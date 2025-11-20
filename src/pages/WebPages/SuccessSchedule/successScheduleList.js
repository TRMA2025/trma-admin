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
import {
  deleteSuccessScheduleApi,
  getSuccessScheduleListApi,
} from "src/DAL/WebsitePages/SuccessScheduleApi";
import { s3baseUrl } from "src/config/config";
import CustomMUITable from "src/components/CustomMUITable";

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "schedule_date", label: "Date", alignRight: false },
  {
    id: "image",
    label: "Image",
    alignRight: false,
    type: "thumbnail",
  },
  {
    id: "schedule_description_1",
    label: "Time",
    alignRight: false,
    type: "html",
  },
  {
    id: "schedule_description_2",
    label: "Review Topic",
    alignRight: false,
    type: "html",
  },
  { id: "order", label: "Order", alignRight: false },
  { id: "status", label: "Status", alignRight: false, type: "row_status" },
  { id: "action", label: "Action", alignRight: false, type: "action" },
];

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function SuccessScheduleList() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const [successList, setSuccessList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [moduleData, setModuleData] = useState({});
  const [pageData, setPageData] = useState({});

  const is_website_pages = window.location.pathname.includes("website-pages");
  const module_actual_name = "success_schedule";

  const getWebPageFaqs = async () => {
    setIsLoading(true);
    const result = await getSuccessScheduleListApi(
      params.page_id ? params.page_id : ""
    );
    if (result.code === 200) {
      const scuduleList = result.success_schedule.map((list, index) => {
        console.log(list);
        return {
          ...list,
          image: {
            src: s3baseUrl + list.success_image.thumbnail_1,
            alt: "title",
          },
          // name: category.first_name + " " + category.last_name,
        };
      });
      setSuccessList(scuduleList);
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
          `/website-pages/${params.page_id}/edit-success-schedule/${value._id}`,
          {
            state: {
              data: value,
              page_info: pageData,
            },
          }
        );
      } else {
        navigate(
          `/template-pages/${params.page_id}/edit-success-schedule/${value._id}`,
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
    const result = await deleteSuccessScheduleApi(deleteDoc._id);
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
        navigate(`/website-pages/${params.page_id}/add-success-schedule`, {
          state: pageData,
        });
      } else {
        navigate(`/template-pages/${params.page_id}/add-success-schedule`, {
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
      setModuleData(get_module_info?.module_replica_info);
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
    setModuleData(get_module_info?.module_replica_info);
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
                : "Success Schedule"}
            </h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button onClick={handleNavigate} className="small-contained-button">
              {moduleData?.add_button_text
                ? moduleData.add_button_text
                : "Add Success Schedule"}
            </button>
          </div>
        </div>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={successList}
          MENU_OPTIONS={MENU_OPTIONS}
          className="card-with-background"
        />
      </div>
    </>
  );
}
