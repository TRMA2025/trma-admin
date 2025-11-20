import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconButton,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  admin_edit_api,
  admin_videos_detail,
} from "src/DAL/HelpingVideos/AdminHelpingVideos";
import { s3baseUrl } from "../../config/config";
import TinyEditor from "src/components/ckeditor/Ckeditor";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
const Input = styled("input")({
  display: "none",
});

export default function EditAdminVideos() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = useState();
  const [audioFile, setAudio] = useState();
  const [oldAudioFile, setOldAudio] = useState();
  const [programmeDetail, setProgrammeDetail] = useState([]);
  const [fileNew, setProfileImageNew] = useState(false);
  const [detailDescriptionCk, setDetailDescriptionCk] = useState();

  const [inputs, setInputs] = useState({
    title: "",
    order: "",
    image: {},
    status: true,
    videoUrl: "",
    short_description: "",
    detailed_description: "",
    image_show: "",
  });

  const getProgrammeDetail = async () => {
    setIsLoading(true);
    const result = await admin_videos_detail(state.helping_video_slug);
    if (result.code === 200) {
      setProgrammeDetail(result.helpingvideo);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setProfileImageNew(true);
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const audioFileChange = (e) => {
    setAudio(e.target.files[0]);
  };
  const handldeDeleteAudio = async (value) => {
    let postData = {
      status: "audio",
    };
    setIsLoading(true);
    let result = await deleteAudioApi(postData, state.program_slug);
    if (result.code == 200) {
      setIsLoading(false);
      getProgrammeDetail();
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      urlPatternValidation(inputs.videoUrl) === false &&
      inputs.videoUrl !== ""
    ) {
      enqueueSnackbar("Enter Valid Video URL", { variant: "error" });
    } else {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("short_description", inputs.short_description);
      formData.append("status", inputs.status);
      formData.append("long_description", detailDescriptionCk);
      formData.append("video_url", inputs.videoUrl);
      formData.append("order", inputs.order);
      // audio file
      // if (audioFile) {
      //   formData.append("audio_file", audioFile);
      // } else {
      // }
      if (fileNew == true) {
        formData.append("image", inputs.image);
      }

      setIsLoading(true);
      const result = await admin_edit_api(formData, state.helping_video_slug);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(`/admin-videos`);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    getProgrammeDetail();
  }, []);
  useEffect(() => {
    setDetailDescriptionCk(programmeDetail.long_description);
    setInputs((prevState) => ({
      ...prevState,
      ["title"]: programmeDetail.title,
      ["short_description"]: programmeDetail.short_description,
      ["status"]: programmeDetail.status,
      ["detailed_description"]: programmeDetail.long_description,
      ["videoUrl"]: programmeDetail.video_url,
      ["order"]: programmeDetail.order,
      ["image_show"]: programmeDetail.thumbnail_image?.thumbnail_1,
    }));
    // audio file
    // setOldAudio(programmeDetail.audio_file);
  }, [programmeDetail]);

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
          <h2>Edit Admin Video</h2>
        </div>
      </div>
      <div class="card main-card">
        <div class="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Video Title*"
                variant="outlined"
                fullWidth
                name="title"
                value={inputs.title}
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
                type="number"
                onWheel={(event) => event.target.blur()}
                required
              />
            </div>
            {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Status *
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="status"
              value={inputs.status}
              label="Status *"
              onChange={handleChange}>
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </div> */}
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Video Url"
                variant="outlined"
                fullWidth
                name="videoUrl"
                value={inputs.videoUrl}
                onChange={handleChange}
                required
              />
            </div>
            {/* audio file */}
            {/* <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Upload Audio</p>
              <FormHelperText className="pt-0">
                Audio mp3 (max 200mb)
              </FormHelperText>
            </div>
            <div className="col-2">
              {oldAudioFile && (
                <DeleteIcon
                  onClick={handldeDeleteAudio}
                  className="mt-3 icon-color"
                />
              )}
            </div>
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
                  component="span">
                  Upload
                </Button>
              </label>
            </div>
          </div>
          <p className="text-secondary">{audioFile && audioFile.name}</p>
          {programmeDetail.audio_file && (
            <audio
              className="w-100"
              src={s3baseUrl + programmeDetail?.audio_file}
              controls
            />
          )}
        </div> */}

            <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
              <div className="row w-100 div-style ms-0 pt-0">
                <div className="col-5">
                  <p className="">Upload Thumbnail Image *</p>
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
                      src={s3baseUrl + inputs.image_show}
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
              {inputs.image.name == "" ? (
                ""
              ) : (
                <p className="text-secondary">{inputs.image.name}</p>
              )}
            </div>
            <div className="col-12 mt-5">
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Short Description *"
                  multiline
                  rows={6}
                  name="short_description"
                  value={inputs.short_description}
                  onChange={handleChange}
                />
              </FormControl>
            </div>

            <div className="col-12 mt-5">
              <h4>Detail Description</h4>
              <TinyEditor
                setDetailDescription={setDetailDescriptionCk}
                detailDescriptionCk={detailDescriptionCk}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-end mt-4">
        <button onClick={handleSubmit} className="small-contained-button">
          Submit
        </button>
      </div>
    </div>
  );
}
