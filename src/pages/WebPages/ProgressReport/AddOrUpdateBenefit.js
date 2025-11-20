import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  addFaqApi,
  FaqDetailApi,
  updateFaqApi,
} from "src/DAL/WebsitePages/WebPageFaq";
import { useEffect } from "react";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import moment from "moment";
import {
  addSuccessScheduleApi,
  successScheduleDetailApi,
  updateSuccessScheduleApi,
} from "src/DAL/WebsitePages/SuccessScheduleApi";
import { s3baseUrl } from "src/config/config";
import {
  addBenefitApi,
  benefitsDetailApi,
  updateBenefitsApi,
} from "src/DAL/WebsitePages/benefitsApi";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
const Input = styled("input")({
  display: "none",
});
export default function AddOrUpdateBenefit() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { state } = useLocation();
  const [formType, setFormType] = useState("ADD");
  const { enqueueSnackbar } = useSnackbar();
  const [moduleData, setModuleData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const [file, setProfileImage] = React.useState();
  const [oldfile, setoldProfileImage] = React.useState();
  const [pageData, setPageData] = useState({});
  const [timeCk, setTimeCk] = useState("");
  const [reviewTopicCk, setReviewTopicCk] = useState("");
  const module_actual_name = "benefits";
  const [date, setDate] = React.useState(new Date());
  const [inputs, setInputs] = React.useState({
    question_statment: "",
    status: true,
    answer_statment: "",
    image: {},
  });
  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
    setoldProfileImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let postData = {};
    postData = {
      schedule_date: moment(date).format("YYYY-MM-DD"),
      benefits_description_1: timeCk,
      benefits_description_2: reviewTopicCk,
      status: inputs.status,
      created_for: "sale_page",
      page_id: params.page_id,
    };

    const formData = new FormData();
    // formData.append("schedule_date", moment(date).format("YYYY-MM-DD"));
    formData.append("benifits_description_1", timeCk);
    formData.append("benifits_description_2", reviewTopicCk);

    formData.append("status", inputs.status);
    if (file) {
      formData.append("image", inputs.image);
    }
    // formData.append("answer_statment", inputs.answer_statment);
    if (params && params.page_id) {
      formData.append("created_for", "sale_page");
      formData.append("page_id", params.page_id);
    } else {
      formData.append("created_for", "general");
    }

    if (formType === "EDIT") {
      formData.append("order", inputs.order);
    }
    console.log(...formData, "formData");
    const result =
      formType == "ADD"
        ? await addBenefitApi(formData)
        : await updateBenefitsApi(formData, params?.benefits_id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setDate(newValue);
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

  const getFaqDetailData = async () => {
    setIsLoading(true);
    const result = await benefitsDetailApi(params.success_id);
    if (result.code == 200) {
      setFormType("EDIT");
      setInputs(result.success_schedule);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handlePageDetail = (data) => {
    setPageData(data);
    const get_module_info = data?.module_info?.filter(
      (item) => item.module_actual_name == module_actual_name
    )[0];
    setModuleData(get_module_info?.module_replica_info);
  };

  useEffect(() => {
    if (params && params.benefits_id) {
      if (state) {
        if (params?.page_id) {
          handlePageDetail(state.page_info);
        }

        setInputs(state?.data);
        setTimeCk(state?.data?.benifits_description_1);
        setReviewTopicCk(state?.data?.benifits_description_2);
        setoldProfileImage(state?.data?.image?.src);
        setFormType("EDIT");
      } else {
        getFaqDetailData();
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
  console.log(state, "statestatestate");

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
              <h2>{`${formType === "ADD" ? "Add" : "Edit"} Benefits`}</h2>
            )}
          </h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Date"
                inputFormat="dd-MM-yyyy"
                value={date}
                onChange={handleChangeDate}
                minDate={moment().toDate()}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </LocalizationProvider>
          </div> */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              fullWidth
              required
              name="benifits_description_1"
              value={timeCk}
              onChange={(e) => setTimeCk(e.target.value)}
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
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Image </p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {oldfile ? (
                  <img className="image-border" src={oldfile} height="50" />
                ) : (
                  file && (
                    <img className="image-border" src={file} height="50" />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="image"
                    onChange={fileChangedHandler}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.image?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.image?.name}</p>
            )}
          </div>
          {/* <div className="col-12 mt-5">
            <h4>Time *</h4>
            <TinyEditor
              setDetailDescription={setTimeCk}
              detailDescriptionCk={timeCk}
              editorHeight={300}
            />
          </div> */}
          <div className="col-12 mt-5">
            <h4>Description *</h4>
            <TinyEditor
              setDetailDescription={setReviewTopicCk}
              detailDescriptionCk={reviewTopicCk}
              editorHeight={300}
            />
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
