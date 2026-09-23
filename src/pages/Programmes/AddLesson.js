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
import { AddLessonApi } from "src/DAL/lessons/lessons";
import { TimePicker } from "@mui/lab";
import TinyEditor from "src/components/ckeditor/Ckeditor";
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


export default function AddLesson() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programList, setProgramList] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");

  //   const [value, setValue] = React.useState(new Date());

  const [inputs, setInputs] = React.useState({
    ks_stages: [],
    title: "",
    status: "",
    programStatus: "true",
    is_paid: true,
    is_locked: false,
    image: {},
    videoUrl: "",
    short_description: "",
    detailed_description: "",
    video_duration: new Date("00"),
  });

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
  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!detailDescriptionCk) {
      enqueueSnackbar("detail  description is required", { variant: "error" });
      return;
    }
    if (!file) {
      enqueueSnackbar("image is required", { variant: "error" });
      return;
    }

    if (urlPatternValidation(inputs.videoUrl) === false) {
      enqueueSnackbar("Enter Valid Video URL", { variant: "error" });
    } else {
      const originalDate = new Date(inputs.video_duration);
      const hours = originalDate.getHours().toString().padStart(2, "0");
      const minutes = originalDate.getMinutes().toString().padStart(2, "0");
      const seconds = originalDate.getSeconds().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const formData = new FormData();
      (inputs.ks_stages || []).forEach((st) => formData.append("ks_stages[]", st));
      formData.append("title", inputs.title);
      formData.append("program_slug", state);
      if (file) {
        formData.append("main_image", inputs.image);
      }
      formData.append("short_description", inputs.short_description);
      formData.append("detailed_description", detailDescriptionCk);
      formData.append("status", inputs.programStatus);
      formData.append("is_paid", inputs.is_paid);
      formData.append("is_locked", inputs.is_locked);
      formData.append("landing_lesson_video_url", inputs.videoUrl);
      formData.append("lesson_duration", formattedTime);

      if (audioFile) {
        formData.append("audio_file", audioFile);
      } else {
      }

      setIsLoading(true);
      const result = await AddLessonApi(formData);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
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

  React.useEffect(() => {}, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

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
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Add Lesson</h2>
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
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Lesson Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="programStatus"
                    value={inputs.programStatus}
                    label="lesson Status *"
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
                    label="lesson Type *"
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
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
                {/* <p className="text-secondary">{audioFile && audioFile.name}</p> */}
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

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="ks-stages-label">Key Stages</InputLabel>
                  <Select
                    labelId="ks-stages-label"
                    multiple
                    value={inputs.ks_stages || []}
                    onChange={(e) => setInputs(prev => ({ ...prev, ks_stages: typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value }))}
                    input={<OutlinedInput label="Key Stages" />}
                    renderValue={(selected) => selected.join(", ")}
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
