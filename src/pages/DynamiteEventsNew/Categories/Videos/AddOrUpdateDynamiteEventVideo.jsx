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
import { CircularProgress, IconButton } from "@mui/material";
import { useEffect } from "react";
import { s3baseUrl } from "src/config/config";
import {
  add_dynamite_event_video_api,
  dynamite_event_video_detail_api,
  update_dynamite_event_video_api,
} from "src/DAL/DynamiteEvents/Categories/EventsCategoryVideos/EventsCategoryVideos";
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

export default function AddOrUpdateDynamiteEventVideo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { video_id, category_id } = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudio] = useState(null);
  const [formType, setFormType] = useState("ADD");
  const [oldAudio, setOldAudio] = useState("");

  const [images, setImages] = useState({
    image: "",
  });

  const [oldImages, setOldImages] = useState({
    image: "",
  });

  const [inputs, setInputs] = useState({
    title: "",
    status: true,
    is_feature: false,
    is_chat_enable: true,
    video_type: "video",
    image: {},
    short_description: "",
    detail_description: "",
    video_url: "",
    order: 0,
  });

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

  const audioFileChange = (e) => {
    setAudio(e.target.files[0]);
  };

  const get_video_detail = async () => {
    setIsLoading(true);
    const result = await dynamite_event_video_detail_api(video_id);
    if (result.code == 200) {
      handleFormat(result.dynamite_event_category_video);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("short_description", inputs.short_description);
    formData.append("detail_description", inputs.detail_description);
    formData.append("status", inputs.status);
    formData.append("is_feature", inputs.is_feature);
    formData.append("is_chat_enable", inputs.is_chat_enable);
    formData.append("video_type", inputs.video_type);
    formData.append("dynamite_event_category", category_id);

    if (formType == "ADD") {
      formData.append("image", inputs.image);
    } else {
      formData.append("order", inputs.order);
      if (images.image) {
        formData.append("image", inputs.image);
      }
    }
    if (inputs.video_type == "video") {
      formData.append("video_url", inputs.video_url);
    } else if (inputs.video_type == "audio" && audioFile) {
      formData.append("audio", audioFile);
    }

    const result =
      formType == "ADD"
        ? await add_dynamite_event_video_api(formData)
        : await update_dynamite_event_video_api(formData, video_id);
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

  const handleNavigate = () => {
    navigate(`/dynamite-event-videos/${category_id}`);
  };

  const handleFormat = (data) => {
    if (data.video_type == "audio") {
      setOldAudio(data.audio_file_url);
    }
    setInputs(data);
    setOldImages({
      ...oldImages,
      ["image"]: data.image?.thumbnail_3,
    });
    setFormType("EDIT");
    setIsLoading(false);
  };

  useEffect(() => {
    if (video_id) {
      if (state) {
        handleFormat(state);
      } else {
        get_video_detail();
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
        <div className="col-12">
          <h2>{`${formType == "ADD" ? "Add" : "Edit"} Video`}</h2>
        </div>
      </div>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Video Title"
            variant="outlined"
            fullWidth
            name="title"
            value={inputs.title}
            onChange={handleChange}
            required
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

        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Is Feature</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="is_feature"
              value={inputs.is_feature}
              label="Is Feature"
              onChange={handleChange}
              required
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">
              Is Chat Enable
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="is_chat_enable"
              value={inputs.is_chat_enable}
              label="Is Chat Enable"
              onChange={handleChange}
              required
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
        {formType == "EDIT" && (
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Order"
              variant="outlined"
              fullWidth
              name="order"
              value={inputs.order}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="video_type"
              value={inputs.video_type}
              label="Type"
              onChange={handleChange}
              required
            >
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="audio">Audio</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Upload Image * </p>
              <FormHelperText className="pt-0">
                Image Size (100*100) ("JPG", "JPEG", "PNG","WEBP")
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
              <label htmlFor="contained-button-file-thumbnail">
                <Input
                  accept="image/*"
                  id="contained-button-file-thumbnail"
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
        {inputs.video_type === "audio" ? (
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Audio *</p>
                <FormHelperText className="pt-0">
                  Allowed Formats is "Mp3",200Mb
                </FormHelperText>
              </div>
              <div className="col-2"></div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="audio">
                  <Input
                    accept="audio/mp3,audio/*;capture=microphone"
                    id="audio"
                    multiple
                    name="audio"
                    type="file"
                    onChange={audioFileChange}
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
            <p className="text-secondary">{audioFile && audioFile.name}</p>
            {oldAudio && (
              <audio className="w-100" src={s3baseUrl + oldAudio} controls />
            )}
          </div>
        ) : (
          <div className="col-12 mt-4">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Video Embed Code"
                multiline
                rows={6}
                required
                name="video_url"
                value={inputs.video_url}
                onChange={handleChange}
              />
            </FormControl>
          </div>
        )}

        <div className="col-12 mt-4">
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
        </div>
        <div className="col-12 mt-4">
          <h4>Detailed Description </h4>
          <GeneralCkeditor
            setInputs={setInputs}
            inputs={inputs}
            name="detail_description"
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
