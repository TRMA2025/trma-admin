import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IconButton,
  CircularProgress,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@mui/material";
import { s3baseUrl } from "src/config/config";
import { useEffect } from "react";
import { updateThanksSettingApi } from "src/DAL/ClientSetting/ClientSetting";
import { detailContentPageApi } from "src/DAL/WebsitePages/websitepages";
import {
  dynamite_event_detail_api,
  update_dynamite_lock_content_event_api,
  update_event_config_api,
} from "src/DAL/DynamiteEvents/DynamiteEvents";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import GeneralCkeditor from "src/components/GeneralCkeditor";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function EventConfiguration() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [logo, setLogo] = useState();
  const [oldLogo, setOldLogo] = useState("");

  const [inputs, setInputs] = useState({
    button_text: "",
    button_link: "",
    title: "",
    show_for: "",
    is_enable: false,
    date: new Date(),
    time: "00:00",
    event_logo: {},
  });

  const getDetail = async () => {
    setIsLoading(true);
    const result = await dynamite_event_detail_api(params.event_id);
    if (result.code == 200) {
      if (result?.dynamite_event?.event_timer_configration) {
        setInputs({
          ...inputs,
          ["date"]:
            result?.dynamite_event?.event_timer_configration?.event_date,
          ["time"]:
            result?.dynamite_event?.event_timer_configration?.event_time,
          ["event_logo"]:
            result?.dynamite_event?.event_timer_configration?.event_logo,
        });
        setOldLogo(
          s3baseUrl +
            result?.dynamite_event?.event_timer_configration?.event_logo
        );
      }

      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangeDate = (name, value) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        ["date"]: value,
      };
    });
  };
  const handleChangeTime = (event) => {
    const { name, value } = event.target;

    setInputs((prevState) => {
      return {
        ...prevState,
        ["time"]: value,
      };
    });
  };
  const fileChangedHandlerFB = async (e) => {
    setLogo(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "300");
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs((input) => ({
        ...input,
        ["event_logo"]: imageUpload.image_path,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    let postData = {
      title: inputs.title,
      button_text: inputs.button_text,
      button_link: inputs.button_link,
      event_date: inputs.date,
      event_time: inputs.time,
      is_enable: inputs.is_enable,
      show_for: inputs.show_for,
      event_logo: inputs.event_logo,
    };
    let timeConfig = {
      event_timer_configration: postData,
    };

    const result = await update_event_config_api(timeConfig, params.event_id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoadingForm(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingForm(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    if (state == null || state == "" || state == undefined) {
      getDetail();
    } else if (state?.event_timer_configration) {
      setOldLogo(state?.event_timer_configration?.event_logo);
      setInputs({
        ...inputs,
        ["date"]: state?.event_timer_configration?.event_date,
        ["time"]: state?.event_timer_configration?.event_time,
        ["button_text"]: state?.event_timer_configration?.button_text,
        ["button_link"]: state?.event_timer_configration?.button_link,
        ["title"]: state?.event_timer_configration?.title,
        ["is_enable"]: state?.event_timer_configration?.is_enable,
        ["show_for"]: state?.event_timer_configration?.show_for,
      });
    } else {
    }
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <h2>Event Timer Configuration</h2>
          </div>
          {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              fullWidth
              name="title"
              value={inputs?.title}
              onChange={handleChange}
            />
          </div> */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Is Enable</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="is_enable"
                value={inputs?.is_enable}
                label="Is Enable"
                onChange={handleChange}
                required
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Show For</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="show_for"
                value={inputs?.show_for}
                label="Show For"
                onChange={handleChange}
                required
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Text"
              variant="outlined"
              fullWidth
              name="button_text"
              value={inputs?.button_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Link"
              variant="outlined"
              fullWidth
              type="url"
              name="button_link"
              value={inputs?.button_link}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                name="startDate"
                inputFormat="dd-MM-yyyy"
                // minDate={startDateMin}
                value={inputs.date}
                onChange={(e) => {
                  handleChangeDate("start_date", e);
                }}
                format="YYYY-MM-DD"
                renderInput={(params) => (
                  <TextField {...params} className="inputs-fields" fullWidth />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4 ">
            <TextField
              variant="outlined"
              id="time"
              label="Time"
              type="time"
              className="inputs-fields"
              name="start_time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={inputs.time}
              onChange={(e) => handleChangeTime(e)}
            />
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Event Timer Icon</p>
                <FormHelperText className="pt-0">
                  (Recommended Size 1000 X 250)
                </FormHelperText>
              </div>
              <div className="col-2">
                {logo ? (
                  <img className="image-border" src={logo} height="50" />
                ) : (
                  oldLogo && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldLogo}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-button-fileFb">
                  <Input
                    accept="image/*"
                    id="contained-button-fileFb"
                    multiple
                    type="file"
                    name="InvoiceImage"
                    onChange={fileChangedHandlerFB}
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
            {inputs?.logo?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.logo?.name}</p>
            )}
          </div>
          <div className="col-12 mt-5">
            <h4>Description</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="title"
              editorHeight={320}
            />
          </div>

          <div className="text-end mt-4" id="fixedbutton">
            <button className="small-contained-button" disabled={isLoadingForm}>
              {isLoadingForm ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
