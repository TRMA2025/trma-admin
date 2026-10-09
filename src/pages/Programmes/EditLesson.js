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
//import Editor from "../../components/Editor/Editor";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
// import { VaultListing } from "src/DAL/Vault/Vault";
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
import { IconButton, Divider, CircularProgress, Tooltip } from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
import { object } from "prop-types";
import { menuList } from "src/DAL/Menu/Menu";
import { AddProgrammeApi } from "src/DAL/Programme/Programme";
import {
  AddLessonApi,
  EditLessonApi,
  lesson_detail_api,
  lessonListingApi,
} from "src/DAL/lessons/lessons";
import { TimePicker } from "@mui/lab";
import { s3baseUrl } from "src/config/config";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import OrderField from "src/components/OrderField";
import {
  confirmOrderSave,
  loadOrderSiblings,
  programSlugOf,
} from "src/utils/orderRules";
// import { get_root_value } from "src/utils/domUtils";

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

// Lesson records are not uniform (some predate fields the form expects, e.g.
// lesson_duration), so everything the form reads is normalised here and a
// missing or odd value never takes the page down.
const durationToDate = (lesson) => {
  let parts = null;
  if (typeof lesson.lesson_duration === "string") {
    parts = lesson.lesson_duration.split(":").map((p) => parseInt(p, 10));
  } else if (Number.isFinite(lesson.lesson_duration_seconds)) {
    const t = Math.max(0, Math.floor(lesson.lesson_duration_seconds));
    parts = [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60];
  }
  if (!parts || parts.length !== 3 || parts.some((p) => !Number.isFinite(p))) {
    parts = [0, 0, 0];
  }
  return new Date(0, 0, 0, parts[0], parts[1], parts[2]);
};

const toStageList = (value) => {
  if (Array.isArray(value)) return value.filter((s) => typeof s === "string");
  if (typeof value === "string" && value) return [value];
  return [];
};

