import React from "react";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
// import blank from "../../assets/images/blank-image.png";
// import ViewDetails from "../Customer/ViewDetails";

// import blank from "../../assets/images/blank-image.png";
// import ViewDetails from "../Customer/ViewDetails";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
// import AddCustomer from "../Customer/AddCustomer";
// import UpdateCustomer from "../Customer/UpdateCustomer";
import CloseIcon from "@mui/icons-material/Close";
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
  Chip,
  TableHead,
} from "@mui/material";
// components
// import ViewCategory from "./ViewCategory";
// import Page from "../../components/Page";
// import Label from "../../components/Label";
// import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
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
import { clientPortalUrl, s3baseUrl } from "../../config/config";
import CustomPopover from "src/components/MenuOption/CustomPopoverSection";
import { useSnackbar } from "notistack";
// import CategoryCofirmation from "../Category/CategoryConfirmation";
// import Loader from "../../components/Loader/Loader";
import { unstable_ownerWindow } from "@mui/utils";
import moment from "moment";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Label from "src/components/Label";
// import CategoryCofirmation from "../Category/CategoryConfirmation";
// import Loader from "../../components/Loader/Loader";

import { makeStyles } from "@mui/styles";
// import AddAuthor from "./AddAuthor/AddAuthor";
// import UpdateAuthor from "./UpdateAuthor";
// import { get_short_string } from "src/utils/utils";
import {
  DeleteMemberApi,
  DeleteMultiMemberApi,
  memberCompleteListing,
  memberListing,
  member_login_api,
  resendWelcomeEmailApi,
} from "src/DAL/member/member";
import { htmlDecode } from "src/utils/convertHtml";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";

