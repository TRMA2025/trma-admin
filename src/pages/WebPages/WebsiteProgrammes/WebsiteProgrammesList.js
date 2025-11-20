import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { s3baseUrl } from "src/config/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  deleteWebsiteProgrammesApi,
  websiteProgrammesListApi,
} from "src/DAL/WebsitePages/WebsiteProgrammes";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import CustomMUITable from "src/components/CustomMUITable";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false, type: "action" },

  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "title", label: "Title", alignRight: false },
  { id: "table_avatar", label: "Image", alignRight: false, type: "thumbnail" },
  { id: "order", label: "Order", alignRight: false },
  {
    id: "status",
    label: "Status",
    type: "row_status",
  },
];

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function WebsiteProgrammesList() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [programmesData, setProgrammesData] = useState([]);
  const [moduleData, setModuleData] = useState({});
  const [pageData, setPageData] = useState({});

  const is_website_pages = window.location.pathname.includes("website-pages");
  const module_actual_name = "website_programmes";
  const getProgrammesListing = async () => {
    setIsLoading(true);
    const result = await websiteProgrammesListApi(
      params.page_id ? params.page_id : ""
    );
    if (result.code == 200) {
      let programmes = [];
      programmes = result.program.map((program) => {
        return {
          ...program,
          table_avatar: {
            src: s3baseUrl + program.program_images.thumbnail_2,
            alt: program.title,
          },
        };
      });
      setProgrammesData(programmes);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    const result = await deleteWebsiteProgrammesApi(deleteDoc.program_slug);
    if (result.code === 200) {
      // setProgrammesData((programmesData) => {
      //   return programmesData.filter((data) => data._id !== deleteDoc._id);
      // });
      getProgrammesListing();
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
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

  const handleEdit = (value) => {
    if (params.page_id) {
      if (is_website_pages) {
        navigate(
          `/website-pages/${params.page_id}/website-programmes/edit-programme/${value.program_slug}`,
          {
            state: {
              data: value,
              page_info: pageData,
            },
          }
        );
      } else {
        navigate(
          `/template-pages/${params.page_id}/website-programmes/edit-programme/${value.program_slug}`,
          {
            state: {
              data: value,
              page_info: pageData,
            },
          }
        );
      }
    } else {
      navigate(`/website-programmes/edit-programmes/${value.program_slug}`, {
        state: { data: value },
      });
    }
  };

  const handleNavigate = () => {
    if (params.page_id) {
      if (is_website_pages) {
        navigate(
          `/website-pages/${params.page_id}/website-programmes/add-programme`,
          {
            state: pageData,
          }
        );
      } else {
        navigate(
          `/template-pages/${params.page_id}/website-programmes/add-programme`,
          {
            state: pageData,
          }
        );
      }
    } else {
      navigate(`/website-programmes/add-programmes`);
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
    getProgrammesListing();
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
        title={"Are you sure you want to delete this programme?"}
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
          <div className="col-lg-6 col-sm-12">
            <h2>
              {moduleData?.list_page_heading
                ? moduleData.list_page_heading
                : "Website Programmes"}
            </h2>
          </div>
          <div className="col-lg-6 col-sm-12 text-end ">
            <button onClick={handleNavigate} className="small-contained-button">
              {moduleData?.add_button_text
                ? moduleData.add_button_text
                : "Add Website Programme"}
            </button>
          </div>
        </div>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={programmesData}
          MENU_OPTIONS={MENU_OPTIONS}
          className="card-with-background"
          pagePagination={true}
        />
      </div>
    </>
  );
}
