import { useEffect, useState } from "react";
import {
  Card,
  Chip,
  CircularProgress,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import { dd_date_format } from "src/utils/constant";
// import { subscription_list_with_page_and_plan } from "src/DAL/WebsitePages/WebsitePages";
import moment from "moment";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import SubscriptionListFilter from "./SubscriptionListFilter";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
import { Icon } from "@iconify/react";
import Label from "src/components/Label";
import { project_mode } from "src/config/config";
import { get_root_value } from "src/utils/domUtils";
import { subscription_list_with_page_and_plan } from "src/DAL/WebsitePages/websitepages";
import { convertToTitleCase, htmlDecode } from "src/utils/convertHtml";
import FilteredChip from "src/components/FilteredChip";
import { GridCheckCircleIcon } from "@mui/x-data-grid";
import Skeleton from "react-loading-skeleton";

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },

  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "member_name", label: "Member", alignRight: false },
  { id: "page_name", label: "Product", alignRight: false },
  // { id: "plan_title", label: "Plan Title", alignRight: false },
  { id: "stripe_mode", label: "Subscription Mode", alignRight: false },
  {
    id: "next_payment_date",
    label: "Next Payment Date",
    alignRight: false,
  },
  {
    id: "created_at",
    label: "Subscription Date",
    alignRight: false,
  },

  // { id: "invoice_date", label: "Next Invoice Date", alignRight: false },
  {
    id: "status",
    label: "Status",
    renderData: (row) => {
      console.log(row, "/////////////");
      console.log(row.statusDate, "/////// date");
      return (
        <div style={{ display: "flex" }}>
          <Label
            variant="ghost"
            color={
              row.status?.includes("Cancels") ||
              row.status?.includes("Cancelled")
                ? "warning"
                : row.status?.includes("Trial")
                ? "info"
                : row.subscription_status === true
                ? "success"
                : row.subscription_status === false
                ? "error"
                : row.status === "Completed"
                ? "success"
                : "success"
            }
          >
            {/* {row.status?.includes("Cancels") && (
              <GridCheckCircleIcon
                style={{ marginRight: "5px", width: "18px", height: "18px" }}
              />
            )}

            {row.status?.includes("Completed") && (
              <GridCheckCircleIcon
                style={{ marginRight: "5px", width: "18px", height: "18px" }}
              />
            )} */}

            {row.status}
          </Label>
        </div>
      );
    },
  },
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

