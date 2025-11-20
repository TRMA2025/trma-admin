import React from "react";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
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
} from "@mui/material";
// components
import SearchNotFound from "../../components/SearchNotFound";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import {
  UserListHead,
  UserListToolbar,
} from "../../components/_dashboard/user";
//
import { s3baseUrl } from "../../config/config";
import { useSnackbar } from "notistack";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import { user_pending_feed_list } from "src/DAL/CommunityArea/Comments";
import { approveRejectPost } from "src/DAL/CommunityArea/Community";
import RejectReason from "./RejectReason";
import Label from "src/components/Label";

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
  { id: "userName", label: "Name", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "publish_status", label: "Publish Status", alignRight: false },
  { id: "createdAt", label: "Created At", alignRight: false },
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
      (row) =>
        row.userName.toLowerCase().indexOf(query.toLowerCase().trim()) !== -1
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
export default function PendingPosts() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [openDelete, setOpenDelete] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openMultiDelete, setOpenMultiDelete] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const classes = useStyles();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [rejectDoc, setRejectDoc] = useState("");
  const [filterNameStatus, setFilterNameStatus] = useState(false);
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [memberFilterDrawerState, setMemberFilterDrawerState] = useState(false);
  const [reason, setReason] = React.useState("");
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");

  const EMPTY_FILTER = {
    search_text: "",
  };

  const [filterState, setFilterState] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);

  const handleDetail = (value) => {
    navigate(`/pending-posts/post-detail`, { state: value });
  };
  const handleOpenFilterDrawer = () => {
    setFilterDrawerState(true);
  };
  const handleCloseFilterDrawer = () => {
    setFilterDrawerState(false);
  };
  const handleOpenFilterDrawerMember = () => {
    setMemberFilterDrawerState(true);
    // setFilterState(filterStateUpdated);
  };
  const handleCloseFilterDrawerMember = () => {
    setMemberFilterDrawerState(false);
  };

  const params = useParams();

  const getMemberListing = async (filterData) => {
    setIsLoading(true);
    const result = await user_pending_feed_list("pending");

    if (result.code == 200) {
      let chipData = { ...filterData };
      if (chipData.search_text) {
        delete chipData.search_text;
      }
      setFilterStateUpdated(chipData);
      const members = result?.feeds?.map((member, index) => {
        return {
          ...member,
          id: member?._id,
          description: member?.description,
          createdAt: member?.createdAt,
          publish_status: member?.publish_status,
          userName: member?.created_by?.name,

          count: index + 1 + rowsPerPage * page,
        };
      });

      setData(members);
      setTotalPages(result.total_pages);
      setTotalCount(result.feeds.length);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    // setSearchText(event.target.value);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 && 0;

  const filteredUsers = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = data.length === 0;

  const handleView = (row) => {
    setSelectedRow(row);
    handleOpenViewDrawer();
  };

  const handleOpenViewDrawer = (row) => {
    setViewDrawerOpen(true);
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleAgreeReject = (value) => {
    setRejectDoc(value);

    handleOpenFilterDrawer();
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    let postData = {
      publish_status: "approved",
    };
    const result = await approveRejectPost(postData, deleteDoc.id);
    if (result.code === 200) {
      setIsLoading(false);
      getMemberListing();
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleReject = async () => {
    setOpenReject(false);
    handleCloseFilterDrawer();
    setIsLoading(true);
    let postData = {
      publish_status: "rejected",
      rejection_reason: reason,
    };
    const result = await approveRejectPost(postData, rejectDoc.id);
    if (result.code === 200) {
      setIsLoading(false);
      getMemberListing();
      setReason("");
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

  const MENU_OPTIONS = [
    {
      label: "Approve",
      icon: "mdi:approve",
      handleClick: handleAgreeDelete,
    },
    {
      label: "Reject",
      icon: "ooui:cancel",
      handleClick: handleAgreeReject,
    },
    {
      label: "View Detail",
      icon: "zondicons:view-show",
      handleClick: handleDetail,
    },
  ];

  useEffect(() => {
    let filter_data = EMPTY_FILTER;
    let find_filter = localStorage.getItem("MemberListSearch");
    if (find_filter) {
      filter_data = JSON.parse(find_filter);
      if (filter_data.search_text) {
        setSearchText(filter_data.search_text);
      }
    }
    setFilterState(filter_data);
    setFilterStateUpdated(filter_data);
    getMemberListing(filter_data);
  }, [rowsPerPage, page]);

  useEffect(() => {
    if (!filterNameStatus) {
      return;
    }
    getMemberListing(EMPTY_FILTER);
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <>
      <CustomDrawer
        isOpenDrawer={filterDrawerState}
        onOpenDrawer={handleOpenFilterDrawer}
        onCloseDrawer={handleCloseFilterDrawer}
        pageTitle="Reject Reason"
        componentToPassDown={
          <RejectReason
            setOpenReject={setOpenReject}
            reason={reason}
            setReason={setReason}
          />
        }
      />
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to Approve ?"}
        handleAgree={handleDelete}
      />
      <CustomConfirmation
        open={openReject}
        setOpen={setOpenReject}
        title={"Are you sure you want to Reject ?"}
        handleAgree={handleReject}
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
            <h2>Pending Posts</h2>
          </div>
          {/* <div className="col-lg-6 col-sm-12 text-end">
            <CustomPopoverSectionGroups menu={MENU_OPTIONS_NEW} data={params} />
          </div> */}
        </div>

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
                rowCount={data.length}
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
                      userName,
                      name,
                      createdAt,
                      email,
                      profile,
                      description,
                      publish_status,
                      type,
                      memberCount,
                      refUser,
                    } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}>
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
                            spacing={1}>
                            <Avatar alt={name} src={s3baseUrl + profile} />
                            <Typography variant="subtitle2" noWrap>
                              {userName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{description}</TableCell>
                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}>
                            {/* <Chip label={"Pending"} color={"warning"} /> */}
                            <Label variant="ghost" color="warning">
                              {" "}
                              Pending
                            </Label>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {moment(createdAt).format("ddd, MMM DD, YYYY")}
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
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={data.length}
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
