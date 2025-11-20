import React, { useState } from "react";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import { addMediaApi, editMediaApi } from "src/DAL/MediaSection/mediaSection";
import { s3baseUrl } from "src/config/config";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
const EditMediaSection = () => {
  const classes = useStyles();
  const { state } = useLocation();
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [file, setProfileImage] = useState();
  const [oldImage, setOldImage] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [detailDescriptionCk, setDetailDescriptionCk] = useState("");
  const params = useParams();

  const [inputs, setInputs] = useState({
    title: "",
    mediaType: "podcast",
    short_description: "",
    mediaButtonText: "",
    mediaUrl: "",
    status: "",
    order: "",
    image: {},
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
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
      setIsLoading(false);
    } else {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("button_text", inputs.mediaButtonText);
      formData.append("button_link", inputs.mediaUrl);
      formData.append("media_type", inputs.mediaType);
      formData.append("short_description", inputs.short_description);
      formData.append("detailed_description", detailDescriptionCk);
      if (file) {
        formData.append("main_image", inputs.image);
      }
      formData.append("status", inputs.status);
      formData.append("order", inputs.order);

      const result = await editMediaApi(formData, params.id);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  const {
    title,
    image,
    order,
    status,
    button_text,
    button_link,
    detailed_description,
    short_description,
    media_type,
  } = state.object;

  React.useEffect(() => {
    setDetailDescriptionCk(detailed_description);
    setOldImage(image);
    setInputs({
      ...inputs,
      ["title"]: title,
      ["mediaType"]: media_type,
      ["mediaButtonText"]: button_text,
      ["mediaUrl"]: button_link,
      ["short_description"]: short_description,
      ["status"]: status,
      ["order"]: order,
    });
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row">
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
        <div className="col-6">
          <h2>Edit Media Section</h2>
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
              <InputLabel id="demo-simple-select-label-1">
                Media Type *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label-1"
                id="demo-simple-select"
                name="mediaType"
                value={inputs.mediaType}
                label="Media Type"
                required
                onChange={handleChange}
              >
                <MenuItem value="podcast">Podcast</MenuItem>
                <MenuItem value="newsletter">News Article</MenuItem>
                <MenuItem value="brand">Brand</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Media Button Text"
              variant="outlined"
              fullWidth
              name="mediaButtonText"
              value={inputs.mediaButtonText}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Media URL"
              variant="outlined"
              fullWidth
              name="mediaUrl"
              value={inputs.mediaUrl}
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
                  Image Size(225 X 225) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {file ? (
                  <img className="image-border" src={file} height="50" />
                ) : (
                  oldImage && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldImage}
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
            <h4>Detail Description </h4>
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

export default EditMediaSection;
