import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { get_root_value } from "src/utils/domUtils";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  TableHead,
  Chip,
  Box,
} from "@mui/material";
// components
// import Page from "../components/Page";
// import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "src/components/NotFound/SearchNotFound";
import DeletedModal from "src/components/ModalPopover/DeleteModal";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "src/components/_dashboard/user";
// import UserListHead from "./UserListHead";
// import GoalStatementMenu from "../components/_dashboard/user/GoalStatementMenu";
// import { QuestionListing } from "src/DAL/GoalStatement/GoalStatement";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { htmlDecode } from "src/utils/convertHtml";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import {
  LessonSectionList,
  deleteLessonSectionApi,
  deleteProgrammeSectionApi,
  programmeSectionList,
} from "src/DAL/Programme/Programme";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import Skeleton from "react-loading-skeleton";
import ListStagesTypeSkeleton from "src/components/listSkeleton/ListStagesTypeSkeleton";
import Label from "src/components/Label";
import { lesson_detail_api } from "src/DAL/lessons/lessons";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  if (!Array.isArray(array)) {
    console.error("Error: array is not an array", array);
    return [];
  }

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return array.filter(
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}
const USERLIST = [
  {
    id: 1,
    question: "Current Average Working Hours Per Week?",
    avatarUrl: "/static/mock-images/avatars/avatar_3.jpg",
    status: "active",
  },
];
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function LessonSectionListing() {
  const navigate = useNavigate();
  const params = useLocation();
  console.log(params.state, "paramsparams");
  const id = useParams();
  console.log(id.slug, "idid sx");

  const { slug } = useParams();
  console.log(slug, "slugslugslug");
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [lessonDetailInfo, setLessonsDetailInfo] = useState(null);

  const location = useLocation();
  console.log(location, "locationlocationlocation");
  let programName = lessonDetailInfo?.program[0]?._id?.title;
  let program_slug_navgation = lessonDetailInfo?.program[0]?._id?.program_slug;
  console.log(program_slug_navgation, "program_slug_navgation");
  console.log(programName, "programNameprogramNameprogramName");

  const [UserId, setUserId] = useState(false);
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },
    {
      title: programName,
      navigation: `/programmes/programmes-detail/${program_slug_navgation}`,
      active: false,
    },
    {
      title: "Lessons",
      navigation: `/programmes/${program_slug_navgation}/lessons-listing`,
      active: false,
    },
    {
      title: lessonDetailInfo?.title,
      navigation: `/programmes/lessons-detail/${id.slug}`,
      active: false,
    },
    {
      title: "Sections",
      navigation: null,
      active: true,
    },
  ];
  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };
  const handleDetail = async () => {
    setIsLoading(true);
    console.log(id.slug, "asalksjlkabxk");

    let result = await lesson_detail_api(id.slug);
    console.log(id.slug, "asalksjlkabxk ou");

    console.log(result, "resultresultresult scnz");

    if (result.code === 200) {
      //   setlessonName(result.lesson.title);
      setLessonsDetailInfo(result.lesson);
      //   getDocument(result.lesson._id);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  useEffect(() => {
    handleDetail();
  }, []);

  const getQuestionListing = async () => {
    try {
      setIsLoading(true);
      const result = await LessonSectionList(params?.state._id);
      console.log(result, "resultSection");

      if (result.code === 200) {
        console.log(result, "resultSection");
        // setQuestionData(result.goal_statement);

        const data = result.data.map((section) => {
          return {
            id: section._id,
            name: section?.section_title,
            section_slug: section?.section_slug,
            button_text: section?.button_text,
            button_url: section?.button_url,
            detailed_description: section?.description,
            video_url: section?.main_video_url,
            status: section?.status,
            order: section?.order,
            is_builtin: section.is_builtin,
          };
        });
        setUserList(data);

        setIsLoading(false);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    } catch (error) {}
  };
  const handleEdit = (value) => {
    navigate(`/programmes/lesson/${id.slug}/section/edit-section`, {
      state: value,
      params: params.state, // Second state (newly added)
    });
  };
  const handleNavigate = (value) => {
    navigate(`/programmes/lesson/${id.slug}/section/add-section`, {
      state: {
        ...params.state, // Spread existing state properties
        sectionListing: userList, // Pass section listing data
      },
    });
  };

  const handleAgreeDelete = (value) => {
    console.log(value, "valuevaluevalue");
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    console.log(params?.state, "askgasgxvasjvxj");
    const result = await deleteLessonSectionApi(deleteDoc.id);
    console.log(deleteDoc.id, "id in deletedoc");

    console.log(result, "resultresultresult");
    if (result.code === 200) {
      getQuestionListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = USERLIST.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );
  console.log(userList, "userListuserListuserListuserList");
  useEffect(() => {
    getQuestionListing();
  }, []);
  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: (row) => {
        console.log(row, "Row data in handleClick");

        if (
          row.name === "Resource" ||
          row.name === "Teacher Guide" ||
          row.name === "Lesson Evaluation" ||
          row.is_builtin === true // Prevent deletion if built-in
        ) {
          return; // Prevent deletion action
        }
        handleAgreeDelete(row);
      },
      disabled: (row) =>
        row.name === "Resources" ||
        row.name === "Teacher Guide" ||
        row.name === "Lesson Evaluation" ||
        row.is_builtin === true, // Prevent deletion if built-in
    },
  ];

  const isUserNotFound = filteredUsers.length === 0;
  // if (isLoading == true) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }

  console.log(userList, "ok");

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />

      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(-1)}
            >
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />              
            </IconButton> */}
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
            {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
            <button
              onClick={handleNavigate}
              className="small-contained-button float-end mt-1"
            >
              Add Section
            </button>
          </div>
          <div className="col-lg-8 col-sm-12">
            <h2>Section</h2>
          </div>
          {/* <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              Add Section
            </button>
          </div> */}
        </div>
        {/* <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton> */}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          {/* <Typography variant="h4" gutterBottom>
              Goal Statement
            </Typography> */}
        </Stack>

        <Card style={{ overflowX: "auto" }}>
          <div className="d-flex justify-content-between">
            <TablePagination
              rowsPerPageOptions={[50, 100, 150]}
              component="div"
              count={userList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
          </div>

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                // onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => {
                    const {
                      id,
                      name,
                      question,
                      question_statement,
                      status,
                      is_builtin,
                    } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell className="action-in-table-width">
                          <CustomPopoverSection
                            menu={MENU_OPTIONS}
                            data={row}
                          />
                        </TableCell>
                        <TableCell
                          align="left"
                          className="action-in-table-width"
                        >
                          {page * rowsPerPage + (i + 1)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography variant="subtitle2">
                              {Capitalize(htmlDecode(name))}
                            </Typography>
                            {is_builtin && (
                              <Chip
                                label=" default "
                                color="primary"
                                size="small"
                                sx={{
                                  backgroundColor: "#af66db",
                                  color: "#fff",
                                }}
                              />
                            )}
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={status === false ? "error" : "success"}
                          >
                            {status === false ? "InActive" : "Active"}
                          </Label>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[50, 100, 150]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </div>
    </>
  );
}
