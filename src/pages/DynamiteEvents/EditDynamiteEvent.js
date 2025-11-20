import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  Input,
  TextField,
} from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import FormHelperText from "@mui/material/FormHelperText";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Select from "@mui/material/Select";
import { useSnackbar } from "notistack";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { s3baseUrl } from "src/config/config";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  dynamiteEventsDetailApi,
  editDynamiteEvents,
} from "src/DAL/WebsitePagesold/DynamiteEvents/DynamiteEvents";
import { urlPatternValidation } from "src/utils/constant";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const EditDynamiteEvent = () => {
  const classes = useStyles();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [detailDescriptionCk, setDetailDescriptionCk] = useState("");
  const [date, setDate] = useState("");
  const [inputs, setInputs] = useState({
    title: "",
    video_url: "",
    no_of_days: "",
    short_description: "",
    banner1_link: "",
    banner2_link: "",
    status: true,
    image: {},
    banner1_image: {},
    banner2_image: {},
    logo: {},
  });

  const [images, setImages] = useState({
    banner1_image: "",
    banner2_image: "",
    image: "",
    logo: "",
  });

  const [oldImages, setOldImages] = useState({
    banner1_image: "",
    banner2_image: "",
    image: "",
    logo: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setDate(dateType);
  };

  const fileChangedHandler = (e) => {
    const name = e.target.name;
    const value = e.target.files[0];
    setInputs({
      ...inputs,
      [name]: value,
    });

    setImages({
      ...images,
      [name]: URL.createObjectURL(value),
    });
  };

  const getEventDetailData = async () => {
    const result = await dynamiteEventsDetailApi(params.id);

    const {
      detail_description,
      images,
      banner1_image,
      banner2_image,
      start_date,
      event_logo,
    } = result.dynamite_event;

    setOldImages({
      ["banner1_image"]: banner1_image?.thumbnail_1,
      ["banner2_image"]: banner2_image?.thumbnail_1,
      ["image"]: images?.thumbnail_1,
      ["logo"]: event_logo?.thumbnail_1,
    });
    setInputs({
      ...result.dynamite_event,
      ["image"]: images?.thumbnail_1,
      ["banner2_image"]: banner2_image?.thumbnail_1,
      ["banner2_image"]: banner2_image?.thumbnail_1,
      ["logo"]: event_logo?.thumbnail_1,
    });
    setDate(start_date);
    setDetailDescriptionCk(detail_description);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
      setIsLoading(false);
    } else {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("video_url", inputs.video_url);
      formData.append("short_description", inputs.short_description);
      formData.append("status", inputs.status);
      formData.append("detail_description", detailDescriptionCk);
      formData.append("no_of_days", inputs.no_of_days);
      formData.append("banner1_link", inputs.banner1_link);
      formData.append("banner2_link", inputs.banner2_link);
      formData.append("start_date", date);

      if (images.image) {
        formData.append("image", inputs.image);
      }
      if (images.banner1_image) {
        formData.append("banner1_image", inputs.banner1_image);
      }
      if (images.banner2_image) {
        formData.append("banner2_image", inputs.banner2_image);
      }
      if (images.logo) {
        formData.append("event_logo", inputs.logo);
      }
      const result = await editDynamiteEvents(formData, params.id);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(`/dynamite-events`);
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
            onClick={() => navigate(`/dynamite-events`)}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Event Start Date *"
                  inputFormat="dd/MM/yyyy"
                  value={date}
                  onChange={handleChangeDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="No Of Days"
              variant="outlined"
              fullWidth
              required
              type="number"
              name="no_of_days"
              value={inputs.no_of_days}
              onChange={handleChange}
              onWheel={(event) => event.target.blur()}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Logo *</p>
                <FormHelperText className="pt-0">
                  Image Size(350 X 100) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {images.logo ? (
                  <img className="image-border" src={images.logo} height="50" />
                ) : (
                  oldImages.logo && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldImages.logo}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-button-file-logo">
                  <Input
                    accept="image/*"
                    id="contained-button-file-logo"
                    multiple
                    type="file"
                    name="logo"
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
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Image *</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {images.image ? (
                  <img
                    className="image-border"
                    src={images.image}
                    height="50"
                  />
                ) : (
                  oldImages.image && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldImages.image}
                      height="50"
                    />
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
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Banner 1 Image </p>
                <FormHelperText className="pt-0">
                  Image Size(600 X 173) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {images.banner1_image ? (
                  <img
                    className="image-border"
                    src={images.banner1_image}
                    height="50"
                  />
                ) : (
                  oldImages.banner1_image && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldImages.banner1_image}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-banner1_image">
                  <Input
                    accept="image/*"
                    id="contained-banner1_image"
                    multiple
                    type="file"
                    name="banner1_image"
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
            {inputs?.image?.banner1_image == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.image?.banner1_image}</p>
            )}
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Banner 2 Image </p>
                <FormHelperText className="pt-0">
                  Image Size(600 X 173) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {images.banner2_image ? (
                  <img
                    className="image-border"
                    src={images.banner2_image}
                    height="50"
                  />
                ) : (
                  oldImages.banner2_image && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldImages.banner2_image}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-banner2_image">
                  <Input
                    accept="image/*"
                    id="contained-banner2_image"
                    multiple
                    type="file"
                    name="banner2_image"
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
            {inputs?.image?.banner2_image == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.image?.banner2_image}</p>
            )}
          </div>
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

          <div className="col-12 mt-5">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Short Description "
                multiline
                rows={6}
                required
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <h4>Detailed Description *</h4>
            <TinyEditor
              setDetailDescription={setDetailDescriptionCk}
              detailDescriptionCk={detailDescriptionCk}
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

export default EditDynamiteEvent;
