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
} from "@mui/material";
// components
// import Page from "../components/Page";
// import Label from "./Label";
// import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "src/components/NotFound/SearchNotFound";
import DeletedModal from "src/components/ModalPopover/DeleteModal";
import Label from "src/components/Label";
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
  deleteProgrammeSectionApi,
  programmeAutoGroupList,
  programmeSectionList,
  deleteProgrammeAutoGroupApi,
} from "src/DAL/Programme/Programme";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import Skeleton from "react-loading-skeleton";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Group Name", alignRight: false },
  { id: "status", label: "Group Status", alignRight: false },
  { id: "startDay", label: "Start Day", alignRight: false },
  { id: "endDay", label: "End Day", alignRight: false },
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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
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
export default function ProgrammeAutomatedGroups() {
  const navigate = useNavigate();
  const params = useLocation();
  const { slug } = useParams();
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

  const [UserId, setUserId] = useState(false);

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },
    {
      title: `${slug}`,
      navigation: `/programmes/programmes-detail/${slug}`,
      active: false,
    },
    {
      title: "Automated Group",
      navigation: null,
      active: true,
    },
  ];
  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getQuestionListing = async () => {
    try {
      setIsLoading(true);
      const result = await programmeAutoGroupList(slug);
      if (result.code === 200) {
        setIsLoading(false);

        setQuestionData(result.group);

        const data = result.group.map((section) => {
          return {
            id: section._id,
            name: section.title,
            status: section.status,
            start: section.automated_group_start_day,
            end: section.automated_group_end_day,
            group_slug: section.group_slug,
            program_slug: slug,
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
    navigate(`/programmes/${slug}/edit-automated-group`, {
      state: value,
    });
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteProgrammeAutoGroupApi(deleteDoc.group_slug);
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
  const handleNavigate = () => {
    navigate(`/programmes/${slug}/add-automated-group`, {
      state: slug,
    });
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );
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
      handleClick: handleAgreeDelete,
    },
  ];

  const isUserNotFound = filteredUsers.length === 0;
  // if (isLoading == true) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }
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
              className="back-screen-button"
              onClick={() => navigate(-1)}
            >
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton> */}
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

            {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() =>
              navigate(`/programmes/lessons-listing/${program_slug}`, {
                state: { name: title, slug: program_slug },
              })
            }
          >
            View Lessons
          </button> */}
          </div>
          <div className="col-lg-8 col-sm-12">
            <h2>Automated Group</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              Add Group
            </button>
          </div>
        </div>

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
        {isLoading ? (
          <div>
            <Card style={{ overflowX: "auto" }}>
              <div className="mt-2 d-flex justify-content-between">
                <div style={{ marginLeft: "5px" }}>
                  <Skeleton width={200} height={20} />
                </div>
                <div style={{ marginRight: "15px" }}>
                  <Skeleton width={200} height={60} />
                </div>
              </div>

              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/* Skeleton for Table Header */}
                      <TableCell>
                        <Skeleton width={150} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={50} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={200} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} height={20} />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Skeleton Loading for Rows */}
                    {Array.from({ length: 6 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton width={50} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={50} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={200} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={20} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div
                style={{
                  margin: "20px",
                  justifyContent: "end",
                  display: "flex",
                }}
              >
                <Skeleton width={200} height={20} />
              </div>
            </Card>
          </div>
        ) : (
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
                        status,
                        start,
                        end,
                        question,
                        question_statement,
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
                          <TableCell>
                            <CustomPopoverSection
                              menu={MENU_OPTIONS}
                              data={row}
                            />
                          </TableCell>
                          <TableCell align="left">
                            {page * rowsPerPage + (i + 1)}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0}
                            >
                              <Typography variant="subtitle2">
                                {Capitalize(htmlDecode(name))}
                              </Typography>
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
                          <TableCell align="left">{start}</TableCell>
                          <TableCell align="left">{end}</TableCell>
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
        )}
      </div>
    </>
  );
}
