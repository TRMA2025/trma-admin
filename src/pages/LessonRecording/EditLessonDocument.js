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
import { AddLessonApi, AddLessonRecordingApi } from "src/DAL/lessons/lessons";
import { DatePicker, TimePicker } from "@mui/lab";
import {
  AddLessonDocumentApi,
  EditLessonDocumentApi,
} from "src/DAL/lessonDocument/LessonDocument";
import { s3baseUrl } from "src/config/config";
import KsStagesSelect, { appendKsStages } from "src/components/KsStagesSelect";

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


export default function EditLessonDocument() {
  const navigate = useNavigate();
  const { state } = useLocation();

  console.log(state, "state in edit lesson......");
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
  console.log(imageStatus, "imageStatusimageStatusv");
  // Key stages this resource is for (16 Sep 2026).
  const [ksStages, setKsStages] = React.useState([]);
  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    docType: "image",
    embed_code: "",
    image: {},
    image_thumbnail: {},
    otherDocument: {},
    detailed_description: "",
    order: "",
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
    console.log("called");
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
    //console.log("kkkkkkkk");
    setThumbnailFileNew(URL.createObjectURL(e.target.files[0]));

    // setThumbnailFile(URL.createObjectURL(e.target.files[0]));
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
      console.log(activeType, "activeTypeactiveTypeactiveType");
      const formData = new FormData();
      formData.append("title", inputs.title);
      // formData.append("lesson_slug", params.slug);
      formData.append("detailed_description", inputs.detailed_description);
      formData.append("status", inputs.status);
      formData.append("document_type", inputs.docType);
      appendKsStages(formData, ksStages);
      formData.append("order", inputs.order);
      console.log(audioFile, "audio file file file");

      if (inputs.docType == "audio" && audioStatus == true) {
        formData.append("document_file", audioFile);
        console.log("audio case");
      } else if (inputs.docType == "image" && imageStatus == true) {
        formData.append("document_file", inputs.image);
        console.log(imageStatus, "image case");
      } else if (inputs.docType == "other_document" && otherStatus == true) {
        console.log("other case");
        formData.append("document_file", inputs.otherDocument);
      } else if (inputs.docType == "embed_code") {
        console.log("embed case");
        formData.append("embed_code", inputs.embed_code);
      }
      if (inputs.image_thumbnail) {
        formData.append("document_thumbnail", inputs.image_thumbnail);
      }

      for (var value of formData.values()) {
      }
      setIsLoading(true);
      const result = await EditLessonDocumentApi(formData, state.document_slug);
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
  console.log(activeType, "activeType");
  React.useEffect(() => {
    setActiveType(state.document_type);
    setKsStages(Array.isArray(state?.ks_stages) ? state.ks_stages : []);
    if (state?.document_type == "other_document") {
      setOldImageOther(state.document_thumbnail);
    } else if (state?.document_type == "image") {
      setOldImageOther(state.document_images_url.thumbnail_2);
    } else if (state?.document_type == "audio") {
      setOldAudio(state.document_file_url);
    }
    setThumbnailFile(state.document_thumbnail);

    setInputs((prevState) => ({
      ...prevState,
      ["title"]: state.title,
      ["embed_code"]: state.embed_code,
      ["status"]: state.status,
      ["docType"]: state.document_type,
      ["detailed_description"]: state.detailed_description,
      ["image_thumbnail"]: state.document_thumbnail,
      ["order"]: state.order,
    }));
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(isLoading, "isLoadingisLoadingisLoadingisLoading");
  //console.log(inputs.otherDocument, "inputs.otherDocument");
  //console.log(state, "paramsparams");
  //console.log(s3baseUrl + oldAudio, "s3baseUrl + " / " + oldAudio");

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
          <h2>Edit Resource</h2>
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
                  label="Resource Title "
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
                    Resource Type *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="docType"
                    value={inputs.docType}
                    label="Resource Type*"
                    onChange={handleChange}
                  >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                    <MenuItem value="embed_code">Embed Code</MenuItem>

                    <MenuItem value="other_document">PDF / Document</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Resource Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label="Resource Status *"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
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

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <KsStagesSelect value={ksStages} onChange={setKsStages} />
              </div>
              {inputs.docType === "audio" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Upload Audio *</p>
                      <FormHelperText className="pt-0">
                        Allowed Formats is "Mp3",200Mb
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
                  <p className="text-secondary">
                    {audioFile && audioFile.name}
                  </p>
                  {oldAudio && (
                    <audio
                      className="w-100"
                      src={s3baseUrl + oldAudio}
                      controls
                    />
                  )}
                </div>
              )}
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
              {inputs.docType == "other_document" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Upload PDF or Document *</p>
                      <FormHelperText className="pt-0">
                        Other Resource *("PDF", "DOC", "XLSX",
                        "DOCX","CSV","200MB")
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {/* {oldImageOther && (
                  <img src={s3baseUrl + oldImageOther} height="50" />
                )} */}
                    </div>
                    <div className="col-5 text-end pt-2">
                      {state.document_file_url !== "" && (
                        <a
                          href={s3baseUrl + state.document_file_url}
                          target="_blank"
                          className="me-2 small-contained-button-search a-style"
                        >
                          View File
                        </a>
                      )}
                      <label htmlFor="contained-button-file">
                        <Input
                          accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.png,.csv"
                          id="contained-button-file"
                          multiple
                          type="file"
                          name="otherDocument"
                          onChange={fileChangedHandlerOther}
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
                  {inputs.otherDocument.name == "" ? (
                    ""
                  ) : (
                    <p className="text-secondary">
                      {inputs.otherDocument.name}
                    </p>
                  )}
                </div>
              )}
              {inputs.docType == "embed_code" && (
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
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Resource Thumbnail </p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 100*100) ("JPG", "JPEG","PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {/* {thumbnail_file && (
                    <img
                      className="image-border"
                      src={s3baseUrl + thumbnail_file}
                      height="50"
                    />
                  )} */}
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
