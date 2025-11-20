import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { s3baseUrl } from "src/config/config";
import {
  add_general_event_api,
  general_event_detail_api,
  update_general_event_api,
} from "src/DAL/DynamiteEvents/GeneralEvents/GeneralEvents";
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

export default function AddOrUpdateGeneralEvents() {
  const navigate = useNavigate();
  const { event_slug, dynamite_event_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("ADD");

  const [images, setImages] = useState({
    image: "",
  });

  const [oldImages, setOldImages] = useState({
    image: "",
  });

  const [inputs, setInputs] = useState({
    title: "",
    status: true,
    image: {},
    order: 0,
    button_text: "",
    button_link: "",
    event_type: "current",
    description: "",
  });

  const getEventDetail = async () => {
    setIsLoading(true);
    const result = await general_event_detail_api(event_slug);
    if (result.code === 200) {
      handleFormat(result.home_event);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const fileChangedHandler = (e) => {
    const { name, files } = e.target;

    setImages({
      ...images,
      [name]: URL.createObjectURL(files[0]),
    });

    setInputs({
      ...inputs,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("status", inputs.status);
    formData.append("button_text", inputs.button_text);
    formData.append("button_link", inputs.button_link);
    formData.append("event_type", inputs.event_type);
    formData.append("description", inputs.description);
    formData.append("created_for", "event");

    formData.append(
      "event_id",
      dynamite_event_id ? dynamite_event_id : inputs.dynamite_event // if Form Type is ADD use dynamite_event from params otherwise use from detail data
    );

    if (formType == "EDIT") {
      // if Form Type is EDIT order is required && image is optional
      formData.append("order", inputs.order);
      if (images.image) {
        formData.append("image", inputs.image);
      }
    } else {
      // if Form Type is ADD image is reqired
      formData.append("image", inputs.image);
    }

    const result =
      formType == "ADD"
        ? await add_general_event_api(formData)
        : await update_general_event_api(formData, event_slug);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      handleNavigate();
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

  const handleFormat = (data) => {
    setInputs(data);
    setFormType("EDIT");
    setOldImages({
      ...oldImages,
      ["image"]: data.images.thumbnail_2,
    });
    setIsLoading(false);
  };

  const handleNavigate = () => {
    if (formType == "ADD") {
      navigate(`/dynamite-events/${dynamite_event_id}/general-events`);
    } else {
      navigate(`/dynamite-events/${inputs.dynamite_event}/general-events`);
    }
  };

  useEffect(() => {
    if (event_slug) {
      if (state) {
        handleFormat(state);
      } else {
        getEventDetail();
      }
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
            onClick={handleNavigate}
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
          <h2>{`${formType == "ADD" ? "Add" : "Edit"} Event`}</h2>
        </div>
      </div>
      <form className="row" onSubmit={handleSubmit}>
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
          <FormControl fullWidth required>
            <InputLabel id="event_type">Event Type </InputLabel>
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
        </div>
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
        {formType == "EDIT" && (
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
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="status"
              value={inputs.status}
              label="Status"
              onChange={handleChange}
              required
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
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
              {(images.image || oldImages.image) && (
                <img
                  className="image-border"
                  src={
                    images.image ? images.image : s3baseUrl + oldImages.image
                  }
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
        <div className="col-12 mt-4">
          <h4>Detailed Description </h4>
          <GeneralCkeditor
            setInputs={setInputs}
            inputs={inputs}
            name="description"
            editorHeight={320}
          />
        </div>
        <div className="text-end mt-4">
          <button className="small-contained-button">
            {formType == "ADD" ? "Submit" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
