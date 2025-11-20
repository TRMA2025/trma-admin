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
  Pagination,
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
import { memberListing } from "src/DAL/member/member";
import { s3baseUrl } from "src/config/config";
import {
  consultantListing,
  DeleteConsultantApi,
} from "src/DAL/consultant/consultant";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
import {
  DeleteStripeListApi,
  StripeListApi,
} from "src/DAL/StripeProduct/stripeProductApi";
import moment from "moment";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import StripeProductFilter from "./StripeProductFilter";
import StripeProductFilterNew from "./StripeProductFilterNew";
import Skeleton from "react-loading-skeleton";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },

  { id: "number", label: "#", alignRight: false },
  { id: "name", label: " Name", alignRight: false },
  // { id: "action", label: "Action By", alignRight: false },
  { id: "stripeId", label: "Stripe Product Id", alignRight: false },
  { id: "createdAt", label: "Created At", alignRight: false },
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
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.stripe_id.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.createdAt.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
export default function StripeProductsList() {
  const navigate = useNavigate();
  const params = useLocation();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setData] = useState([]);
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("all");
  const [totalCount, setTotalCount] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const [filterNameStatus, setFilterNameStatus] = useState(false);

  const [UserId, setUserId] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };
  const EMPTY_FILTER = {
    type: "all",
    id: null,
    search: searchText,
  };
  const [filterData, setFilterData] = useState(EMPTY_FILTER);
  const [updateFilterData, setUpdateFilterData] = useState(EMPTY_FILTER);
  const searchFunction = () => {
    setPage(0);
    setPageCount(1);
    getStripeProductListing(filterData);
    setUpdateFilterData(filterData);
    localStorage.setItem("Stripe_product_data", JSON.stringify(filterData));
  };

  const handleDeleteChip = (data) => {
    setPage(0);
    setPageCount(1);
    if (data.type !== "consultant") {
      data.id = null;
    }
    setUpdateFilterData(data);
    setFilterData(data);
    getStripeProductListing(data);
    localStorage.setItem("Stripe_product_data", JSON.stringify(data));
  };

  const handleClearFilter = () => {
    setUpdateFilterData(EMPTY_FILTER);
    setFilterData(EMPTY_FILTER);
    getStripeProductListing(EMPTY_FILTER);
    localStorage.removeItem("Stripe_product_data");
  };
  const handleSelectOther = (name, value) => {
    setFilterData((values) => ({ ...values, [name]: value }));
  };
  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getStripeProductListing = async (value) => {
    console.log(value, "filter value");

    setIsLoading(true);
    // let postData = { ...value };

    // if (postData.id) {
    //   postData._id = value.id._id;
    // } else {
    //   postData._id = "";
    // }

    // handleCloseFilterDrawer();
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

      const result = await StripeListApi(page, rowsPerPage, postData);
      if (result.code === 200) {
        console.log(result, "resultresultresult ");
        // let chipData = { ...value };
        // if (chipData.type !== "consultant") {
        //   delete chipData.id;
        // }
        // setUpdateFilterData(chipData);
        setData(result.product);
        setIsLoading(false);
        setTotalCount(result.total_product_count);
        setQuestionData(result.product);

        const data = result.product.map((product, index) => {
          //console.log(product, "member.program");
          return {
            ...product,
            id: product._id,
            name: product.name,
            actionBy: product.action_info,
            stripe_id: product.stripe_product_id,
            createdAt: product.createdAt,
            product_slug: product.product_slug,
            description: product.description,
            show_on_consultant: product.show_on_consultant,
            StripeProductObject: product,
            count: index + 1 + rowsPerPage * page,
          };
        });
        setUserList(data);
        setTotalPages(result.total_pages);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
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
  const handleEdit = (value) => {
    navigate(`/stripe-products/edit-product/${value.product_slug}`, {
      state: value,
    });
  };
  const handleChangePassword = (value) => {
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
    const result = await DeleteStripeListApi(deleteDoc.product_slug);
    if (result.code === 200) {
      getStripeProductListing();
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
  const handleSearchName = () => {
    //console.log(filterName, "filterName for search");
    getStripeProductListing();
    setFilterNameStatus(true);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchName();
    }
  };

  const handleFilterByName = (event) => {
    setSearchText(event.target.value);
    // setFilterName(event.target.value);
    // setInputs((values) => ({ ...values, ["search_text"]: event.target.value }));
  };
  const handleNavigate = () => {
    navigate(`/stripe-products/add-product`);
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
    getStripeProductListing();
  }, [rowsPerPage, page]);
  useEffect(() => {
    if (!filterNameStatus) {
      return;
    }
    getStripeProductListing();
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
            <h2>Stripe Products</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            {/* <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenFilterDrawer}
            >
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button> */}

            <button onClick={handleNavigate} className="small-contained-button">
              Add Product
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
          <div>
            <Card style={{ overflowX: "auto" }}>
              <div className="mt-2 d-flex justify-content-between">
                {" "}
                <div style={{ marginLeft: "5px" }}>
                  <Skeleton width={200} height={20} />
                </div>
                <div className="d-flex" style={{ marginRight: "15px" }}>
                  <Skeleton width={200} height={60} />
                  <div style={{ margin: "10px" }}>
                    <Skeleton
                      baseColor="#dddde8"
                      highlightColor="#9F00FF"
                      width={70}
                      height={40}
                    />
                  </div>
                </div>
              </div>

              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/* Skeleton for Table Header */}
                      <TableCell>
                        <Skeleton width={150} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={50} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={200} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} height={20} />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Skeleton Loading for Rows */}
                    {Array.from({ length: 6 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton width={50} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={50} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={200} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={20} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div
                style={{
                  margin: "20px",
                  justifyContent: "end",
                  display: "flex",
                }}
              >
                <Skeleton width={200} height={20} />
              </div>
            </Card>
          </div>
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
                  onClick={() => getStripeProductListing()}
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
                        stripe_id,
                        createdAt,
                        status,
                        actionBy,
                        type,
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
                            {type === "team" ? (
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
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2">{name}</Typography>
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
                          <TableCell component="th" scope="row">
                            {Capitalize(htmlDecode(stripe_id))}
                          </TableCell>

                          <TableCell component="th" scope="row">
                            {createdAt
                              ? moment(createdAt).format("DD-MM-YYYY")
                              : "N/A"}
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
                  {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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
          // <StripeProductFilterNew
          //   filterData={filterData}
          //   handleSelectOther={handleSelectOther}
          //   searchFunction={searchFunction}
          //   handleClearFilter={handleClearFilter}
          // />
          <StripeProductFilter
            value={selectedValue}
            setSelectedConsultant={setSelectedConsultant}
            selectedConsultant={selectedConsultant}
            setSelectedValue={setSelectedValue}
            handleChange={handleChangeFilter}
            dataList={getStripeProductListing}
            onCloseDrawer={handleCloseFilterDrawer}
          />
        }
      />
    </>
  );
}
