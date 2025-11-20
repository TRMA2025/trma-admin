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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { s3baseUrl } from "src/config/config";
import { useEffect } from "react";
import TinyEditor from "../../components/ckeditor/Ckeditor";

import moment from "moment";
import {
  add_challenges,
  challenges_detail_api,
  update_challenges,
} from "src/DAL/GrowthTools/GrowthTools";
import DeleteIcon from "@mui/icons-material/Delete";
import { audioImage } from "src/assets";
import {
  add_challenges_recordings,
  challenges_recordings_detail_api,
  update_challenges_recordings,
} from "src/DAL/GrowthTools/Challenges";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function AddOrUpdateChallengeRecordings() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("ADD");
  const [file, setProfileImage] = React.useState();
  const [oldImage, setOldImage] = useState();
  const [audioFile, setAudio] = React.useState();
  const [oldAudioFile, setOldAudio] = React.useState();
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");

  const [inputs, setInputs] = useState({
    title: "",
    videoUrl: "",
    short_description: "",
    status: true,
    video_thumbnail: {},
  });
  const handleFormatData = (state) => {
    setFormType("EDIT");
    setOldImage(state.video_thumbnail.thumbnail_1);
    setInputs((prevState) => ({
      ...prevState,
      ["title"]: state?.title,
      ["short_description"]: state?.description,
      ["videoUrl"]: state?.video_url,
      ["status"]: state.status,
    }));
    setIsLoading(false);
  };

  const getChallengesDetail = async () => {
    setIsLoading(true);
    let result = await challenges_recordings_detail_api(params.resource_id);
    if (result.code == 200) {
      handleFormatData(result.challenge_recording);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.short_description.length > 200) {
      enqueueSnackbar("Short Description Must Be Less Than 200 Characters", {
        variant: "error",
      });
      return;
    }

    if (formType === "ADD" && !file) {
      enqueueSnackbar("Please Upload Image", {
        variant: "error",
      });
      return;
    }
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("status", inputs.status);
    formData.append("description", inputs.short_description);
    formData.append("video_url", inputs.videoUrl);
    if (formType === "ADD") {
      formData.append("challenge_id", params.id);
    }
    if (file) {
      formData.append("video_thumbnail", inputs.video_thumbnail);
    } else {
      if (oldImage) {
      }
    }
    console.log(...formData, "fomrData");
    setIsLoading(true);
    const result =
      formType === "ADD"
        ? await add_challenges_recordings(formData)
        : await update_challenges_recordings(formData, params.resource_id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const fileChangedHandler = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["video_thumbnail"]: e.target.files[0],
    });
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handldeDeleteAudio = () => {
    setAudio();
  };
  const audioFileChange = (e) => {
    setAudio(e.target.files[0]);
  };
  useEffect(() => {
    if (params && params.resource_id) {
      if (state) {
        handleFormatData(state);
      } else {
        getChallengesDetail();
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
          <h2>{`${formType === "ADD" ? "Add" : "Edit"} Recording`}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row main-card">
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
              label="Video Url "
              variant="outlined"
              required
              fullWidth
              name="videoUrl"
              value={inputs.videoUrl}
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
                required
                value={inputs.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>InActive</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Thumbnail Image*</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-3">
                <div className="col-3">
                  {file ? (
                    <img className="image-border" src={file} height="70" />
                  ) : (
                    oldImage && (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldImage}
                        height="70"
                      />
                    )
                  )}
                </div>
              </div>
              <div className="col-4 text-end pt-2">
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="plan_image"
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
          </div>
          <div className="col-12 mt-5">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Description"
                multiline
                required
                rows={6}
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
              <FormHelperText>Maximum limit 200 characters</FormHelperText>
            </FormControl>
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
