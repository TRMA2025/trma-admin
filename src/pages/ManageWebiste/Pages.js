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
  Tooltip,
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
import { client_url, s3baseUrl } from "src/config/config";
import {
  consultantListing,
  DeleteConsultantApi,
} from "src/DAL/consultant/consultant";
import { pagesListingApi } from "src/DAL/WebsitePages/websitepages";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Page Title", alignRight: false },
  { id: "url", label: "URL", alignRight: false },
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
export default function WebsitePages() {
  const navigate = useNavigate();
  const params = useLocation();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [filterNameStatus, setFilterNameStatus] = useState(false);

  const [dataValue, setData] = useState([]);

  const [UserId, setUserId] = useState(false);

  const handleOpen = (e) => {
    //
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
      const result = await pagesListingApi();
      if (result.code === 200) {
        setData(result.Sale_page);
        setIsLoading(false);

        setQuestionData(result.Sale_page);

        const data = result.Sale_page.map((page) => {
          return {
            id: page._id,
            name: page.sale_page_title,
            slug: page.sale_page_title_slug,
            testimonials_status: page.is_general_testimonial,
            is_faq: page.is_faq,
            testimonials_status: page.is_general_testimonial,
            is_faq: page.is_faq,
            page_type: page.page_type,
            sale_page_detail: page?.sale_page_detail,
            object: page,
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
    //
    navigate(`/website-pages/edit-page`, {
      state: value,
    });
  };
  const handleUpdatePageContent = (value) => {
    //console.log(value, "Page Content value");
    navigate(`/website-pages/update-page-content/${value.slug}`, {
      state: value,
    });
  };
  const handleNavigateSalePageTeam = (value) => {
    //console.log(value, "Page Content value");
    navigate(`/website-pages/sale-page-team/${value.id}`, {
      state: value,
    });
  };
  const handleNavigateSalePageEvent = (value) => {
    //console.log(value, "Page Content value");
    navigate(`/website-pages/sale-page/${value.id}`, {
      state: value,
    });
  };
  const handlePaymentPlans = (value) => {
    //console.log(value, "payment plans");
    navigate(`/website-pages/payment-plans/${value.id}`, {
      state: value,
    });
  };
  const handleSocialSharingCenter = (value) => {
    console.log(value.object.sale_page_title_slug, "valuevaluevaluevalue");
    delete value.MENU_OPTIONS;
    navigate(
      `/template-pages/socail-sharing-setting/${value?.object?.sale_page_title_slug}`,
      {
        state: value,
      }
    );
  };
  const handlePageTestimonial = (value) => {
    console.log(value, "valuevaluevaluevaluevalue");
    //console.log(value, "payment plans");
    navigate(`/website-pages/sale-testimonial/${value.id}`);
  };
  const handlePageFAQ = (value) => {
    //console.log(value, "payment plans");
    navigate(`/website-pages/sale-page-faq/${value.id}`, {
      state: value,
    });
  };

  // const handleEdit = (value) => {
  //
  //   navigate(`/website-pages/edit-page`, {
  //     state: value,
  //   });
  // };
  // const handleUpdatePageContent = (value) => {
  //   console.log(value, "Page Content value");
  //   navigate(`/website-pages/update-page-content/${value.slug}`, {
  //     state: value,
  //   });
  // };
  // const handlePaymentPlans = (value) => {
  //   console.log(value, "payment plans");
  //   navigate(`/website-pages/payment-plans/${value.id}`, {
  //     state: value,
  //   });
  // };
  // const handlePageTestimonial = (value) => {
  //   console.log(value, "payment plans");
  //   navigate(`/website-testimonials/sale-testimonial/${value.id}`, {
  //     state: value,
  //   });
  // };

  // const handleEdit = (value) => {

  //   console.log(value, "edit value");

  //   navigate(`/website-pages/edit-page`, {
  //     state: value,
  //   });
  // };
  // const handleUpdatePageContent = (value) => {
  //   console.log(value, "Page Content value");
  //   navigate(`/website-pages/update-page-content/${value.slug}`, {
  //     state: value,
  //   });
  // };
  // const handlePaymentPlans = (value) => {
  //   console.log(value, "payment plans");
  //   navigate(`/website-pages/payment-plans/${value.id}`, {
  //     state: value,
  //   });
  // };
  // const handlePageTestimonial = (value) => {
  //   console.log(value, "payment plans");
  //   navigate(`/website-testimonials/sale-testimonial/${value.id}`, {
  //     state: value,
  //   });
  // };

  const handleAgreeDelete = (value) => {
    //
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    //
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteConsultantApi(deleteDoc.id);
    if (result.code === 200) {
      getConsultantListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  // const handleEdit = (value) => {
  //   //
  //   navigate(`/website-pages/edit-page`, {
  //     state: value,
  //   });
  // };
  // const handleUpdatePageContent = (value) => {
  //   console.log(value, "Page Content value");
  //   navigate(`/website-pages/update-page-content/${value.slug}`, {
  //     state: value,
  //   });
  // };
  // const handleNavigateSalePageTeam = (value) => {
  //   console.log(value, "Page Content value");
  //   navigate(`/website-pages/sale-page-team/${value.id}`, {
  //     state: value,
  //   });
  // };
  // const handleNavigateSalePageEvent = (value) => {
  //   console.log(value, "Page Content value");
  //   navigate(`/website-pages/sale-page/${value.id}`, {
  //     state: value,
  //   });
  // };
  // const handlePaymentPlans = (value) => {
  //   console.log(value, "payment plans");
  //   navigate(`/website-pages/payment-plans/${value.id}`, {
  //     state: value,
  //   });
  // };
  // const handlePageTestimonial = (value) => {
  //   console.log(value, "payment plans");
  //   navigate(`/website-testimonials/sale-testimonial/${value.id}`, {
  //     state: value,
  //   });
  // };
  // const handlePageFAQ = (value) => {
  //   console.log(value, "payment plans");
  //   navigate(`/website-pages/sale-page-faq/${value.id}`, {
  //     state: value,
  //   });
  // };
  const handleWhatsInclude = (value) => {
    //console.log(value, "payment plans");
    navigate(`/website-pages/whats-include/${value.id}`, {
      state: value,
    });
  };
  const handleQuestions = (value) => {
    console.log("navigate");
    navigate(`/website-pages/question/${value.id}`, {
      state: value,
    });
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
    setFilterName(event.target.value);
  };
  const handleSearchName = () => {
    setFilterNameStatus(true);
    getConsultantListing();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchName();
    }
  };

  const handleNavigate = () => {
    navigate(`/website-pages/add-page`);
  };
  const menuHandling = (value) => {
    console.log(value, "value for menu ");

    const MENU_OPTIONS = [
      {
        label: "Edit Page Setting",
        icon: "akar-icons:edit",
        handleClick: handleEdit,
      },
      {
        label: "Social Sharing Setting",
        icon: "akar-icons:edit",
        handleClick: handleSocialSharingCenter,
      },
      {
        label: "Update Page Content",
        icon: "akar-icons:edit",
        handleClick: handleUpdatePageContent,
      },
    ];

    let generalTesimonial = {};
    let generalFaq = {};
    let generalTeam = {};
    let generalEvent = {};
    let generalPayment = {};
    let whatInclude = {};

    if (value.object.is_general_testimonial == false) {
      generalTesimonial = {
        label: "Testimonials",
        icon: "akar-icons:edit",
        handleClick: handlePageTestimonial,
      };
      MENU_OPTIONS.push(generalTesimonial);
    }
    if (value.object.is_general_faq == false) {
      generalFaq = {
        label: "Manage FAQ's",
        icon: "akar-icons:edit",
        handleClick: handlePageFAQ,
      };
      MENU_OPTIONS.push(generalFaq);
    }
    if (value.object.is_general_team == false) {
      generalTeam = {
        label: "Manage Team",
        icon: "akar-icons:edit",
        handleClick: handleNavigateSalePageTeam,
      };
      MENU_OPTIONS.push(generalTeam);
    }
    if (value.object.is_general_event == false) {
      generalTeam = {
        label: "Manage Event",
        icon: "akar-icons:edit",
        handleClick: handleNavigateSalePageEvent,
      };
      MENU_OPTIONS.push(generalTeam);
    }
    if (value.object.is_general_payment_plan == false) {
      generalPayment = {
        label: "Payment Plans",
        icon: "akar-icons:edit",
        handleClick: handlePaymentPlans,
      };
      MENU_OPTIONS.push(generalPayment);
    }

    if (value.object.is_what_include == true) {
      whatInclude = {
        label: "Manage Whats include",
        icon: "akar-icons:edit",
        handleClick: handleWhatsInclude,
      };
      MENU_OPTIONS.push(whatInclude);
    }

    return MENU_OPTIONS;
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
      label: "Edit Page Setting",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Update Page Content",
      icon: "akar-icons:edit",
      handleClick: handleUpdatePageContent,
    },
    {
      label: "Payment Plans",
      icon: "akar-icons:edit",
      handleClick: handlePaymentPlans,
    },
  ];

  const MENU_OPTIONS_faq = [
    {
      label: "Edit Page Setting",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Update Page Content",
      icon: "akar-icons:edit",
      handleClick: handleUpdatePageContent,
    },
    {
      label: "Payment Plans",
      icon: "akar-icons:edit",
      handleClick: handlePaymentPlans,
    },
    {
      label: "Manage FAQ's",
      icon: "akar-icons:edit",
      handleClick: handlePageFAQ,
    },
  ];
  const MENU_OPTIONS1 = [
    {
      label: "Edit Page Setting",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Update Page Content",
      icon: "akar-icons:edit",
      handleClick: handleUpdatePageContent,
    },

    {
      label: "Payment Plans",
      icon: "akar-icons:edit",
      handleClick: handlePaymentPlans,
    },
    {
      label: "Testimonials",
      icon: "akar-icons:edit",
      handleClick: handlePageTestimonial,
    },
    {
      label: "Questions",
      icon: "akar-icons:edit",
      handleClick: handleQuestions,
    },
  ];
  const MENU_OPTIONS2 = [
    {
      label: "Edit Page Setting",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Update Page Content",
      icon: "akar-icons:edit",
      handleClick: handleUpdatePageContent,
    },
    {
      label: "Payment Plans",
      icon: "akar-icons:edit",
      handleClick: handlePaymentPlans,
    },
    {
      label: "Testimonials",
      icon: "akar-icons:edit",
      handleClick: handlePageTestimonial,
    },
    {
      label: "Manage FAQ's",
      icon: "akar-icons:edit",
      handleClick: handlePageFAQ,
    },
  ];
  const MENU_OPTIONS3 = [
    {
      label: "Edit Page Setting",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Update Page Content",
      icon: "akar-icons:edit",
      handleClick: handleUpdatePageContent,
    },
    {
      label: "Payment Plans",
      icon: "akar-icons:edit",
      handleClick: handlePaymentPlans,
    },
    // {
    //   label: "Testimonials",
    //   icon: "akar-icons:edit",
    //   handleClick: handlePageTestimonial,
    // },
    {
      label: "Manage FAQ's",
      icon: "akar-icons:edit",
      handleClick: handlePageFAQ,
    },
  ];
  const MENU_OPTIONS_Demo = [
    {
      label: "Edit Page Setting",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Update Page Content",
      icon: "akar-icons:edit",
      handleClick: handleUpdatePageContent,
    },
    {
      label: "Payment Plans",
      icon: "akar-icons:edit",
      handleClick: handlePaymentPlans,
    },
  ];

  const isUserNotFound = filteredUsers.length === 0;
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //
  //

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
            <h2>Pages</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              Add New Page
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

        <Card style={{ overflowX: "auto" }}>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onKeyDown={handleKeyDown}
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
                      lastName,
                      email,
                      profile,
                      goal,
                      address,
                      type,
                      memberCount,
                      testimonials_status,
                      object,
                      is_faq,
                      page_type,
                      slug,
                      sale_page_detail,
                    } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;
                    console.log(sale_page_detail, "sale_page_detail");
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
                        <TableCell component="th" scope="row">
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
                          {sale_page_detail !== undefined ? (
                            <a
                              href={
                                page_type == "landing"
                                  ? client_url
                                  : client_url + slug
                              }
                              className="anchor-style"
                              target="_blank"
                            >
                              Preview
                            </a>
                          ) : (
                            <Tooltip
                              title="Please add page data to preview this page !"
                              style={{ cursor: "pointer" }}
                            >
                              <span>Preview</span>
                            </Tooltip>
                          )}
                        </TableCell>

                        <TableCell>
                          <CustomPopoverSection
                            menu={menuHandling(row)}
                            data={row}
                          />
                          {/* {object.is_general_testimonial == true ? (
                            object.is_general_testimonial == true ? (
                              <CustomPopoverSection
                                menu={menuHandling(row)}
                                data={row}
                              />
                            ) : (
                              <CustomPopoverSection
                                menu={MENU_OPTIONS1}s
                                data={row}
                              />
                            )
                          ) : (
                            <CustomPopoverSection
                              menu={MENU_OPTIONS1}
                              data={row}
                            />
                          )} */}
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
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
