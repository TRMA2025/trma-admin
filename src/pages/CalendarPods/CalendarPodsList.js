import { filter } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Pagination,
  TableHead,
} from "@mui/material";
// components
import SearchNotFound from "src/components/NotFound/SearchNotFound";
import Label from "src/components/Label";
import { UserListHead, UserListToolbar } from "src/components/_dashboard/user";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { s3baseUrl } from "src/config/config";
import { DeletePodsApi, podsListingApi } from "src/DAL/Pods/pods";
import Skeleton from "react-loading-skeleton";
import ListSkeleton from "src/components/listSkeleton/ListSkeleton";

//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },

  { id: "number", label: "#", alignRight: false },
  { id: "name", label: " Title", alignRight: false },
  { id: "image", label: "Image", alignRight: false },
  { id: "zoomLink", label: "Zoom Link", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "type", label: "Type", alignRight: false },
  { id: "user", label: "Users", alignRight: false },
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

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function CalendarPodsList() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [totalCount, setTotalCount] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [filterNameStatus, setFilterNameStatus] = useState(false);

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getConsultantListing = async () => {
    try {
      const result = await podsListingApi(page, rowsPerPage, searchText);
      if (result.code === 200) {
        const data = result.room.map((room) => {
          return {
            id: room._id,
            name: room.title,
            status: room.status,
            profile: room.room_image,
            zoom_link: room.zoom_link,
            room_type: room.room_type,
            room_user: room.room_user,
            slug: room.room_slug,
            object: room,
          };
        });
        setUserList(data);
        setIsLoading(false);
        setTotalCount(result.total_rooms);
        setTotalPages(result.total_pages);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    } catch (error) {}
  };
  const handleEdit = (value) => {
    navigate(`/meetings/edit-meeting/${value.slug}`, {
      state: { editValues: value.object },
    });
  };

  const handleViewDetail = (value) => {
    navigate(`/meetings/meeting-detail/${value?.object?.room_slug}`, {
      state: value.object,
    });
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeletePodsApi(deleteDoc.slug);
    if (result.code === 200) {
      getConsultantListing();
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
    navigate(`/meetings/add-meeting`);
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
  }, []);
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
            <h2>Meetings</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              Add Meeting
            </button>
          </div>
        </div>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        ></Stack>
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
                        profile,
                        zoom_link,
                        room_type,
                        room_user,
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
                          {" "}
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
                            {
                              <Avatar
                                src={s3baseUrl + profile?.thumbnail_1}
                                alt="photoURL"
                              />
                            }
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {zoom_link == "" ? "N/A" : "View Zoom Link"}
                          </TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={status === false ? "error" : "success"}
                            >
                              {status === false ? "InActive" : "Active"}
                            </Label>
                          </TableCell>
                          <TableCell>{room_type}</TableCell>
                          <TableCell>{room_user.length}</TableCell>
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
                      <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
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
