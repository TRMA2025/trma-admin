import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";
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
import {
  DeleteMemberApi,
  memberListing,
  memberTransactionListApi,
} from "src/DAL/member/member";
import { s3baseUrl } from "src/config/config";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import { convertCurrencyToSign } from "src/utils/constant";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "amount", label: "Amount", alignRight: false },
  { id: "transactionDate", label: "Transaction Date", alignRight: false },
  // { id: "profile", label: "Profile", alignRight: false },
  // { id: "currency", label: "Currency", alignRight: false },
  { id: "transactionType", label: "Transaction Type", alignRight: false },
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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    //console.log(query, "queryqueryquery");
    return filter(
      array,
      (_user) =>
        _user.currency.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.transaction_status.toLowerCase().indexOf(query.toLowerCase()) !==
          -1
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
export default function MemberAllTransaction() {
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
  const [transactionsList, setTransactionList] = useState([]);

  const [UserId, setUserId] = useState(false);
  let breadCrumbMenu = [
    {
      title: "Members",
      navigation: -1,
      active: false,
    },

    {
      title: "All Transactions",
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

  const getMemberListing = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      const result = await memberTransactionListApi(params.state.id);
      if (result.code === 200) {
        //console.log(result, "api for transaction list");
        //console.log(result?.transaction, "resultresultresult ");
        setTransactionList(result?.transaction);
        setIsLoading(false);

        setQuestionData(result.member);

        const data = result.transaction.map((transaction) => {
          // console.log(
          //   moment(transaction.createdAt).format("MM DD YYYY"),
          //   "Date time"
          // );

          return {
            id: transaction._id,
            amount: transaction.amount,
            date: transaction.createdAt,
            currency: transaction.currency,
            transaction_type: transaction.transaction_type,
            transaction_status: transaction.transaction_status,
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
    // navigate(`/member/all-transaction/${value.id}`, {
    //   state: value,
    // });
  };

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
    navigate(`/member/add-member`);
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
    getMemberListing();
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
      label: "Manage Program Access",
      icon: "ant-design:key",
      handleClick: handleChangePassword,
    },
    {
      label: "All Transactions",
      icon: "icon-park-outline:transaction-order",
      handleClick: handleChangeAllTransaction,
    },
    {
      label: "View Billings",
      icon: "icon-park-outline:transaction-order",
      handleClick: handleChangePassword,
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
          <div className="col-12 mb-3">
            {/* <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(-1)}>
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton> */}
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

            {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
          </div>
          <div className="col-lg-8 col-sm-12">
            <h2>All Transactions</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            {/* <button onClick={handleNavigate} className="small-contained-button">
              Add Member
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

        <Card style={{ overflowX: "auto" }}>
          <div className="d-flex justify-content-between">
            {" "}
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
                      transaction_status,
                      email,
                      profile,
                      program,
                      goal,
                      date,
                      currency,
                      transaction_type,
                      amount,
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
                        <TableCell align="left">
                          {page * rowsPerPage + (i + 1)}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="1">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            {/* <Avatar alt={name} src={s3baseUrl + profile} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {convertCurrencyToSign(currency) + amount}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {moment(date).format("DD-MM-YYYY hh:mm A")}
                        </TableCell>

                        {/* <TableCell align="left">
                          {currency === "gbp"
                            ? "UK Pounds"
                            : currency === "usd"
                            ? "Dollar"
                            : currency === "eur"
                            ? "Euro"
                            : ""}
                        </TableCell> */}
                        <TableCell align="left">{transaction_type}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={
                              transaction_status === "succeeded"
                                ? "success"
                                : "error"
                            }
                          >
                            {transaction_status === "succeeded"
                              ? "Successful"
                              : "Unsuccessful"}
                          </Label>
                        </TableCell>

                        {/* <TableCell>
                          <CustomPopoverSection
                            menu={MENU_OPTIONS}
                            data={row}
                          />
                        </TableCell> */}
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
