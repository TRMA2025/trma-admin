import * as React from "react";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { manage_module_acceess_api } from "src/DAL/WebsitePages/templateConfig";
import { detailPageApi } from "src/DAL/WebsitePages/websitepages";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ManageModuleAccess() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [manageAcceess, setManageAcceess] = React.useState([]);
  const [selected, setSelected] = useState([]);
  const [pagetitle, setPagetitle] = useState("");

  const get_page_detail = async () => {
    setIsLoading(true);
    const result = await detailPageApi(params.page_slug);
    if (result.code == 200) {
      formatData(result.sale_page.module_info);
      setPagetitle(result.sale_page.sale_page_title);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const formatData = (data) => {
    setManageAcceess(data);

    let selected_array = [];
    data.map((item) => {
      if (item.is_access) {
        selected_array.push(item);
      }
    });
    setSelected(selected_array);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let manage_cceess_array = manageAcceess.map((item) => {
      let is_selected = selected.some(
        (object) => item.module_actual_name === object.module_actual_name
      );
      if (is_selected) {
        return {
          ...item,
          is_access: true,
        };
      } else {
        return { ...item, is_access: false };
      }
    });

    const formData = {
      module_info: manage_cceess_array,
    };

    const result = await manage_module_acceess_api(params.page_slug, formData);
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
      formatData(state.module_info);
      setPagetitle(state.sale_page_title);
    } else {
      get_page_detail();
    }
  }, []);

  const TABLE_HEAD = [
    { id: "module_label_text", label: "All Modules", alignRight: false },
  ];

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex mb-4">
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
          <h2>Manage Modules Access</h2>
        </div>
      </div>
      <CustomMUITable
        TABLE_HEAD={TABLE_HEAD}
        data={manageAcceess}
        selected={selected}
        setSelected={setSelected}
        checkbox_selection={true}
        selected_by="module_actual_name"
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
