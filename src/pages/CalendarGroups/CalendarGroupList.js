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
import { DeleteGroupApi, GroupListingApi } from "src/DAL/group/group";
import Skeleton from "react-loading-skeleton";
import ListSkeleton from "src/components/listSkeleton/ListSkeleton";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },

  { id: "number", label: "#", alignRight: false },
  { id: "name", label: " Name", alignRight: false },
  { id: "program", label: "Programme", alignRight: false },
  // { id: "type", label: "Type", alignRight: false },
  { id: "member", label: "Members", alignRight: false },
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
export default function CalendarGroupsList() {
  const navigate = useNavigate();
  const params = useLocation();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [totalCount, setTotalCount] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [filterNameStatus, setFilterNameStatus] = useState(false);

  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setData] = useState([]);

  const [UserId, setUserId] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getConsultantListing = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      const result = await GroupListingApi(page, rowsPerPage, searchText);
      if (result.code === 200) {
        setData(result.group);
        setIsLoading(false);
        setTotalCount(result.total_groups);
        setTotalPages(result.total_pages);
        setQuestionData(result.group);

        const data = result.group.map((group) => {
          console.log(group, "group");
          return {
            id: group._id,
            name: group.title,
            program: group.program,
            member: group.member,
            status: group.status,
            type: group.group_type,
            slug: group.group_slug,
            object: group,
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
    navigate(`/calendar-groups/edit-group/${value.id}`, {
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
  const handleViewDetail = (value) => {
    navigate(`/consultant/view-group-detail/${value.slug}`, {
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
    const result = await DeleteGroupApi(deleteDoc.slug);
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
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const handleSearchName = () => {
    //console.log(filterName, "filterName for search");
    getConsultantListing();
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
  };
  const handleNavigate = () => {
    navigate(`/calendar-groups/add-group`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  useEffect(() => {
    getConsultantListing();
  }, [page, rowsPerPage]);
  useEffect(() => {
    if (!filterNameStatus) {
      return;
    }
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
    {
      label: "View Detail",
      icon: "fluent:video-recording-20-regular",
      handleClick: handleViewDetail,
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
            <h2>Groups</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              Add Group
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
                  onClick={() => getConsultantListing()}
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
                        status,
                        lastName,
                        email,
                        profile,
                        goal,
                        address,
                        type,
                        memberCount,
                        program,
                        member,
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
                          <TableCell className="action-in-table-width">
                            {
                              <CustomPopoverSection
                                menu={MENU_OPTIONS}
                                data={row}
                              />
                            }
                          </TableCell>
                          <TableCell
                            align="left"
                            className="action-in-table-width"
                          >
                            {page * rowsPerPage + (i + 1)}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              {name}
                            </Stack>
                          </TableCell>

                          <TableCell component="th" scope="row">
                            {program.map((program, i) => {
                              return (
                                <div
                                  key={i}
                                  dangerouslySetInnerHTML={{
                                    __html: program._id?.title,
                                  }}
                                ></div>
                              );
                            })}
                          </TableCell>
                          {/* <TableCell component="th" scope="row">
                          {type ? type : "N/A"}
                        </TableCell> */}
                          <TableCell component="th" scope="row">
                            {member.length}
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
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
    </>
  );
}
