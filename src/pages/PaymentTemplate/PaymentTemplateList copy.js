import React from "react";
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
import roundFilterList from "@iconify/icons-ic/round-filter-list";
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
  DeleteStripeListApi,
  StripeListApi,
} from "src/DAL/StripeProduct/stripeProductApi";
import {
  DeletePaymentTemplateApi,
  paymentTemplateListApi,
} from "src/DAL/PaymentTemplate/paymentTemplateApi";
import PaymentTemplateFilter from "./PaymentTemlateFilter";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Title", alignRight: false },
  { id: "programme", label: "Programme", alignRight: false },
  { id: "Product", label: "Product", alignRight: false },
  { id: "type", label: "Payment Request Type", alignRight: false },
  { id: "amount", label: "Total Amount", alignRight: false },
  { id: "InitialAmount", label: "Initial Amount", alignRight: false },
  { id: "InstallmentAmount", label: "Installment Amount", alignRight: false },
  {
    id: "NoOfInstallmentAmount",
    label: "No of Installments",
    alignRight: false,
  },
  { id: "Actionby", label: "Action By", alignRight: false },
  { id: "Action", label: "Action", alignRight: false },
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
export default function PaymentTemplateList() {
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
  const [member, setData] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState("all");
  const [filterDrawerState, setFilterDrawerState] = useState(false);

  const [UserId, setUserId] = useState(false);

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
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
  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getConsultantListing = async (value) => {
    setIsLoading(true);
    let postData = {};
    if (value == undefined) {
      postData = {
        type: "all",
      };
    } else {
      postData = {
        type: value,
      };
    }

    try {
      setIsLoading(true);
      const result = await paymentTemplateListApi(postData);
      if (result.code === 200) {
        //console.log(result, "Api result ");
        //console.log(result.payment_template, "resultresultresult ");
        setData(result.payment_template);
        setIsLoading(false);

        setQuestionData(result.payment_template);

        const data = result.payment_template.map((template) => {
          //console.log(template, "templatetemplatetemplatetemplate");
          return {
            id: template._id,
            currency: template.currency,
            name: template.title,
            actionBy: template.action_info,
            initial_amount: template.initial_amount,
            installment_amount: template.installment_amount,
            product: template.product,
            program: template.program,
            template_type: template.template_type,
            total_amount: template.total_amount,
            description: template.short_description,
            vat_number: template.vat_number,
            no_of_installment: template.no_of_installment,
            object: template,
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
    navigate(`/payment-template/edit-template/${value.id}`, {
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

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeletePaymentTemplateApi(deleteDoc.id);
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
    navigate(`/payment-template/add-template`);
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
  const isUserNotFound = filteredUsers.length === 0;
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  // console.log(selected, "How data is working ");
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
            <h2>Payment Template</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenFilterDrawer}>
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button>
            <button onClick={handleNavigate} className="small-contained-button">
              Add Template
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
                      stripe_id,
                      createdAt,
                      status,
                      type,
                      currency,
                      initial_amount,
                      installment_amount,
                      product,
                      program,
                      total_amount,
                      description,
                      vat_number,
                      actionBy,
                      no_of_installment,
                      template_type,
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
                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}>
                            {name}
                          </Stack>
                        </TableCell>

                        {/* <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(createdAt))}
                        </TableCell> */}
                        <TableCell component="th" scope="row">
                          {Capitalize(
                            htmlDecode(program?.title ? program.title : "N/A")
                          )}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(product?.name))}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(template_type))}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(total_amount))}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(initial_amount))}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(installment_amount))}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(no_of_installment))}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {htmlDecode(
                            actionBy.type == "admin_user"
                              ? actionBy.name + " (" + "Admin" + ")"
                              : actionBy.type == "consultant_user"
                              ? actionBy.name + " (" + "Consultant" + ")"
                              : "N/A"
                          )}
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
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
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
      <CustomDrawer
        isOpenDrawer={filterDrawerState}
        onOpenDrawer={handleOpenFilterDrawer}
        onCloseDrawer={handleCloseFilterDrawer}
        pageTitle="Filters"
        componentToPassDown={
          <PaymentTemplateFilter
            value={selectedValue}
            handleChange={handleChangeFilter}
            dataList={getConsultantListing}
            setSelectedValue={setSelectedValue}
            onCloseDrawer={handleCloseFilterDrawer}
          />
        }
      />
    </>
  );
}
