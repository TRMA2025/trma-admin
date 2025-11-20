import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import React, { useEffect, useState } from "react";
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
import { convertCurrencyToSign } from "src/utils/constant";
// import UserListHead from "./UserListHead";
// import GoalStatementMenu from "../components/_dashboard/user/GoalStatementMenu";
// import { QuestionListing } from "src/DAL/GoalStatement/GoalStatement";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { htmlDecode } from "src/utils/convertHtml";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import moment from "moment";
import {
  deleteProgrammeSectionApi,
  programmeAutoGroupList,
  programmeSectionList,
  deleteProgrammeAutoGroupApi,
} from "src/DAL/Programme/Programme";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import {
  DeleteMemberApi,
  memberBillingDetailApi,
  memberBillingListApi,
  memberListing,
} from "src/DAL/member/member";
import { s3baseUrl } from "src/config/config";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "totalAmount", label: "Total Amount", alignRight: false },
  { id: "note", label: "Transaction Note", alignRight: false },
  { id: "date", label: "Transaction Date", alignRight: false },
  { id: "currency", label: "Currency", alignRight: false },
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
    return filter(
      array,
      (_user) =>
        _user.transaction_note.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
export default function PaymentRequestInfo() {
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
  const [billingList, setBillingList] = useState([]);

  const [UserId, setUserId] = useState(false);
  let breadCrumbMenu = [
    {
      title: "Payment Requests",
      navigation: `/payment-requests`,
      active: false,
    },

    {
      title: params?.state?.request_title,
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
  const {
    request_title,
    date,
    currency,
    initial_amount,
    installment_amount,
    is_first_paid,
    member,
    month,
    payment_request_slug,
    payment_template,
    product,
    request_iteration_type,
    request_type,
    status,
    total_amount,
    transaction_note,
    vat_number,
  } = params.state;

  const getMemberListing = async () => {
    setIsLoading(true);
    //console.log("okokokokokokoko");

    try {
      setIsLoading(true);
      const result = await memberBillingDetailApi(payment_request_slug);
      if (result.code === 200) {
        console.log(result, "api for billing detail");
        //console.log(result.payment_request_info, "resultresultresult ");
        setBillingList(result.payment_request_info);
        setIsLoading(false);

        setQuestionData(result.payment_request_info);
        //console.log(result.payment_request_info, "result.payment_request_info");
        const data = result.payment_request_transaction.map((transaction) => {
          return {
            ...transaction,
            id: transaction._id,
            total_amount: transaction.amount,
            date: transaction.transaction_date,
            currency: transaction.currency,
            transaction_note: transaction.transaction_note,
            status: transaction.status,
          };
        });
        // const data = {
        //   id: result.payment_request_info._id,
        //   total_amount: result.payment_request_info.total_amount,
        //   date: result.payment_request_info.createdAt,
        //   currency: result.payment_request_info.currency,
        //   transaction_note: result.payment_request_info.transaction_note,
        //   status: result.payment_request_info.status,
        // };
        let bill = [];
        bill.push(data);
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
  const handleBilling = (value) => {
    //console.log(value, "Billing Detail");

    navigate(`/member/billing-detail`, {
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
  React.useEffect(() => {
    getMemberListing();
  }, []);
  const MENU_OPTIONS = [
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
    {
      label: "View Detail",
      icon: "akar-icons:eye",
      handleClick: handleBilling,
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
          <div className="col-12 mb-2">
            {/* <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(-1)}>
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton> */}
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          </div>
          <div className="col-lg-8 col-sm-12">
            <h2>Payment Request Transaction</h2>
          </div>
        </div>
        <Card className="payment-card mb-3">
          <div className="row p-3">
            <div className="col-12">
              <div className="mb-3">
                {/* <span>{htmlDecode(bill.request_title)}</span> */}
                <span className="payment-font">
                  {htmlDecode(request_title)}
                </span>
              </div>
              <div className="mb-3 d-flex align-items-center svg-color date-color ">
                <Icon icon="uiw:date" />
                <span className="ms-2 payment-font">
                  {moment(date).format("MMM DD YYYY")}
                </span>
              </div>
              <div className="row">
                <div className="col-8 col-md-6 col-lg-3 payment-font">
                  Request Type:
                </div>
                <div className="col-4 col-md-6 col-lg-3 text-muted payment-font">
                  {request_type === "onetime" ? "OneTime" : "Recurring"}
                </div>
                <div className="col-8 col-md-6 col-lg-3 mt-3 mt-lg-0 payment-font">
                  Total Programme Amount:
                </div>
                <div className="col-4 col-md-6 col-lg-3  mt-3 mt-lg-0 text-muted payment-font">
                  {convertCurrencyToSign(currency)}
                  {total_amount.toLocaleString()}
                </div>
                {request_type === "recurring" && (
                  <>
                    <div className="col-8 col-md-6 col-lg-3  mt-3 payment-font">
                      Initial Deposit Amount:
                    </div>
                    <div className="col-4 col-md-6 col-lg-3  mt-3 text-muted payment-font">
                      {convertCurrencyToSign(currency)}
                      {initial_amount.toLocaleString()}
                    </div>

                    <div className="col-8 col-md-6 col-lg-3  mt-3 payment-font">
                      Monthly Installments:
                    </div>
                    <div className="col-4 col-md-6 col-lg-3  mt-3 text-muted payment-font">
                      {convertCurrencyToSign(currency)}
                      {month.toLocaleString()}
                    </div>
                    <div className="col-8 col-md-6 col-lg-3  mt-3">
                      Installments Plan:
                    </div>
                    <div className="col-4 col-md-6 col-lg-3 mt-3 text-muted payment-font">
                      {month.toLocaleString() + " " + "months"}
                    </div>
                  </>
                )}

                {/* {handlePage && (
              <div className="col-12 text-center">
                <button
                  className="small-contained-button mt-3"
                  onClick={() => {
                    handlePage(
                      bill.payment_request_type,
                      bill.payment_request_slug
                    );
                  }}
                >
                  {btn_title}
                </button>
              </div>
            )} */}
              </div>
            </div>
          </div>
        </Card>

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
                      name,
                      start,
                      end,
                      email,
                      profile,
                      program,
                      goal,
                      question,
                      question_statement,

                      date,
                      currency,
                      initial_amount,
                      installment_amount,
                      is_first_paid,
                      member,
                      month,
                      payment_request_slug,
                      payment_template,
                      product,
                      request_iteration_type,
                      request_title,
                      request_type,
                      status,
                      total_amount,
                      transaction_note,
                      vat_number,
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
                            <Typography variant="subtitle2">
                              {total_amount}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(transaction_note))}
                        </TableCell>{" "}
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(date))}
                        </TableCell>
                        <TableCell align="left">
                          {currency === "gbp"
                            ? "UK Pounds"
                            : currency === "usd"
                            ? "Dollar"
                            : currency === "eur"
                            ? "Euro"
                            : ""}
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={status === "" ? "error" : "success"}
                          >
                            {status === false ? "Unsuccessful" : "successful"}
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
