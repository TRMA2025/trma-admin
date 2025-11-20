import React from "react";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
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
  Chip,
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
import {
  DeleteMemberApi,
  DeletePaymentRequestApi,
  memberBillingListApi,
  memberListing,
} from "src/DAL/member/member";
import { s3baseUrl } from "src/config/config";
import { paymentRequestListApi } from "src/DAL/PaymentRequest/paymentRequestApi";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import PaymentRequestFilter from "./PaymentRequestFilter";
import Skeleton from "react-loading-skeleton";
import ListSkeleton from "src/components/listSkeleton/ListSkeleton";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },

  { id: "number", label: "#", alignRight: false },
  { id: "member", label: "member", alignRight: false },
  { id: "name", label: "Request Title", alignRight: false },
  { id: "email", label: "Product", alignRight: false },
  { id: "paymentTemplate", label: "Payment Template", alignRight: false },
  //   { id: "program", label: "Program", alignRight: false },
  { id: "requestType", label: "Request Type", alignRight: false },
  { id: "totalAmount", label: "Total Amount", alignRight: false },
  { id: "initialAmount", label: "Initial Amount", alignRight: false },
  { id: "installmentAmount", label: "Installment Amount", alignRight: false },
  { id: "month", label: "Month", alignRight: false },
  // { id: "actionby", label: "Action By", alignRight: false },
  { id: "firstPaid", label: "First Paid", alignRight: false },
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
    return filter(array, (_user) => {
      let memberName = "";
      if (_user?.member) {
        memberName = _user?.member?.first_name + " " + _user?.member?.last_name;
      }
      // _user.request_title.toLowerCase().indexOf(query.toLowerCase()) !== -1
      //  ||
      // _user?.member?.first_name.toLowerCase().indexOf(query.toLowerCase()) !==
      //   -1;
      // ||
      // _user.member?.last_name.toLowerCase().indexOf(query.toLowerCase()) !==
      //   -1
      return (
        memberName &&
        memberName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
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
export default function PaymentRequestList() {
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
  const [selectedValue, setSelectedValue] = React.useState("all");
  const [totalCount, setTotalCount] = React.useState("all");
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const [filterNameStatus, setFilterNameStatus] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);

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

  const handleOpenFilterDrawer = () => {
    setFilterDrawerState(true);
  };
  const handleCloseFilterDrawer = () => {
    setFilterDrawerState(false);
  };
  const handleChangeFilter = (event) => {
    setSelectedValue(event.target.value);
  };

  const getMemberListing = async (value) => {
    setIsLoading(true);
    let postData = {};
    if (value == undefined) {
      postData = {
        type: "all",
        search: searchText,
      };
    } else if (value == "consultant") {
      postData = {
        type: value,
        id: selectedConsultant,
        search: searchText,
      };
    } else {
      postData = {
        type: value,
        search: searchText,
      };
    }

    try {
      setIsLoading(true);
      const result = await paymentRequestListApi(page, rowsPerPage, postData);
      if (result.code === 200) {
        //console.log(result, "api for request ");
        //console.log(result.payment_request, "resultresultresult ");
        setBillingList(result.payment_request);
        setIsLoading(false);
        setTotalCount(result.total_payment_request_count);
        // setTotalCount(result?.payment_request?.length);
        setQuestionData(result.payment_request);
        setTotalPages(result.total_pages);

        const data = result.payment_request.map((billing) => {
          //console.log(billing.is_first_paid, "billing.is_first_paid");
          return {
            id: billing._id,
            date: billing.createdAt,
            currency: billing.currency,
            actionBy: billing.action_info,
            initial_amount: billing.initial_amount,
            installment_amount: billing.installment_amount,
            is_first_paid: billing.is_first_paid,
            member: billing.member,
            member_id: billing?.member?._id,
            month: billing.month,
            payment_request_slug: billing.payment_request_slug,
            payment_template: billing.payment_template,
            product: billing.product,
            // program: billing.program,
            request_iteration_type: billing.request_iteration_type,
            request_title: billing.request_title,
            request_type: billing.request_type,
            status: billing.status,
            total_amount: billing.total_amount,
            transaction_note: billing.transaction_note,
            vat_number: billing.vat_number,
            firstPaid: billing.is_first_paid,
            show_on_consultant: billing.show_on_consultant,
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
    navigate(`/payment-request/edit-payment-request/${value.id}`, {
      state: value,
    });
  };
  const handleBilling = (value) => {
    //console.log(value, "Billing Detail");

    navigate(`/payment-request/payment-request-detail`, {
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
    localStorage.setItem("member_page_number", newPage);
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
  const handleSearchName = () => {
    //console.log(filterName, "filterName for search");
    getMemberListing();
    setFilterNameStatus(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchName();
    }
  };

  const handleNavigate = () => {
    navigate(`/payment-request/add-payment-request`);
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
  }, [page, rowsPerPage]);
  useEffect(() => {
    if (!filterNameStatus) {
      return;
    }
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
      label: "View Detail",
      icon: "akar-icons:eye",
      handleClick: handleBilling,
    },
  ];
  const MENU_OPTIONS1 = [
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
          <div className="col-lg-8 col-sm-12">
            <h2>Payment Requests</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            {/* <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenFilterDrawer}
            >
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button> */}
            <button
              onClick={() => handleNavigate()}
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
                {/* <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              /> */}
                <UserListToolbar
                  numSelected={selected.length}
                  filterName={searchText}
                  onFilterName={handleFilterByName}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={() => getMemberListing()}
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
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                        actionBy,
                        is_first_paid,
                        firstPaid,
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
                            {is_first_paid === true ? (
                              <CustomPopoverSection
                                menu={MENU_OPTIONS1}
                                data={row}
                              />
                            ) : (
                              <CustomPopoverSection
                                menu={MENU_OPTIONS}
                                data={row}
                              />
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {page * rowsPerPage + (i + 1)}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className="text-nowrap"
                          >
                            {Capitalize(
                              htmlDecode(
                                member?.first_name
                                  ? member.first_name + " " + member.last_name
                                  : "N/A"
                              )
                            )}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                              className="text-nowrap"
                            >
                              {/* <Avatar alt={name} src={s3baseUrl + profile} /> */}
                              <Typography variant="subtitle2">
                                {request_title}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(
                              htmlDecode(product?.name ? product?.name : "N/A")
                            )}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(
                              htmlDecode(
                                payment_template?.title
                                  ? payment_template.title
                                  : "N/A"
                              )
                            )}
                          </TableCell>

                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(htmlDecode(request_type))}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(htmlDecode(total_amount))}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(htmlDecode(initial_amount))}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(htmlDecode(installment_amount))}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(htmlDecode(month))}
                          </TableCell>
                          {/* <TableCell component="th" scope="row">
                          {htmlDecode(
                            actionBy?.type == "admin_user"
                              ? "Admin" + " (" + actionBy?.name + ")"
                              : actionBy?.type == "consultant_user"
                              ? "Consultant" + " (" + actionBy?.name + ")"
                              : "N/A"
                          )}
                        </TableCell> */}
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={
                                is_first_paid === false ? "error" : "success"
                              }
                            >
                              {is_first_paid === false ? "Pending" : "Paid"}
                            </Label>
                          </TableCell>
                          <TableCell className="text-nowrap" align="left">
                            <Chip
                              width="140px"
                              label={status == true ? "Active" : "Inactive"}
                              variant="contained"
                              className={
                                status == true
                                  ? `manage-program-chip-success `
                                  : ""
                              }
                              color={status == true ? "success" : "error"}
                              size="small"
                            />
                            {/* <Label
                            variant="ghost"
                            color={status === false ? "error" : "success"}
                          >
                            {status === false ? "InActive" : "Active"}
                          </Label> */}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={13} />
                  </TableRow>
                )} */}
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
        )}
      </div>
      <CustomDrawer
        isOpenDrawer={filterDrawerState}
        onOpenDrawer={handleOpenFilterDrawer}
        onCloseDrawer={handleCloseFilterDrawer}
        pageTitle="Filters"
        componentToPassDown={
          <PaymentRequestFilter
            value={selectedValue}
            handleChange={handleChangeFilter}
            dataList={getMemberListing}
            setSelectedValue={setSelectedValue}
            onCloseDrawer={handleCloseFilterDrawer}
            setSelectedConsultant={setSelectedConsultant}
            selectedConsultant={selectedConsultant}
          />
        }
      />
    </>
  );
}
