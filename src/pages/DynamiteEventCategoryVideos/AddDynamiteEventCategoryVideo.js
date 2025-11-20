import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  FormHelperText,
  IconButton,
  TextField,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Select from "@mui/material/Select";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { add_dynamite_event_category_video } from "src/DAL/WebsitePagesold/DynamiteEventCategoryVideos/DynamiteEventCategoryVideos";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const AddDynamiteEventCategoryVideo = () => {
  const classes = useStyles();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [detailDescriptionCk, setDetailDescriptionCk] = useState("");
  const [file, setProfileImage] = React.useState();
  const [inputs, setInputs] = useState({
    title: "",
    short_description: "",
    status: true,
    is_feature: false,
    is_chat_enable: true,
    dynamite_event_category: "",
    video_url: "",
    image: {},
  });
  const Input = styled("input")({
    display: "none",
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
      formData.append("detail_description", detailDescriptionCk);
      formData.append("status", inputs.status);
      formData.append("is_chat_enable", inputs.is_chat_enable);
      formData.append("is_feature", inputs.is_feature);
      formData.append("dynamite_event_category", params.category_id);
      if (file) {
        formData.append("image", inputs.image);
      }

      const result = await add_dynamite_event_category_video(formData);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(
          `/dynamite-event-videos/${params.event_id}/${params.category_id}`
        );
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() =>
              navigate(
                `/dynamite-event-videos/${params.event_id}/${params.category_id}`
              )
            }
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
        <div className="col-6">
          <h2>Add Video</h2>
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
              <InputLabel id="is_feature">Is Featured Video *</InputLabel>
              <Select
                labelId="is_feature"
                id="demo-simple-select"
                name="is_feature"
                value={inputs.is_feature}
                label="Is Featured Video"
                required
                onChange={handleChange}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="is_chat_enable">Is Chat Enable *</InputLabel>
              <Select
                labelId="is_chat_enable"
                id="demo-simple-select"
                name="is_chat_enable"
                value={inputs.is_chat_enable}
                label="Is Chat Enable"
                required
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
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
                {file && (
                  <img className="image-border" src={file} height="50" />
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
            {inputs.image.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs.image.name}</p>
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
              />
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <h4>Detailed Description </h4>
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

export default AddDynamiteEventCategoryVideo;
