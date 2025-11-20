import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import React, { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
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
  Pagination,
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
import { memberListing, member_login_api } from "src/DAL/member/member";
import { clientPortalUrl, s3baseUrl } from "src/config/config";
import {
  consultantListing,
  DeleteConsultantApi,
  Deleteticket,
  MoveTrash,
} from "src/DAL/consultant/consultant";
import {
  resolve,
  supportTicketListApi,
} from "src/DAL/supportTicket/supportTicket";
import moment from "moment";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import SupportTicketFilter from "./SupportTicketFilter";
import { defaultSettingApi } from "src/DAL/SiteSetting/siteSetting";
import { get_date_with_user_time_zone } from "src/utils/constant";
import SupportTicketFilterDepartment from "./SupportTicketFilterDepartment";
import UserListToolbars from "src/components/_dashboard/user/UserListToolbars";
import Skeleton from "react-loading-skeleton";
import ListSkeleton from "src/components/listSkeleton/ListSkeleton";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------
// default timezone-----------------------
require("moment-timezone");

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },

  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "User Name", alignRight: false },
  { id: "subject", label: " Subject", alignRight: false },

  { id: "status", label: "Status", alignRight: false },
  { id: "created", label: "Created", alignRight: false },
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
export default function SupportTicket() {
  const navigate = useNavigate();
  const params = useLocation();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [openResolved, setOpenResolved] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openTrash, setTrash] = useState(false);
  const [member, setData] = useState([]);
  const [filterBy, setFilterBy] = useState("all");
  const [editDrawerState, setEditDrawerState] = useState(false);
  const [editDrawerStateDep, setEditDrawerStateDep] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("all");
  const [selectedDep, setSelectedDep] = React.useState("");
  const [filterNameStatus, setFilterNameStatus] = useState(false);
  const [defaultTimeZone, setDefaultTimeZone] = useState("");
  const [del, setdel] = useState("");
  const [trashId, setTrashId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [UserId, setUserId] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };
  const handleOpenEditDrawer = () => {
    setEditDrawerState(true);
  };
  const handleCloseEditDrawer = (closeType) => {
    if (closeType === "filter") {
      console.log(closeType, "filter applied");
    } else {
      setSelectedValue("all");
    }
    setEditDrawerState(false);
  };
  const handleOpenEditDrawerDep = () => {
    setEditDrawerStateDep(true);
  };
  const handleCloseEditDrawerDep = () => {
    setEditDrawerStateDep(false);
  };

  const convertTZ = (date, tzString) => {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  };
  const getDefaultSetting = async () => {
    setIsLoading(true);
    const result = await defaultSettingApi();
    if (result.code === 200) {
      moment.tz.setDefault(result?.default_setting?.time_zone);
      setDefaultTimeZone(result?.default_setting?.time_zone);
    }
  };
  //console.log(defaultTimeZone, "defaultTimeZone");

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getSupportTicketListing = async (value) => {
    // setIsLoading(true);
    console.log(value, "valueeeeee");

    try {
      // setIsLoading(true);
      const formData = new FormData();
      if (value == undefined || value == "") {
        formData.append("filter_by", "all");
      } else {
        formData.append("filter_by", value);
        // formData.append("department", dep_id);
      }
      console.log(...formData, "formDataformDataformDataformData");

      const result = await supportTicketListApi(
        formData,
        page,
        rowsPerPage,
        searchText
      );
      if (result.code === 200) {
        setData(result.support_ticket);

        setQuestionData(result.support_ticket);

        const data = result.support_ticket.map((ticket) => {
          var moment = require("moment-timezone");
          var a = moment.tz(ticket.support_ticket_date, defaultTimeZone);
          // var a = ticket.support_ticket_date;
          return {
            id: ticket._id,
            createdAt: a,
            // createdAt: get_date_with_user_time_zone(
            //   ticket.createdAt,
            //   "YYYY-MM-DD HH:mm",
            //   local,
            //   defaultTimeZone
            // ),
            name: ticket.subject,
            userName: ticket.member,
            status: ticket.status,
            department: ticket.department,
            response_status: ticket.response_status,
            ticket_status: ticket.ticket_status,
          };
        });
        setTotalCount(result.total_support_ticket_count);
        setTotalPages(result.total_pages);
        setUserList(data);
        setIsLoading(false);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    } catch (error) {}
  };
  const handleEdit = (value) => {
    // navigate(`/support-ticket/detail/${value.id}`, {
    //   state: value,
    // });
    navigate(`/support-ticket/detail/${value.id}`);
  };
  const handleDeletefunction = (value) => {
    console.log(value, "value");
    setdel(value.id);
    setOpenDelete(true);
  };
  const handleMoveTrash = (value) => {
    console.log(value, "value");
    setTrashId(value.id);
    setTrash(true);
  };
  // var timedifference = new Date().getTimezoneOffset();
  // console.log(timedifference, "timedifferencetimedifference");

  const handleChangePassword = (value) => {
    navigate(`/consultant/change-password/${value.id}`, {
      state: value,
    });
  };
  const handleChangeRecording = (value) => {
    navigate(`/consultant/recordings/${value.id}`, {
      state: value,
    });
  };
  const handleChangeGroup = (value) => {
    navigate(`/consultant/groups/${value.id}`, {
      state: value,
    });
  };
  const handleChangePods = (value) => {
    navigate(`/consultant/pods-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeMember = (value) => {
    navigate(`/consultant/member-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeGoalStatement = (value) => {
    navigate(`/consultant/goal-statement-list/${value.id}`, {
      state: value,
    });
  };
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleChangeDep = (event) => {
    setSelectedDep(event.target.value);
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteConsultantApi(deleteDoc.id);
    if (result.code === 200) {
      getSupportTicketListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const LoginAsMember = async (value) => {
    setIsLoading(true);
    console.log(value.userName.email, "dflkajsdk");
    const data = {
      email: value.userName.email,
      user_type: "client",
    };
    const result = await member_login_api(data);
    if (result.code === 200) {
      window.open(`${clientPortalUrl}login-by-admin/${result.token}`);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleDeleteSupportTickt = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await Deleteticket(del);
    if (result.code === 200) {
      getSupportTicketListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleMoveTrashTicket = async () => {
    setTrash(false);
    setIsLoading(true);
    const result = await MoveTrash(trashId);
    if (result.code === 200) {
      getSupportTicketListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };
  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const handleSearchName = () => {
    setFilterNameStatus(true);
    getSupportTicketListing();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchName();
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleFilterByName = (event) => {
    setSearchText(event.target.value);
    // setFilterName(event.target.value);
  };
  const handleNavigate = () => {
    navigate(`/consultant/add-consultant`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy)
    // filterName
  );
  const handleMarkResolvedPopup = (value) => {
    setTicketId(value.id);
    setOpenResolved(true);
  };
  // const handleMarkResolved = async () => {
  //   setOpenResolved(false);
  //   setIsLoading(true);
  //   const result = await markResolved(ticketId);
  //   if (result.code === 200) {
  //     getTickestsListing("all");
  //     enqueueSnackbar(result.message, { variant: "success" });

  //     setIsLoading(false);
  //   } else {
  //     enqueueSnackbar(result.message, { variant: "error" });
  //     navigate(`/support-ticket`);
  //   }
  // };
  const handleMarkResolved = async () => {
    setIsLoading(true);
    const data = {
      support_ticket: ticketId,
    };
    const result = await resolve(data);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
      getSupportTicketListing();
      setOpenResolved(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDefaultSetting();
  }, []);

  const MENU_OPTIONS = [
    {
      label: "Detail",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Mark Resolve",
      icon: "emojione-monotone:heavy-check-mark",
      handleClick: handleMarkResolvedPopup,
    },
    {
      label: "Login As Member",
      icon: "ant-design:lock",
      handleClick: LoginAsMember,
    },
  ];
  const MENU_OPTIONS_SOLVED = [
    {
      label: "Detail",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Move To Trash",
      icon: "foundation:loop",
      handleClick: handleMoveTrash,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleDeletefunction,
    },
    {
      label: "Login As Member",
      icon: "ant-design:lock",
      handleClick: LoginAsMember,
    },
  ];
  const MENU_OPTIONS_TRASH = [
    {
      label: "Detail",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleDeletefunction,
    },
    {
      label: "Login As Member",
      icon: "ant-design:lock",
      handleClick: LoginAsMember,
    },
  ];
  useEffect(() => {
    getSupportTicketListing();
  }, [page, rowsPerPage]);
  useEffect(() => {
    getSupportTicketListing();
  }, [defaultTimeZone]);

  const isUserNotFound = filteredUsers.length === 0;
  //console.log(defaultTimeZone, "defaultTimeZone");

  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDeleteSupportTickt}
      />
      <CustomConfirmation
        open={openTrash}
        setOpen={setTrash}
        title={"Are you sure you want to move this ticket to trash ?"}
        handleAgree={handleMoveTrashTicket}
      />

      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-sm-12">
            <h2>Support Tickets</h2>
          </div>
          <div className="col-12 text-end">
            <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenEditDrawer}
            >
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button>
            {/* <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenEditDrawerDep}
            >
              Filter By Department &nbsp;&nbsp; <Icon icon={roundFilterList} />
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
          mb={5}
        >
          {/* <Typography variant="h4" gutterBottom>
              Goal Statement
            </Typography> */}
        </Stack>
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <Card style={{ overflowX: "auto" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column align-items-start">
                <TablePagination
                  rowsPerPageOptions={[50, 100, 150]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Pagination
                  count={totalPages + 1}
                  page={pageCount}
                  defaultPage={0}
                  onChange={handleChangePages}
                  className="pagination-style"
                />
              </div>
              <div className="d-flex align-items-center">
                <UserListToolbars
                  numSelected={selected.length}
                  filterName={searchText}
                  onFilterName={handleFilterByName}
                  onSearch={handleSearchName}
                  onKeyDown={handleKeyDown}
                />
              </div>
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
                        lastName,
                        email,
                        profile,
                        goal,
                        address,
                        type,
                        memberCount,
                        department,
                        createdAt,
                        response_status,
                        ticket_status,
                        userName,
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
                            {
                              <CustomPopoverSection
                                menu={
                                  ticket_status == 1
                                    ? MENU_OPTIONS_SOLVED
                                    : ticket_status == 2
                                    ? MENU_OPTIONS_TRASH
                                    : MENU_OPTIONS
                                }
                                data={row}
                              />
                            }
                          </TableCell>
                          <TableCell align="left">
                            {page * rowsPerPage + (i + 1)}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            onClick={() => handleEdit(row)}
                            className="modalIcon"
                          >
                            {userName?.first_name
                              ? userName.first_name + " " + userName.last_name
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            onClick={() => handleEdit(row)}
                            className="modalIcon"
                          >
                            {name}
                          </TableCell>
                          {/* <TableCell component="th" scope="row">
                          {department?.title
                            ? Capitalize(htmlDecode(department?.title))
                            : "N/A"}
                        </TableCell> */}

                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              // color={status === false ? "error" : "success"}
                              className={
                                ticket_status === 0 && response_status == 1
                                  ? "answer-ticket"
                                  : ticket_status == 1
                                  ? "solved-ticket"
                                  : ticket_status == 2
                                  ? "trash-ticket"
                                  : "pending-ticket"
                              }
                            >
                              {ticket_status === 0 && response_status == 1
                                ? "Answer"
                                : ticket_status == 1
                                ? " Solved"
                                : ticket_status == 2
                                ? "Trash"
                                : "waiting"}
                            </Label>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {Capitalize(
                              htmlDecode(
                                moment(
                                  createdAt._i,
                                  "YYYY-MM-DD HH:mm"
                                ).fromNow()
                              )
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={9} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
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
      <CustomDrawer
        isOpenDrawer={editDrawerState}
        onOpenDrawer={handleOpenEditDrawer}
        onCloseDrawer={handleCloseEditDrawer}
        pageTitle="Filters"
        componentToPassDown={
          <SupportTicketFilter
            value={selectedValue}
            handleChange={handleChange}
            dataList={getSupportTicketListing}
            setSelectedValue={setSelectedValue}
            onCloseDrawer={handleCloseEditDrawer}
          />
        }
      />
      <CustomConfirmation
        open={openResolved}
        setOpen={setOpenResolved}
        title={"Are you sure you want to mark this ticket as resolved?"}
        handleAgree={handleMarkResolved}
      />
      <CustomDrawer
        isOpenDrawer={editDrawerStateDep}
        onOpenDrawer={handleOpenEditDrawerDep}
        onCloseDrawer={handleCloseEditDrawerDep}
        pageTitle="Filters"
        componentToPassDown={
          <SupportTicketFilterDepartment
            value={selectedDep}
            handleChange={handleChangeDep}
            dataList={getSupportTicketListing}
            setSelectedValue={setSelectedDep}
            onCloseDrawer={handleCloseEditDrawerDep}
          />
        }
      />
    </>
  );
}
