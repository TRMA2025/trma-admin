import React from "react";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import CloseIcon from "@mui/icons-material/Close";
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
  Chip,
  TableHead,
} from "@mui/material";
import SearchNotFound from "../../components/SearchNotFound";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../../components/_dashboard/user";
import USERLIST from "../../_mocks_/user";
import { clientPortalUrl, s3baseUrl } from "../../config/config";
import CustomPopover from "src/components/MenuOption/CustomPopoverSection";
import { useSnackbar } from "notistack";
import { unstable_ownerWindow } from "@mui/utils";
import moment from "moment";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Label from "src/components/Label";
import { makeStyles } from "@mui/styles";

import {
  DeleteMemberApi,
  DeleteMultiMemberApi,
  memberApprove,
  memberCompleteListing,
  memberListing,
  member_login_api,
} from "src/DAL/member/member";
import { htmlDecode } from "src/utils/convertHtml";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { fontSize } from "@mui/system";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import Iconify from "@iconify/iconify";
import { dd_date_format } from "src/utils/constant";
import FilteredChip from "src/components/FilteredChip";
import MemberFilter from "./MemberFilterNew";
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
  { id: "action", label: "Action", alignRight: false },
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: " Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "program", label: "Programme", alignRight: false },
  { id: "childCount", label: "Child/Teacher Count", alignRight: false },
  { id: "CreatedAt", label: "Created At", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "approval_status", label: "Approval", alignRight: false },
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
      (row) => row.fulName.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
