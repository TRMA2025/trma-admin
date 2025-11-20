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
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { s3baseUrl } from "src/config/config";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import moment from "moment";
import {
  add_dynamite_event_api,
  dynamite_event_detail_api,
  update_dynamite_event_api,
} from "src/DAL/DynamiteEvents/DynamiteEvents";
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

export default function AddOrUpdateDynamiteEvent() {
  const navigate = useNavigate();
  const { event_slug } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("ADD");
  const [startDate, setStartDate] = useState(null);
  // const [startDate, setStartDate] = useState(new Date());
  console.log(event_slug, "event slug value ............");

  const [images, setImages] = useState({
    image: "",
    link_image: "",
    event_logo: "",
    banner1_image: "",
    banner2_image: "",
  });

  const [oldImages, setOldImages] = useState({
    image: "",
    link_image: "",
    event_logo: "",
    banner1_image: "",
    banner2_image: "",
  });

  const [inputs, setInputs] = useState({
    title: "",
    status: true,
    is_show_on_list: true,
    is_purchase_link: false,
    image: {},
    link_image: {},
    event_logo: {},
    banner1_image: {},
    banner2_image: {},
    video_url: "",
    short_description: "",
    no_of_days: 1,
    order: 0,
    banner1_link: "",
    banner2_link: "",
    top_text: "",
    bottom_text: "",
    detail_description: "",
  });

  const getEventDetail = async () => {
    setIsLoading(true);
    const result = await dynamite_event_detail_api(event_slug);
    if (result.code === 200) {
      handleFormat(result.dynamite_event);
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
    if (formType == "ADD" && !images.image) {
      enqueueSnackbar("image is required", { variant: "error" });
      return;
    }
    if (formType == "ADD" && !images.event_logo) {
      enqueueSnackbar("event_logo is required", { variant: "error" });
      return;
    }

    if (formType == "ADD" && !inputs.detail_description) {
      enqueueSnackbar("detail_description is required", { variant: "error" });
      return;
    }

    setIsLoading(true);
    const formatDate = new Date(startDate);
    const year = formatDate.getFullYear();
    const month = String(formatDate.getMonth() + 1).padStart(2, "0");
    const day = String(formatDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("video_url", inputs.video_url);
    formData.append("short_description", inputs.short_description);
    formData.append("no_of_days", inputs.no_of_days);
    formData.append("start_date", formattedDate);
    // formData.append("start_date", moment(startDate).format("YYYY-MM-DD"));
    formData.append("detail_description", inputs.detail_description);
    formData.append("banner2_link", inputs.banner2_link);
    formData.append("banner1_link", inputs.banner1_link);
    formData.append("top_text", inputs.top_text);
    formData.append("bottom_text", inputs.bottom_text);
    formData.append("status", inputs.status);
    formData.append("is_purchase_link", inputs.is_purchase_link);
    formData.append("is_show_on_list", inputs.is_show_on_list);

    //banner1_image is optional
    if (images.banner1_image) {
      formData.append("banner1_image", inputs.banner1_image);
    }
    //banner2_image is optional
    if (images.banner2_image) {
      formData.append("banner2_image", inputs.banner2_image);
    }
    //event_logo is optional
    if (images.event_logo) {
      formData.append("event_logo", inputs.event_logo);
    }

    if (formType == "EDIT") {
      // if Form Type is EDIT order is required && image is optional
      formData.append("order", inputs.order);
      if (images.image) {
        formData.append("image", inputs.image);
      }

      if (inputs.is_purchase_link == true) {
        // if is_purchase_link link is required && link_image is optional
        formData.append("link", inputs.link);
        if (images.link_image) {
          formData.append("link_image", inputs.link_image);
        }
      }
    } else {
      // if Form Type is ADD image is reqired
      formData.append("image", inputs.image);

      // if is_purchase_link link && link_image is required
      if (inputs.is_purchase_link == true) {
        formData.append("link_image", inputs.link_image);
        formData.append("link", inputs.link);
      }
    }

    const result =
      formType == "ADD"
        ? await add_dynamite_event_api(formData)
        : await update_dynamite_event_api(formData, event_slug);
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
    // setStartDate(data.start_date);
    const dateString = data.start_date;
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    const dateObject = new Date(year, month, day);
    setStartDate(dateObject);

    setOldImages({
      ...oldImages,
      ["image"]: data?.images?.thumbnail_2,
      ["event_logo"]: data.event_logo.thumbnail_1,
      ["banner1_image"]: data?.banner1_image?.thumbnail_1,
      ["banner2_image"]: data?.banner2_image?.thumbnail_1,
      ["link_image"]: data.link_image,
    });
    setIsLoading(false);
  };

  const handleNavigate = () => {
    navigate(`/dynamite-events`);
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
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Event Title"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={inputs.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Event Start Date"
                    value={startDate}
                    inputFormat="dd-MM-yyyy"
                    required
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth required />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Is Show On List
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_show_on_list"
                    value={inputs.is_show_on_list}
                    label="Is Show On List"
                    required
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  required
                  id="outlined-basic"
                  label="No Of Days"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="no_of_days"
                  value={inputs.no_of_days}
                  onChange={handleChange}
                  onWheel={(event) => event.target.blur()}
                />
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Top Section Text"
            variant="outlined"
            fullWidth
            name="top_text"
            value={inputs.top_text}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Bottom Section Text"
            variant="outlined"
            fullWidth
            name="bottom_text"
            value={inputs.bottom_text}
            onChange={handleChange}
          />
        </div> */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Banner 1 Link"
                  variant="outlined"
                  fullWidth
                  name="banner1_link"
                  value={inputs.banner1_link}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Banner 2 Link"
                  variant="outlined"
                  fullWidth
                  name="banner2_link"
                  value={inputs.banner2_link}
                  onChange={handleChange}
                />
              </div>
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

              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">
              Is Purchase Link Enable
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="is_purchase_link"
              value={inputs.is_purchase_link}
              label="Is Purchase Link Enable"
              required
              onChange={handleChange}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div> */}

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

              {/* {inputs.is_purchase_link == true && (
          <>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Purchase Link"
                variant="outlined"
                fullWidth
                required
                name="link"
                value={inputs.link}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
              <div className="row w-100 div-style ms-0 pt-0">
                <div className="col-5">
                  <p className="">Upload Link Image *</p>
                  <FormHelperText className="pt-0">
                    Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                  </FormHelperText>
                </div>
                <div className="col-2">
                  {(images.link_image || oldImages.link_image) && (
                    <img
                      src={
                        images.link_image
                          ? images.link_image
                          : s3baseUrl + oldImages.link_image
                      }
                      height="50"
                    />
                  )}
                </div>
                <div className="col-5 text-end pt-2">
                  <label htmlFor="link_image">
                    <Input
                      accept="image/*"
                      id="link_image"
                      multiple
                      type="file"
                      name="link_image"
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
              {inputs?.link_image?.name == "" ? (
                ""
              ) : (
                <p className="text-secondary">{inputs?.link_image?.name}</p>
              )}
            </div>
          </>
        )} */}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Event Logo *</p>
                    <FormHelperText className="pt-0">
                      Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {(images.event_logo || oldImages.event_logo) && (
                      <img
                        className="image-border"
                        src={
                          images.event_logo
                            ? images.event_logo
                            : s3baseUrl + oldImages.event_logo
                        }
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="event_logo">
                      <Input
                        accept="image/*"
                        id="event_logo"
                        multiple
                        type="file"
                        name="event_logo"
                        onChange={fileChangedHandler}
                      />

                      <Button
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
                {inputs?.event_logo?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs?.event_logo?.name}</p>
                )}
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
                          images.image
                            ? images.image
                            : s3baseUrl + oldImages.image
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
                        className="small-contained-button-search"
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
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Banner 1 Image </p>
                    <FormHelperText className="pt-0">
                      Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {(images.banner1_image || oldImages.banner1_image) && (
                      <img
                        className="image-border"
                        src={
                          images.banner1_image
                            ? images.banner1_image
                            : s3baseUrl + oldImages.banner1_image
                        }
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="banner1_image">
                      <Input
                        accept="image/*"
                        id="banner1_image"
                        multiple
                        type="file"
                        name="banner1_image"
                        onChange={fileChangedHandler}
                      />

                      <Button
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
                {inputs?.banner1_image?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">
                    {inputs?.banner1_image?.name}
                  </p>
                )}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Banner 2 Image </p>
                    <FormHelperText className="pt-0">
                      Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {(images.banner2_image || oldImages.banner2_image) && (
                      <img
                        className="image-border"
                        src={
                          images.banner2_image
                            ? images.banner2_image
                            : s3baseUrl + oldImages.banner2_image
                        }
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="banner2_image">
                      <Input
                        accept="image/*"
                        id="banner2_image"
                        multiple
                        type="file"
                        name="banner2_image"
                        onChange={fileChangedHandler}
                      />

                      <Button
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
                {inputs?.banner2_image?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">
                    {inputs?.banner2_image?.name}
                  </p>
                )}
              </div>
              <div className="col-12 mt-4">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Video Embed Code"
                    multiline
                    rows={6}
                    name="video_url"
                    value={inputs.video_url}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
              <div className="col-12 mt-4">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Short Description"
                    multiline
                    rows={6}
                    name="short_description"
                    value={inputs.short_description}
                    onChange={handleChange}
                    required
                  />
                  <FormHelperText>Maximum limit 500 characters</FormHelperText>
                </FormControl>
              </div>
              <div className="col-12 mt-4">
                <h4>Detailed Description *</h4>
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="detail_description"
                  editorHeight={320}
                />
              </div>
            </div>
          </div>
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
