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
import Chip from "@mui/material/Chip";
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
import {
  AddLessonApi,
  AddLessonRecordingApi,
  EditLessonRecordingApi,
  recordingDetailApi,
} from "src/DAL/lessons/lessons";
import { DatePicker, TimePicker } from "@mui/lab";
import { s3baseUrl } from "src/config/config";
import {
  EditRecordingGettingStarting,
  GettingREcordingDetailApi,
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


export default function EditGettingStartingRecording() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [recordingInfo, setRecordingInfo] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [recordingDate, setRecordingDate] = React.useState(null);
  const [oldAudioFile, setOldAudio] = React.useState();
  const [oldImageFile, setOldImage] = React.useState();
  const [fileNew, setProfileImageNew] = React.useState(false);
  console.log(state, "state in the edit recording..........");

  const [inputs, setInputs] = React.useState({
    title: "",
    status: true,
    image: {},
    videoUrl: "",
    short_description: "",
    detailed_description: "",
  });
  const {
    title,
    status,
    audio_recording,
    recording_date,
    recording_slug,
    short_description,
    video_url,
    recording_image,
  } = state;
  console.log(recordingDate, "recording_daterecording_date");
  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(typeof value === "string" ? value.split(",") : value);
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

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setDate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recordingDate) {
      enqueueSnackbar("recording  date is required", {
        variant: "error",
      });
      return;
    }
    console.log(
      moment(recordingDate).format("YYYY-MM-DD"),
      "lkjdsflsdlflksdjflsdlkf"
    );
    let date = moment(recordingDate).format("YYYY-MM-DD");
    console.log(date, "recordingDate");
    console.log(date, "date");
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
    } else {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append(
        "recording_date",
        moment(recordingDate).format("YYYY-MM-DD")
      );
      formData.append("short_description", inputs.short_description);
      formData.append("status", inputs.status);
      formData.append("video_url", inputs.videoUrl);

      if (audioFile) {
        formData.append("audio_file", audioFile);
      } else {
      }
      if (fileNew == true) {
        formData.append("image", inputs.image);
      }
      for (var value of formData.values()) {
      }
      console.log(...formData, "data going in edit recording.....");
      setIsLoading(true);
      const result = await EditRecordingGettingStarting(formData, params.slug);
      console.log(result, "response in edit recording.....");

      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-2);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };
  const recordingDetail = async () => {
    let result = await GettingREcordingDetailApi(params.slug);
    if (result.code == 200) {
      setIsLoading(false);
      setRecordingInfo(result.recording);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    recordingDetail();
  }, []);

  React.useEffect(() => {
    setOldAudio(audio_recording);
    setOldImage(recording_image.thumbnail_1);
    setRecordingDate(recording_date);
    setInputs((prevState) => ({
      ...prevState,
      ["title"]: title,
      ["status"]: status,
      ["short_description"]: short_description,
      ["videoUrl"]: video_url,
      ["image"]: recording_image.thumbnail_1,
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
          <h2>Edit Recording</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  required
                  id="outlined-basic"
                  label="Recording Title "
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Recording Date *"
                    value={recordingDate}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => {
                      setRecordingDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  required
                  id="outlined-basic"
                  label="Enter Video Url "
                  variant="outlined"
                  fullWidth
                  name="videoUrl"
                  value={inputs.videoUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Recording Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label="Programme Status *"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Audio</p>
                    <FormHelperText className="pt-0">
                      Audio mp3 (max 200mb)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {audioFile && (
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
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
                <p className="text-secondary">{audioFile && audioFile.name}</p>
                {state.audio_recording && (
                  <audio
                    className="w-100"
                    src={s3baseUrl + state.audio_recording}
                    controls
                  />
                )}
              </div>
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
                      <img src={file} height="50" />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldImageFile}
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
                    label="Short Description"
                    multiline
                    rows={6}
                    name="short_description"
                    value={inputs.short_description}
                    onChange={handleChange}
                  />
                </FormControl>
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
