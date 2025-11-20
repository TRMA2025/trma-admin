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
import {
  deleteWebsitePodCast,
  listWebsitePodCast,
} from "src/DAL/Podcasts/PodcastApi";
import UserListToolbars from "src/components/_dashboard/user/UserListToolbars";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: " Title", alignRight: false },
  { id: "order", label: " Order", alignRight: false },
  { id: "image", label: " Image", alignRight: false },
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
  //console.log(query, "query");
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
export default function PodcastsList() {
  const navigate = useNavigate();
  const params = useLocation();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [totalCount, setTotalCount] = useState("");
  const [apiPath, setApiPath] = useState("api/website_pods?page=0&limit=50");
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setData] = useState([]);

  const [UserId, setUserId] = useState(false);

  const handleOpen = (e) => {
    //console.log("id", e);
    setUserId(e);
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getConsultantListing = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      const result = await listWebsitePodCast(filterName, rowsPerPage, page);
      if (result.code === 200) {
        // console.log(result, "Api result");
        //console.log(result.website_pods, "resultresultresult ");
        setData(result.website_pods);
        setIsLoading(false);
        setTotalCount(result.total_count);
        setQuestionData(result.website_pods);

        const data = result.website_pods.map((pods, index) => {
          //console.log(pods, "pods");
          return {
            id: pods._id,
            name: pods.title,
            order: pods.order,
            profile: pods.room_image.thumbnail_2,
            status: pods.status,
            object: pods,
            count: index + 1 + rowsPerPage * page,
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
    //console.log(value, "edit value");
    navigate(`/website-podcasts/edit-podcast/${value.id}`, {
      state: value,
    });
  };
  const handleChangePassword = (value) => {
    //console.log(value, "edit value");
    navigate(`/consultant/change-password/${value.id}`, {
      state: value,
    });
  };
  const handleChangeRecording = (value) => {
    //console.log(value, "value for action");
    navigate(`/consultant/recordings/${value.id}`, {
      state: value,
    });
  };
  const handleChangeGroup = (value) => {
    //console.log(value, "value for action");
    navigate(`/consultant/groups/${value.id}`, {
      state: value,
    });
  };
  const handleChangePods = (value) => {
    //console.log(value, "value for action");
    navigate(`/consultant/pods-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeMember = (value) => {
    //console.log(value, "value for action");
    navigate(`/consultant/member-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeGoalStatement = (value) => {
    //console.log(value, "value for action");
    navigate(`/consultant/goal-statement-list/${value.id}`, {
      state: value,
    });
  };

  const handleAgreeDelete = (value) => {
    //console.log(value, "delete it ");
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    //console.log(deleteDoc, "delete function run");
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteWebsitePodCast(deleteDoc?.object?.room_slug);
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
    //console.log(event.target.value, "this is value");
    setFilterName(event.target.value);
  };
  const handleNavigate = () => {
    navigate(`/website-podcasts/add-podcast`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy)
    // filterName
  );

  // console.log(member, "membermembermember");
  useEffect(() => {
    getConsultantListing();
  }, [page, rowsPerPage]);

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
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //console.log(questionData, "questionData");
  //console.log(params, "ok");
  // console.log(selected, "How data is working ");
  return (
    <>
      <CustomConfirmation
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />

      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-sm-12">
            <h2>Website Podcasts</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              Add PodCast
            </button>
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

        <Card style={{ overflowX: "auto" }}>
          <UserListToolbars
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onSearch={getConsultantListing}
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
                {filteredUsers.map((row, i) => {
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
                    order,
                    count,
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
                      <TableCell align="left">{count}</TableCell>
                      <TableCell component="th" scope="row" padding="1">
                        <Stack direction="row" alignItems="center">
                          <Typography variant="subtitle2">
                            {htmlDecode(name)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{order}</TableCell>
                      <TableCell align="left">
                        <Avatar alt={name} src={s3baseUrl + profile} />
                      </TableCell>
                      <TableCell align="left">
                        <Label
                          variant="ghost"
                          color={status === false ? "error" : "success"}
                        >
                          {status === false ? "InActive" : "Active"}
                        </Label>
                      </TableCell>
                      <TableCell>
                        {
                          <CustomPopoverSection
                            menu={MENU_OPTIONS}
                            data={row}
                          />
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
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
            rowsPerPageOptions={[50]}
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
