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
import {
  AddProgrammeApi,
  AddProgrammeDocumentApi,
} from "src/DAL/Programme/Programme";
import { AddLessonApi, AddLessonRecordingApi } from "src/DAL/lessons/lessons";
import { DatePicker, TimePicker } from "@mui/lab";
import { AddLessonDocumentApi } from "src/DAL/lessonDocument/LessonDocument";
import { programmeListing } from "../../DAL/Programme/Programme";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { AddStudySessionApi } from "src/DAL/studySession/studySessionApi";

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


export default function AddStudySession() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail_file, setThumbnailFile] = React.useState();
  const [otherDocument, setOtherDocument] = React.useState();
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programList, setProgramList] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [recordingDate, setRecordingDate] = React.useState(null);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [docStatus, setDocStatus] = React.useState("false");

  //   const [value, setValue] = React.useState(new Date());

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    docType: "image",
    image: {},
    image_thumbnail: {},
    otherDocument: {},
    short_description: "",
    is_show_sidebar: "true",
  });

  const getProgramListing = async () => {
    const result = await programmeListing();
    setIsLoading(true);
    if (result.code === 200) {
      //console.log(result, "getProgramListing");
      setProgramList(result.program);
      setProgramName(result.program[0].program_slug);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  //console.log(programName, "programNameprogramNameprogramNameprogramName");

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerOther = (e) => {
    setOtherDocument(URL.createObjectURL(e.target.files[0]));
    setDocStatus(true);
    setInputs({
      ...inputs,
      ["otherDocument"]: e.target.files[0],
    });
  };
  const fileChangedHandlerThumbnails = (e) => {
    //console.log("kkkkkkkk");
    setThumbnailFile(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image_thumbnail"]: e.target.files[0],
    });
  };
  const handleThumbnail = (e) => {
    //console.log("kkkkkkkk");
    // setThumbnailFile(URL.createObjectURL(e.target.files[0]));
    // setInputs({
    //   ...inputs,
    //   ["image_thumbnail"]: e.target.files[0],
    // });
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
    //console.log(typeof dateType, "dateType");
    setDate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let date = moment(recordingDate).format("YYYY-MM-DD");

    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("program_slug", programName);
    formData.append("detailed_description", detailDescriptionCk);
    formData.append("short_description", inputs.short_description);
    formData.append("image", inputs.image_thumbnail);
    formData.append("status", inputs.status);
    // formData.append("is_show_sidebar", inputs.is_show_sidebar);

    if (docStatus == true) {
      formData.append("document_file", inputs.otherDocument);
    }

    //console form data
    for (var value of formData.values()) {
      //console.log(value, "form data value");
    }

    setIsLoading(true);
    const result = await AddStudySessionApi(formData);
    if (result.code === 200) {
      //console.log(result, "result");
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      //console.log(result, "error case");
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleChangeProgram = (e) => {
    //console.log(e, "handleChangeProgram");
    setProgramName(e.target.value);
  };

  React.useEffect(() => {
    getProgramListing();
  }, []);
  //   console.log(typeof audioFile, "values of audio to be send ");

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  //console.log(params, "params");
  //console.log(inputs.image, "inputs.image");
  //console.log(inputs.otherDocument, "inputs.other");

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
          <h2>Add Study Session</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Title *"
            variant="outlined"
            fullWidth
            name="title"
            value={inputs.title}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          {/* <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={programList}
            value={programName}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => {
              // handleProgramName(newValue);
              setProgramName(newValue.program_slug);
            }}
            // sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Programmes" />
            )}
          /> */}
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Programme</InputLabel>
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

        {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Do you want to use in Sidebar *
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="is_show_sidebar"
              value={inputs.is_show_sidebar}
              label="Do you want to use in Sidebar *"
              onChange={handleChange}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </div> */}
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="status"
              value={inputs.status}
              label="Status *"
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
              <p className="">Upload Document </p>
              <FormHelperText className="pt-0">
                Other Document *("PDF", "DOC", "XLSX", "DOCX","CSV","200MB")
              </FormHelperText>
            </div>
            <div className="col-2">
              {/* {otherDocument && <img src={otherDocument} height="50" />} */}
            </div>
            <div className="col-5 text-end pt-2">
              <label htmlFor="contained-button-file-other">
                <Input
                  accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.png,.csv"
                  id="contained-button-file-other"
                  multiple
                  type="file"
                  name="otherDocument"
                  onChange={fileChangedHandlerOther}
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
          {inputs.otherDocument.name == "" ? (
            ""
          ) : (
            <p className="text-secondary">{inputs.otherDocument.name}</p>
          )}
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Upload Image *</p>
              <FormHelperText className="pt-0">
                Image Size ("JPG", "JPEG", "PNG","WEBP")(Recommended Size
                1000*670)
              </FormHelperText>
            </div>
            <div className="col-2">
              {thumbnail_file && (
                <img
                  className="image-border"
                  src={thumbnail_file}
                  height="50"
                />
              )}
            </div>
            <div className="col-5 text-end pt-2">
              <label htmlFor="contained-button-file-thumbnail">
                <Input
                  accept="image/*"
                  id="contained-button-file-thumbnail"
                  multiple
                  type="file"
                  name="image"
                  onChange={fileChangedHandlerThumbnails}
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
          {inputs.image_thumbnail.name == "" ? (
            ""
          ) : (
            <p className="text-secondary">{inputs.image_thumbnail.name}</p>
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

        <div className="text-end mt-4">
          <button onClick={handleSubmit} className="small-contained-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
