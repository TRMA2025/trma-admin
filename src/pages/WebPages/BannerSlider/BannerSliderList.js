import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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
// import { deleteFaqApi, getFaqListApi } from "src/DAL/FAQ/FaqApi";

import {
  bannerSliderListApi,
  deleteBannerApi,
} from "src/DAL/bannerSliderApi/bannerApi";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: " Name", alignRight: false },
  { id: "image", label: " Image", alignRight: false },
  { id: "order", label: " Order", alignRight: false },
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
export default function BannerSliderList() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("order");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setData] = useState([]);
  const [pageData, setPageData] = useState({});
  const [UserId, setUserId] = useState(false);
  const [moduleData, setModuleData] = useState({});
  const module_actual_name = "banner_slider";
  const is_website_pages = window.location.pathname.includes("website-pages");
  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await page_detail_by_id(params.page_id);
    if (result.code == 200) {
      const get_module_info = result.sale_page.module_info.filter(
        (item) => item.module_actual_name == module_actual_name
      )[0];
      setModuleData(get_module_info.module_replica_info);
      setPageData(result.sale_page);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleOpen = (e) => {
    console.log("id", e);
    setUserId(e);
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getBannerListing = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      const result = await bannerSliderListApi(params.page_id);
      if (result.code === 200) {
        let sliderData = result.slider;
        setData(sliderData);
        setIsLoading(false);

        const data = sliderData.map((slider) => {
          return {
            id: slider._id,
            name: slider.title,
            profile: slider.images,
            order: slider.order,
            description: slider.short_description,
            status: slider.status,
            object: slider,
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
  // const handleEdit = (value) => {
  //   if (params.page_id) {
  //     navigate(
  //       `/website-pages/${params?.page_id}/edit-banner-slider/${value.id}`,
  //       {
  //         state: { value, state },
  //       }
  //     );
  //   } else {
  //     navigate(
  //       `/website-pages/${params?.page_id}/edit-banner-slider/${value.id}`,
  //       {
  //         state: value,
  //       }
  //     );
  //   }
  // };
  const handleEdit = (value) => {
    if (params.page_id) {
      if (is_website_pages) {
        navigate(
          `/website-pages/${params.page_id}/edit-banner-slider/${value.id}`,
          {
            state: { value, state },
          }
        );
      } else {
        navigate(
          `/template-pages/${params.page_id}/edit-banner-slider/${value.id}`,
          {
            state: { value, state },
          }
        );
      }
    }
  };
  // const handleNavigate = () => {
  //   if (params.page_id) {
  //     navigate(`/website-pages/${params.page_id}/add-banner-slider`, {
  //       state: state,
  //     });
  //   } else {
  //     navigate(`/website-banner-slider/add-banner-slider`);
  //   }
  // };
  const handleNavigate = () => {
    if (is_website_pages) {
      navigate(`/website-pages/${params.page_id}/add-banner-slider`, {
        state: pageData,
      });
    } else {
      navigate(`/template-pages/${params.page_id}/add-banner-slider`, {
        state: pageData,
      });
    }
  };

  const handleAgreeDelete = (value) => {
    console.log(value, "delete it ");
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    console.log(deleteDoc, "delete function run");
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteBannerApi(deleteDoc?.id);
    if (result.code === 200) {
      getBannerListing();
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
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleFilterByName = (event) => {
    console.log(event.target.value, "this is value");
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  useEffect(() => {
    getBannerListing();
  }, [params.page_id]);
  useEffect(() => {
    if (state !== null) {
      const get_module_info = state.module_info.filter(
        (item) => item.module_actual_name == module_actual_name
      )[0];
      setModuleData(get_module_info);
      // setModuleData(state);
      setPageData(state);
    } else {
      getPageDetail();
    }
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
  let breadCrumbMenu = [
    {
      title: is_website_pages ? "pages" : "Template Pages",
      navigation: is_website_pages ? `/website-pages` : `/template-pages`,
      active: false,
    },

    {
      title: pageData.sale_page_title,
      navigation: null,
      active: true,
    },
  ];
  const isUserNotFound = filteredUsers.length === 0;
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <CustomConfirmation
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />

      <div className="container">
        <div className="row">
          {params.page_id && (
            <div className="col-12 mb-4">
              <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

              {/* <IconButton
                className="back-screen-button "
                onClick={() => navigate(-1)}>
    <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />              </IconButton>
              <span className="sale-page-title">
                {pageData.sale_page_title}
              </span> */}
            </div>
          )}
          <div className="col-lg-8 col-sm-12">
            <h2>
              {moduleData?.module_replica_info
                ? moduleData?.module_replica_info?.list_page_heading
                : "Banner Sliders"}
            </h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              {moduleData?.module_replica_info
                ? moduleData.module_replica_info.add_button_text
                : "Add Banner Slider"}
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
          <div className="d-flex justify-content-between">
            <TablePagination
              rowsPerPageOptions={[50, 100, 150]}
              component="div"
              count={userList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => {
                    const {
                      id,
                      name,
                      status,
                      answer,
                      profile,
                      designation,
                      order,
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
                          <Avatar
                            alt={name}
                            src={s3baseUrl + profile?.thumbnail_1}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {order}
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
