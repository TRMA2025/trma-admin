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
import { menuList } from "src/DAL/Menu/Menu";
import { AddProgrammeApi } from "src/DAL/Programme/Programme";
import TinyEditor from "../../components/ckeditor/Ckeditor";

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


export default function AddProgramme() {
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
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "",
    programStatus: "true",
    showStatus: "true",
    image: {},
    accessType: "unlimited",
    videoUrl: "",
    short_description: "",
    detailed_description: "",
    video_show_Status: "",
    days: 0,
    no_of_start_days: 0,
  });

  const getNavItemList = async () => {
    const result = await menuList();
    if (result.code === 200) {
      setMenuList(result.menus);
    }
  };
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
    //console.log("clicked");
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
    //console.log("reset State");
  };
  const handleChangeMembers = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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
    if (!file) {
      enqueueSnackbar("image is required", { variant: "error" });
      return;
    }
    if (!detailDescriptionCk) {
      enqueueSnackbar("detail description is required", { variant: "error" });
      return;
    }
    if (
      urlPatternValidation(inputs.videoUrl) === false &&
      inputs.videoUrl !== ""
    ) {
      enqueueSnackbar("Enter Valid Video URL", { variant: "error" });
    } else {
      if (inputs.short_description.length > 200) {
        enqueueSnackbar("Short Description Must Be Less Than 200 Characters", {
          variant: "error",
        });
      } else {
        if (inputs.days < 0) {
          enqueueSnackbar("No of days must be positive number ", {
            variant: "error",
          });
        } else if (inputs.no_of_start_days < 0) {
          enqueueSnackbar("No of start days must be positive number ", {
            variant: "error",
          });
        } else {
          const formData = new FormData();
          formData.append("title", inputs.title);

          formData.append("short_description", inputs.short_description);
          formData.append("detailed_description", detailDescriptionCk);
          formData.append("status", inputs.programStatus);
          formData.append("video_url", inputs.videoUrl);
          formData.append("program_access_type", inputs.accessType);
          formData.append("is_program_show_on_list", inputs.showStatus);
          formData.append("no_of_limited_days", inputs.days);
          formData.append("nav_items", JSON.stringify(navItems));
          formData.append(
            "no_of_start_days",
            inputs.no_of_start_days ? inputs.no_of_start_days : 0
          );
          // formData.append("recording_date", moment(date).format("YYYY-MM-DD"));
          // formData.append("vault_category_slug", vaultName);
          // formData.append("is_program_show_on_list", inputs.video_show_Status);
          if (file) {
            formData.append("main_image", inputs.image);
          }
          if (audioFile) {
            formData.append("audio_file", audioFile);
            //console.log(audioFile, "not empty case of audio file");
          } else {
          }
          //console form data
          for (var value of formData.values()) {
            //console.log(value, "form data value");
          }
          console.log(...formData, "formmmmmmmmmmmmmmmmmmmmmmmmmm");
          if (+inputs.no_of_start_days > +inputs.days) {
            enqueueSnackbar(
              "No of Limit Start Days cannot be greater than No of Limit End days",
              { variant: "error" }
            );
            setIsLoading(false);
            return;
          }
          setIsLoading(true);
          const result = await AddProgrammeApi(formData);
          if (result.code === 200) {
            //console.log(result, "result");
            enqueueSnackbar(result.message, { variant: "success" });
            navigate(`/programmes`);
          } else {
            //console.log(result, "error case");
            enqueueSnackbar(result.message, { variant: "error" });
            setIsLoading(false);
          }
        }
      }
    }
  };
  const handleChangeProgram = (e) => {
    setProgramName(e.target.value);
  };
  const handleChangeVault = (event) => {
    setVaultName(event.target.value);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    getNavItemList();
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
            />
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
          <h2>Add Programme</h2>
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
                  label="Programme Name"
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
                  label="Video Url "
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
                    Programme Status *
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
                    Is Programme Show On List? *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="showStatus"
                    value={inputs.showStatus}
                    label="Is Programme Show On List? *"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Programme Access Type *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="accessType"
                    value={inputs.accessType}
                    label="Programme Access Type *"
                    onChange={handleChange}
                  >
                    <MenuItem value="limited">Limited</MenuItem>
                    <MenuItem value="unlimited">Unlimited</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {inputs.accessType == "limited" && (
                <>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="No Of Limit Start Days"
                      variant="outlined"
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      placeholder="No Of Limit Start Days"
                      fullWidth
                      required
                      name="no_of_start_days"
                      value={inputs.no_of_start_days}
                      onChange={handleChange}
                      onWheel={(event) => event.target.blur()}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="No Of Days *"
                      variant="outlined"
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      name="days"
                      value={inputs.days}
                      onChange={handleChange}
                      onWheel={(event) => event.target.blur()}
                    />
                  </div>
                </>
              )}

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">
                    Nav Items
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={navItems}
                    onChange={handleChangeNavItem}
                    input={<OutlinedInput label="Nav Items" />}
                    MenuProps={MenuProps}
                  >
                    {menuLists.map((name) => (
                      <MenuItem
                        key={name}
                        value={name.option_value}
                        style={getStyles(name, navItems, theme)}
                      >
                        {name.option_label}
                      </MenuItem>
                    ))}
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
                  <div className="col-6">
                    <p className="">Upload Image *</p>
                    <FormHelperText className="pt-0">
                      Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-1">
                    {file && (
                      <img className="image-border" src={file} height={50} />
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
                    label="Short Description "
                    required
                    multiline
                    rows={6}
                    name="short_description"
                    value={inputs.short_description}
                    onChange={handleChange}
                  />
                  <FormHelperText>Maximum limit 200 characters</FormHelperText>
                </FormControl>
              </div>
              {/* <div className="col-12 mt-5">
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-flexible"
              label="Detail Description *"
              multiline
              rows={6}
              name="detailed_description"
              value={inputs.detailed_description}
              onChange={handleChange}
            />
          </FormControl>
        </div> */}
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
          <button className="small-contained-button">Submit</button>
        </div>
      </form>
    </div>
  );
}
