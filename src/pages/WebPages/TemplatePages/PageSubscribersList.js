import React from "react";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import CloseIcon from "@mui/icons-material/Close";
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
} from "@mui/material";
// components
// import ViewCategory from "./ViewCategory";
// import Page from "../../components/Page";
// import Label from "../../components/Label";
// import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "src/components/SearchNotFound";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";

import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "src/components/_dashboard/user";
//
// import USERLIST from "../../_mocks_/user";

// import { clientPortalUrl, s3baseUrl } from "src/config/config";
import { useSnackbar } from "notistack";

import Label from "src/components/Label";

import { makeStyles } from "@mui/styles";

// import {
//   DeleteMemberApi,
//   DeleteMultiMemberApi,
//   DeleteSubscriberMemberApi,
//   memberListing,
//   memberSubscriberListingApi,
//   member_login_api,
// } from "src/DAL/member/member";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import UserListToolbars from "src/components/_dashboard/user/UserListToolbars";
import { fontSize } from "@mui/system";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import MemberFilter from "src/pages/Members/MemberFilter";
import {
  DeletePageSubscriberMemberApi,
  pageSubscriberListingApi,
  pageSubscriberListingApiNew,
} from "src/DAL/WebsitePages/websitepages";
import moment from "moment";
import { s3baseUrl } from "src/config/config";
import { member_login_api } from "src/DAL/memberNew/member";
import { client_url } from "src/config/config";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

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
  { id: "page", label: "Page Title", alignRight: false },
  { id: "plan", label: "Plan Title", alignRight: false },
  { id: "subscribe", label: "Subscription Date", alignRight: false },
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
export default function PageSubscribersList() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { pathname } = useLocation();

  const params = useParams();
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
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
  const [pageCount, setPageCount] = useState(1);
  const [deleteDoc, setDeleteDoc] = useState("");
  const [filterNameStatus, setFilterNameStatus] = useState(false);
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("all");
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedGoalStatus, setSelectedGoalStatus] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  const [link, setLink] = useState("");

  let breadCrumbMenu = [
    {
      title: linkTitle,
      navigation: link,
      active: false,
    },

    {
      title: "Member Subscriber",
      navigation: null,
      active: true,
    },
  ];
  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(true);
    setOpenImage(value);
  };
  const handleClose = () => setOpen(false);

  const handleOpenFilterDrawer = () => {
    setFilterDrawerState(true);
  };
  const handleCloseFilterDrawer = () => {
    setFilterDrawerState(false);
  };
  const handleChangeFilter = (event) => {
    setSelectedValue(event.target.value);
  };

  // const { id } = useParams();

  const getMemberListing = async (
    programsName,
    levelsName,
    goalStatus,
    clearFilterStatus
  ) => {
    let dataObject = {};
    if (clearFilterStatus == true) {
      dataObject = {
        program: [],
        community: [],
      };
    } else {
      dataObject = {
        program: selectedProgram == undefined ? [] : selectedProgram,
        community: selectedLevels == undefined ? [] : selectedLevels,
      };
    }

    const dataToSend = JSON.stringify(dataObject);
    setIsLoading(true);
    const postData = {
      search: filterName,
    };
    const result = await pageSubscriberListingApiNew(
      params.id,
      page,
      rowsPerPage,
      filterName
    );
    console.log(result, "resultresult");
    if (result.code == 200) {
      setTotalPages(result.total_pages);
      const members = result?.event_subscriber?.map((member, index) => {
        return {
          ...member,
          id: member?._id,
          name: member?.member?.first_name,
          lastName: member?.member?.last_name,
          email: member.member.email,
          profile: member.member.profile_image,
          page: member?.page?.sale_page_title,
          plan: member?.plan?.plan_title,
          date: member?.createdAt
            ? moment(member?.createdAt).format("DD-MM-YYYY")
            : "",
          object: member,
          count: index + 1 + rowsPerPage * page,
        };
      });
      setData(members);
      setTotalCount(result.total_event_subscriber_count);
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
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setSearchName(event.target.value);
    // setPage(0);
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
  const handleSearchName = () => {
    setPage(0);
    setPageCount(1);
    setFilterNameStatus(true);
    getMemberListing();
  };

  const emptyRows = page > 0 && 0;

  const filteredUsers = applySortFilter(
    data,
    getComparator(order, orderBy)
    // filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  const handleView = (row) => {
    setSelectedRow(row);
    handleOpenViewDrawer();
  };

  const handleOpenUpdateAuthor = () => {
    setIsDrawerOpen(true);
  };

  const handleOpenViewDrawer = (row) => {
    setViewDrawerOpen(true);
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

  // const handleRegisterEvents = () => {
  //   navigate(`/member/register-events`);
  // };
  const LoginAsMember = async (value) => {
    setIsLoading(true);
    const data = {
      email: value.email,
      user_type: "client",
    };
    const result = await member_login_api(data);
    if (result.code === 200) {
      window.open(`${client_url}login-by-admin/${result.token}`);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleAgreeMultiDelete = (value) => {
    setOpenMultiDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeletePageSubscriberMemberApi(deleteDoc.id);
    if (result.code === 200) {
      getMemberListing();
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

  const handleMenu = (row) => {
    let MENU_OPTIONS = [
      {
        label: "Delete",
        icon: "ant-design:delete-twotone",
        handleClick: handleAgreeDelete,
      },
      // {
      //   label: "Login As Member",
      //   icon: "ant-design:lock",
      //   handleClick: LoginAsMember,
      // },
    ];

    return MENU_OPTIONS;
  };

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
  useEffect(() => {
    console.log(window.location.pathname, "dsjlkfsd");
    if (pathname.match("/website-pages/page-subscriber/")) {
      setLinkTitle("Pages");
      setLink("/website-pages");
    } else {
      setLinkTitle("Template Pages");
      setLink("/template-pages");
    }
  }, [pathname]);
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(page, "pagessss");
  console.log(pageCount, "pagessss Count");
  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />
      <CustomConfirmation
        open={openMultiDelete}
        setOpen={setOpenMultiDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleMultipleDelete}
      />
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 mb-2">
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

            {/* <IconButton
              className="back-screen-button"
              onClick={() => navigate(-1)}
            >
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton> */}
          </div>
          <div className="col-lg-12 col-sm-12">
            <h2>Member Subscriber</h2>
          </div>
          {/* <div className="col-lg-8 col-sm-12 text-end ">
            <a href={member_import_sample_file}>
              <button
                className="small-contained-button me-2 mt-1 mb-4"
                onClick={() => {}}
              >
                Member Sample File &nbsp;&nbsp;
                <Icon icon={arrowCircleDownFill} height={20} />
              </button>
            </a>
            <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleOpenFilterDrawer}
            >
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button>
            <button
              onClick={handleNavigateImportMember}
              className="small-contained-button me-2"
            >
              Import Member
            </button>

            <button onClick={handleNavigate} className="small-contained-button">
              Add Member
            </button>
          </div> */}
        </div>

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
              <UserListToolbars
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                onSearch={handleSearchName}
                handleMultipleDelete={handleAgreeMultiDelete}
              />
            </div>
          </div>

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
                {filteredUsers.map((row, index) => {
                  const {
                    id,
                    name,
                    lastName,
                    status,
                    email,
                    profile,
                    referral_name,
                    consultant,
                    page,
                    plan,
                    count,
                    date,
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
                          menu={handleMenu(row)}
                          data={row}
                        />
                      </TableCell>
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(event) => handleClick(event, id)}
                        />
                      </TableCell> */}
                      <TableCell>{count}</TableCell>
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar alt={name} src={s3baseUrl + profile} />
                          <Typography variant="subtitle2" noWrap>
                            {name + " " + lastName}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{page}</TableCell>
                      <TableCell>{plan}</TableCell>
                      <TableCell>{date}</TableCell>
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
          <Pagination
            count={totalPages + 1}
            page={pageCount}
            defaultPage={0}
            onChange={handleChangePages}
            className="pagination-style"
          />
        </Card>
      </div>
      <CustomDrawer
        isOpenDrawer={filterDrawerState}
        onOpenDrawer={handleOpenFilterDrawer}
        onCloseDrawer={handleCloseFilterDrawer}
        pageTitle="Filters"
        componentToPassDown={
          <MemberFilter
            value={selectedValue}
            setSelectedProgram={setSelectedProgram}
            selectedProgram={selectedProgram}
            setSelectedLevels={setSelectedLevels}
            selectedLevels={selectedLevels}
            setSelectedGoalStatus={setSelectedGoalStatus}
            selectedGoalStatus={selectedGoalStatus}
            // setSelectedConsultant={setSelectedConsultant}
            // selectedConsultant={selectedConsultant}
            setSelectedValue={setSelectedValue}
            handleChange={handleChangeFilter}
            dataList={getMemberListing}
            onCloseDrawer={handleCloseFilterDrawer}
          />
        }
      />
    </>
  );
}
