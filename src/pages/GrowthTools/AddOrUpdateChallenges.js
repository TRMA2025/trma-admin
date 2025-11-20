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

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function AddOrUpdateChallenges() {
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
    number_of_days: 1,
    status: true,
    is_published_on_community: true,
    video_thumbnail: {},
  });
  const handleFormatData = (state) => {
    setFormType("EDIT");
    setOldImage(state.video_thumbnail.thumbnail_1);
    setDetailDescriptionCk(state.detail_description);
    setInputs((prevState) => ({
      ...prevState,
      ["title"]: state?.title,
      ["short_description"]: state?.short_description,
      ["number_of_days"]: state?.number_of_days,
      ["videoUrl"]: state?.video_url,
      ["status"]: state.status,
      ["is_published_on_community"]: state?.is_published_on_community,
    }));
    // setOldImage(state?.image?.thumbnail_1);
    setIsLoading(false);
  };

  const getChallengesDetail = async () => {
    setIsLoading(true);
    let result = await challenges_detail_api(params.id);
    if (result.code == 200) {
      handleFormatData(result.challenge);
      setIsLoading(false);
    } else {
      //   navigate(`/daily-messages`);
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      enqueueSnackbar("image is required", {
        variant: "error",
      });
      return;
    }
    if (!detailDescriptionCk) {
      enqueueSnackbar("detail description is required", {
        variant: "error",
      });
      return;
    }

    if (inputs.short_description.length > 200) {
      enqueueSnackbar("Short Description Must Be Less Than 200 Characters", {
        variant: "error",
      });
      return;
    }
    if (inputs.number_of_days == 0) {
      enqueueSnackbar("No of Challenge Days should be greater than 0", {
        variant: "error",
      });
      return;
    }
    if (detailDescriptionCk == "") {
      enqueueSnackbar("Detail Description is Required", {
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
    formData.append(
      "is_published_on_community",
      inputs.is_published_on_community
    );
    formData.append("detail_description", detailDescriptionCk);
    formData.append("short_description", inputs.short_description);
    formData.append("number_of_days", inputs.number_of_days);
    formData.append("video_url", inputs.videoUrl);

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
        ? await add_challenges(formData)
        : await update_challenges(formData, params.id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/challenges`);
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
    if (params && params.id) {
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
            onClick={() =>
              navigate(`/challenges`, {
                state: state,
              })
            }
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
          <h2>{`${formType === "ADD" ? "Add" : "Edit"} Challenge`}</h2>
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
            <TextField
              id="outlined-basic"
              label="No Of Challenge Days"
              variant="outlined"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              placeholder="No Of Challenge Days"
              fullWidth
              required
              name="number_of_days"
              value={inputs.number_of_days}
              onChange={handleChange}
              onWheel={(event) => event.target.blur()}
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
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Is Share on Dashboard?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="is_published_on_community"
                required
                value={inputs.is_published_on_community}
                label="Is Share on Dashboard?"
                onChange={handleChange}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
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
                label="Short Description"
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
          <div className="col-12 mt-5">
            <h4>Detail Description *</h4>
            <TinyEditor
              setDetailDescription={setDetailDescriptionCk}
              detailDescriptionCk={detailDescriptionCk}
            />
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