export default function SubscriptionList() {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };

  const getMembersList = async (filterData) => {
    setIsLoadingSection(true);
    handleCloseFilterDrawer();
    let postData = { ...filterData };
    console.log(postData, "asfkjdskflkajlskdh");

    if (postData.sale_page) {
      postData.sale_page = postData.sale_page._id;
    } else {
      postData.sale_page = "";
    }
    if (postData.payment_plan) {
      postData.payment_plan = postData.payment_plan._id;
    } else {
      postData.payment_plan = "";
    }

    // if (postData.expired === false) {
    //   postData.start_date = moment(postData?.start_date).format("YYYY-MM-DD");
    //   postData.end_date = moment(postData?.end_date).format("YYYY-MM-DD");
    //   if (postData.expiry_in !== "custom") {
    //     postData.end_date = moment(postData.start_date, "YYYY-MM-DD")
    //       .add(postData.expiry_in, "days")
    //       .format("YYYY-MM-DD");
    //   }
    // } else {
    //   delete postData.start_date;
    //   delete postData.end_date;
    //   delete postData.expiry_name;
    // }
    const result = await subscription_list_with_page_and_plan(
      page,
      rowsPerPage,
      postData
    );
    console.log(result, "s....s");
    if (result.code == 200) {
      let chipData = { ...filterData };

      // if (postData.expired === false) {
      //   let expiry_name = "";
      //   if (chipData.expiry_in !== "custom") {
      //     expiry_name = `Active`;
      //   } else {
      //     expiry_name = `Active`;
      //   }
      //   chipData.expiry_name = expiry_name;
      // }

      // if (!chipData.expired) {
      //   delete chipData.expiry_in;
      // }

      delete chipData.start_date;
      delete chipData.end_date;
      delete chipData.search_text;

      setFilterStateUpdated(chipData);
      let subscription_list = [];

      if (result.subscription.length > 0) {
        subscription_list = result.subscription.map((event, index) => {
          console.log(event, "aaaaaaaaaaaaaaa");
          console.log(
            event.member_info,
            "member_infomember_infomember_infomember_info"
          );
          let member_name = "";

          if (event.member) {
            if (event.member.first_name) {
              member_name = `${event.member.first_name} ${event.member.last_name} (${event.member.email})`;
            }
          } else if (!event.member) {
            member_name = `${event?.member_info?.name} (${event?.member_info?.email})`;
          } else {
            member_name = "No member info available";
          }

          // subscripton status code yahan per //
          let statusTab = "Active";
          console.log(event, " ssssssssssssss");
          if (event.is_completed) {
            statusTab = "Completed";
          } else if (event.is_cancelled) {
            statusTab = "Cancelled";
          } else if (event.cancelation_requested) {
            const date = moment(event.subscription_cancelled_date).format(
              "DD MMMM YYYY"
            );
            statusTab = `Cancels at: ${date}`;
          } else if (event.is_on_trial) {
            const date = moment(event.trial_ending_date).format("DD MMMM YYYY");
            statusTab = `Trial Ends at: ${date}`;
          }
          const status = event.is_completed
            ? "Completed"
            : event.is_cancelled
            ? "Cancelled"
            : event.cancelation_requested
            ? statusTab
            : event.is_on_trial
            ? statusTab
            : event.subscription_status === true
            ? "Active"
            : "Expired";

          let transaction_type = "";
          if (event?.sale_page) {
            transaction_type =
              convertToTitleCase(htmlDecode("sale_page (")) +
              (event?.sale_page ? event?.sale_page?.sale_page_title : "") +
              (event?.payment_request
                ? ` | ` + event?.payment_request?.request_title
                : "") +
              (event?.plan ? ` | ` + event?.plan?.plan_title : "") +
              (event?.transaction_request_type
                ? ` | ` + convertToTitleCase(event?.transaction_request_type)
                : "") +
              ")";
          }

          // console.log(transaction_type, "fajdskhkjf");
          let event_plan = event.plan;
          let plan_title = "N/A";
          if (event_plan?.plan_title) {
            plan_title = event_plan?.plan_title;
          }
          let payment_access = event_plan?.payment_access;
          if (plan_title != "N/A") {
            if (event_plan?.is_plan_free) {
              plan_title = plan_title + " (Free)";
            } else if (payment_access == "recursion") {
              plan_title = plan_title + " (Recurring)";
            } else if (payment_access == "onetime") {
              plan_title = plan_title + " (OneTime)";
            } else {
              plan_title = plan_title;
            }
          }
          // let statusTab = "Active";

          // const status = event.is_cancelled
          //   ? "Cancelled"
          //   : event.cancelation_requested
          //   ? statusTab
          //   : event.is_on_trial
          //   ? statusTab
          //   : event.is_completed
          //   ? "Completed"
          //   : event.subscription_status === true
          //   ? "Active"
          //   : "Expired";
          console.log(event, "ssssssssssseb");
          let next_payment_date;

          if (event.is_on_trial) {
            next_payment_date = " ";
          } else if (event.is_completed == true) {
            next_payment_date = " ";
          } else {
            next_payment_date = event.next_payment_date
              ? moment(event.next_payment_date).format("DD-MM-YYYY")
              : "";
          }

          return {
            ...event,
            member_name: member_name,
            // page_name: event.sale_page?.sale_page_title,
            page_name: transaction_type,

            created_at: dd_date_format(event.createdAt),
            invoice_date: event.next_invoice_date
              ? dd_date_format(event.next_invoice_date)
              : "N/A",
            plan_title: plan_title,
            status,

            next_payment_date,
          };
        });
      }

      setSubscriptionsData(subscription_list);
      setTotalCount(result.total_subscription_count);
      setTotalPages(result.total_pages);
      setIsLoadingSection(false);
    } else {
      enqueueSnackbar(result.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
      setIsLoadingSection(false);
    }
  };

  const searchFunction = () => {
    setPage(0);
    setPageCount(1);
    filterState.search_text = searchText;
    getMembersList(filterState);
    localStorage.setItem("subscription_list_data", JSON.stringify(filterState));
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
      console.log(data, "datadatadatadatadatadatadata");
      data.expiry_in = "";
      // data.expired = "";
      data.start_date = new Date();
      data.end_date = new Date();
    }
    getMembersList(data);
    setFilterState(data);
    localStorage.setItem("subscription_list_data", JSON.stringify(data));
  };

  const handleClearFilter = () => {
    let clear_data = { ...EMPTY_FILTER };
    setPage(0);
    setPageCount(1);
    setSearchText("");
    setFilterState(clear_data);
    getMembersList(clear_data);
    localStorage.removeItem("subscription_list_data");
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilterState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleChangeDate = (name, value) => {
    setFilterState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    let filter_data = EMPTY_FILTER;
    let find_filter = localStorage.getItem("subscription_list_data");
    if (find_filter) {
      filter_data = JSON.parse(find_filter);
      if (filter_data.search_text) {
        setSearchText(filter_data.search_text);
      }
    }
    setFilterState(filter_data);
    setFilterStateUpdated(filter_data);
    getMembersList(filter_data);
  }, [rowsPerPage, page]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-sm-12 mb-3">
            <h2>Subscription List</h2>
          </div>
          <div className="col-lg-6 col-sm-12 mb-3 text-end">
            <button
              className="small-contained-button"
              onClick={handleOpenFilterDrawer}
            >
              Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
            </button>
          </div>
        </div>
        <div className="mb-1 mt-3">
          {isLoadingSection ? (
            <Skeleton
              baseColor="#dddde8"
              highlightColor="#ddd"
              width={200}
              height={20}
            />
          ) : (
            <FilteredChip
              data={filterStateUpdated}
              tempState={filterState}
              EMPTY_FILTER={EMPTY_FILTER}
              onDeleteChip={handleDeleteChip}
              onClear={handleClearFilter}
            />
          )}
        </div>

        <div className="row mt-3">
          {isLoadingSection ? (
            <div>
              <Card style={{ overflowX: "auto" }}>
                <div className="mt-2 d-flex justify-content-between">
                  {" "}
                  <div style={{ marginLeft: "5px" }}>
                    <Skeleton width={200} height={20} />
                  </div>
                  <div className="d-flex" style={{ marginRight: "15px" }}>
                    <Skeleton width={200} height={60} />
                    <div style={{ margin: "10px" }}>
                      <Skeleton
                        baseColor="#dddde8"
                        highlightColor="#9F00FF"
                        width={70}
                        height={40}
                      />
                    </div>
                  </div>
                </div>

                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {/* Skeleton for Table Header */}
                        <TableCell>
                          <Skeleton width={150} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={50} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={200} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={20} />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Skeleton Loading for Rows */}
                      {Array.from({ length: 6 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton width={50} height={20} />
                          </TableCell>
                          <TableCell>
                            <Skeleton width={50} height={20} />
                          </TableCell>
                          <TableCell>
                            <Skeleton width={200} height={20} />
                          </TableCell>
                          <TableCell>
                            <Skeleton width={100} height={20} />
                          </TableCell>
                          <TableCell>
                            <Skeleton width={100} height={20} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div
                  style={{
                    margin: "20px",
                    justifyContent: "end",
                    display: "flex",
                  }}
                >
                  <Skeleton width={200} height={20} />
                </div>
              </Card>
            </div>
          ) : (
            <div className="col-12">
              <CustomMUITable
                TABLE_HEAD={TABLE_HEAD}
                data={subscriptionsData}
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
      <CustomDrawer
        isOpenDrawer={filterDrawerState}
        onOpenDrawer={handleOpenFilterDrawer}
        onCloseDrawer={handleCloseFilterDrawer}
        pageTitle="Filters"
        componentToPassDown={
          <SubscriptionListFilter
            filterState={filterState}
            handleChange={handleChange}
            handleChangeOther={handleChangeOther}
            handleChangeDate={handleChangeDate}
            searchSubmitFilter={searchFunction}
            handleClearFilter={handleClearFilter}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />
        }
      />
    </>
  );
}
