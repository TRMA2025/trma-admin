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
import {
  DeleteMemberApi,
  DeletePaymentRequestApi,
  memberBillingListApi,
  memberListing,
} from "src/DAL/member/member";
import { s3baseUrl } from "src/config/config";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },

  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Request Title", alignRight: false },
  { id: "email", label: "Product", alignRight: false },
  { id: "paymentTemplate", label: "Payment Template", alignRight: false },
  { id: "program", label: "Program", alignRight: false },
  { id: "member", label: "member", alignRight: false },
  { id: "requestType", label: "Request Type", alignRight: false },
  { id: "totalAmount", label: "Total Amount", alignRight: false },
  { id: "initialAmount", label: "Initial Amount", alignRight: false },
  { id: "installmentAmount", label: "Installment Amount", alignRight: false },
  { id: "month", label: "Month", alignRight: false },
  // { id: "firstPaid", label: "First Paid", alignRight: false },
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
        _user.request_title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
export default function ViewBillingList() {
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
      title: "Members",
      navigation: -1,
      active: false,
    },

    {
      title: "Payment Requests",
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
      const result = await memberBillingListApi(params.state.id);
      if (result.code === 200) {
        //console.log(result, "api for biilling ");
        //console.log(result.payment_request, "resultresultresult ");
        setBillingList(result.payment_request);
        setIsLoading(false);

        setQuestionData(result.payment_request);

        const data = result.payment_request.map((billing) => {
          //console.log(billing, "billingbilling");
          return {
            id: billing._id,
            date: billing.createdAt,
            currency: billing.currency,
            initial_amount: billing.initial_amount,
            installment_amount: billing.installment_amount,
            is_first_paid: billing.is_first_paid,
            member: billing.member,
            name: billing.member?.first_name,
            member_id: billing.member._id,
            month: billing.month,
            payment_request_slug: billing.payment_request_slug,
            payment_template: billing.payment_template,
            product: billing.product,
            program: billing.program,
            request_iteration_type: billing.request_iteration_type,
            request_title: billing.request_title,
            request_type: billing.request_type,
            status: billing.status,
            total_amount: billing.total_amount,
            transaction_note: billing.transaction_note,
            vat_number: billing.vat_number,
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
  const handleBilling = (value) => {
    //console.log(value, "Billing Detail");
    if (params.pathname.includes("pending")) {
      navigate(`/pending-member/billing-detail`, {
        state: value,
      });
    } else {
      navigate(`/member/billing-detail`, {
        state: value,
      });
    }
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
    const result = await DeletePaymentRequestApi(
      deleteDoc.payment_request_slug
    );
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
  const handleNavigate = (id) => {
    if (params.pathname.includes("pending")) {
      navigate(`/pending-member/add-payment-request/${id}`);
    } else {
      navigate(`/member/add-payment-request/${id}`);
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  // //console.log(member, "membermembermember");
  useEffect(() => {
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
          <div className="col-12 mb-3">
            {/* <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(-1)}
            >
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton> */}
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          </div>
          <div className="col-lg-8 col-sm-12">
            <h2>Payment Requests</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button
              onClick={() => handleNavigate(params.state.id)}
              className="small-contained-button"
            >
              Add Payment Requests
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
                        <TableCell>
                          <CustomPopoverSection
                            menu={MENU_OPTIONS}
                            data={row}
                          />
                        </TableCell>
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
                              {request_title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {Capitalize(htmlDecode(product?.name))}
                        </TableCell>
                        <TableCell>
                          {Capitalize(
                            htmlDecode(
                              payment_template?.title
                                ? payment_template.title
                                : "N/A"
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          {Capitalize(
                            htmlDecode(program?.title ? program.title : "N/A")
                          )}
                        </TableCell>
                        <TableCell>
                          {Capitalize(
                            htmlDecode(
                              member?.first_name
                                ? member.first_name + " " + member.last_name
                                : "N/A"
                            )
                          )}
                        </TableCell>{" "}
                        <TableCell>
                          {Capitalize(htmlDecode(request_type))}
                        </TableCell>
                        <TableCell>
                          {Capitalize(htmlDecode(total_amount))}
                        </TableCell>
                        <TableCell>
                          {Capitalize(htmlDecode(initial_amount))}
                        </TableCell>
                        <TableCell>
                          {Capitalize(htmlDecode(installment_amount))}
                        </TableCell>
                        <TableCell>{Capitalize(htmlDecode(month))}</TableCell>
                        {/* <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={
                              is_first_paid === false ? "error" : "success"
                            }
                          >
                            {is_first_paid === false ? "Pending" : "Paid"}
                          </Label>
                        </TableCell> */}
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
                    <TableCell align="center" colSpan={13} sx={{ py: 3 }}>
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
