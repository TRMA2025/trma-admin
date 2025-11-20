import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import {
  deletePaymentPlanApi,
  paymentPlansListApi,
} from "src/DAL/WebsitePages/paymentPlan";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";

import { s3baseUrl } from "src/config/config";
import CustomMUITable from "src/components/CustomMUITable";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false, type: "action" },

  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "plan_title", label: "Title", alignRight: false },
  { id: "planImage", label: "Image", alignRight: false, type: "thumbnail" },

  {
    id: "is_free",
    label: "Plan",
    alignRight: false,
    className: "text-capitalize",
  },
  { id: "planPrice", label: "Plan Price", alignRight: false },
  {
    id: "time_period_interval_param",
    label: "Time Period Interval",
    alignRight: false,
    className: "text-capitalize",
  },

  { id: "plan_status", label: "Status", alignRight: false, type: "row_status" },
];

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function WebPagePaymentPlans() {
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useLocation();
  const classes = useStyles();
  const [moduleData, setModuleData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState([]);
  const [pageData, setPageData] = useState({});
  const is_website_pages = window.location.pathname.includes("website-pages");
  const module_actual_name = "payment_plans";
  console.log(paymentPlan, "paymentPlanpaymentPlan");
  const getConsultantListing = async () => {
    const result = await paymentPlansListApi(
      params.page_id ? params.page_id : ""
    );
    if (result.code === 200) {
      const data = result.payment_plan.map((plan) => {
        return {
          ...plan,
          is_free:
            plan.is_plan_free == true
              ? "Free"
              : `Paid ( ${
                  plan.payment_access === "recursion"
                    ? "Recurring"
                    : plan.payment_access
                } ${
                  plan.payment_access == "onetime"
                    ? ""
                    : plan.product?.name
                    ? `| ${plan.product.name} `
                    : ""
                })`,
          productName: plan.product?.name ? plan.product.name : "N/A",
          planImage: {
            src: s3baseUrl + plan.plan_image,
            alt: plan.plan_title,
          },

          time_period_interval_param: `${plan.time_period_interval}  ${
            plan.payment_access == "recursion" && plan.plan_type
              ? plan.plan_type
              : ""
          }`,
          planPrice:
            plan.is_plan_free == true
              ? "£0"
              : plan.plan_price
              ? plan.plan_currency == "usd"
                ? "$" + plan.plan_price
                : plan.plan_currency == "gbp"
                ? "£" + plan.plan_price
                : plan.plan_currency == "eur"
                ? "€" + plan.plan_price
                : "" + plan.plan_price
              : "£0",
        };
      });
      setPaymentPlan(data);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleEdit = (value) => {
    if (params.page_id) {
      if (is_website_pages) {
        navigate(
          `/website-pages/${params.page_id}/payment-plans/edit-plan/${value._id}`,
          {
            state: {
              data: value,
              page_info: pageData,
            },
          }
        );
      } else {
        navigate(
          `/template-pages/${params.page_id}/payment-plans/edit-plan/${value._id}`,
          {
            state: {
              data: value,
              page_info: pageData,
            },
          }
        );
      }
    } else {
      navigate(`/payment-plans/edit-plan/${value._id}`);
    }
  };
  const handleSubscriber = (value) => {
    console.log(value, "dfkajdslkfjalkds", params.page_id, is_website_pages);
    if (params.page_id) {
      if (is_website_pages) {
        navigate(`/website-pages/${params.page_id}/subscriber/${value._id}`, {
          state: {
            data: value,
            page_info: pageData,
          },
        });
      } else {
        navigate(`/template-pages/${params.page_id}/subscriber/${value._id}`, {
          state: {
            data: value,
            page_info: pageData,
          },
        });
      }
    } else {
      console.log("called else", "dfkajdslkfjalkds");
      navigate(`/payment-plans/edit-plan/${value._id}`);
    }
  };
  const handleManageProgrammeAccess = (value) => {
    if (is_website_pages) {
      navigate(
        `/website-pages/${params.page_id}/payment-plans/${value._id}/manage-program-access`
      );
    } else {
      navigate(
        `/template-pages/${params.page_id}/payment-plans/${value._id}/manage-program-access`
      );
    }
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await page_detail_by_id(params.page_id);
    if (result.code == 200) {
      handlePageDetail(result.sale_page);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deletePaymentPlanApi(deleteDoc._id);
    if (result.code === 200) {
      getConsultantListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleManageEventsAccess = (value) => {
    if (is_website_pages) {
      navigate(
        `/website-pages/${params.page_id}/payment-plans/${value._id}/manage-events-access`
      );
    } else {
      navigate(
        `/template-pages/${params.page_id}/payment-plans/${value._id}/manage-events-access`
      );
    }
  };
  const handleNavigate = () => {
    if (params.page_id) {
      if (is_website_pages) {
        navigate(`/website-pages/${params.page_id}/payment-plans/add-plan`, {
          state: pageData,
        });
      } else {
        navigate(`/template-pages/${params.page_id}/payment-plans/add-plan`, {
          state: pageData,
        });
      }
    } else {
      navigate(`/payment-plans/add-plan`);
    }
  };

  const handlePageDetail = (data) => {
    setPageData(data);
    const get_module_info = data.module_info.filter(
      (item) => item.module_actual_name == module_actual_name
    )[0];
    setModuleData(get_module_info.module_replica_info);
  };
  const handleCopyUrl = (value) => {
    // const url =
    //   client_Url + state.sale_page_title_slug + "/payment/" + value.plan_slug;
    let CopiedUrl = "";
    navigator.clipboard.writeText(url).then(
      () => {
        enqueueSnackbar("Payment plan url copied.", { variant: "success" });
      },
      () => {
        enqueueSnackbar("Something went wrong, Please contact support!", {
          variant: "error",
        });
      }
    );
  };

  useEffect(() => {
    getConsultantListing();
    if (params.page_id) {
      if (state) {
        handlePageDetail(state);
      } else {
        getPageDetail();
      }
    }
  }, [params.page_id]);

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
    // {
    //   label: "Copy Url",
    //   icon: "akar-icons:edit",
    //   handleClick: handleCopyUrl,
    // },
    {
      label: "View Subscribers",
      icon: "akar-icons:edit",
      handleClick: handleSubscriber,
    },
    {
      label: "Manage Programme Access",
      icon: "akar-icons:edit",
      handleClick: handleManageProgrammeAccess,
    },
    {
      label: "Manage Events Access",
      icon: "akar-icons:edit",
      handleClick: handleManageEventsAccess,
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
        {params.page_id && (
          <div className="row">
            <div className="col-12 display-flex mb-4">
              <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

              {/* <IconButton
                className="back-screen-button"
                onClick={() => navigate(-1)}
              >
    <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />              </IconButton>
              <span className="sale-page-title">
                {pageData.sale_page_title}
              </span> */}
            </div>
          </div>
        )}
        <div className="row mb-5">
          <div className="col-lg-8 col-sm-12">
            <h2>
              {moduleData?.list_page_heading
                ? moduleData.list_page_heading
                : "Payment Plans"}
            </h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              {moduleData?.add_button_text
                ? moduleData.add_button_text
                : "Add Payment Plan"}
            </button>
          </div>
        </div>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={paymentPlan}
          className="card-with-background text-nowrap"
          MENU_OPTIONS={MENU_OPTIONS}
          pagePagination={true}
        />
      </div>
    </>
  );
}