import { fontSize } from "@mui/system";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
// import MemberFilter from "./MemberFilter";
import Iconify from "@iconify/iconify";
import { dd_date_format } from "src/utils/constant";
import FilteredChip from "src/components/FilteredChip";
import MemberFilter from "./MemberFilterNew";
import { CleanHands } from "@mui/icons-material";
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
export default function MembersList() {
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
  const [openResendWelcome, setOpenResendWelcome] = useState(false);
  const [resendWelcomeDoc, setResendWelcomeDoc] = useState(null);
  const [openMultiDelete, setOpenMultiDelete] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [isOpenPasswordDrawer, setOpenPasswordDrawer] = useState(false);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  // const [inputs, setInputs] = useState("");
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

  let listing_name = "/member/";
  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(true);
    setOpenImage(value);
  };
  const handleClose = () => setOpen(false);

  const searchFunction = () => {
    setPage(0);
    setPageCount(1);
    console.log(filterState, "statestatestate");
    filterState.search_text = searchText;
    filterState.page = 0;
    filterState.rows_per_page = rowsPerPage;
    getMemberListing(filterState);
    handleCloseFilterDrawer();
    localStorage.setItem("member_filter_state", JSON.stringify(filterState));
    localStorage.setItem("MemberListSearch", JSON.stringify(filterState));
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
    localStorage.setItem("member_filter_state", JSON.stringify(data));
  };

  const handleClearFilter = () => {
    setPage(0);
    setPageCount(1);
    setRowsPerPage(50);
    setSearchText("");
    setFilterState(EMPTY_FILTER);
    getMemberListing(EMPTY_FILTER);
    handleCloseFilterDrawer();
    localStorage.removeItem("member_filter_state");
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

  // const { id } = useParams();

  const getMemberListing = async (filterData) => {
    console.log(filterData, "filterDatafilterDatafilterData");
    setIsLoading(true);

    let rows_per_page = 50;
    let page = 0;
    let postData = {
      program: filterData.program,
      status: filterData.statuss,
      search_text: filterData.search_text,
      request_approval_type: "approve",
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

    const result = await memberListing(page, rows_per_page, postData);
    console.log(result, "...........................");

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
  console.log(data, "datatatattatttttttttttt");

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
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
    //console.log(name, "checkbox");
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
    localStorage.setItem("member_filter_state", JSON.stringify(filter_state));
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
    localStorage.setItem("member_filter_state", JSON.stringify(filter_state));
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
    console.log(filter_state, "filter_statefilter_state");
    getMemberListing(filter_state);

    localStorage.setItem("member_filter_state", JSON.stringify(filter_state));
  };

  const handleFilterByName = (event) => {
    setSearchText(event.target.value);

    // setFilterName(event.target.value);
    // setInputs((values) => ({ ...values, ["search_text"]: event.target.value }));
  };
  //console.log(selected, "selected");

  const emptyRows = page > 0 && 0;

  const filteredUsers = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = data.length === 0;
  console.log(isUserNotFound, "isUserNotFoundisUserNotFound");

  //-----------Array for Images
  // let img = [];
  //   data.forEach((data) => {
  //     img = data.images;
  //     //console.log(img, "datadatadata");
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
    // setIsLoading(true);
    const data = {
      email: value.email,
      user_type: "client",
    };

    const result = await member_login_api(data);
    if (result.code === 200) {
      window.open(`${clientPortalUrl}login-by-admin/${result?.token}`);

      // setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      // setIsLoading(false);
    }
  };
  const handleEdit = (value) => {
    console.log(value, "...........");

    localStorage.setItem("filterState", JSON.stringify(filterState));
    localStorage.setItem("rowsPerPage", rowsPerPage);
    localStorage.setItem("member_page_number", page);
    localStorage.setItem("MemberListSearch", JSON.stringify(filterState));

    navigate(`/member/edit-member/${value.id}`, {
      state: value,
    });
  };
  const handleChild = (value) => {
    console.log(value, "valuevaluevaluevalue");
    navigate(`/member/member-child/${value.id}`, {
      state: value,
    });
  };
  const handleEventSubscribers = (value) => {
    navigate(`/member/event-subscriber/${value.id}`, {
      state: value,
    });
  };
  const handleProfile = (value) => {
    //////console.log(value, "Profile");
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
  const handleChangeRoute = (route, data) => {
    // delete data.MENU_OPTIONS;
    navigate(route, { state: data });
  };
  const handleChangeBilling = (value) => {
    navigate(`/member/view-billing-list/${value.id}`, {
      state: value,
    });
  };
  const handleChangeAccess = (value) => {
    console.log(value, "ssssssssssssss");

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
    navigate(`/member/add-member`);
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleAgreeResendWelcome = (value) => {
    setResendWelcomeDoc(value);
    setOpenResendWelcome(true);
  };
  const handleResendWelcome = async () => {
    setOpenResendWelcome(false);
    const result = await resendWelcomeEmailApi({
      member_id: resendWelcomeDoc.id || resendWelcomeDoc._id,
    });
    if (result.code === 200) {
      enqueueSnackbar(`Welcome email sent to ${result.data?.email}`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleAgreeMultiDelete = (value) => {
    setOpenMultiDelete(true);
  };
  const handleMemberSubscribers = (value) => {
    console.log(value, "ssssssssssssss");

    navigate(`/member/member-subscribers/${value._id}`, {
      state: value,
    });
  };

  // const handleMemberSubscribers = (value) => {
  //   console.log(value, "ssssssssssssss");
  //   let route = `/member/member-subscribers/${value._id}`;
  //   handleChangeRoute(route, {
  //     state: {
  //       memberSubscription: data, // Pass the value as memberSubscription state
  //     },
  //   });
  // };
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
  const handleMultipleDelete = async () => {
    setOpenMultiDelete(false);

    const member_id = [];
    selected.map((id) => {
      //console.log(id, "id of the member");
      member_id.push(id);
    });
    //console.log(member_id, "new arrays");
    const formData = new FormData();
    formData.append("type", "specific");
    formData.append("member", JSON.stringify(member_id));
    setIsLoading(true);
    // for (const value of formData.values()) {
    //   console.log(value, "formmmmmmmmm");
    // }
    // console.log(...formData, "datataatatat");
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
      label: "Login As Parent / School",
      icon: "ant-design:lock",
      handleClick: LoginAsMember,
    },
    {
      label: "Child / Teacher Management",
      icon: "iconoir:profile-circled",
      handleClick: handleChild,
    },
    {
      label: "View Subscriptions",
      icon: "eva:eye-fill",
      handleClick: handleMemberSubscribers, // Pass correct memberObject
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
      label: "Resend Welcome Email",
      icon: "ic:outline-email",
      handleClick: handleAgreeResendWelcome,
    },
    {
      label: "Manage Programme Access",
      icon: "ant-design:key",
      handleClick: handleChangeAccess,
    },
    // {
    //   label: "Manage Reward Access",
    //   icon: "ant-design:key",
    //   handleClick: handleChangeRewardAccess,
    // },
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
    // {
    //   label: "Member History",
    //   icon: "eva:eye-fill",
    //   handleClick: handleMemberHistory,
    // },
  ];

  const handleNameClick = (row) => {
    handleView(row);
  };

  useEffect(() => {
    let filter_data = EMPTY_FILTER;
    let find_filter = localStorage.getItem("member_filter_state");
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
        open={openResendWelcome}
        setOpen={setOpenResendWelcome}
        title={`Send a new temporary password and login details to ${resendWelcomeDoc?.email || "this member"}? Their current password will stop working.`}
        handleAgree={handleResendWelcome}
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
            <h2>Parents / Schools</h2>
          </div>
          <div className="col-lg-6 col-sm-12 text-end ">
            <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenFilterDrawer}
            >
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button>
            {/* <button
              onClick={handleNavigateImportMember}
              className="small-contained-button me-2"
            >
              Import Member
            </button> */}
            {/* <button
              onClick={handleRegisterEvents}
              className="small-contained-button me-2"
            >
              Register Events
            </button> */}
            <button onClick={handleNavigate} className="small-contained-button">
              Add Parent / School
            </button>
          </div>
        </div>
        {/* chips */}
        {/* {console.log(
          filterStateUpdated,
          filterData,
          EMPTY_FILTER,
          "dsfhdskfhkjdshfkjdshfkjsadjh"
        )} */}
        <FilteredChip
          data={filterStateUpdated}
          tempState={filterState}
          EMPTY_FILTER={EMPTY_FILTER}
          onDeleteChip={handleDeleteChip}
          onClear={handleClearFilter}
        />
        {/* <div className="mb-2">
          {inputs &&
            Object.keys(inputs).map((item) => {
              console.log(item, "Dsfjsdlkfjsdkl", typeof inputs[item], inputs);
            })}
          <Chip label="Deletable" onDelete={() => {}} />
        </div> */}
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <Card style={{ overflowX: "auto" }}>
            <div className="d-flex justify-content-between align-items-center">
              {/* Pagination Section */}
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

              {/* Toolbar Section */}
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
                >
                  Search
                </button>
              </div>
            </div>

            {/* Data Table */}
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {data.map((row, i) => {
                    const isItemSelected = selected.indexOf(row.id) !== -1;
                    return (
                      <TableRow
                        hover
                        key={row.id}
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
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Avatar
                              alt={row.name}
                              src={s3baseUrl + row.profile}
                              onClick={() => handleChild(row)}
                              sx={{ cursor: "pointer" }}
                            />
                            <Typography
                              variant="subtitle2"
                              noWrap
                              onClick={() => handleChild(row)}
                              sx={{ cursor: "pointer" }}
                            >
                              {row.fulName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>
                          {row.program.map((program) => (
                            <Tooltip
                              title={
                                <Typography fontSize={14}>
                                  {program.expiry_date
                                    ? `Expiry: ${moment(
                                        program.expiry_date
                                      ).format("DD-MM-YYYY")}`
                                    : "No Expiry"}
                                </Typography>
                              }
                              arrow
                              key={program._id}
                            >
                              <p
                                className="mb-1 modalIcon"
                                onClick={() => handleChangeAccess(row)}
                              >
                                {program._id?.title}
                              </p>
                            </Tooltip>
                          ))}
                        </TableCell>
                        <TableCell>{`${row.childCount} / ${row.max_teacher_limit}`}</TableCell>
                        <TableCell>{row.created_at}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={row.status ? "success" : "error"}
                          >
                            {row.status ? "Active" : "Inactive"}
                          </Label>
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={
                              row.approval_status === "pending"
                                ? "error"
                                : "success"
                            }
                          >
                            {row.approval_status === "pending"
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
