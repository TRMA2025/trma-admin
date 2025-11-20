import React, { useState, useEffect } from "react";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Button,
  CircularProgress,
  IconButton,
  Input,
  TextField,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Select from "@mui/material/Select";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  editWebsiteEvent,
  WebsiteEventDetail,
} from "src/DAL/WebsitePages/websitepages";
import { makeStyles } from "@mui/styles";
import { s3baseUrl } from "src/config/config";
import TinyEditor from "src/components/ckeditor/Ckeditor";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const EditWebPageEvent = () => {
  const classes = useStyles();
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setProfileImage] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [oldImage, setOldImage] = useState("");
  const [shortDescriptionCk, setShortDescriptionCk] = useState("");
  const params = useParams();
  const [inputs, setInputs] = useState({
    title: "",
    email_subject: "",
    email_body_heading: "",
    button_link: "",
    button_text: "",
    short_description: "",
    status: "",
    image: {},
    order: "",
    is_event_popup: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  const getEventDetailData = async () => {
    const result = await WebsiteEventDetail(params.id);
    const { images, description } = result.home_event;
    console.log(result, "okoko");
    setOldImage(images.thumbnail_1);
    setDate(result?.home_event?.event_start_date);
    setEndDate(result?.home_event?.event_end_date);
    setInputs({
      ...result.home_event,
      ["image"]: images?.thumbnail_1,
    });
    setShortDescriptionCk(description);
    setIsLoading(false);
  };

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setDate(dateType);
  };

  const handleChangeEndDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setEndDate(todayDate);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (inputs.short_description?.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
      setIsLoading(false);
    } else {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("button_text", inputs.button_text);
      formData.append("button_link", inputs.button_link);
      // formData.append("event_type", inputs.event_type);
      formData.append("description", shortDescriptionCk);
      formData.append("status", inputs.status);
      formData.append("order", inputs.order);
      formData.append("is_event_popup", inputs.is_event_popup);
      formData.append("event_start_date", date);
      formData.append("event_end_date", endDate);
      if (inputs.is_event_popup == true || inputs.is_event_popup == "true") {
        formData.append("email_body_heading", inputs.email_body_heading);
        formData.append("email_subject", inputs.email_subject);
      }
      formData.append("event_start_date", date);
      formData.append("event_end_date", endDate);
      if (params && params.page_id) {
        formData.append("created_for", "sale_page");
        formData.append("page_id", params.page_id);
      } else if (params && params.event_id) {
        formData.append("created_for", "event");
        formData.append("event_id", params.event_id);
      } else {
        formData.append("created_for", "general");
      }

      if (file) {
        formData.append("image", inputs.image);
      }
      console.log(...formData, "formData");

      const result = await editWebsiteEvent(formData, params.id);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getEventDetailData();
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
      <div className="row">
        <div className="col-6">
          <h2>Edit Event</h2>
        </div>
      </div>
      <form method="post" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              fullWidth
              required
              name="title"
              value={inputs.title}
              onChange={handleChange}
            />
          </div>
          {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="event_type">Event Type *</InputLabel>
              <Select
                labelId="event_type"
                id="demo-simple-select"
                name="event_type"
                value={inputs.event_type}
                label="Event Type"
                required
                onChange={handleChange}
              >
                <MenuItem value="current">Current Event</MenuItem>
                <MenuItem value="upcoming">Upcoming Event</MenuItem>
              </Select>
            </FormControl>
          </div> */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Text"
              variant="outlined"
              fullWidth
              name="button_text"
              value={inputs.button_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Link"
              variant="outlined"
              fullWidth
              name="button_link"
              value={inputs.button_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Order"
              variant="outlined"
              fullWidth
              name="order"
              value={inputs.order}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Event Start Date"
                  // inputFormat="dd/MM/yyyy"
                  inputFormat="yyyy/MM/dd"
                  value={date}
                  onChange={handleChangeDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Event End Date"
                  // inputFormat="dd/MM/yyyy"
                  inputFormat="yyyy/MM/dd"
                  value={endDate}
                  onChange={handleChangeEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                value={inputs.status}
                label="Status"
                required
                onChange={handleChange}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Is Event Popup*
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="is_event_popup"
                value={inputs.is_event_popup}
                label="Is Event Popup"
                required
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          {(inputs.is_event_popup == true ||
            inputs.is_event_popup == "true") && (
            <>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Email Body Heading"
                  variant="outlined"
                  fullWidth
                  required
                  name="email_body_heading"
                  value={inputs.email_body_heading}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Email Subject"
                  variant="outlined"
                  fullWidth
                  name="email_subject"
                  value={inputs.email_subject}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Image *</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {file ? (
                  <img className="image-border" src={file} height="50" />
                ) : (
                  <img
                    className="image-border"
                    src={s3baseUrl + oldImage}
                    height="50"
                  />
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
                    hidden
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
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Short Description "
                multiline
                rows={6}
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
              <FormHelperText>Maximum limit 500 characters</FormHelperText>
            </FormControl>
          </div>{" "} */}
          <div className="col-12 mt-4">
            <h4>Short Description </h4>
            <TinyEditor
              setDetailDescription={setShortDescriptionCk}
              detailDescriptionCk={shortDescriptionCk}
            />
          </div>
          <div className="text-end mt-4">
            <button className="small-contained-button">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditWebPageEvent;
