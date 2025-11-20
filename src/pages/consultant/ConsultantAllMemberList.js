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
  Popover,
  Link,
  Pagination,
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
import { memberListing } from "src/DAL/member/member";
import { s3baseUrl } from "src/config/config";
import {
  consultantGroupAllMember,
  consultantGroupListingApi,
  consultantListing,
  DeleteConsultantApi,
  DeleteConsultantGroupApi,
} from "src/DAL/consultant/consultant";
import { get_root_value } from "src/utils/domUtils";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: " Name", alignRight: false },
  { id: "image", label: "Profile", alignRight: false },
  { id: "email", label: "Email ", alignRight: false },
  { id: "programme", label: "Programme ", alignRight: false },
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
  const stabilizedThis = array && array.map((el, index) => [el, index]);
  stabilizedThis &&
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis && stabilizedThis.map((el) => el[0]);
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
  customPagination: {
    color: "red", // Set the text color to red
  },
}));

export default function ConsultantAllMemberList({
  groupPrograms,
  groupMembers,
}) {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [poperData, setPoperDate] = useState([]);

  const [UserId, setUserId] = useState(false);

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };

  const handleClick = (event, program) => {
    setAnchorEl(event.currentTarget);
    setPoperDate(program);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPoper = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getConsultantListing = async () => {
    setIsLoading(true);

    const result = await consultantGroupAllMember(
      params.id,
      filterName,
      page,
      rowsPerPage
    );
    if (result.code == 200) {
      console.log(result, "faskdj");
      const data = result?.members?.map((member) => {
        return {
          id: member._id,
          name: member.first_name + " " + member.last_name,
          image: member.profile_image,
          email: member.email,
          program: member.program,
        };
      });
      setUserList(data);
      setIsLoading(false);
      setTotalPages(result.total_pages);
      setTotalCount(result.total_members);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleViewDetail = (value) => {
    navigate(`/consultant/view-group-detail/${value.group_slug}`, {
      state: value,
    });
  };
  const handleChangePassword = (value) => {
    navigate(`/consultant/change-password/${value.id}`, {
      state: value,
    });
  };

  const handleChangeGroup = (value) => {
    navigate(`/consultant/groups/${value.id}`, {
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
    const result = await DeleteConsultantGroupApi(deleteDoc.group_slug);
    if (result.code === 200) {
      getConsultantListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

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
    navigate(`/consultant/add-consultant`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  useEffect(() => {
    getConsultantListing();
  }, [rowsPerPage, page]);
  const MENU_OPTIONS = [
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
    {
      label: "View Detail",
      icon: "fluent:video-recording-20-regular",
      handleClick: handleViewDetail,
    },
  ];
  const isUserNotFound = userList && userList.length === 0;
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />
      <Popover
        // className="custom-popover"
        id={id}
        open={openPoper}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            minWidth: "300px",
            backgroundColor: get_root_value("--sidebars-background-color"),
            color: get_root_value("--text-primary-color"),
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          },
        }}>
        <div className="sticky-top card">
          <div className="d-flex justify-content-between align-items-center p-3">
            <Typography fontWeight="500">Programs</Typography>
            <Icon
              icon={"fluent-emoji-high-contrast:cross-mark"}
              width={15}
              height={15}
              onClick={handleClose}
            />
          </div>
        </div>
        <div className="my-2">
          {poperData?.map((program) => {
            return (
              <div
                className="px-4 py-1"
                dangerouslySetInnerHTML={{
                  __html: program._id.title,
                }}></div>
            );
          })}
        </div>
      </Popover>
      <div className="">
        <div className="row">
          {/* <div className="col-lg-8 col-sm-12">
            <h2>Consultant Groups</h2>
          </div> */}
          <div className="col-lg-4 col-sm-12 text-end">
            {/* <button onClick={handleNavigate} className="small-contained-button">
              Add Consultant
            </button> */}
          </div>
        </div>
        {/* <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton> */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}>
          {/* <Typography variant="h4" gutterBottom>
              Goal Statement
            </Typography> */}
        </Stack>

        <Card style={{ overflowX: "auto" }}>
          <div className="d-flex justify-content-between ">
            <div className="d-flex flex-column align-items-start">
              <TablePagination
                rowsPerPageOptions={[5, 10, 20, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              {/* <Pagination
                count={totalPages}
                page={page}
                defaultPage={0}
                onChange={handleChangePage}
              /> */}
            </div>
            <div className="d-flex align-items-center">
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
              <button
                onClick={() => getConsultantListing()}
                className="small-contained-button-search me-3 mb-1"
                // style={{ height: 32 }}
              >
                Search
              </button>
            </div>
          </div>

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList && userList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                // onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {userList &&
                  userList.map((row, i) => {
                    const {
                      id,
                      name,
                      status,
                      image,
                      description,
                      program,
                      member,
                      email,
                    } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}>
                        <TableCell align="left">
                          {page * rowsPerPage + (i + 1)}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="1">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {<Avatar src={s3baseUrl + image} alt="photoURL" />}
                        </TableCell>{" "}
                        <TableCell component="th" scope="row">
                          {email}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {program &&
                            program?.map((program, i) => {
                              return (
                                i <= 2 && (
                                  <>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: program._id.title + ",",
                                      }}></div>
                                  </>
                                )
                              );
                            })}
                          {program && program.length > 3 && (
                            <Link
                              aria-describedby={id}
                              variant="text"
                              sx={{ cursor: "pointer" }}
                              onClick={(e) => handleClick(e, program)}>
                              View More
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
            count={totalCount}
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
