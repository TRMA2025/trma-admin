import React from "react";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
// import blank from "../../assets/images/blank-image.png";
// import ViewDetails from "../Customer/ViewDetails";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
// import AddCustomer from "../Customer/AddCustomer";
// import UpdateCustomer from "../Customer/UpdateCustomer";
import CloseIcon from "@mui/icons-material/Close";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
// import UpdatePassword from "../Customer/UpdatePassword";
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
  Tooltip,
  CircularProgress,
  Pagination,
  TableHead,
} from "@mui/material";
// components
// import ViewCategory from "./ViewCategory";
// import Page from "../../components/Page";
// import Label from "../../components/Label";
// import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";

import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../../components/_dashboard/user";
//
import USERLIST from "../../_mocks_/user";
// import {
//   _delete_customer,
//   _authors_list,
//   _delete_author,
//   _edit_author,
// } from "../../DAL/authors/authors";
import { s3baseUrl } from "../../config/config";
import CustomPopover from "src/components/MenuOption/CustomPopoverSection";
import { useSnackbar } from "notistack";
// import CategoryCofirmation from "../Category/CategoryConfirmation";
// import Loader from "../../components/Loader/Loader";
import { unstable_ownerWindow } from "@mui/utils";
import moment from "moment";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Label from "src/components/Label";
import { makeStyles } from "@mui/styles";
// import AddAuthor from "./AddAuthor/AddAuthor";
// import UpdateAuthor from "./UpdateAuthor";
// import { get_short_string } from "src/utils/utils";
import {
  DeleteMemberApi,
  DeleteMultiMemberApi,
  memberListing,
  paymentTemplateListApi,
} from "src/DAL/member/member";
import { htmlDecode } from "src/utils/convertHtml";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import UserListToolbars from "src/components/_dashboard/user/UserListToolbars";
import { fontSize } from "@mui/system";
import {
  DeletePaymentTemplateApi,
  paymentTemplateListApiPagination,
} from "src/DAL/PaymentTemplate/paymentTemplateApi";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import PaymentTemplateFilter from "./PaymentTemlateFilter";
import Skeleton from "react-loading-skeleton";
import ListSkeleton from "src/components/listSkeleton/ListSkeleton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TABLE_HEAD = [
  { id: "Action", label: "Action", alignRight: false },

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
  // { id: "Actionby", label: "Action By", alignRight: false },
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
      (row) => row.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
      // row.last_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function PaymentTemplateList() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [biology, setBiology] = useState("");
  const [achievements, setAchievements] = useState("");
  const [dob, setDOB] = useState("");
  const [country, setCountry] = useState("");
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMultiDelete, setOpenMultiDelete] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [isOpenPasswordDrawer, setOpenPasswordDrawer] = useState(false);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [inputs, setInputs] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [openImage, setOpenImage] = useState();
  const classes = useStyles();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [filterNameStatus, setFilterNameStatus] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("all");
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(true);
    setOpenImage(value);
  };
  const handleClose = () => setOpen(false);

  // const { id } = useParams();

  const getMemberListing = async (value) => {
    setIsLoading(true);
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
        search: searchText,
        id: selectedConsultant,
      };
    } else {
      postData = {
        search: searchText,
        type: value,
      };
    }
    console.log(postData, "fkjhadskjfhla");
    const result = await paymentTemplateListApiPagination(
      page,
      rowsPerPage,
      postData
    );
    console.log(result, "members");
    if (result.code == 200) {
      const members = result?.payment_template?.map((template, index) => {
        return {
          ...template,
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
          show_on_consultant: template.show_on_consultant,
          object: template,
          count: index + 1 + rowsPerPage * page,
        };
      });
      //console.log(members, "members updated array");

      setData(members);
      setTotalPages(result.total_pages);
      setTotalCount(result.total_payment_template_count);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    console.log(name, "checkbox");
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  console.log(selected, "selected");

  const emptyRows = page > 0 && 0;

  const filteredUsers = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  //-----------Array for Images
  // let img = [];
  //   data.forEach((data) => {
  //     img = data.images;
  //     console.log(img, "datadatadata");
  //   });

  const handleUpdate = (row) => {
    setSelectedRow(row);
    handleOpenUpdateAuthor();
  };

  const handleView = (row) => {
    setSelectedRow(row);
    handleOpenViewDrawer();
  };

  const handleOpenUpdateAuthor = () => {
    setIsDrawerOpen(true);
  };

  const handleOpenAddAuthor = () => {
    setAddDrawerOpen(true);
  };
  const handleCloseAddAuthor = () => {
    setAddDrawerOpen(false);
  };

  const handleCloseUpdateAuthor = () => {
    setIsDrawerOpen(false);
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleAddAuthor = () => {
    setAddDrawerOpen(true);
  };

  const handleViewCustomerChallenges = (selectedRow) => {
    navigate(`/customers/view-customer-challenges/${selectedRow.user_id._id}`);
  };

  const handleOpenViewDrawer = (row) => {
    setViewDrawerOpen(true);
  };

  const handleCloseViewDrawer = () => {
    // setSelectedRow(row);
    setViewDrawerOpen(false);
  };
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
  const handleOpenFilterDrawer = () => {
    setFilterDrawerState(true);
  };
  const handleCloseFilterDrawer = () => {
    setFilterDrawerState(false);
  };
  const handleChangeFilter = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  const openPasswordDrawer = () => {
    setOpenPasswordDrawer(true);
  };

  const closePasswordDrawer = () => {
    setOpenPasswordDrawer(false);
  };

  const handlePassword = (row) => {
    setSelectedRow(row);
    openPasswordDrawer();
  };
  const handleEdit = (value) => {
    //console.log(value, "edit value");
    navigate(`/payment-template/edit-template/${value.id}`, {
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
  const handleMemberHistory = (value) => {
    navigate(`/member/member-history/${value.id}`, {
      state: value,
    });
  };
  const handleNavigateImportMember = () => {
    navigate(`/member/import-member`);
  };
  // const handleRegisterEvents = () => {
  //   navigate(`/member/register-events`);
  // };
  const handleNavigate = () => {
    navigate(`/payment-template/add-template`);
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
      getMemberListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

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

  const handleNameClick = (row) => {
    handleView(row);
  };

  useEffect(() => {
    getMemberListing();
  }, [rowsPerPage, page]);
  // useEffect(() => {
  //   getMemberListing();
  // }, [filterName === "" && filterNameStatus == true]);
  useEffect(() => {
    if (!filterNameStatus) {
      return;
    }
    getMemberListing();
  }, []);

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
            <h2>Payment Templates</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end mt-1 mb-4">
            {/* <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenFilterDrawer}
            >
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button> */}
            <button onClick={handleNavigate} className="small-contained-button">
              Add Template
            </button>
          </div>
        </div>
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
            {/* <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // onSearch={handleSearchName}
          /> */}

            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                          aria-checked={isItemSelected}
                        >
                          <TableCell>
                            {
                              <CustomPopoverSection
                                menu={MENU_OPTIONS}
                                data={row}
                              />
                            }
                          </TableCell>
                          <TableCell align="left">
                            {page * rowsPerPage + (i + 1)}
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
                              {name}
                            </Stack>
                          </TableCell>

                          {/* <TableCell component="th" scope="row">
                          {Capitalize(htmlDecode(createdAt))}
                        </TableCell> */}
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(
                              htmlDecode(program?.title ? program.title : "N/A")
                            )}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {product?.name
                              ? Capitalize(htmlDecode(product?.name))
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {Capitalize(htmlDecode(template_type))}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {total_amount}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {template_type == "onetime" ? "0" : initial_amount}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {template_type == "onetime"
                              ? "0"
                              : installment_amount}
                          </TableCell>
                          <TableCell
                            className="text-nowrap"
                            component="th"
                            scope="row"
                          >
                            {template_type == "onetime"
                              ? "0"
                              : no_of_installment}
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
                      <TableCell align="center" colSpan={11} sx={{ py: 3 }}>
                        <SearchNotFound />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>

            {/* <CategoryCofirmation
            open={openDelete}
            setOpen={setOpenDelete}
            title={"Are you sure you want to delete this Author?"}
            handleAgree={handleDelete}
          /> */}
            {/* <AddAuthor
            AddOpenDrawer={addDrawerOpen}
            OpenDrawer={handleOpenAddAuthor}
            CloseDrawer={handleCloseAddAuthor}
            getMemberListing={getMemberListing}
          />
          <UpdateAuthor
            isOpenDrawer={isDrawerOpen}
            onOpenDrawer={handleOpenUpdateAuthor}
            onCloseDrawer={handleCloseUpdateAuthor}
            selectedRow={selectedRow}
            getMemberListing={getMemberListing}
          /> */}
            <TablePagination
              rowsPerPageOptions={[50, 100, 150]}
              component="div"
              count={totalCount}
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
          <PaymentTemplateFilter
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
