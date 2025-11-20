import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
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
  consultantListing,
  DeleteConsultantApi,
} from "src/DAL/consultant/consultant";
import { dashboardApi } from "src/DAL/Login/Login";
import moment from "moment";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  //   { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "date", label: "Created Date", alignRight: false },
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
  //conole.log.log(query, "query");
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
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
  return stabilizedThis?.map((el) => el[0]);
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
export default function RecentMembersTable({ recentMember }) {
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
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setData] = useState([]);
  const [lessons, setLessons] = useState();

  const [UserId, setUserId] = useState(false);

  const handleOpen = (e) => {
    //conole.log.log("id", e);
    setUserId(e);
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getConsultantListing = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      // const result = await dashboardApi();
      // if (result.code === 200) {
      setData(recentMember);

      // setQuestionData(result.member);

      const data = recentMember.map((member) => {
        // console.log(member, "lessonlesson");
        return {
          ...member,
          id: member._id,
          name: member.first_name,
          lastName: member.last_name,
          email: member.email,
          status: member.status,
        };
      });
      setUserList(data);
      setIsLoading(false);
    } catch (error) {}
  };
  const handleEdit = (value) => {
    //conole.log(value, "edit value");
    navigate(`/consultant/edit-consultant/${value.id}`, {
      state: value,
    });
  };
  const handleChangePassword = (value) => {
    //conole.log(value, "edit value");
    navigate(`/consultant/change-password/${value.id}`, {
      state: value,
    });
  };
  const handleChangeRecording = (value) => {
    //conole.log(value, "value for action");
    navigate(`/consultant/recordings/${value.id}`, {
      state: value,
    });
  };
  const handleChangeGroup = (value) => {
    //conole.log(value, "value for action");
    navigate(`/consultant/groups/${value.id}`, {
      state: value,
    });
  };
  const handleChangePods = (value) => {
    //conole.log(value, "value for action");
    navigate(`/consultant/pods-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeMember = (value) => {
    //conole.log(value, "value for action");
    navigate(`/consultant/member-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeGoalStatement = (value) => {
    //conole.log(value, "value for action");
    navigate(`/consultant/goal-statement-list/${value.id}`, {
      state: value,
    });
  };

  const handleAgreeDelete = (value) => {
    //conole.log(value, "delete it ");
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    //conole.log(deleteDoc, "delete function run");
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteConsultantApi(deleteDoc.id);
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
    //conole.log(event.target.value, "this is value");
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

  // console.log(member, "membermembermember");
  useEffect(() => {
    getConsultantListing();
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
    {
      label: "Change Password",
      icon: "ant-design:lock",
      handleClick: handleChangePassword,
    },
    {
      label: "View Recordings",
      icon: "fluent:video-recording-20-regular",
      handleClick: handleChangeRecording,
    },
    {
      label: "View Groups",
      icon: "fluent:video-recording-20-regular",
      handleClick: handleChangeGroup,
    },
    {
      label: "View Meetings",
      icon: "fluent:video-recording-20-regular",
      handleClick: handleChangePods,
    },
    {
      label: "View Members",
      icon: "fluent:video-recording-20-regular",
      handleClick: handleChangeMember,
    },
    {
      label: "View Events",
      icon: "fluent:video-recording-20-regular",
      handleClick: handleChangeGroup,
    },
    {
      label: "View Goal Statement",
      icon: "fluent:video-recording-20-regular",
      handleClick: handleChangeGoalStatement,
    },
  ];
  const MENU_OPTIONS1 = [
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
    {
      label: "Change Password",
      icon: "ant-design:lock",
      handleClick: handleChangePassword,
    },
  ];
  const isUserNotFound = filteredUsers?.length === 0;
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //conole.log(questionData, "questionData");
  //conole.log(params, "ok");

  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />

      <div className="">
        {/* <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton> */}
        <Stack
          direction="row"
          alignItems="center"
          //   justifyContent="space-between"
          mb={5}
        >
          {/* <Typography variant="h4" gutterBottom>
            Goal Statement
          </Typography> */}
        </Stack>

        <Card style={{ overflowX: "auto" }}>
          <h3 className="ms-3 mt-3">Recent Members</h3>
          {/* <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          /> */}
          <TableContainer sx={{ minWidth: 450 }}>
            <Table size="small">
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList?.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                // onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row, i) => {
                    const {
                      id,
                      name,
                      status,
                      lastName,
                      email,
                      date,
                      createdAt,
                      profile,
                      goal,
                      address,
                      type,
                      memberCount,
                      program,
                    } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={i}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell>
                          <Typography>{name + " " + lastName}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>{email}</Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography sx={{ ml: 1 }}>
                            {createdAt
                              ? moment(createdAt).format(" DD-MM-YYYY")
                              : "N/A"}
                          </Typography>
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
          {/* <TablePagination
            rowsPerPageOptions={[50, 100, 150]}
            component="div"
            count={userList?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Card>
      </div>
    </>
  );
}
