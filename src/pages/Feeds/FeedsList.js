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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
import { DeleteMemberApi, memberListing } from "src/DAL/member/member";
import { htmlDecode } from "src/utils/convertHtml";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import UserListToolbars from "src/components/_dashboard/user/UserListToolbars";
import {
  DeleteRecording,
  RecordingListingApi,
} from "src/DAL/Recording/RecordingsApi";
import { deleteFeedApi, feedsListing } from "src/DAL/feeds/feeds";
import {
  DeleteStudySessionApi,
  studySessionListing,
} from "src/DAL/studySession/studySessionApi";
import { feedFeatureApi } from "src/DAL/feeds/feeds";
import FeatureConfirmation from "src/components/ModalPopover/featureConfirmation";

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
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "appear", label: "Appear by", alignRight: false },
  { id: "video ", label: "Pin Feed Top", alignRight: false },
  { id: "image", label: "Image", alignRight: false },
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
export default function FeedsList() {
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
  const [openFeature, setOpenFeature] = useState(false);
  const [member, setMember] = useState([]);
  const [featureFeedDetail, setFeatureFeedDetail] = useState();
  const [featureFeed, setFeatureFeed] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(true);
    setOpenImage(value);
  };
  const handleClose = () => setOpen(false);

  // const { id } = useParams();

  const handleFeatureFeed = (data) => {
    setFeatureFeed(data.is_feature);
    setFeatureFeedDetail(data);
    setOpenFeature(true);
  };

  const getMemberListing = async () => {
    setIsLoading(true);
    const postData = {
      search: filterName,
    };
    const result = await feedsListing(page, rowsPerPage);
    if (result.code == 200) {
      const members = result?.feeds?.map((feed, index) => {
        return {
          ...feed,
          id: feed._id,
          name: feed?.action_info?.name,
          description: feed.description,
          appearBy: feed?.feed_appear_by,
          image: feed?.image,
          videoUrl: feed?.video_url,
          object: feed,
          is_feature: feed?.is_feature,
          count: index + 1 + rowsPerPage * page,
        };
      });

      setData(members);
      setTotalCount(result.total_feed_count);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };
  const featureUpdate = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (
      featureFeedDetail.is_feature === false ||
      featureFeedDetail.is_feature === "false" ||
      featureFeedDetail.is_feature === undefined
    ) {
      formData.append("feed", featureFeedDetail.id);
      formData.append("action", "feature");
    } else {
      formData.append("feed", featureFeedDetail.id);
      formData.append("action", "unfeature");
    }
    const result = await feedFeatureApi(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      getMemberListing();
      setOpenFeature(false);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
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
    setPage(0);
  };
  const handleSearchName = () => {
    getMemberListing();
    setFilterNameStatus(true);
  };

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
  const handleEdit = (value) => {
    navigate(`/recording-list/edit-recording/`, {
      state: { editValues: value },
    });
  };
  const handleDetail = (value) => {
    navigate(`/recording-list/recording-detail/`, {
      state: value,
    });
  };
  const handleProfile = (value) => {
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
  const handleNavigateImportMember = () => {
    navigate(`/member/import-member`);
  };
  const handleNavigate = () => {
    navigate(`/member/add-member`);
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteFeedApi(deleteDoc.id);
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
    // {
    //   label: "Edit",
    //   icon: "akar-icons:edit",
    //   handleClick: handleEdit,
    // },
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

  useEffect(() => {
    if (!filterNameStatus) {
      return;
    }
    getMemberListing();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <>
      <FeatureConfirmation
        openDelete={openFeature}
        setOpenDelete={setOpenFeature}
        title={
          featureFeed === false || featureFeed === "false"
            ? "Are you sure you want to Pin this feed to top?"
            : "Are you sure you want to unPin this feed from top?"
        }
        handleAgree={featureUpdate}
      />
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(-1)}
            >
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton> */}
            {/* <button
              className="small-contained-button float-end mt-1"
              onClick={() => navigate(`/recording-list/add-recording`)}
            >
              Add New Recording
            </button> */}
          </div>
          <div className="col-lg-8 col-sm-12 mb-3">
            <h2>Feeds</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end"></div>
        </div>

        <Card style={{ overflowX: "auto" }}>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onSearch={handleSearchName}
          />

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
                    description,
                    program,
                    date,
                    count,
                    appearBy,
                    videoUrl,
                    image,
                    is_feature,
                  } = row;
                  return (
                    <TableRow hover key={id}>
                      {
                        <TableCell>
                          {page * rowsPerPage + (index + 1)}
                        </TableCell>
                      }
                      <TableCell component="th" scope="row" padding="1">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {/* <Avatar alt={name} src={s3baseUrl + profile} /> */}
                          <Typography variant="subtitle2">{name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography>
                          {description.length > 0
                            ? description.substring(0, 50) + "..."
                            : ""}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{appearBy}</TableCell>
                      {/* <TableCell align="left">
                        {videoUrl ? (
                          <a
                            href={videoUrl}
                            target="_blank"
                            className="anchor-style"
                          >
                            View
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell> */}
                      {/* <TableCell align="left">
                        <Avatar
                          alt={name}
                          src={s3baseUrl + image?.thumbnail_1}
                        />
                      </TableCell> */}

                      {/* <TableCell component="th" scope="row">
                        <Typography>
                          {name.length > 0 ? name.substring(0, 50) + "..." : ""}
                        </Typography>
                      </TableCell> */}

                      <TableCell align="left">
                        {is_feature == false ? (
                          <button
                            onClick={() => {
                              handleFeatureFeed(row);
                            }}
                            className="small-contained-button"
                          >
                            PIN
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleFeatureFeed(row);
                            }}
                            className="small-contained-button"
                          >
                            UNPIN
                          </button>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        <Avatar
                          alt={name}
                          src={s3baseUrl + image?.thumbnail_1}
                        />
                      </TableCell>

                      <TableCell>
                        <CustomPopoverSection menu={MENU_OPTIONS} data={row} />
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
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={totalCount}
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
