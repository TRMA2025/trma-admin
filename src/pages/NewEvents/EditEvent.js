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
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import {
  addWebsiteEvent,
  editWebsiteEvent,
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
const EditEvent = () => {
  const classes = useStyles();
  const [date, setDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [file, setProfileImage] = React.useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [oldImage, setOldImage] = useState("");
  const [shortDescriptionCk, setShortDescriptionCk] = useState("");
  const { state } = useLocation();

  const [inputs, setInputs] = useState({
    title: "",
    buttonLink: "",
    buttonText: "",
    short_description: "",
    status: "",
    image: {},
    order: "",
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

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    //console.log(todayDate, "todayDatetodayDatetodayDate");
    setDate(dateType);
  };
  //console.log(date, "dateeeee");
  const handleChangeEndDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    //console.log(typeof dateType, "dateType");
    setEndDate(todayDate);
  };
  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };
  const handleSubmit = async (e) => {
    // console.log(detailDescriptionCk, "lolololo");
    e.preventDefault();
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
    } else {
      if (urlPatternValidation(inputs.buttonLink) === false) {
        enqueueSnackbar("Enter Valid Video URL", { variant: "error" });
      } else {
        const formData = new FormData();
        formData.append("title", inputs.title);
        formData.append("button_text", inputs.buttonText);
        formData.append("button_link", inputs.buttonLink);
        formData.append("description", inputs.short_description);
        formData.append("status", inputs.status);
        formData.append("event_start_date", date);
        formData.append("event_end_date", endDate);
        if (file) {
          formData.append("image", inputs.image);
        }

        // formData.append("recording_date", moment(date).format("YYYY-MM-DD"));
        // formData.append("vault_category_slug", vaultName);
        // formData.append("is_program_show_on_list", inputs.video_show_Status);
        //console.log(...formData, "formData");

        setIsLoading(true);
        const result = await editWebsiteEvent(formData, state.slug);
        if (result.code === 200) {
          //console.log(result, "result");
          enqueueSnackbar(result.message, { variant: "success" });
          navigate(-1);
        } else {
          //console.log(result, "error case");
          enqueueSnackbar(result.message, { variant: "error" });
          setIsLoading(false);
        }
      }
    }
  };
  const {
    button_link,
    button_text,
    description,
    event_end_date,
    event_start_date,
    images,
    order,
    status,
    title,
  } = state.object;
  useEffect(() => {
    setDate(event_start_date);
    setEndDate(event_end_date);
    setOldImage(images.thumbnail_1);
    setShortDescriptionCk(description);
    setInputs({
      ...inputs,
      ["title"]: title,
      ["buttonLink"]: button_link,
      ["buttonText"]: button_text,
      ["short_description"]: description,
      ["status"]: status,
      ["image"]: images.thumbnail_1,
      ["order"]: order,
    });
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
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Edit Event</h2>
        </div>
      </div>
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
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Button Text"
            variant="outlined"
            fullWidth
            name="buttonText"
            value={inputs.buttonText}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Button Link"
            variant="outlined"
            fullWidth
            name="buttonLink"
            value={inputs.buttonLink}
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
        <div className="col-12 mt-5">
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
          </FormControl>
        </div>{" "}
        <div className="col-12 mt-4">
          <h4>Short Description </h4>
          <TinyEditor
            setDetailDescription={setShortDescriptionCk}
            detailDescriptionCk={shortDescriptionCk}
          />
        </div>
        <div className="text-end mt-4">
          <button onClick={handleSubmit} className="small-contained-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
