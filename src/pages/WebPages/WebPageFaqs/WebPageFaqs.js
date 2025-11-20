import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { deleteFaqApi, getFaqListApi } from "src/DAL/WebsitePages/WebPageFaq";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import CustomMUITable from "src/components/CustomMUITable";

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "question_statment", label: " Question", alignRight: false },
  { id: "status", label: "Status", alignRight: false, type: "row_status" },
  { id: "order", label: "Order", alignRight: false },
  { id: "action", label: "Action", alignRight: false, type: "action" },
];

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function WebPageFaqs() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const [faqList, setFaqList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [moduleData, setModuleData] = useState({});
  const [pageData, setPageData] = useState({});

  const is_website_pages = window.location.pathname.includes("website-pages");
  const module_actual_name = "website_faq";

  const getWebPageFaqs = async () => {
    setIsLoading(true);
    const result = await getFaqListApi(params.page_id ? params.page_id : "");
    if (result.code === 200) {
      setFaqList(result.faq);
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
          `/website-pages/${params.page_id}/website-faq/edit-faq/${value._id}`,
          {
            state: {
              data: value,
              page_info: pageData,
            },
          }
        );
      } else {
        navigate(
          `/template-pages/${params.page_id}/website-faq/edit-faq/${value._id}`,
          {
            state: {
              data: value,
              page_info: pageData,
            },
          }
        );
      }
    } else {
      navigate(`/website-faq/edit-faq/${value._id}`, {
        state: { data: value },
      });
    }
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteFaqApi(deleteDoc._id);
    if (result.code === 200) {
      getWebPageFaqs();
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    if (params.page_id) {
      if (is_website_pages) {
        navigate(`/website-pages/${params.page_id}/website-faq/add-faq`, {
          state: pageData,
        });
      } else {
        navigate(`/template-pages/${params.page_id}/website-faq/add-faq`, {
          state: pageData,
        });
      }
    } else {
      navigate(`/website-faq/add-faq`);
    }
  };

  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await page_detail_by_id(params.page_id);
    if (result.code == 200) {
      const get_module_info = result.sale_page.module_info.filter(
        (item) => item.module_actual_name == module_actual_name
      )[0];
      setModuleData(get_module_info.module_replica_info);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handlePageDetail = (data) => {
    setPageData(data);
    const get_module_info = data.module_info.filter(
      (item) => item.module_actual_name == module_actual_name
    )[0];
    setModuleData(get_module_info.module_replica_info);
  };

  useEffect(() => {
    getWebPageFaqs();
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
  ];

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
        {params.page_id && (
          <div className="row">
            <div className="col-12 display-flex mb-4">
              <IconButton
                className="back-screen-button"
                onClick={() => navigate(-1)}
              >
                <ArrowBackIcon
                  className="arrow-back-icon"
                  style={{ color: "#fff !important", fill: "#fff !important" }}
                />{" "}
              </IconButton>
              <span className="sale-page-title">
                {pageData.sale_page_title}
              </span>
            </div>
          </div>
        )}
        <div className="row mb-5">
          <div className="col-lg-8 col-sm-12">
            <h2>
              {moduleData?.list_page_heading
                ? moduleData.list_page_heading
                : "FAQ'S"}
            </h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              {moduleData?.add_button_text
                ? moduleData.add_button_text
                : "Add FAQ"}
            </button>
          </div>
        </div>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={faqList}
          MENU_OPTIONS={MENU_OPTIONS}
          className="card-with-background"
        />
      </div>
    </>
  );
}
