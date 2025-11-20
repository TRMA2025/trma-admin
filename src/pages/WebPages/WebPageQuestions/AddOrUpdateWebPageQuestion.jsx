import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import {
  add_website_question_api,
  update_website_question_api,
  website_question_detail_api,
} from "src/DAL/WebsitePages/WebPageQuestion";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function AddOrUpdateWebPageQuestion() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { state } = useLocation();
  const [formType, setFormType] = useState("ADD");
  const { enqueueSnackbar } = useSnackbar();
  const [moduleData, setModuleData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const [pageData, setPageData] = useState({});
  const module_actual_name = "website_questions";
  const [inputs, setInputs] = React.useState({
    question_statment: "",
    status: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = {
      question_statment: inputs.question_statment,
      status: inputs.status,
    };
    if (params && params.page_id) {
      formData.created_for = "sale_page";
      formData.page_id = params.page_id;
    } else {
      formData.created_for = "general";
    }

    if (formType === "EDIT") {
      formData.order = inputs.order;
    }

    const result =
      formType == "ADD"
        ? await add_website_question_api(formData)
        : await update_website_question_api(formData, params.question_id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const getPageDetail = async () => {
    const result = await page_detail_by_id(params.page_id);
    if (result.code == 200) {
      handlePageDetail(result.sale_page);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const getQuestionDetailData = async () => {
    setIsLoading(true);
    const result = await website_question_detail_api(params.question_id);
    if (result.code == 200) {
      setFormType("EDIT");
      setInputs(result.question);
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
    if (params && params.question_id) {
      if (state) {
        if (params.page_id) {
          handlePageDetail(state.page_info);
        }
        setInputs(state.data);
        setFormType("EDIT");
      } else {
        getQuestionDetailData();
        if (params.page_id) {
          getPageDetail();
        }
      }
    } else {
      if (params.page_id) {
        if (state) {
          handlePageDetail(state);
        } else {
          getPageDetail();
        }
      }
    }
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
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
          <span className="sale-page-title">{pageData.sale_page_title}</span>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2>
            {moduleData?.add_page_heading ? (
              <h2>
                {formType === "ADD"
                  ? moduleData.add_page_heading
                  : moduleData.edit_page_heading}
              </h2>
            ) : (
              <h2>{`${formType === "ADD" ? "Add" : "Edit"} Question`}</h2>
            )}
          </h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Statement"
              variant="outlined"
              fullWidth
              required
              name="question_statment"
              value={inputs.question_statment}
              onChange={handleChange}
            />
          </div>
          {formType !== "ADD" && (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Order"
                variant="outlined"
                fullWidth
                required
                name="order"
                value={inputs.order}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Status </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                value={inputs.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="text-end mt-4">
            <button className="small-contained-button">
              {formType == "ADD" ? "Submit" : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
