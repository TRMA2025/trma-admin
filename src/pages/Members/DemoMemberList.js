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
import Pagination from "@mui/material/Pagination";
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
import { DeleteMemberApi, memberListing } from "src/DAL/member/member";
import { s3baseUrl } from "src/config/config";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: " Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  // { id: "profile", label: "Profile", alignRight: false },
  { id: "program", label: "Programme", alignRight: false },
  { id: "communityLevel", label: "Community Level", alignRight: false },
  { id: "likes", label: "Likes", alignRight: false },
  { id: "gratitude", label: "Gratitude", alignRight: false },
  { id: "coin", label: "Coins", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "goal", label: "Goal", alignRight: false },
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
      (_user) =>
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
export default function MembersList() {
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
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setMember] = useState([]);
  const [limit, setLimit] = useState(50);
  const [count, setCount] = useState();
  const [userListPath, setUserListPath] = useState(
    "api/member/member_list?page=0&limit=50"
  );
  const [search, setSearch] = useState("");

  const [UserId, setUserId] = useState(false);

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getMemberListing = async (page, rowsPerPage, search) => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      // const result = await memberListing(userListPath, search);
      const result = await memberListing(page, rowsPerPage, search);
      if (result.code === 200) {
        setUserListPath(result.load_more);
        setMember(result.member);
        setCount(result?.total_member_count);
        setIsLoading(false);

        const data = result.member.map((member) => {
          return {
            id: member._id,
            name: member.first_name,
            lastName: member.last_name,
            status: member.status,
            email: member.email,
            profile: member.profile_image,
            program: member.program,
            goal: member.goal_statement_status,
            contact_number: member.contact_number,
            street: member.street,
            city: member.city,
            zip_code: member.zip_code,
            state: member.state,
            selectedCountry: member.country,
            consultant_id: member?.consultant?._id,
            time_zone: member.time_zone,
            member_biography: member.member_biography,
            profile_image: member.profile_image,
            first_payment_date: member.first_payment_date,
            selected_country: member.country,
            communityLevel: member.community_level,
            likeCount: member.like_count,
            gratitudeCount: member.gratitude_count,
            coinsCount: member.coins_count,
            object: member,
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
    navigate(`/member/edit-member/${value.id}`, {
      state: value,
    });
  };
  const handleProfile = (value) => {
    //console.log(value, "Profile");
    navigate(`/member/member-profile/${value.id}`, {
      state: value,
    });
  };
  const handleChangePassword = (value) => {
    navigate(`/member/change-password/${value.id}`, {
      state: value,
    });
  };
  const handleChangeAllTransaction = (value) => {
    navigate(`/member/all-transaction/${value.id}`, {
      state: value,
    });
  };

  const handleChangeBilling = (value) => {
    navigate(`/member/view-billing-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeAccess = (value) => {
    navigate(`/member/programme-access/${value.id}`, {
      state: value,
    });
  };
  const handleChangeRewardAccess = (value) => {
    navigate(`/member/reward-access/${value.id}`, {
      state: value,
    });
  };
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(2) + "k"
      : Math.sign(num) * Math.abs(num);
  }
  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  function abbreviateNumber(number) {
    // what tier? (determines SI symbol)
    var tier = (Math.log10(Math.abs(number)) / 3) | 0;

    // if zero, we don't need a suffix
    if (tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
  }

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteMemberApi(deleteDoc.id);
    if (result.code === 200) {
      getMemberListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    //console.log(event, newPage, "ok change handleChangePage");
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log("handleChangeRowsPerPage");
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
    navigate(`/member/add-member`);
  };
  const handleNavigateImportMember = () => {
    navigate(`/member/import-member`);
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
    // getMemberListing(userListPath);
    getMemberListing(page, rowsPerPage);
    // console.log(page, rowsPerPage, "rowsPerPagerowsPerPagerowsPerPage");
  }, []);
  useEffect(() => {
    // getMemberListing(userListPath);
    getMemberListing(page, rowsPerPage);
    //console.log(page, rowsPerPage, "rowsPerPagerowsPerPagerowsPerPage");
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
    {
      label: "View Profile",
      icon: "iconoir:profile-circled",
      handleClick: handleProfile,
    },
    {
      label: "Change Password",
      icon: "ant-design:lock",
      handleClick: handleChangePassword,
    },
    {
      label: "Manage Programme Access",
      icon: "ant-design:key",
      handleClick: handleChangeAccess,
    },
    {
      label: "Manage Reward Access",
      icon: "ant-design:key",
      handleClick: handleChangeRewardAccess,
    },
    {
      label: "All Transactions",
      icon: "icon-park-outline:transaction-order",
      handleClick: handleChangeAllTransaction,
    },
    {
      label: "View Billings",
      icon: "icon-park-outline:transaction-order",
      handleClick: handleChangeBilling,
    },
  ];
  const isUserNotFound = filteredUsers.length === 0;
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

      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            <h2>Members</h2>
          </div>
          <div className="col-lg-6 col-sm-12 text-end ">
            <button
              onClick={handleNavigateImportMember}
              className="small-contained-button me-2">
              Import Member
            </button>
            <button onClick={handleNavigate} className="small-contained-button">
              Add Member
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
          mb={5}>
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
                      name,
                      lastName,
                      status,
                      start,
                      end,
                      email,
                      profile,
                      program,
                      goal,
                      question,
                      question_statement,
                      communityLevel,
                      likeCount,
                      gratitudeCount,
                      coinsCount,
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
                            spacing={2}>
                            <Avatar alt={name} src={s3baseUrl + profile} />
                            <Typography variant="subtitle2" noWrap>
                              {name + " " + lastName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(email))}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {program.map((program) => {
                            return (
                              <>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: program._id.title + ",",
                                  }}></div>
                              </>
                            );
                          })}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {communityLevel}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {likeCount}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {gratitudeCount}
                        </TableCell>{" "}
                        <TableCell component="th" scope="row">
                          {abbreviateNumber(coinsCount)}
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={status === false ? "error" : "success"}>
                            {status === false ? "InActive" : "Active"}
                          </Label>
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={goal === false ? "error" : "success"}>
                            {goal === false ? "Locked" : "Unlocked"}
                          </Label>
                        </TableCell>
                        <TableCell>
                          <CustomPopoverSection
                            menu={MENU_OPTIONS}
                            data={row}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={11} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={11} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
          {/* <Pagination
            count={count}
            shape="rounded"
            page={page}
            className="pagination-Color"
            renderItem={(item) => (
              <PaginationItem
                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
            onClick={() => getMemberListPagination()}
          /> */}
          <TablePagination
            rowsPerPageOptions={[50, 100, 150]}
            component="div"
            count={count}
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