export default function EditLesson() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  const lessonSlug = state?.lesson_slug || params.id;
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
  const [deletefromapi, setDeletefromapi] = React.useState(false);
  const [oldAudioFile, setOldAudio] = React.useState();
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  // Order and programme as loaded, for the order rules (9 Oct 2026).
  const loadedLesson = React.useRef({ order: "", _id: "", programSlug: "" });

  //   const [value, setValue] = React.useState(new Date());

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "",
    programStatus: "true",
    is_paid: true,
    is_locked: false,
    showStatus: "",
    image: {},
    accessType: "",
    videoUrl: "",
    short_description: "",
    detailed_description: "",
    video_show_Status: "",
    order: "",
    video_duration: "",
    ks_stages: [],
  });
  //console.log(inputs.video_duration, "statsussssss");

  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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
    setOldAudio();
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
  const delteOldAuide = () => {
    setOldAudio();
    setAudio();
  };

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    //console.log(typeof dateType, "dateType");
    setDate(newValue);
  };
  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!detailDescriptionCk) {
      enqueueSnackbar("detail description is required", { variant: "error" });
      return;
    }

    if (urlPatternValidation(inputs.videoUrl) === false) {
      enqueueSnackbar("Enter Valid Video URL", { variant: "error" });
    } else {
      const { programSlug } = loadedLesson.current;
      const siblings = programSlug
        ? await loadOrderSiblings(() => lessonListingApi(programSlug), "lesson")
        : null;
      const proceed = confirmOrderSave({
        from: loadedLesson.current.order,
        to: inputs.order,
        siblings,
        self: { _id: loadedLesson.current._id, ks_stages: inputs.ks_stages },
        onError: (message) => enqueueSnackbar(message, { variant: "error" }),
      });
      if (!proceed) return;
      const originalDate = new Date(inputs.video_duration);
      const hours = originalDate.getHours().toString().padStart(2, "0");
      const minutes = originalDate.getMinutes().toString().padStart(2, "0");
      const seconds = originalDate.getSeconds().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const formData = new FormData();
      formData.append("title", inputs.title);
      // formData.append("lesson_slug", state.lesson_slug);
      formData.append("short_description", inputs.short_description);
      formData.append("detailed_description", detailDescriptionCk);
      formData.append("status", inputs.programStatus);
      formData.append("is_paid", inputs.is_paid);
      formData.append("is_locked", inputs.is_locked);
      formData.append("landing_lesson_video_url", inputs.videoUrl);
      formData.append("order", inputs.order);
      formData.append("lesson_duration", formattedTime);
      formData.append("recording_delete_status", deletefromapi);
      if (inputs.ks_stages && inputs.ks_stages.length > 0) {
        inputs.ks_stages.forEach((s) => formData.append("ks_stages[]", s));
      }

      if (audioFile) {
        formData.append("audio_file", audioFile);
        //console.log(audioFile, "not empty case of audio file");
      } else {
      }
      if (fileNew == true) {
        formData.append("main_image", inputs.image);
      }
      //console form data

      console.log(...formData, "formattedTimeform data value");

      setIsLoading(true);
      const result = await EditLessonApi(formData, lessonSlug);
      if (result.code === 200) {
        //console.log(result, "result");
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-2);
      } else {
        //console.log(result, "error case");
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };
  const deleteOldAudio = () => {
    console.log("Deleting old audio:", oldAudioFile);
    setOldAudio(null); // Remove audio from UI
    setDeletefromapi(true); // Ensure API receives delete request
  };
  console.log(deletefromapi, "asfromapiapiapas");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const loadLesson = (lesson) => {
    loadedLesson.current = {
      order: lesson.order ?? "",
      _id: lesson._id,
      programSlug: programSlugOf(lesson),
    };
    setOldAudio(lesson.audio_file || undefined);
    setDetailDescriptionCk(lesson.detailed_description || "");
    setInputs((prevState) => ({
      ...prevState,
      ["title"]: lesson.title || "",
      ["status"]: lesson.status,
      ["programStatus"]: String(lesson.status) === "true" ? "true" : "false",
      ["is_paid"]: String(lesson.is_paid) === "true",
      ["is_locked"]: lesson.is_locked === true,
      ["videoUrl"]: lesson.landing_lesson_video_url || "",
      ["short_description"]: lesson.short_description || "",
      ["detailed_description"]: lesson.detailed_description || "",
      ["video_duration"]: durationToDate(lesson),
      ["image"]: lesson.lesson_images?.thumbnail_1 || "",
      ["order"]: lesson.order ?? "",
      ["ks_stages"]: toStageList(lesson.ks_stages),
    }));
  };

  React.useEffect(() => {
    if (state) {
      loadLesson(state);
      return;
    }
    // Opened by URL (refresh, bookmark): there is no router state, so fetch it.
    (async () => {
      setIsLoading(true);
      const result = await lesson_detail_api(lessonSlug);
      if (result.code === 200 && result.lesson) {
        loadLesson(result.lesson);
      } else {
        enqueueSnackbar(result.message || "Lesson not found", {
          variant: "error",
        });
      }
      setIsLoading(false);
    })();
  }, []);
  //   console.log(typeof audioFile, "values of audio to be send ");

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //   console.log(
  //     moment(inputs.video_duration).format("LTS"),
  //     "newValuenewValuenewValue"
  //   );
  //console.log(inputs.video_duration, "inputs.video_duration ");
  console.log(
    moment(inputs.video_duration).format("HH:mm:ss"),
    "video_duration"
  );

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
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Edit Lesson</h2>
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
                  label="Lesson Name"
                  variant="outlined"
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
                  required
                  id="outlined-basic"
                  label="Landing Lesson Video Url "
                  variant="outlined"
                  fullWidth
                  name="videoUrl"
                  value={inputs.videoUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <OrderField
                  required
                  id="outlined-basic"
                  label="Order "
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
                    Lesson Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="programStatus"
                    value={inputs.programStatus}
                    label="Programme Status *"
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
                    Lesson Type *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_paid"
                    value={inputs.is_paid}
                    label="Lesson Type *"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Paid</MenuItem>
                    <MenuItem value={false}>Free</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="lesson-lock-label">
                    Lesson Access *
                  </InputLabel>
                  <Select
                    labelId="lesson-lock-label"
                    id="lesson-lock-select"
                    name="is_locked"
                    value={inputs.is_locked}
                    label="Lesson Access *"
                    onChange={handleChange}
                  >
                    <MenuItem value={false}>Unlocked</MenuItem>
                    <MenuItem value={true}>Locked</MenuItem>
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
                      <Tooltip title="Delete Audio">
                        <DeleteIcon
                          onClick={handldeDeleteAudio}
                          className="mt-3 icon-color"
                        />
                      </Tooltip>
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
                <div>
                  <p className="text-secondary">
                    {/* {oldAudioFile ? oldAudioFile : "No audio file"} */}
                  </p>
                  {oldAudioFile && (
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <audio
                        className="flex-grow-1"
                        src={s3baseUrl + oldAudioFile}
                        controls
                      />
                      <Tooltip title="Delete Audio" arrow>
                        <DeleteIcon
                          onClick={deleteOldAudio}
                          className="ms-3 icon-color"
                          style={{ cursor: "pointer" }} // Ensures it's clickable
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
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
                {inputs.image?.name ? (
                  <p className="text-secondary">{inputs.image.name}</p>
                ) : (
                  ""
                )}
              </div>

              
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="ks-stages-label">Key Stages</InputLabel>
                  <Select
                    labelId="ks-stages-label"
                    multiple
                    value={toStageList(inputs.ks_stages)}
                    onChange={(e) => setInputs(prev => ({ ...prev, ks_stages: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value }))}
                    input={<OutlinedInput label="Key Stages" />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {["Foundation","KS1","KS2","Year 8","Year 9","Year 10","Junior Infant / Senior Infant","1st Class","2nd Class","3rd Class","4th Class","5th Class","6th Class","1st Year","2nd Year","3rd Year"].map((stage) => (
                      <MenuItem key={stage} value={stage}>{stage}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
