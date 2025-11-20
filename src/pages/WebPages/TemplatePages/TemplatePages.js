import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import Switch from "@mui/material/Switch";
import {
  changePageAccessApi,
  deleteSalePageApi,
  import_template_data_api,
  pagesListingApi,
} from "src/DAL/WebsitePages/websitepages";

import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import CopyToClipboard from "react-copy-to-clipboard";
// import CustomMUITable from "src/components/CustomMUITable";
import { client_url } from "src/config/config";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import Skeleton from "react-loading-skeleton";
import ListSkeleton from "src/components/listSkeleton/ListSkeleton";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function TemplatePages() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [templateData, setTemplateData] = useState([]);
  const [selectedObject, setSelectedObject] = useState({});
  const is_website_pages = window.location.pathname.includes("website-pages");
  const [openModel, setOpenModel] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [pageSlug, setPageSlug] = useState("");
  const [changeAccessData, setChangeAccessData] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const TABLE_HEAD = [
    {
      id: "action",
      label: "Action",
      alignRight: false,
      MENU_OPTIONS: "MENU_OPTIONS",
      type: "action",
    },
    { id: "number", label: "#", alignRight: false, type: "number" },
    { id: "sale_page_title", label: "Page Title", alignRight: false },
  ];

  if (is_website_pages) {
  }
  TABLE_HEAD.splice(3, 0, {
    label: "Copy URL",
    alignRight: false,
    type: "url",
    renderData: (row) => {
      console.log(row, "rowrowrowrow");
      if (
        row.type_of_page == "payment_page" ||
        row.type_of_page == "thanks_page"
      ) {
        return <></>;
      } else {
        if (
          is_website_pages &&
          row.is_page_template_available &&
          !row.is_template_data_imported
        ) {
          return <></>;
        } else {
          return (
            <CopyToClipboard
              text={
                row.page_type == "landing"
                  ? client_url
                  : client_url + row.sale_page_title_slug
              }
              onCopy={() => handleCopiedUrl(true)}
            >
              <Tooltip title="Click to copy Preview URL">
                <Chip label="Copy URL" color="primary" variant="outlined" />
              </Tooltip>
            </CopyToClipboard>
          );
        }
      }
    },
  });

  // if (is_website_pages) {}
  TABLE_HEAD.splice(3, 0, {
    id: "page_access",
    label: "Page Access",
    alignRight: false,
    renderData: (row) => {
      return (
        <Tooltip title="Change Page Access">
          <Switch
            checked={row.page_access}
            onChange={() => handleConfirmation(row)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Tooltip>
      );
    },
  });

  TABLE_HEAD.splice(3, 0, {
    label: "URL",
    alignRight: false,
    renderData: (row) => {
      console.log(row, "row in the tablehead URL");
      if (
        row.type_of_page == "payment_page" ||
        row.type_of_page == "thanks_page"
      ) {
        return <></>;
      } else {
        if (
          is_website_pages &&
          row.is_page_template_available &&
          !row.is_template_data_imported
        ) {
          return (
            <Tooltip title="Click to import template data">
              <Chip
                label="Import Template Data"
                color="primary"
                variant="outlined"
                onClick={() => handleAgreeImportData(row)}
              />
            </Tooltip>
          );
        } else {
          console.log(row?.preview_link_data?.to, "row?.preview_link_data?.to");
          return (
            <a
              href={row?.preview_link_data?.to}
              className="anchor-style tex-center"
              target="_blank"
            >
              {row.status == true ? "Preview" : ""}
            </a>
          );
        }
      }
    },
  });

  const handleChangePageAccess = async (value) => {
    let postData = {
      sale_page_id: changeAccessData._id,
      page_access: changeAccessData.page_access
        ? !changeAccessData.page_access
        : true,
    };
    const result = await changePageAccessApi(postData);
    if (result.code == 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setOpenConfirmation(false);
      getTemplatePagesListing();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setOpenConfirmation(false);
    }
  };
  const handleConfirmation = (value) => {
    setChangeAccessData(value);
    setOpenConfirmation(true);
  };

  const getTemplatePagesListing = async () => {
    setIsLoading(true);
    const result = await pagesListingApi(
      page,
      rowsPerPage,
      searchText,
      is_website_pages ? "general" : "template"
    );
    console.log(result, "resultresultresult");
    if (result.code === 200) {
      let result_array = [];
      result.Sale_page.map((template) => {
        result_array.push({
          ...template,
          preview_link_data: {
            to:
              template.page_type == "landing"
                ? client_url
                : client_url + template.sale_page_title_slug, // yaha pr check lgaana ha agr page landing ha to slug ni attach krna
            target: "_blank",
            show_text: "Preview",
            className: "anchor-style",
          },
          MENU_OPTIONS: menuHandling(template, result.default_pages),
        });
      });
      setTemplateData(result_array);
      setTotalCount(result.total_sale_pages);

      setTotalPages(result.total_pages);

      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const getTemplatePagesListingBaseOnWebPage = async () => {
    setIsLoading(true);
    const result = await pagesListingApi(
      0,
      50,
      "",
      is_website_pages ? "general" : "template"
    );
    if (result.code === 200) {
      console.log(result, "dklgjsdflkjgldkf");
      let result_array = [];
      result.Sale_page.map((template) => {
        result_array.push({
          ...template,
          preview_link_data: {
            to:
              template.page_type == "landing"
                ? client_url
                : client_url + template.sale_page_title_slug, // yaha pr check lgaana ha agr page landing ha to slug ni attach krna
            target: "_blank",
            show_text: "Preview",
            className: "anchor-style",
          },
          MENU_OPTIONS: menuHandling(template, result.default_pages),
        });
      });
      setTemplateData(result_array);
      setTotalCount(result.total_sale_pages);

      setTotalPages(result.total_pages);

      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleEdit = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(`/website-pages/edit-page/${value.sale_page_title_slug}`, {
        state: value,
      });
    } else {
      navigate(`/template-pages/edit-page/${value.sale_page_title_slug}`, {
        state: value,
      });
    }
  };
  const searchFunction = () => {
    setPage(0);
    setPageCount(1);

    getTemplatePagesListing();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchFunction();
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  const handleBeniefits = (value) => {
    delete value?.MENU_OPTIONS;
    if (!is_website_pages) {
      navigate(`/template-pages/${value._id}/benifits`, {
        state: value,
      });
    }
  };
  const handleEditThanksPage = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(
        `/website-pages/edit-page/${value.thanks_page.sale_page_title_slug}`,
        {
          state: value.thanks_page,
        }
      );
    } else {
      navigate(
        `/template-pages/edit-page/${value.thanks_page.sale_page_title_slug}`,
        {
          state: value.thanks_page,
        }
      );
    }
  };
  const handleEditPaymentPage = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(
        `/website-pages/edit-page/${value.payment_page.sale_page_title_slug}`,
        {
          state: value.payment_page,
        }
      );
    } else {
      navigate(
        `/template-pages/edit-page/${value.payment_page.sale_page_title_slug}`,
        {
          state: value.payment_page,
        }
      );
    }
  };
  const handleSocialSharing = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(
        `/website-pages/social-sharing-setting/${value.sale_page_title_slug}`,
        {
          state: value,
        }
      );
    } else {
      navigate(
        `/template-pages/social-sharing-setting/${value.sale_page_title_slug}`,
        {
          state: value,
        }
      );
    }
  };

  const handleUpdatePageContent = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(
        `/website-pages/update-page-content/${value.sale_page_title_slug}`,
        {
          state: value,
        }
      );
    } else {
      navigate(
        `/template-pages/update-page-content/${value.sale_page_title_slug}`,
        {
          state: value,
        }
      );
    }
  };
  const handleQuestionAnswers = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(`/website-pages/answers/${value._id}`, {
        state: value,
      });
    } else {
      navigate(`/template-pages/answers/${value._id}`, {
        state: value,
      });
    }
  };
  const handleUpdateThanksPageContent = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(
        `/website-pages/update-page-content/${value.thanks_page.sale_page_title_slug}`,
        {
          state: value.thanks_page,
        }
      );
    } else {
      navigate(
        `/template-pages/update-page-content/${value.thanks_page.sale_page_title_slug}`,
        {
          state: value.thanks_page,
        }
      );
    }
  };
  const handleUpdateThanksContent = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(
        `/website-pages/update-thanks-content/${value.sale_page_title_slug}`,
        {
          state: value,
        }
      );
    } else {
      navigate(
        `/template-pages/update-thanks-content/${value.sale_page_title_slug}`,
        {
          state: value,
        }
      );
    }
  };
  const handleUpdatePaymentPageContent = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(
        `/website-pages/update-page-content/${value.payment_page.sale_page_title_slug}`,
        {
          state: value,
        }
      );
    } else {
      navigate(
        `/template-pages/update-page-content/${value.payment_page.sale_page_title_slug}`,
        {
          state: value,
        }
      );
    }
  };

  const handleManageCommission = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(`/website-pages/manage-commission-access/${value._id}`, {
        state: value,
      });
    } else {
      navigate(`/template-pages/manage-commission-access/${value._id}`, {
        state: value,
      });
    }
  };

  const handleAccess = (value) => {
    delete value.MENU_OPTIONS;
    navigate(
      `/template-pages/manage-consultant-access/${value.sale_page_title_slug}`,
      {
        state: value,
      }
    );
  };
  const handlePageSubscriber = (value) => {
    delete value.MENU_OPTIONS;
    if (is_website_pages) {
      navigate(`/website-pages/page-subscriber/${value._id}`);
    } else {
      navigate(`/template-pages/page-subscriber/${value._id}`);
    }
  };

  const handleUnpublishSetting = (value) => {
    delete value.MENU_OPTIONS;
    navigate(`/website-pages/unpublish-setting/${value._id}`, {
      state: value,
    });
  };

  const handleModuleAccess = (value) => {
    delete value.MENU_OPTIONS;
    navigate(
      `/template-pages/manage-module-access/${value.sale_page_title_slug}`,
      {
        state: value,
      }
    );
  };

  const handleRedirect = (module, value, redirect) => {
    if (redirect == "thanks_page") {
      value = value.thanks_page;
    } else if (redirect == "payment_page") {
      value = value.payment_page;
    }

    if (is_website_pages) {
      switch (module.module_actual_name) {
        case "testimonial":
          navigate(`/website-pages/${value._id}/testimonials`, {
            state: value,
          });
          break;

        case "payment_plans":
          navigate(`/website-pages/${value._id}/payment-plans`, {
            state: value,
          });
          break;
        case "website_programmes":
          navigate(`/website-pages/${value._id}/website-programmes`, {
            state: value,
          });
          break;
        case "buisness_strategy":
          navigate(`/website-pages/${value._id}/business-strategy`, {
            state: value,
          });
          break;
        case "website_faq":
          navigate(`/website-pages/${value._id}/website-faq`, {
            state: value,
          });
          break;
        case "wheel_of_life":
          navigate(`/website-pages/${value._id}/questions`, {
            state: value,
          });
          break;
        case "banner_slider":
          navigate(`/website-pages/${value._id}/banner-slider`, {
            state: value,
          });
          break;
        case "success_schedule":
          navigate(`/website-pages/${value._id}/success-schedule`, {
            state: value,
          });
          break;
        case "website_questions":
          navigate(`/website-pages/${value._id}/website-questions`, {
            state: value,
          });
          break;
        case "general_questions":
          navigate(`/website-pages/${value._id}/general-questions`, {
            state: value,
          });
          break;
        default:
        // code block
      }
    } else {
      switch (module.module_actual_name) {
        case "testimonial":
          navigate(`/template-pages/${value._id}/testimonials`, {
            state: value,
          });
          break;
        case "benefits":
          navigate(`/template-pages/${value._id}/benifits`, {
            state: value,
          });
          break;
        case "payment_plans":
          navigate(`/template-pages/${value._id}/payment-plans`, {
            state: value,
          });
          break;
        case "website_programmes":
          navigate(`/template-pages/${value._id}/website-programmes`, {
            state: value,
          });
          break;
        case "buisness_strategy":
          navigate(`/template-pages/${value._id}/business-strategy`, {
            state: value,
          });
          break;
        case "website_faq":
          navigate(`/template-pages/${value._id}/website-faq`, {
            state: value,
          });
          break;
        case "wheel_of_life":
          navigate(`/template-pages/${value._id}/questions`, {
            state: value,
          });
          break;
        case "success_schedule":
          navigate(`/template-pages/${value._id}/success-schedule`, {
            state: value,
          });
          break;
        case "banner_slider":
          navigate(`/template-pages/${value._id}/banner-slider`, {
            state: value,
          });
          break;
        case "website_questions":
          navigate(`/template-pages/${value._id}/website-questions`, {
            state: value,
          });
          break;
        case "general_questions":
          navigate(`/template-pages/${value._id}/general-questions`, {
            state: value,
          });
        default:
        // code block
      }
    }
  };

  const handleAgreeImportData = (value) => {
    setSelectedObject(value);
    setOpenModel(true);
  };
  const handleDeletePages = (e) => {
    setOpenDelete(true);
    setPageSlug(e.sale_page_title_slug);
  };
  const handleAgreeDeletePage = async (e) => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteSalePageApi(pageSlug);
    if (result.code == 200) {
      getTemplatePagesListing();
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setOpenModel(false);
    setIsLoading(true);
    const dataObject = {
      sale_page_id: selectedObject._id,
    };

    const result = await import_template_data_api(dataObject);
    if (result.code === 200) {
      getTemplatePagesListing();
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleCopyAppointmentURL = async (e) => {
    await navigator.clipboard.writeText(
      client_url + e.sale_page_title_slug + "/appointment"
    );
    enqueueSnackbar("Appointment URL Copied to clipboard", {
      variant: "success",
    });
  };

  const menuHandling = (value, pagesDefault) => {
    console.log(value, "valuevaluevaluevaluevalue in handlemenu ");
    console.log(pagesDefault, "pagesDefault in handlemenu ");

    const MENU_OPTIONS = [
      // {
      //   label: "Delete Page",
      //   icon: "ant-design:delete-twotone",
      //   handleClick: (e) => {
      //     handleDeletePages(e);
      //   },
      // },

      {
        label: "Edit Page Setting",
        icon: "akar-icons:edit",
        handleClick: (e) => {
          handleEdit(e);
        },
      },
      {
        label: "Social Sharing Setting",
        icon: "akar-icons:edit",
        handleClick: (e) => {
          handleSocialSharing(e);
        },
      },
      {
        label: "Update Page Content",
        icon: "akar-icons:edit",
        handleClick: handleUpdatePageContent,
      },
      {
        label: "Update Thanks Content",
        icon: "akar-icons:edit",
        handleClick: handleUpdateThanksContent,
      },
      {
        label: "View Subscribers",
        icon: "eva:eye-fill",
        handleClick: handlePageSubscriber,
      },
      {
        label: "Page Unpublish Setting",
        icon: "akar-icons:edit",
        handleClick: handleUnpublishSetting,
      },
      // {
      //   label: "Manage Commission Access",
      //   icon: "akar-icons:edit",
      //   handleClick: handleManageCommission,
      // },
    ];
    if (value.type_of_page == "book_a_call_page") {
      MENU_OPTIONS.splice(3, 0, {
        label: "Copy Appointment URL",
        icon: "eva:eye-fill",
        handleClick: handleCopyAppointmentURL,
      });
      MENU_OPTIONS.splice(4, 0, {
        label: "Question Answers",
        icon: "eva:eye-fill",
        handleClick: handleQuestionAnswers,
      });
    }

    if (value.thanks_page) {
      let child_menu_options = [
        {
          label: "Edit Page Setting",
          icon: "akar-icons:edit",
          handleClick: (e) => {
            handleEditThanksPage(e);
          },
        },

        {
          label: "Update Page Content",
          icon: "akar-icons:edit",
          handleClick: handleUpdateThanksPageContent,
        },
      ];
      value.thanks_page?.module_info?.map((module) => {
        child_menu_options.push({
          label: module.module_label_text,
          icon: "akar-icons:edit",
          handleClick: () => {
            handleRedirect(module, value, "thanks_page");
          },
        });
      });
      MENU_OPTIONS.push({
        label: "Thanks Page",
        icon: "akar-icons:edit",
        child_options: child_menu_options,
      });
    }
    console.log(value, "value.payment_page");
    if (value.payment_page) {
      let child_menu_options = [
        {
          label: "Edit Page Setting",
          icon: "akar-icons:edit",
          handleClick: (e) => {
            handleEditPaymentPage(e);
          },
        },
        {
          label: "Update Page Content",
          icon: "akar-icons:edit",
          handleClick: handleUpdatePaymentPageContent,
        },
      ];
      value.payment_page?.module_info?.map((module) => {
        child_menu_options.push({
          label: module.module_label_text,
          icon: "akar-icons:edit",
          handleClick: () => {
            handleRedirect(module, value, "payment_page");
          },
        });
      });
      MENU_OPTIONS.push({
        label: "Payment Page",
        icon: "akar-icons:edit",
        child_options: child_menu_options,
      });
    }
    if (!is_website_pages) {
      MENU_OPTIONS
        .push
        // {
        //   label: "Manage Delegates Access",
        //   icon: "akar-icons:edit",
        //   handleClick: handleAccess,
        // },
        // {
        //   label: "Manage Module Access",
        //   icon: "akar-icons:edit",
        //   handleClick: handleModuleAccess,
        // }
        ();
    }
    if (
      is_website_pages &&
      value.is_page_template_available &&
      !value.is_template_data_imported
    ) {
      MENU_OPTIONS.push({
        label: "Import Template Data",
        icon: "akar-icons:edit",
        handleClick: handleAgreeImportData,
      });
    }

    value.module_info.map((module) => {
      MENU_OPTIONS.push({
        label: module.module_label_text,
        icon: "akar-icons:edit",
        handleClick: () => {
          handleRedirect(module, value, "sale_page");
        },
      });
    });

    let menu123 = pagesDefault?.some((page) => page._id == value._id);
    if (is_website_pages) {
      if (!menu123) {
        MENU_OPTIONS.push({
          label: "Delete Page",
          icon: "ant-design:delete-twotone",
          handleClick: (e) => {
            handleDeletePages(e);
          },
        });
      }
    }
    return MENU_OPTIONS;
  };

  useEffect(() => {
    getTemplatePagesListing();
  }, [page, rowsPerPage]);
  useEffect(() => {
    getTemplatePagesListingBaseOnWebPage();
    return () => {
      setSearchText("");
      setPage(0);
      setRowsPerPage(50);
    };
  }, [is_website_pages]);

  const handleNavigate = () => {
    navigate(`/website-pages/add-page`);
  };

  return (
    <>
      <CustomConfirmation
        open={openModel}
        setOpen={setOpenModel}
        title_html={
          <div className="confirmation-popup-title">
            <h2>Are you sure you want to import template data?</h2>
            <p>
              Importing template data will update page content and copy other
              modules data.
            </p>
          </div>
        }
        handleAgree={handleDelete}
      />
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this page?"}
        handleAgree={handleAgreeDeletePage}
      />
      <CustomConfirmation
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        title={"Are you sure you want to change type ?"}
        handleAgree={handleChangePageAccess}
      />
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-8 col-sm-12">
            <h2>{is_website_pages ? "Pages" : "Template Pages"}</h2>
          </div>
          {is_website_pages && (
            <div className="col-lg-4 col-sm-12 text-end">
              <button
                onClick={handleNavigate}
                className="small-contained-button"
              >
                Add New Page
              </button>
            </div>
          )}
        </div>
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <CustomMUITable
            TABLE_HEAD={TABLE_HEAD}
            data={templateData}
            className="card-with-background"
            custom_search={{
              searchText: searchText,
              setSearchText: setSearchText,
              handleSubmit: searchFunction,
              onKeyDown: handleKeyDown,
            }}
            custom_pagination={{
              total_count: totalCount,
              rows_per_page: rowsPerPage,
              page: page,
              handleChangePage: handleChangePage,
              onRowsPerPageChange: handleChangeRowsPerPage,
            }}
            pageCount={pageCount}
            totalPages={totalPages}
            handleChangePages={handleChangePages}
            pagePagination={true}
          />
        )}
      </div>
    </>
  );
}
