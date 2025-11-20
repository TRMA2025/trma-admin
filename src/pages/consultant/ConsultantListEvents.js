import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { get_root_value } from "src/utils/domUtils";
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
} from "@mui/material";
// components
import Page from "src/components/Page";
import Label from "src/components/Label";
import Scrollbar from "src/components/Scrollbar";
import SearchNotFound from "src/components/SearchNotFound";
import DeletedModal from "src/components/ModalPopover/DeleteModal";
import moment from "moment";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import EditEvent from "./EditEvents";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "src/components/_dashboard/user";
// import GoalStatementMenu from "src/components/_dashboard/user/GoalStatementMenu";
// import { QuestionListing } from "src/DAL/GoalStatement/GoalStatement";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
// import {
//   DeleteEvent,
//   eventsListing,
//   eventsDetailApi,
// } from "src/DAL/Calendar/Calendar";
import AddEvent from "../NewEvents/AddEvent";
import CustomPopover from "src/components/MenuOption/CustomPopoverSection";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { htmlDecode } from "src/utils/convertHtml";
import { deleteEventApi, eventListApi } from "src/DAL/Events/events";
import { consultantEventListing } from "src/DAL/consultant/consultant";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "event", label: "Title", alignRight: false },
  { id: "group", label: "Groups", alignRight: false },
  { id: "startDate", label: "Start Date", alignRight: false },
  { id: "endDate", label: "End Date", alignRight: false },
  { id: "member", label: "Members", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "action", label: "Action", alignRight: false },
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
      (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
const USERLIST = [
  {
    id: 1,
    question: "Current Average Working Hours Per Week?",
    type: "textarea",
    avatarUrl: "/static/mock-images/avatars/avatar_3.jpg",
    order: 1,
    status: "active",
  },
  {
    id: 2,
    question: "Current Average Closing Rate Ratio Per Month - (If Applicable)",
    type: "textarea",
    avatarUrl: "/static/mock-images/avatars/avatar_3.jpg",
    order: 1,
    status: "active",
  },
  {
    id: 3,
    question: "How Many Hours Do You Want To Work Per Week?",
    type: "textarea",
    avatarUrl: "/static/mock-images/avatars/avatar_3.jpg",
    order: 1,
    status: "active",
  },
];
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function ConsultantListEvents() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [drawerState, setDrawerState] = useState(false);
  const [editDrawerState, setEditDrawerState] = useState(false);
  const [eventDetailData, setEventDetailData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [eventSlug, setEventSlug] = useState("");
  const [showEditComponent, setShowEditComponent] = useState(false);
  const [editValues, setEditValues] = useState();

  const [UserId, setUserId] = useState(false);

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };
  const handleOpenDrawer = () => {
    setDrawerState(true);
  };
  const handleCloseDrawer = () => {
    setDrawerState(false);
  };
  const handleOpenEditDrawer = () => {
    setEditDrawerState(true);
  };
  const handleCloseEditDrawer = () => {
    setEditDrawerState(false);
  };
  const eventDetail = (event) => {
    setEventDetailData(event);
    setEditDrawerState(true);
  };
  const handleEdit = (value) => {
    setEditValues(value);
    setEventDetailData(value);
    setEditDrawerState(true);
    setShowEditComponent(true);
  };
  const handleAgreeDelete = (value) => {
    setEventSlug(value.event_slug);
    setOpenDelete(true);
  };
  const handleDetailPage = (value) => {
    navigate("/calendar/event-detail", {
      state: { editValues: value },
    });
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteEventApi(eventSlug);
    if (result.code === 200) {
      setIsLoading(false);
      AllEventListing();
      enqueueSnackbar(result.message, { variant: "success" });
      navigate("/calender/event-list");
      // onCloseDrawer();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const getEventinformation = async (e) => {
    const result = await "";
    if (result.code === 200) {
      setEditValues(result.event);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const getEventListing = async () => {
    const result = await eventListApi();
    if (result.code === 200) {
      let all_events = [];
      result.event.map((event, index) => {
        let resp_event = getEventsList(event);
        all_events = [...all_events, ...resp_event];
      });
      setEvents(all_events);
      setIsLoading(false);
    } else {
      // enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const eventListDetail = async () => {
    const result = await "";
    setEventList(result.event);
  };

  const AllEventListing = async () => {
    try {
      const result = await consultantEventListing(params.id);
      setIsLoading(true);
      if (result.code === 200) {
        // setQuestionData(result.goal_statement);

        const data = result.event.map((goal) => {
          return {
            // id: goal._id,
            // question_statement: goal.question_statement,
            // type: goal.question_type,
            // avatarUrl: "/static/mock-images/avatars/avatar_3.jpg",
            // order: goal.question_order,
            // status: goal.status,
            title: goal.title,
            group: goal.group,
            startDate: goal.start_date,
            endDate: goal.end_date,
            member: goal.member,
            status: goal.status,
            color: goal.color,
            event_slug: goal.event_slug,
            recurring_iteration: goal.recurring_iteration,
            recurring_type: goal.recurring_type,
            start_time: goal.start_time,
            end_time: goal.end_time,
            description: goal.description,
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
    navigate(`/goal-statement/add-question`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );
  useEffect(() => {
    AllEventListing();
    eventListDetail();
  }, []);

  const MENU_OPTIONS = [
    // {
    //   label: "Edit",
    //   icon: "akar-icons:edit",
    //   handleClick: handleEdit,
    // },
    {
      label: "Detail",
      icon: "eva:eye-fill",
      handleClick: handleDetailPage,
    },

    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  const isUserNotFound = filteredUsers.length === 0;
  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <DeletedModal
        AllEventListing={AllEventListing}
        title="member"
        id={UserId}
        open={open}
        setOpen={setOpen}
      />

      <div className="container">
        <div className="row">
          <div className="col-12 text-start mb-4">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon
                className="arrow-back-icon"
                style={{ color: "#fff !important", fill: "#fff !important" }}
              />{" "}
            </IconButton>
          </div>
          <div className="col-lg-8 col-sm-12">
            <h2>Event List</h2>
          </div>
          {/* <div className="col-lg-4 col-sm-12 text-end">
            <button
              className="small-contained-button float-end mt-1 mb-4"
              onClick={handleOpenDrawer}
            >
              Add Event
            </button>
          </div> */}
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

        <Card style={{ overflowX: "auto" }}>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

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
                      role,
                      status,
                      avatarUrl,
                      isVerified,
                      zoomLink,
                      order,
                      password,
                      type,
                      question,
                      question_statement,
                      title,
                      group,
                      startDate,
                      endDate,
                      member,
                      event_slug,
                      recurring_iteration,
                      recurring_type,
                      start_time,
                      end_time,
                      description,
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
                        sx={{
                          " td, th, tr": {
                            borderBottom: `1px solid ${get_root_value(
                              "--text-secondary-color"
                            )}`,
                          },
                        }}
                      >
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
                              {htmlDecode(title)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          {group.map((groups) => {
                            return (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlDecode(groups?._id?.title),
                                }}
                              ></div>
                            );
                          })}
                        </TableCell>
                        <TableCell align="left">
                          {startDate
                            ? moment(startDate).format("DD-MM-YYYY")
                            : "N/A"}
                        </TableCell>
                        <TableCell align="left">
                          {endDate
                            ? moment(endDate).format("DD-MM-YYYY")
                            : "N?A"}
                        </TableCell>
                        <TableCell align="left">
                          {/* {member.map((member) => {
                            return (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: htmlDecode(member._id.first_name),
                                }}
                              ></div>
                            );
                          })} */}
                          {member.length}
                        </TableCell>

                        {/* <TableCell align="left">{order}</TableCell> */}

                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={status === false ? "error" : "success"}
                          >
                            {status === false ? "InActive" : "Active"}
                          </Label>
                        </TableCell>

                        <TableCell align="left">
                          {/* <GoalStatementMenu
                            path={`/goal-statement/edit-question/${id}`}
                            detailPath={`/goal-statement/detail-question/${id}`}
                            id={id}
                            AllEventListing={AllEventListing}
                            editObject={row}
                            OnDelete={() => handleOpen(id)}
                          /> */}
                          <CustomPopover menu={MENU_OPTIONS} data={row} />
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
                    <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <CustomDrawer
          isOpenDrawer={drawerState}
          onOpenDrawer={handleOpenDrawer}
          onCloseDrawer={handleCloseDrawer}
          pageTitle="New Event"
          componentToPassDown={
            <AddEvent
              dataList={AllEventListing}
              onCloseDrawer={handleCloseDrawer}
            />
          }
        />
        {/* <CustomDrawer
          isOpenDrawer={editDrawerState}
          onOpenDrawer={handleOpenEditDrawer}
          onCloseDrawer={handleCloseEditDrawer}
          pageTitle="Event Detail"
          componentToPassDown={
            <EventDetail
              setIsLoading={setIsLoading}
              eventDetailData={eventDetailData}
              dataList={getEventListing}
              onCloseDrawer={handleCloseEditDrawer}
            />
          }
        /> */}
        <CustomConfirmation
          open={openDelete}
          setOpen={setOpenDelete}
          title={"Are you sure you want to delete this Event?"}
          handleAgree={handleDelete}
        />
      </div>
      {showEditComponent && (
        <CustomDrawer
          isOpenDrawer={editDrawerState}
          onOpenDrawer={handleOpenEditDrawer}
          onCloseDrawer={handleCloseEditDrawer}
          pageTitle="Event Detail"
          componentToPassDown={
            <EditEvent
              editValues={editValues}
              dataList={AllEventListing}
              setEditValues={setEditValues}
              getEventinformation={getEventinformation}
              setShowEditComponent={setShowEditComponent}
            />
          }
        />
      )}
    </>
  );
}