export default function PendingMembers() {
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
  const [openApprove, setOpenApprove] = useState(false);
  const [openMultiDelete, setOpenMultiDelete] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [isOpenPasswordDrawer, setOpenPasswordDrawer] = useState(false);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [openImage, setOpenImage] = useState();
  const classes = useStyles();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [filterNameStatus, setFilterNameStatus] = useState(false);

  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("all");
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedGoalStatus, setSelectedGoalStatus] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const done_member = window.location.pathname.includes("/done-listing");
  const [searchText, setSearchText] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [inputs, setInputs] = React.useState({
    search_text: "",
    program: [],
    status: "all",
  });
  const EMPTY_FILTER = {
    program: [],
    statuss: "all",
    search_text: "",
  };

  const [filterState, setFilterState] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);

  let listing_name = "/pending-member/";
  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(true);
    setOpenImage(value);
  };
  const handleClose = () => setOpen(false);
  const searchFunction = () => {
    setPage(0);
    setPageCount(1);
    filterState.search_text = searchText;
    filterState.page = 0;
    filterState.rows_per_page = rowsPerPage;
    getMemberListing(filterState);
    handleCloseFilterDrawer();
    localStorage.setItem(
      "pending_member_filter_state",
      JSON.stringify(filterState)
    );
    localStorage.setItem(
      "pending_MemberListSearch",
      JSON.stringify(filterState)
    );
    // localStorage.removeItem("rowsPerPage");
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchFunction();
    }
  };

  const handleDeleteChip = (data) => {
    setPage(0);
    setPageCount(1);
    getMemberListing(data);
    setFilterState(data);
    data.page = 0;
    data.search_text = searchText;

    localStorage.setItem("pending_member_filter_state", JSON.stringify(data));
  };

  const handleClearFilter = () => {
    let clear_data = { ...EMPTY_FILTER };
    setPage(0);
    setPageCount(1);
    setRowsPerPage(50);
    setSearchText("");
    setFilterState(clear_data);
    getMemberListing(clear_data);
    handleCloseFilterDrawer();
    // localStorage.removeItem("pending_MemberListSearch");
    // localStorage.removeItem("pending_member_page_number");
    // localStorage.removeItem("pending_rowsPerPage");
    localStorage.removeItem("pending_member_filter_state");
  };
  const handleOpenFilterDrawer = () => {
    setFilterDrawerState(true);
    setFilterState(filterStateUpdated);
  };
  const handleCloseFilterDrawer = () => {
    setFilterDrawerState(false);
  };
  const handleChangeFilter = (event) => {
    setSelectedValue(event.target.value);
  };

  const getMemberListing = async (filterData) => {
    setIsLoading(true);
    let rows_per_page = 50;
    let page = 0;

    let postData = {
      program: filterData.program,
      status: filterData.statuss,
      search_text: filterData.search_text,
      request_approval_type: "pending",
    };
    if (postData?.program.length > 0) {
      postData.program = postData.program.map((program) => {
        return program._id;
      });
    }
    if (filterData.rows_per_page) {
      rows_per_page = filterData.rows_per_page;
    }
    if (filterData.page) {
      page = filterData.page;
    }

    let type = done_member ? "done_users" : "";

    const result = await memberListing(page, rows_per_page, postData);

    if (result.code == 200) {
      console.log(result, "member data");
      let chipData = { ...filterData };
      if (chipData.search_text) {
        delete chipData.search_text;
      }
      console.log(chipData, "dsflkjasdlfa");
      setFilterStateUpdated(chipData);
      const members = result?.member?.map((member, index) => {
        return {
          ...member,
          id: member._id,
          fulName: member.first_name + " " + member.last_name,
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
          createdAt: member.createdAt,
          childCount: member?.child_count,
          max_teacher_limit: member?.payment_info?.max_child_limit
            ? member?.payment_info?.max_child_limit
            : 0,
          gaolStatementCompletedStatus: member.goal_statement_completed_status,
          gaolStatementCompletedDate: member.goal_statement_completed_date,
          save_and_close_status: member.save_and_close_status,
          save_and_close_date: member.save_and_close_date,
          referral_name: member.refferal_name,
          object: member,
          created_at: dd_date_format(member.createdAt),
          count: index + 1 + rowsPerPage * page,
        };
      });
      console.log(members, "members updated array");

      setData(members);
      setTotalPages(result.total_pages);

      setTotalCount(result.total_member_count);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleRequestSort = (event, property) => {};

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
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
    let filter_state = { ...filterState };
    filter_state.page = newPage;
    filter_state.rows_per_page = rowsPerPage;
    getMemberListing(filter_state);
    localStorage.setItem(
      "pending_member_filter_state",
      JSON.stringify(filter_state)
    );
  };

  const handleChangePages = (event, newPage) => {
    let filter_state = { ...filterState };
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
      filter_state.page = 0;
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
      filter_state.page = newPage - 1;
    }
    filter_state.rows_per_page = rowsPerPage;
    getMemberListing(filter_state);
    localStorage.setItem(
      "pending_member_filter_state",
      JSON.stringify(filter_state)
    );
  };

  const handleChangeRowsPerPage = (event) => {
    let filter_state = { ...filterState };
    console.log(filter_state, "filter_statefilter_statefilter_state");
    let rows_per_page = parseInt(event.target.value, 10);
    console.log(rows_per_page, "rows_per_pagerows_per_page");
    setRowsPerPage(rows_per_page);
    setPage(0);
    setPageCount(1);
    filter_state.page = 0;
    filter_state.rows_per_page = rows_per_page;
    console.log(filter_state, "pending_filter_statefilter_state");
    getMemberListing(filter_state);

    localStorage.setItem(
      "mpending_ember_filter_state",
      JSON.stringify(filter_state)
    );
  };

  const handleFilterByName = (event) => {
    setSearchText(event.target.value);
  };

  const emptyRows = page > 0 && 0;

  const filteredUsers = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = data.length === 0;

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
    setViewDrawerOpen(false);
  };
  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  function abbreviateNumber(number) {
    var tier = (Math.log10(Math.abs(number)) / 3) | 0;

    if (tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
  }

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
  const LoginAsMember = async (value) => {
    const data = {
      email: value.email,
      user_type: "client",
    };

    const result = await member_login_api(data);
    if (result.code === 200) {
      window.open(`${clientPortalUrl}login-by-admin/${result?.token}`);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleEdit = (value) => {
    console.log(value, "...........");

    localStorage.setItem("pending_filterState", JSON.stringify(filterState));
    localStorage.setItem("pending_rowsPerPage", rowsPerPage);
    localStorage.setItem("pending_member_page_number", page);
    navigate(`/pending-member/edit-member/${value.id}`, {
      state: value,
    });
  };
  const handleApprove = (value) => {
    setDeleteDoc(value);
    setOpenApprove(true);
  };
  const handleChild = (value) => {
    navigate(`/pending-member/member-child/${value.id}`, {
      state: value,
    });
  };
  const handleEventSubscribers = (value) => {
    navigate(`/member/event-subscriber/${value.id}`, {
      state: value,
    });
  };
  const handleProfile = (value) => {
    navigate(`/pending-member/member-profile/${value.id}`, {
      state: value,
    });
  };
  const handleChangePassword = (value) => {
    navigate(`/pending-member/change-password/${value.id}`, {
      state: value,
    });
  };
  const handleChangeAllTransaction = (value) => {
    navigate(`/pending-member/all-transaction/${value.id}`, {
      state: value,
    });
  };
  const handleChangeRoute = (route, data) => {
    navigate(route, { state: data });
  };
  const handleChangeBilling = (value) => {
    navigate(`/pending-member/view-billing-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeAccess = (value) => {
    navigate(`/pending-member/programme-access/${value.id}`, {
      state: value,
    });
  };

  const handleNavigate = () => {
    navigate(`/pending-member/add-member`);
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleAgreeMultiDelete = (value) => {
    setOpenMultiDelete(true);
  };

  const handleMemberSubscribers = (value) => {
    let route = `${listing_name}member-subscribers/${value._id}`;
    handleChangeRoute(route, value);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteMemberApi(deleteDoc.id);
    if (result.code === 200) {
      searchFunction();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleNotifyApproval = async () => {
    setOpenApprove(false);
    setIsLoading(true);
    const result = await memberApprove(deleteDoc.id);
    if (result.code === 200) {
      searchFunction();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleMultipleDelete = async () => {
    setOpenMultiDelete(false);

    const member_id = [];
    selected.map((id) => {
      member_id.push(id);
    });
    const formData = new FormData();
    formData.append("type", "specific");
    formData.append("member", JSON.stringify(member_id));
    setIsLoading(true);

    const result = await DeleteMultiMemberApi(formData);
    if (result.code === 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
      setSelected([]);
      getMemberListing();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleIsDateRange = (event) => {
    const value = event.target.checked;
    setFilterState((values) => ({ ...values, is_date_range: value }));
  };
  const handleChangeOthers = (event, name) => {
    setFilterState((values) => ({ ...values, [name]: event }));
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFilterState((values) => ({ ...values, [name]: value }));
  };

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Approve",
      icon: "mdi:approve",
      handleClick: handleApprove,
    },
    ,
    {
      label: "Child / Teacher Management",
      icon: "iconoir:profile-circled",
      handleClick: handleChild,
    },
    {
      label: "View Subscriptions",
      icon: "eva:eye-fill",
      handleClick: handleMemberSubscribers,
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

  const handleNameClick = (row) => {
    handleView(row);
  };

  useEffect(() => {
    let filter_data = EMPTY_FILTER;
    let find_filter = localStorage.getItem("pending_member_filter_state");
    if (find_filter) {
      filter_data = JSON.parse(find_filter);
      setPage(Number(filter_data.page));
      setRowsPerPage(Number(filter_data.rows_per_page));
      setPageCount(Number(filter_data.page) + 1);
      if (filter_data.search_text) {
        setSearchText(filter_data.search_text);
      }
    }
    setFilterState(filter_data);
    setFilterStateUpdated(filter_data);
    console.log(filter_data, "filter_datafilter_data");
    getMemberListing(filter_data);
  }, []);
  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />
      <CustomConfirmation
        open={openApprove}
        setOpen={setOpenApprove}
        title={"Are you sure you want to Approve ?"}
        handleAgree={handleNotifyApproval}
      />
      <CustomConfirmation
        open={openMultiDelete}
        setOpen={setOpenMultiDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleMultipleDelete}
      />
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-6 col-sm-12">
            <h2>Pending Parents / Schools</h2>
          </div>
          <div className="col-lg-6 col-sm-12 text-end ">
            <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenFilterDrawer}
            >
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button>

            <button onClick={handleNavigate} className="small-contained-button">
              Add Parent / School
            </button>
          </div>
        </div>

        <FilteredChip
          data={filterStateUpdated}
          tempState={filterState}
          EMPTY_FILTER={EMPTY_FILTER}
          onDeleteChip={handleDeleteChip}
          onClear={handleClearFilter}
        />
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <Card style={{ overflowX: "auto" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column align-items-start">
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20, 50]}
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
                  onClick={() => searchFunction()}
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
                  rowCount={data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {data.map((row, i) => {
                    const {
                      id,
                      name,
                      fulName,
                      status,
                      approval_status,
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
                      count,
                      createdAt,
                      childCount,
                      max_teacher_limit,
                      gaolStatementCompletedStatus,
                      gaolStatementCompletedDate,
                      save_and_close_status,
                      save_and_close_date,
                      referral_name,
                      created_at,
                    } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;
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

                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Avatar alt={name} src={s3baseUrl + profile} />
                            <Typography variant="subtitle2" noWrap>
                              {fulName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{email}</TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          className="program-exp"
                        >
                          {program.map((program) => {
                            return (
                              <>
                                <Tooltip
                                  title={
                                    <Typography fontSize={14}>
                                      {program.expiry_date
                                        ? " " +
                                          "Expiry: " +
                                          moment(program.expiry_date).format(
                                            "DD-MM-YYYY"
                                          )
                                        : "No Expiry"}
                                    </Typography>
                                  }
                                  arrow
                                >
                                  <p
                                    className="mb-1 modalIcon"
                                    onClick={() => handleChangeAccess(row)}
                                  >
                                    {program?._id?.title}
                                  </p>
                                </Tooltip>
                              </>
                            );
                          })}
                        </TableCell>
                        <TableCell>
                          {`${childCount} / ${max_teacher_limit}`}
                        </TableCell>
                        <TableCell>{created_at}</TableCell>

                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={status === false ? "error" : "success"}
                          >
                            {status === false ? "InActive" : "Active"}
                          </Label>
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={
                              approval_status === "pending"
                                ? "error"
                                : "success"
                            }
                          >
                            {approval_status === "pending"
                              ? "Pending"
                              : "Approved"}
                          </Label>
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
                      <TableCell align="center" colSpan={14} sx={{ py: 3 }}>
                        <SearchNotFound />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50]}
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
          <MemberFilter
            filterData={filterState}
            handleChange={handleChange}
            setFilterData={setFilterState}
            handleIsDateRange={handleIsDateRange}
            handleChangeOthers={handleChangeOthers}
            searchSubmitFilter={searchFunction}
            handleClearFilter={handleClearFilter}
          />
        }
      />
    </>
  );
}
