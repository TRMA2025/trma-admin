import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import { s3baseUrl } from "src/config/config";
import {
  CancelMemberSubscriptionApi,
  memberSubscriberListingApi,
} from "src/DAL/member/member";
import { dd_date_format } from "src/utils/constant";
import moment from "moment";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import Label from "src/components/Label";
import { GridCheckCircleIcon } from "@mui/x-data-grid";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function MemberSubscriptions() {
  const navigate = useNavigate();
  const { member_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [openDelete, setOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [memberData, setMemberData] = useState({});
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const classes = useStyles();
  const [pageCount, setPageCount] = useState(1);
  const [deleteDoc, setDeleteDoc] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [deletingMemberId, setDeletingMemberId] = useState(null);

  console.log(
    deletingMemberId,
    "deletingMemberIddeletingMemberIddeletingMemberIddeletingMemberId"
  );

  const location = useLocation();
  const state = location.state;
  console.log(state, "statestate");

  let breadCrumbMenu = [
    {
      title: "Members",
      navigation: -1,
      active: false,
    },

    {
      title: " " + state?.name,
      navigation: null,
      active: true,
    },
  ];
  console.log(memberData, "memberDatamemberDatamemberDatamemberData");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };
  const handleMenu = (row) => {
    console.log(row, "rowrowrow");
    const MENU_OPTIONS = [];
    if (
      row.cancelation_requested === false &&
      row.is_cancelled === false &&
      row.is_completed !== true
    ) {
      MENU_OPTIONS.push({
        label: "Cancel",
        icon: "line-md:cancel",
        handleClick: (row, index) => handleAgreeDelete(row._id),
      });
    }

    return MENU_OPTIONS;
  };

  const TABLE_HEAD = [
    {
      id: "action",
      label: "Action",
      alignRight: false,
      type: "action",
      MENU_OPTIONS: "MENU_OPTIONS",
    },
    { id: "number", label: "#", alignRight: false, type: "number" },

    { id: "page_name", label: "Page Title", alignRight: false },

    { id: "plan_title", label: "Plan Title", alignRight: false },
    {
      id: "status",
      label: "Status",
      renderData: (row) => {
        console.log(row, "row in render data");
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
                  : row.subscription_status == false
                  ? "error"
                  : row.status === "Completed"
                  ? "primary"
                  : "success"
              }
            >
              {row.status}
            </Label>
          </div>
        );
      },
    },

    //   id: "preview_link_data",
    //   label: "Agreement PDF",
    //   alignRight: false,
    //   type: "link",
    // },

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
    // {
    //   id: "register_url",
    //   label: "Register Link",
    //   alignRight: false,
    // },
  ];
  let idid = " ";
  console.log(idid, "ididididiid");

  const getMembersList = async () => {
    try {
      setIsLoading(true);

      const result = await memberSubscriberListingApi(member_id);
      console.log(result, "result of subscription members.....");

      if (result.code === 200) {
        const members = result.subscription?.map((event) => {
          const stripeId =
            event.stripe_subscription_id || "default_value_or_null"; // Fallback if stripe_subscription_id is undefined
          console.log("Stripe ID:", stripeId);

          if (stripeId) {
            setDeletingMemberId(stripeId);
          } else {
            console.warn(
              "stripe_subscription_id is undefined for event:",
              event
            );
          }

          console.log(event, "event map");
          idid = event._id;
          const subscription = event || {};
          let statusTab = "Active";
          console.log(subscription, " ssssssssssssss");

          if (subscription.is_cancelled) {
            statusTab = "Cancelled";
          } else if (subscription.cancelation_requested) {
            const date = moment(
              subscription.subscription_cancelled_date
            ).format("DD MMMM YYYY");
            statusTab = `Cancels at: ${date}`;
          } else if (subscription.is_on_trial) {
            const date = moment(subscription.trial_ending_date).format(
              "DD MMMM YYYY"
            );
            statusTab = `Trial Ends at: ${date}`;
          }

          const concatenated_info = `${
            subscription.sale_page?.sale_page_title || ""
          } ${subscription.plan_info?.plan_title ? "|" : ""} ${
            subscription.plan_info?.plan_title || ""
          }`;

          const status = subscription.is_completed
            ? "Completed"
            : subscription.is_cancelled
            ? "Cancelled"
            : subscription.cancelation_requested
            ? statusTab
            : subscription.is_on_trial
            ? statusTab
            : subscription.subscription_status === true
            ? "Active"
            : "Expired";

          const event_plan = event.plan || {};
          let plan_title = event_plan.plan_title || "N/A";

          const affiliate = event.affiliate?.affiliate_user_info || {};
          const affiliate_name = affiliate.first_name
            ? `${affiliate.first_name} ${affiliate.last_name}`
            : "N/A";

          const created_at = event.createdAt
            ? moment(event.createdAt).format("DD-MM-YYYY")
            : "N/A";
          let next_payment_date;

          if (subscription.is_on_trial) {
            next_payment_date = " ";
          } else if (subscription.is_completed == true) {
            next_payment_date = " ";
          } else {
            next_payment_date = event.next_payment_date
              ? moment(event.next_payment_date).format("DD-MM-YYYY")
              : "No Date";
          }

          return {
            ...event,
            page_name: event.sale_page?.sale_page_title,
            created_at,
            next_payment_date,
            plan_title,
            affiliate_name,
            concatenated_info,
            // school: subscription.school_name || "No School",
            status,
            MENU_OPTIONS: handleMenu(subscription),
            preview_link_data: {
              to: s3baseUrl + event.aggrement_pdf_url,
              target: "_blank",
              show_text: event.aggrement_pdf_url ? "Preview" : "",
              className: "anchor-style",
            },
          };
        });

        setMemberData(result.subscription);
        // setDeletingMemberId(result.subscription.stripe_subscription_id);
        console.log(result.subscription.stripe_subscription_id, "==========");
        setSubscriptionsData(members);
        setTotalCount(result.total_count);
        setTotalPages(result.total_pages);
      } else {
        enqueueSnackbar(result.message, {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching members list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchFunction = (e) => {
    e.preventDefault();
    setPage(0);
    setPageCount(1);

    getMembersList();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (value) => {
    navigate(`/member/edit-member-subscribers/${value._id}`, {
      state: value,
    });
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  console.log(memberData, "sssssssssssssmmm");

  const handleDelete = async (value) => {
    console.log(value, " value in del");
    console.log(state._id, " value in del state");

    setOpenDelete(false);
    const result = await CancelMemberSubscriptionApi(value, state._id);
    if (result.code === 200) {
      // setSubscriptionsData((prev) => {
      //   return prev.filter((data) => data._id !== deleteDoc._id);
      // });
      enqueueSnackbar(result.message, { variant: "success" });
      getMembersList();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
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
    localStorage.setItem("member_page_number", newPage);
  };

  useEffect(() => {
    getMembersList();
  }, [rowsPerPage, page]);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to cancel this subscription?"}
        // handleAgree={handleDelete(handleDelete)}
        handleAgree={() => handleDelete(deleteDoc)}
      />
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex">
            {/* <IconButton
              className="back-screen-button"
              onClick={() => navigate(-1)}
            >
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton> */}
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
            {/* <p className="pt-2 ms-2">
              {memberData?.first_name +
                " " +
                memberData?.last_name +
                " (" +
                memberData?.email +
                ") "}
            </p> */}
          </div>
          <div className="col-12 d-flex">
            {memberData?.consultant && (
              <>
                <p className="mt-2 ps-2 title-color"> Delegate: </p>
                <p className="mt-2 ms-2">
                  {" " +
                    memberData?.consultant.first_name +
                    " " +
                    memberData?.consultant.last_name +
                    " (" +
                    memberData?.consultant.email +
                    ")"}
                </p>
              </>
            )}
            {memberData?.affliliate && (
              <>
                <p className="mt-2 ps-2 title-color"> | Affiliate: </p>
                <p className="mt-2 ms-2">
                  {memberData?.affliliate.affiliate_user_info.first_name +
                    " " +
                    memberData.affliliate.affiliate_user_info.last_name +
                    " (" +
                    memberData.affliliate.affiliate_user_info.email +
                    ")"}
                </p>
              </>
            )}
          </div>
          <div className="col-lg-8 col-sm-12 mb-3 mt-3 d-flex align-items-center">
            <h2>Member Subscriptions</h2>
            {/* <p className="pt-2 ms-2">
              {memberData?.first_name +
                " " +
                memberData?.last_name +
                " (" +
                memberData?.email +
                ") "}
            </p> */}
          </div>
          <div className="col-lg-4 col-sm-12 text-end"></div>
        </div>
        <div className="row">
          <div className="col-12">
            <CustomMUITable
              TABLE_HEAD={TABLE_HEAD}
              // MENU_OPTIONS={MENU_OPTIONS}
              data={subscriptionsData}
              className="card-with-background"
              // custom_pagination={{
              //   total_count: totalCount,
              //   rows_per_page: rowsPerPage,
              //   page: page,
              //   handleChangePage: handleChangePage,
              //   onRowsPerPageChange: handleChangeRowsPerPage,
              // }}
              // custom_search={{
              //   searchText: searchText,
              //   setSearchText: setSearchText,
              //   handleSubmit: searchFunction,
              // }}
              pagePagination={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
