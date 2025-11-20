import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { consultantListing } from "src/DAL/consultant/consultant";
import { templateAccessListApi } from "src/DAL/WebsitePages/templateConfig";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import { client_Url } from "src/config/config";
import { detailPageApi } from "src/DAL/WebsitePages/websitepages";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ManageConsultantAccess() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [consultantData, setConsultantData] = useState([]);
  const [pagetitle, setPagetitle] = useState("");
  const [selected, setSelected] = useState([]);
  const classes = useStyles();
  const { state } = useLocation();

  const get_page_detail = async () => {
    const result = await detailPageApi(params.page_slug);
    if (result.code == 200) {
      if (result.sale_page?.consultant) {
        setSelected(result.sale_page.consultant);
      }
      setPagetitle(result.sale_page.sale_page_title);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const TABLE_HEAD = [
    { id: "name", label: " Name", alignRight: false },
    { id: "email", label: "Email", alignRight: false },
    {
      id: "affiliate_link_data",
      label: "Referral ID",
      type: "link",
      alignRight: false,
      className: "show_link_color",
    },
    {
      id: "team_type",
      label: "Type",
      alignRight: false,
      className: "text-capitalize",
    },
    {
      id: "consultant_status",
      label: "Status",
      type: "row_status",
      alignRight: false,
    },
  ];

  const getConsultantListing = async () => {
    const result = await consultantListing();
    if (result.code == 200) {
      let consultant_array = [];
      result.consultant_list.map((consultant) => {
        consultant_array.push({
          ...consultant,
          id: consultant?._id,
          name: consultant?.first_name + " " + consultant?.last_name,
          consultant_status: consultant?.status,
          affiliate_link_data: {
            to: client_Url + consultant?.affiliate_info?.affiliate_url_name,
            target: "_blank",
            show_text: consultant?.affiliate_info?.affiliate_url_name,
            show_alternate_text: "No Referral User",
          },
        });
      });
      setConsultantData(consultant_array);
      if (state) {
        setIsLoading(false);
      } else {
        get_page_detail();
      }
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let selectedConsultant = [];
    selected.map((consultant) => {
      selectedConsultant.push({
        _id: consultant._id,
      });
    });

    let consultants = {
      consultant: selectedConsultant,
    };

    const result = await templateAccessListApi(params.page_slug, consultants);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/template-pages`);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      setSelected(state.consultant);
      setPagetitle(state.sale_page_title);
    }
    getConsultantListing();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex  mb-4">
        <div className="col-12">
          <IconButton
            className="back-screen-button"
            onClick={() => navigate(`/template-pages`)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          <span className="sale-page-title">{pagetitle}</span>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-6">
          <h2>Delegates</h2>
        </div>
      </div>
      <CustomMUITable
        TABLE_HEAD={TABLE_HEAD}
        data={consultantData}
        selected={selected}
        setSelected={setSelected}
        checkbox_selection={true}
      />
      <div className="ms-auto text-end">
        <button
          className="small-contained-button mt-3 ml-auto"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
