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
import { AddLessonApi, AddLessonRecordingApi } from "src/DAL/lessons/lessons";
import { DatePicker, TimePicker } from "@mui/lab";
import {
  AddLessonDocumentApi,
  EditGettingStartedEvaluationApi,
  EditLessonDocumentApi,
  EditLessonEvaluationApi,
} from "src/DAL/lessonDocument/LessonDocument";
import { s3baseUrl } from "src/config/config";

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


export default function EditGettingStartedEvaluation() {
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
  const [thumbnail_fileNew, setThumbnailFileNew] = React.useState();

  const [otherDocument, setOtherDocument] = React.useState();
  const [file, setProfileImage] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [navItems, setNavitems] = React.useState([]);
  const [recordingDate, setRecordingDate] = React.useState(null);
  const [oldImageOther, setOldImageOther] = React.useState("");
  const [audioFile, setAudio] = React.useState();
  const [oldAudio, setOldAudio] = React.useState("");
  const [activeType, setActiveType] = useState("");
  const [imageStatus, setImageStatus] = useState(false);
  const [audioStatus, setAudioStatus] = useState(false);
  const [otherStatus, setOtherStatus] = useState(false);
  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    docType: "image",
    embed_code: "",
    image: {},
    image_thumbnail: "",
    otherDocument: {},
    detailed_description: "",
    embed_code: "",
  });

  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(typeof value === "string" ? value.split(",") : value);
  };

  const fileChangedHandler = (e) => {
    setActiveType("image");
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setImageStatus(true);
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerOther = (e) => {
    setOtherDocument(URL.createObjectURL(e.target.files[0]));
    setOtherStatus(true);
    setInputs({
      ...inputs,
      ["otherDocument"]: e.target.files[0],
    });
  };
  const fileChangedHandlerThumbnails = (e) => {
    setThumbnailFileNew(URL.createObjectURL(e.target.files[0]));

    setInputs({
      ...inputs,
      ["image_thumbnail"]: e.target.files[0],
    });
  };
  const handleThumbnail = (e) => {};
  const audioFileChange = (e) => {
    setAudioStatus(true);
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
    let date = moment(recordingDate).format("YYYY-MM-DD");
    if (inputs.detailed_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
    } else {
      const formData = new FormData();
      formData.append("name", inputs.title);
      formData.append("short_description", inputs.detailed_description);
      formData.append("status", inputs.status);
      formData.append("embed_code", inputs.embed_code);
      if (thumbnail_fileNew) {
        formData.append("main_image", inputs?.image_thumbnail);
      }

      for (var value of formData.values()) {
      }
      console.log(...formData, "form data value");
      setIsLoading(true);
      const result = await EditGettingStartedEvaluationApi(formData, state._id);
      if (result.code === 200) {
        enqueueSnackbar(" Getting Started Evaluation updated successfully.", {
          variant: "success",
        });
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
  React.useEffect(() => {
    setThumbnailFile(state.image.thumbnail_1);

    setInputs((prevState) => ({
      ...prevState,
      ["title"]: state.name,
      ["embed_code"]: state.embed_code,
      ["status"]: state.status,
      ["docType"]: state.document_type,
      ["detailed_description"]: state.short_description,
      ["image_thumbnail"]: state.image.thumbnail_1,
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
          <h2>Edit Lesson Evaluation</h2>
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
                  label="Evaluation Name"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label=" Status *"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4"></div>

              {inputs.docType == "image" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Upload Image *</p>
                      <FormHelperText className="pt-0">
                        Image Size(100 X 100) ("JPG", "JPEG", "PNG","WEBP")
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {oldImageOther && (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldImageOther}
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
              )}

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
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Thumbnail Image* </p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 100*100) ("JPG", "JPEG","PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {thumbnail_fileNew ? (
                      <img
                        className="image-border"
                        src={thumbnail_fileNew}
                        height="50"
                      />
                    ) : thumbnail_file ? (
                      <img
                        className="image-border"
                        src={s3baseUrl + thumbnail_file}
                        height="50"
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-file-thumbnail">
                      <Input
                        accept="image/*"
                        id="contained-button-file-thumbnail"
                        multiple
                        // required
                        type="file"
                        name="image"
                        onChange={fileChangedHandlerThumbnails}
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
                {inputs?.image_thumbnail?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">
                    {inputs?.image_thumbnail?.name}
                  </p>
                )}
              </div>

              <div className="col-12 mt-5">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Short Description"
                    multiline
                    rows={6}
                    name="detailed_description"
                    value={inputs.detailed_description}
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
