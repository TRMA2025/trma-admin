import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Autocomplete from "@mui/material/Autocomplete";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, Divider, CircularProgress } from "@mui/material";
import { object } from "prop-types";
import { menuList } from "src/DAL/Menu/Menu";
import { AddProgrammeApi } from "src/DAL/Programme/Programme";
import { AddLessonApi, EditLessonApi } from "src/DAL/lessons/lessons";
import { TimePicker } from "@mui/lab";
import { s3baseUrl } from "src/config/config";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  EditGettingStartingApi,
  Getting_starting_api,
} from "src/DAL/gettingStarting/GettingStarting";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const ITEM_HEIGHT = 70;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const Input = styled("input")({
  display: "none",
});

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


export default function EditGettingStarting() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [fileNew, setProfileImageNew] = React.useState(false);
  const [oldAudioFile, setOldAudio] = React.useState();
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [lessonDetailInfo, setLessonsDetailInfo] = useState();
  const [updtaeObject, setUpdateObject] = useState({});

  const params = useParams();
  let newid = params.id;

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "",
    programStatus: "true",
    is_paid: true,
    showStatus: "",
    image: {},
    accessType: "",
    videoUrl: "",
    short_description: "",
    detailed_description: "",
    video_show_Status: "",
    order: "",
    video_duration: "",
  });

  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(typeof value === "string" ? value?.split(",") : value);
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
  const handleProgramName = (data) => {
    setProgramName(data.program_slug);
  };
  const handleVaultName = (data) => {
    setVaultName(data.vault_slug);
  };
  const handldeDeleteAudio = () => {
    setAudio();
  };
  const handleDetail = async () => {
    setIsLoading(true);
    let result = await Getting_starting_api(newid);
    if (result.code === 200) {
      setLessonsDetailInfo(result.getting_started);

      setIsLoading(false);
    } else {
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

    if (urlPatternValidation(inputs.videoUrl) === false) {
      enqueueSnackbar("Enter Valid Video URL", { variant: "error" });
      return;
    }

    const originalDate = new Date(inputs.video_duration);
    const hours = originalDate.getHours().toString().padStart(2, "0");
    const minutes = originalDate.getMinutes().toString().padStart(2, "0");
    const seconds = originalDate.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("short_description", inputs.short_description);
    formData.append("detailed_description", detailDescriptionCk);
    formData.append("status", inputs.programStatus);
    formData.append("is_paid", inputs.is_paid);
    formData.append("landing_video_url", inputs.videoUrl);
    formData.append("order", inputs.order);
    formData.append("duration", formattedTime);

    if (audioFile) {
      formData.append("audio_file", audioFile);
    }
    if (fileNew) {
      formData.append("main_image", inputs.image);
    }

    setIsLoading(true);

    try {
      const result = await EditGettingStartingApi(
        formData,
        state.getting_started_slug
      );

      if (result.code === 200) {
        setUpdateObject(result.gettingStarted);
        enqueueSnackbar(result.message, { variant: "success" });

        navigate(
          `/programmes/getting-started-detail/${result.gettingStarted?.getting_started_slug}`
        );
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    handleDetail();
    setOldAudio(state.audio_file);
    setDetailDescriptionCk(state.detailed_description);
    let Duration_value = "Wed Apr 27 2022 " + " " + state?.duration;
    const timeParts = state?.duration?.split(":");
    const date = new Date(
      0,
      0,
      0,
      parseInt(timeParts[0]),
      parseInt(timeParts[1]),
      parseInt(timeParts[2])
    );

    setInputs((prevState) => ({
      ...prevState,
      ["title"]: state.title,
      ["status"]: state.status,
      ["programStatus"]: state.status,
      ["is_paid"]: state?.is_paid,
      ["videoUrl"]: state.landing_video_url,
      ["short_description"]: state.short_description,
      ["detailed_description"]: state.detailed_description,
      ["video_duration"]: date,
      ["image"]: state.images?.thumbnail_1,
      ["order"]: state.order,
    }));
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
          <h2>Edit Getting Started</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  required
                  fullWidth
                  name="title"
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <TimePicker
                      ampm={false}
                      openTo="hours"
                      views={["hours", "minutes", "seconds"]}
                      inputFormat="HH:mm:ss"
                      mask="__:__:__"
                      label="Duration"
                      value={inputs.video_duration}
                      onChange={(newValue) => {
                        setInputs((prevState) => ({
                          ...prevState,
                          ["video_duration"]: newValue,
                        }));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Landing  Video Url "
                  required
                  variant="outlined"
                  fullWidth
                  name="videoUrl"
                  value={inputs.videoUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Order"
                  required
                  variant="outlined"
                  fullWidth
                  name="order"
                  value={inputs.order}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Getting Starting Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="programStatus"
                    value={inputs.programStatus}
                    label="Getting Starting Status *"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Getting Starting Type *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_paid"
                    value={inputs.is_paid}
                    label="Getting Starting Type *"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Paid</MenuItem>
                    <MenuItem value={false}>Free</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-3">
                    <p className="">Upload Audio</p>
                    <FormHelperText className="pt-0">
                      Audio mp3 (max 200mb)
                    </FormHelperText>
                  </div>
                  <div className="col-4">
                    {audioFile && (
                      <DeleteIcon
                        onClick={handldeDeleteAudio}
                        className="mt-3 icon-color"
                      />
                    )}
                    <p className="text-secondary">
                      {audioFile && audioFile.name}
                    </p>
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
                        className="small-contained-button-search mt-3"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
                <p className="text-secondary">{audioFile && audioFile.name}</p>
                {oldAudioFile && (
                  <audio
                    className="w-100"
                    src={s3baseUrl + oldAudioFile}
                    controls
                  />
                )}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-4">
                    <p className="">Upload Image *</p>
                    <FormHelperText className="pt-0">
                      Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-3 text-center ps-5">
                    {file ? (
                      <img src={file} height="50" />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + inputs.image}
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
                {inputs.image?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs?.image?.name}</p>
                )}
              </div>

              <div className="col-12 mt-5">
                <FormControl fullWidth>
                  <TextField
                    required
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
              <div className="col-12 mt-5">
                <h4>Detail Description *</h4>

                <TinyEditor
                  setDetailDescription={setDetailDescriptionCk}
                  detailDescriptionCk={detailDescriptionCk}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button type="submit" className="small-contained-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
