import { useEffect, useState } from "react";
import { Chip, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowBack, ArrowBackIos } from "@mui/icons-material";

import { dd_date_format } from "src/utils/constant";
// import { subscription_list_with_page_and_plan } from "src/DAL/WebsitePages/WebsitePages";
import moment from "moment";
// import SubscriptionListFilter from "./SubscriptionListFilter";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
import { Icon } from "@iconify/react";
import Label from "src/components/Label";
import { project_mode } from "src/config/config";
import { get_root_value } from "src/utils/domUtils";
import { subscription_list_with_page_and_plan } from "src/DAL/WebsitePages/websitepages";
import { convertToTitleCase, htmlDecode } from "src/utils/convertHtml";
import FilteredChip from "src/components/FilteredChip";
import SubscriptionListFilter from "src/pages/SubscriptionList/SubscriptionListFilter";
import AddorUpdatetags from "./AddOrUpdateTags";
import CustomDrawerAddEdit from "src/assets/CustomDraweraddEdit";
import IconButton from "src/theme/overrides/IconButton";
import { GridColumnHeaderFilterIconButton } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { deleteTransactionApi } from "src/DAL/Transaction/transactionApi";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import { BookTagApi, deleteTagsApi } from "src/DAL/book";

const TABLE_HEAD = [
  { id: "action", label: "Action", type: "action" },
  { id: "number", label: "#", type: "number" },
  { id: "title", label: "Title" },
  { id: "book_count", label: "Books Count" },

  { id: "status", label: "Status", type: "row_status" },
];

