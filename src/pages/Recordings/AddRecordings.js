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
import { IconButton, Divider, CircularProgress } from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
import { object } from "prop-types";
// import { ProgramListing } from "src/DAL/Program/Programs";
// import { AddRecording } from "src/DAL/Recording/Recordings";
import { get_root_value } from "src/utils/domUtils";
import {
  programmeActiveListing,
  programmeListing,
} from "../../DAL/Programme/Programme";
import { VaultActiveListing, VaultListing } from "src/DAL/Vault/vault";
import { AddRecording } from "src/DAL/Recording/RecordingsApi";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
  button: {
    backgroundColor: get_root_value("--button-background-color"),
    color: get_root_value("--button-text-color"),
    "&:hover": {
      backgroundColor: get_root_value("--button-background-color"),
      color: get_root_value("--button-text-color"),
    },
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


export default function AddRecordings() {
  const navigate = useNavigate();
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
  const [vaultList, setVaultList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [embedCode, setembedCode] = React.useState();

  const [inputs, setInputs] = React.useState({
    title: "",
    zoomLink: "",
    status: "",
    recordingStatus: "true",
    program: "",
    image: {},
    password: "",
    areaCode: "",
    videoUrl: "",
    groups: [],
    members: [],
    short_description: "",
    detailed_description: "",
    video_show_Status: "",
    button_text: "",
    button_link: "",
    type: "video",
    embed_code: "",
  });

  const getProgramListing = async () => {
    const result = await programmeActiveListing();
    setIsLoading(true);
    if (result.code === 200) {
      console.log(result, "getProgramListing");
      setProgramList(result.program);
      setProgramName(result.program[0].program_slug);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const getVaultList = async () => {
    const result = await VaultActiveListing();
    if (result.code === 200) {
      console.log(result, "result category");
      const categoryData = result.vault_category;
      categoryData.unshift({ _id: "", vault_slug: "", vault_title: "None" });
      setVaultList(categoryData);
      // setVaultName(result.vault_category[0].vault_slug);
    }
  };
  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };

  const fileChangedHandler = (e) => {
    console.log(e.target.files[0]);
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const audioFileChange = (e) => {
    console.log(e.target.files[0]);
    setAudio(e.target.files[0]);
  };
  const handleProgramName = (data) => {
    console.log(data, "programName");
    setProgramName(data.program_slug);
  };
  const handleVaultName = (data) => {
    console.log(data, "Name");
    setVaultName(data.vault_slug);
  };
  const handldeDeleteAudio = () => {
    console.log("deleteAudio");
    setAudio();
  };
  const handleChangeMembers = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
    const membersName = typeof value === "string" ? value.split(",") : value;
    setInputs((input) => ({
      ...input,
      ["members"]: membersName,
    }));
  };
  const handleChangeGroups = (event) => {
    const {
      target: { value },
    } = event;
    setGroups(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const groupName = typeof value === "string" ? value.split(",") : value;
    setInputs((input) => ({
      ...input,
      ["groups"]: groupName,
    }));
  };

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    console.log(typeof dateType, "dateType");
    setDate(newValue);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // enqueueSnackbar("Enter Valid Video URL", { variant: "error" });

    e.preventDefault();
    if (!date) {
      enqueueSnackbar("Recording Date is required", {
        variant: "error",
      });
      return; // Prevent form submission
    }
    if (!date || !moment(date).isValid()) {
      enqueueSnackbar("Please enter a valid date in the format dd/mm/yyyy", {
        variant: "error",
      });
      return; // Prevent form submission
    }
    const selectedYear = moment(date).year();
    if (selectedYear < 1900 || selectedYear > 2024) {
      enqueueSnackbar("Invalid Year in date field.", {
        variant: "error",
      });
      return; // Prevent form submission
    }
    const selectedMonth = moment(date).month();
    if (selectedMonth > 12 || selectedMonth == 0) {
      enqueueSnackbar("Invalid Month in date field", {
        variant: "error",
      });
      return; // Prevent form submission
    }
    const selectedDAY = moment(date).day();

    if (selectedDAY > 31 || selectedDAY == 0) {
      enqueueSnackbar("Invalid Day in date field", {
        variant: "error",
      });
      return; // Prevent form submission
    }

    if (!file) {
      enqueueSnackbar("image is required", { variant: "error" });
      return;
    }
    if (inputs.short_description.length < 5) {
      enqueueSnackbar("Short description must be at least 5 characters long.", {
        variant: "error",
      });
      return; // Prevent form submission
    }

    // console.log(inputs, "Text fields");
    // console.log(personName, "Members");
    // console.log(groups, "Groups");
    // console.log(email, password, "email,password");
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("type", inputs.type);

    if (inputs.type === "embed_code") {
      formData.append("embed_code", inputs.embed_code);
    } else if (inputs.type === "video") {
      formData.append("video_url", inputs.videoUrl);
    }
    console.log(inputs.type, "inputs type............");

    formData.append("button_text", inputs.button_text);
    formData.append("button_link", inputs.button_link);
    formData.append("short_description", inputs.short_description);
    // formData.append("detailed_description", inputs.detailed_description);
    formData.append("status", inputs.recordingStatus);
    formData.append("program_slug", programName);
    formData.append("recording_date", moment(date).format("YYYY-MM-DD"));
    formData.append("vault_category_slug", vaultName);
    // formData.append("is_program_show_on_list", inputs.video_show_Status);
    if (file) {
      formData.append("image", inputs.image);
    }
    if (audioFile) {
      formData.append("audio_file", audioFile);
      console.log(audioFile, "not empty case of audio file");
    } else {
    }
    console.log(...formData, "form data values..........");
    //console form data
    for (var value of formData.values()) {
      console.log(value, "form data value");
    }

    setIsLoading(true);
    const result = await AddRecording(formData);
    if (result.code === 200) {
      console.log(result, "result");
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/recording-list`);
    } else {
      console.log(result);
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeProgram = (e) => {
    console.log(e, "handleChangeProgram");
    setProgramName(e.target.value);
  };
  const handleChangeVault = (event) => {
    console.log(event.target.value, "handleChangeVault");
    setVaultName(event.target.value);
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    getProgramListing();
    getVaultList();
  }, []);
  //   console.log(typeof audioFile, "values of audio to be send ");
  console.log(programList, "programListprogramList");
  console.log(programName, "programName");

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  console.log(vaultList, "vaultListvaultListvaultList");

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
        <div className="col-12">
          <h2>Add Recording</h2>
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
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      label="Recording Date *"
                      inputFormat="dd/MM/yyyy"
                      value={date}
                      onChange={handleChangeDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>

              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Document Title"
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
                  label="Document Link"
                  variant="outlined"
                  fullWidth
                  type="URL"
                  name="button_link"
                  value={inputs.button_link}
                  onChange={handleChange}
                />
              </div> */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Recording Type *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="type"
                    value={inputs.type || ""}
                    label="Recording Type*"
                    onChange={handleChange}
                  >
                    <MenuItem value="video">Video Url</MenuItem>{" "}
                    <MenuItem value="embed_code">Embed Code</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {inputs.type === "video" && (
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Video Url"
                    variant="outlined"
                    fullWidth
                    type="url"
                    name="videoUrl"
                    value={inputs.videoUrl}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Recording Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="recordingStatus"
                    value={inputs.recordingStatus}
                    label="Recording Status *"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Video Show Status*
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="video_show_status"
              value={inputs.video_show_Status}
              label="Show on Main Website *"
              onChange={handleChange}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </div> */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Programme
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={programName}
                    label="Programme"
                    onChange={handleChangeProgram}
                  >
                    {programList.map((program, i) => {
                      return (
                        <MenuItem key={i} value={program.program_slug}>
                          {program.title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                {/* <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={vaultList}
            getOptionLabel={(option) => option.vault_title}
            onChange={(event, newValue) => {
              handleVaultName(newValue);
            }}
            // sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Vault Category" />
            )}
          /> */}
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={vaultName}
                    label=" Category"
                    onChange={handleChangeVault}
                  >
                    {vaultList.map((vault, i) => {
                      return (
                        <MenuItem value={vault.vault_slug}>
                          {vault.vault_title}
                        </MenuItem>
                      );
                    })}
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
                    {file ? (
                      <img
                        className="image-border"
                        src={file}
                        height="50px"
                      ></img>
                    ) : (
                      ""
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
              {inputs.type === "embed_code" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Embed Code"
                      multiline
                      required
                      rows={6}
                      name="embed_code"
                      value={inputs.embed_code}
                      onChange={handleChange}
                    />
                  </FormControl>
                </div>
              )}

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
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button className="small-contained-button">Submit</button>
        </div>
      </form>
    </div>
  );
}
