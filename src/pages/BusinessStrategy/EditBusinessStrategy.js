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
} from "src/DAL/WebsitePages/DynamiteEvents/DynamiteEvents";
import { urlPatternValidation } from "src/utils/constant";
import {
  buisnessStrategyDetailApi,
  editBusinessStrategy,
} from "src/DAL/WebsitePages/BusinessStrategy/BusinessStrategy";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const EditBusinessStrategy = () => {
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
    button_text: "",
    button_link: "",
    order: "",
    short_description: "",
    strategy_type: "video",
    status: true,
    image: {},
  });

  const [images, setImages] = useState({
    image: "",
  });

  const [oldImages, setOldImages] = useState({
    image: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
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
    const result = await buisnessStrategyDetailApi(params.id);
    const { description, images } = result.buisness_strategy;

    setOldImages({
      ["image"]: images?.thumbnail_1,
    });
    setInputs({
      ...result.buisness_strategy,
      ["image"]: images?.thumbnail_1,
    });
    setDetailDescriptionCk(description);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("description", detailDescriptionCk);
    formData.append("strategy_type", inputs.strategy_type);
    formData.append("status", inputs.status);
    formData.append("button_text", inputs.button_text);
    formData.append("order", inputs.order);
    formData.append("button_link", inputs.button_link);
    if (inputs.strategy_type === "video") {
      formData.append("video_url", inputs.video_url);
    } else {
      if (images.image) {
        formData.append("image", inputs.image);
      }
    }
    const result = await editBusinessStrategy(formData, params.id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/business-strategy`);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
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
            onClick={() => navigate(`/business-strategy`)}
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
          <h2>Edit Business Strategy</h2>
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
              <InputLabel id="strategy_type">Strategy Type *</InputLabel>
              <Select
                labelId="strategy_type"
                id="demo-simple-select"
                name="strategy_type"
                value={inputs.strategy_type}
                label="Strategy Type"
                required
                onChange={handleChange}
              >
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="image">Image</MenuItem>
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
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Order"
                name="order"
                required
                value={inputs.order}
                onChange={handleChange}
              />
            </FormControl>
          </div>
          {inputs.strategy_type === "video" ? (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Video URL"
                  name="video_url"
                  required
                  value={inputs.video_url}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
          ) : (
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
                    <img src={images.image} height="50" />
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
          )}
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
          <div className="col-12 mt-4">
            <h4> Description *</h4>
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

export default EditBusinessStrategy;