const useStyles = makeStyles(() => ({
  loadingSection: {
    marginLeft: "45%",
    marginTop: "20%",
    marginBottom: "20%",
    padding: 0,
  },
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function TagsList() {
  const INITIAL_VALUES = {
    deleteSchoolId: null,
    deleteDialogOpen: false,
    drawerOpen: false,
    selectedSchool: null,
  };

  const [schoolListState, setSchoolListState] = useState(INITIAL_VALUES);

  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLoadingSection, setIsLoadingSection] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const classes = useStyles();
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [deleteDoc, setDeleteDoc] = useState("");

  const handleOpenDrawer = () => {
    setSchoolListState((old) => ({
      ...old,
      drawerOpen: true,
      selectedSchool: null,
    }));
  };

  const handleCloseDrawer = () => {
    setSchoolListState((old) => ({ ...old, drawerOpen: false }));
  };
  const handleOpenEditDrawer = (school) => {
    setSchoolListState((old) => ({
      ...old,
      selectedSchool: school,
      drawerOpen: true,
    }));
  };

  const EMPTY_FILTER = {
    start_date: new Date(),
    end_date: new Date(),
    sale_page: null,
    payment_plan: null,
    expiry_in: "",
    expired: null,
    filter: "all",
    expiry_name: null,
    search_text: "",
  };

  const [filterState, setFilterState] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);
  const navigate = useNavigate();

  const handleOpenFilterDrawer = () => {
    setFilterDrawerState(true);
    setFilterState(filterStateUpdated);
  };
  const handleCloseFilterDrawer = () => {
    setFilterDrawerState(false);
  };

  const handleChangeOther = (name, value) => {
    setFilterState((values) => ({ ...values, [name]: value }));
  };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  //   if (newPage <= 0) {
  //     setPageCount(1);
  //   } else {
  //     setPageCount(newPage + 1);
  //   }
  // };
  // console.log(searchText, "searchTextSearchText");
  // console.log(rowsPerPage, "rowsPerPagerowsPerPagerowsPerPage");
  // console.log(page, "pagepagepage");
  // console.log(pageCount, " pageCount ,,,");
  // console.log(totalCount, " totalPagestotalPages ,,,");

  const fetchTags = async () => {
    // const postData = { search: searchText };

    setLoading(true);
    const response = await BookTagApi(page, rowsPerPage, searchText);
    console.log(response, "response/......");
    if (response.code === 200) {
      const tagsWithDetails = response.tags.map((tag, index) => ({
        ...tag,
        // number: index + 1,
        title: tag.name,
        book_count: tag.bookCount,
        status: tag.status,
      }));
      setTotalCount(response.total);
      setTotalPages(Math.ceil(response.total / rowsPerPage) - 1);

      setTags(tagsWithDetails);
    } else {
      enqueueSnackbar("Failed to fetch tags", { variant: "error" });
    }
    setLoading(false);
  };

  const searchFunction = (event) => {
    if (event) {
      event.preventDefault();
    }

    setPage(0);
    setPageCount(1);
    fetchTags();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchFunction();
    }
  };

  const handleDeleteChip = (data) => {
    setPage(0);
    setPageCount(1);

    if (!data.expiry_name) {
      data.expiry_in = "";
      // data.expired = "";
      data.start_date = new Date();
      data.end_date = new Date();
    }
    fetchTags(data);
    setFilterState(data);
    localStorage.setItem("subscription_list_data", JSON.stringify(data));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [page, rowsPerPage]);

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setLoading(true);

    const result = await deleteTagsApi(deleteDoc._id);
    if (result.code === 200) {
      fetchTags();
      setLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setLoading(false);
    }
  };

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick(row) {
        handleOpenEditDrawer(row);
      },
    },

    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  if (loading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  console.log(tags, "tagstagstagstags");
  return (
    <>
      <div className="container">
        <CustomConfirmation
          open={openDelete}
          setOpen={setOpenDelete}
          title={"Are you sure you want to delete ?"}
          handleAgree={handleDelete}
        />
        <div className="row">
          <div className="col-lg-6 col-sm-12 d-flex  mb-3">
            <ArrowBackIcon
              style={{
                cursor: "pointer",
                marginRight: "15px",
                marginTop: "8px",
                marginLeft: "8px",
                color: "white",
              }}
              onClick={() => navigate(-1)}
            />
            <h2>Tags List</h2>
          </div>

          <div className="col-lg-6 col-sm-12 mb-3 text-end">
            <button
              className="small-contained-button"
              onClick={handleOpenDrawer}
            >
              Add Tags
            </button>
          </div>
        </div>
        {/* {console.log(
          filterStateUpdated,
          filterState,
          EMPTY_FILTER,
          "dsfhdskfhkjdshfkjdshfkjsadjh"
        )} */}

        <div className="row mt-3">
          {isLoadingSection ? (
            <CircularProgress
              className={classes.loadingSection}
              color="primary"
            />
          ) : (
            <div className="col-12">
              <CustomMUITable
                TABLE_HEAD={TABLE_HEAD}
                data={tags}
                MENU_OPTIONS={MENU_OPTIONS}
                className="card-with-background"
                custom_pagination={{
                  total_count: totalCount,
                  rows_per_page: rowsPerPage,
                  page: page,
                  handleChangePage: handleChangePage,
                  onRowsPerPageChange: handleChangeRowsPerPage,
                }}
                custom_search={{
                  searchText: searchText,
                  setSearchText: setSearchText,
                  handleSubmit: searchFunction,
                  onKeyDown: handleKeyDown,
                }}
                pageCount={pageCount}
                totalPages={totalPages}
                handleChangePages={handleChangePages}
                pagePagination={true}
              />
            </div>
          )}
        </div>
      </div>
      <CustomDrawerAddEdit
        isOpenDrawer={schoolListState.drawerOpen}
        onOpenDrawer={handleCloseDrawer}
        onCloseDrawer={handleCloseDrawer}
        pageTitle={`${schoolListState.selectedSchool ? "Edit" : "Add"} Tag`}
        componentToPassDown={
          <AddorUpdatetags
            onCloseDrawer={handleCloseDrawer}
            selectedObject={schoolListState.selectedSchool}
            refreshList={fetchTags}
          />
        }
      />
    </>
  );
}
