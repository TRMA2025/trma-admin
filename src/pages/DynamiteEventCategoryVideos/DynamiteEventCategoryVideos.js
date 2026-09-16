import { filter } from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchNotFound from "src/components/NotFound/SearchNotFound";
import Label from "src/components/Label";
import { UserListHead, UserListToolbar } from "src/components/_dashboard/user";

import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";

import { htmlDecode } from "src/utils/convertHtml";
import {
  deleteDynamiteEventCategoryVideo,
  dynamiteEventsCategoryVideoListApi,
} from "src/DAL/WebsitePagesold/DynamiteEventCategoryVideos/DynamiteEventCategoryVideos";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Title", alignRight: false },
  { id: "event_title", label: "Event Title", alignRight: false },
  {
    id: "category_title",
    label: "Event Category Title",
    alignRight: false,
  },
  { id: "order", label: "Order", alignRight: false },
  { id: "is_feature", label: "Is Feature", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "action", label: "Action", alignRight: false },
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
export default function DynamiteEventCategoryVideos() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getConsultantListing = async () => {
    try {
      const result = await dynamiteEventsCategoryVideoListApii(
        params.category_id
      );
      if (result.code === 200) {
        const data = result.dynamite_event_category_video_list.map((video) => {
          return {
            id: video._id,
            name: video.title,
            order: video.order,
            event_title: video.dynamite_event.title,
            category_title: video.dynamite_event_category.title,
            status: video.status,
            is_feature: video.is_feature,
            short_description: video.short_description,
            detail_description: video.detail_description,
            object: video,
          };
        });
        setCategoryTitle(result.dynamite_event_category_info.title);
        setUserList(data);
        setIsLoading(false);
      } else {
        navigate(`/dynamite-event-categories/${params.event_id}`);
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleEdit = (value) => {
    navigate(
      `/dynamite-event-videos/${params.event_id}/${params.category_id}/edit-video/${value.id}`
    );
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteDynamiteEventCategoryVideo(deleteDoc.id);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const handleNavigate = () => {
    navigate(
      `/dynamite-event-videos/${params.event_id}/${params.category_id}/add-video`
    );
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

  const isUserNotFound = filteredUsers.length === 0;
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

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
          <div className="col-12">
            <IconButton
              className="back-screen-button mb-4"
              onClick={() =>
                navigate(`/dynamite-event-categories/${params.event_id}`)
              }
            >
              <ArrowBackIcon
                className="arrow-back-icon"
                style={{ color: "#fff !important", fill: "#fff !important" }}
              />{" "}
            </IconButton>
          </div>
          <div className="col-lg-8 col-sm-12">
            <h2>{htmlDecode(categoryTitle)}</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              Add Video
            </button>
          </div>
        </div>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        ></Stack>

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
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => {
                    const {
                      id,
                      name,
                      event_title,
                      category_title,
                      order,
                      is_feature,
                      status,
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
                        <TableCell align="left">
                          {page * rowsPerPage + (i + 1)}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="1">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row">
                          {event_title}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {category_title}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {order}
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={is_feature === false ? "error" : "success"}
                          >
                            {is_feature === false ? "No" : "Yes"}
                          </Label>
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={status === false ? "error" : "success"}
                          >
                            {status === false ? "InActive" : "Active"}
                          </Label>
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
      </div>
    </>
  );
}
