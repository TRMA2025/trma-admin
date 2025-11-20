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
import { s3baseUrl } from "src/config/config";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import { activeTagsApi, BokEditApi } from "src/DAL/book";
import { tag } from "devexpress-reporting/scopes/reporting-chart-internal";

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


export default function EditBook() {
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
  const [audioFile, setAudio] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [navItems, setNavitems] = React.useState([]);
  const [recordingDate, setRecordingDate] = React.useState(null);
  const [oldImageOther, setOldImageOther] = React.useState("");
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [activeType, setActiveType] = useState("");
  const [imageStatus, setImageStatus] = useState(false);
  const [audioStatus, setAudioStatus] = useState(false);
  const [otherStatus, setOtherStatus] = useState(false);
  const [tagsList, setTagsList] = useState([]);
  const [groupsName, setGroupsName] = useState([]);
  const [selectedProgramIds, setSelectedProgramIds] = useState([]);
  const [error, setError] = useState(false);
  const [selectedTags, setSelectedTags] = useState(state?.tags || []);

  const [errors, setErrors] = useState({});
  console.log(selectedProgramIds, "selectedProgramIdsselectedProgramIds");
  console.log(groupsName, "groupsName groupsName");
  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    docType: "",
    embed_code: "",
    image: {},
    image_thumbnail: {},
    otherDocument: {},
    detailed_description: "",
    order: "",
    tags: "",
    embed: "",
    short_description: "",
  });
  console.log(tagsList, "tagsListtagsListtagsListtagsList");
  console.log(state, "statestatestatestatestate in dedit");

  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(typeof value === "string" ? value.split(",") : value);
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setImageStatus(true);
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerOther = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
    ];
    setOtherStatus(true);

    if (!allowedTypes.includes(file.type)) {
      enqueueSnackbar(
        `Unsupported file type. Please upload PDF, XLS, XLSX, DOC, DOCX, or CSV files only.`,
        {
          variant: "error",
          autoHideDuration: 3000,
        }
      );
      return;
    }

    setOtherDocument(URL.createObjectURL(file));
    setInputs({
      ...inputs,
      otherDocument: file,
    });
  };
  console.log(otherDocument, "otherdocdoc");
  const fileChangedHandlerThumbnails = (e) => {
    setThumbnailFileNew(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image_thumbnail"]: e.target.files[0],
    });
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
  const getTagsList = async () => {
    const result = await activeTagsApi();
    console.log(result, "tags list.....");
    if (result.code === 200) {
      const tags = result.activeTags.map((tag) => ({
        name: tag.name,
        _id: tag._id,
        ...tag,
      }));
      setTagsList(result.activeTags);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  React.useEffect(() => {
    getTagsList();
  }, []);
  const handleChangeGroup = (event, value) => {
    console.log(value, "handleChangeGrouphandleChangeGrouphandleChangeGroup");
    console.log(value, "event value is......");
    const programme_ids = value.map((tag) => tag._id);

    console.log(programme_ids, "programme_ids value is......");
    const selectedNames = typeof value === "string" ? value.split(",") : value;
    setGroupsName(value);
    setSelectedProgramIds(programme_ids);
  };

  console.log(state.tags, "Ssssssssadsj");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (oldImageOther) {
    } else if (inputs.docType == "document_file" && !otherDocument) {
      enqueueSnackbar("document_file is required", {
        variant: "error",
      });

      return;
    }

    // Check if either the groupsName or tags are empty
    if (groupsName.length === 0 && state.tags.length === 0) {
      enqueueSnackbar("At least choose one tag", { variant: "error" });
      return;
    }

    // External URL handling
    if (inputs.docType === "external_url") {
      if (!inputs.embed_code || inputs.embed_code.trim() === "") {
        enqueueSnackbar("White spaces are not allowed for the URL field.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        setErrors((prevErrors) => ({
          ...prevErrors,
          embed_code: "White spaces are not allowed.",
        }));
        return;
      }

      // Check if the URL contains any white spaces
      if (/\s/.test(inputs.embed_code)) {
        enqueueSnackbar("The URL cannot contain white spaces.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        setErrors((prevErrors) => ({
          ...prevErrors,
          embed_code: "The URL cannot contain white spaces.",
        }));
        return;
      }

      if (!/^(https?:\/\/)/.test(inputs.embed_code)) {
        enqueueSnackbar(
          "Please enter a valid URL starting with http:// or https://.",
          {
            variant: "error",
            autoHideDuration: 3000,
          }
        );
        setErrors((prevErrors) => ({
          ...prevErrors,
          embed_code:
            "Please enter a valid URL starting with http:// or https://.",
        }));
        return;
      }

      if (/\s/.test(inputs.embed_code)) {
        enqueueSnackbar("The URL cannot contain spaces.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        setErrors((prevErrors) => ({
          ...prevErrors,
          embed_code: "The URL cannot contain spaces.",
        }));
        return;
      }

      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
        // Clear embedCode only when docType is changed and not when typing in the embedCode field
        ...(name === "docType" && value !== "embed_code" && { embed: "" }),
      }));
    }

    let date = moment(recordingDate).format("YYYY-MM-DD");

    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("detailed_description", detailDescriptionCk);
    formData.append("short_description", inputs.short_description);

    formData.append("status", inputs.status);
    console.log(inputs.docType);
    formData.append("type", inputs.docType);
    console.log(inputs.docType, "docTypedocTypedocType");
    formData.append("order", inputs.order);
    const tagsToSubmit =
      selectedProgramIds.length > 0
        ? selectedProgramIds
        : state.tags.map((tag) => tag._id) || [];
    console.log(
      tagsToSubmit,
      "tagsToSubmittagsToSubmittagsToSubmittagsToSubmittagsToSubmit"
    );
    if (tagsToSubmit.length === 0) {
      enqueueSnackbar("At least choose one tag", { variant: "error" });
      return;
    }

    formData.append("tags", JSON.stringify(tagsToSubmit));
    if (inputs.docType == "document_file" && otherStatus == true) {
      formData.append("document_file", inputs.otherDocument);
    } else if (inputs.docType == "external_url") {
      formData.append("external_url", inputs.embed_code);
    } else if (inputs.docType == "embed_code") {
      formData.append("embed_code", inputs.embed);
    }

    if (thumbnail_fileNew) {
      formData.append("image", inputs.image_thumbnail);
    }

    console.log(...formData, "form data value");

    setIsLoading(true);
    const result = await BokEditApi(state._id, formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value, "valuevaluevaluevalue");

    setInputs((values) => ({ ...values, [name]: value }));

    if (name === "embed_code") {
      if (value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          embed_code: "White spaces are not allowed.",
        }));
        enqueueSnackbar("White spaces are not allowed for this URL field.", {
          variant: "error",
          autoHideDuration: 3000,
        });
      } else if (!/^(https?:\/\/)/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          embed_code:
            "Please enter a valid URL starting with http:// or https://.",
        }));
        enqueueSnackbar(
          "Please enter a valid URL starting with http:// or https://.",
          {
            variant: "error",
            autoHideDuration: 3000,
          }
        );
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          embed_code: "",
        }));
      }
    }
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "docType" && value !== "embed_code" && { embed: "" }),
    }));
  };

  React.useEffect(() => {
    setActiveType(state.document_type);
    setDetailDescriptionCk(state.detailed_description);
    setThumbnailFile(state.image);

    if (state?.type == "document_file") {
      setOldImageOther(state.document_file);
    }

    setGroupsName(state.tags);
    setDetailDescriptionCk(state.detailed_description);

    setInputs((prevState) => ({
      ...prevState,
      ["title"]: state.title,
      ["embed_code"]: state.external_url,
      ["status"]: state.status,
      ["docType"]: state.type,
      ["detailed_description"]: state.detailed_description,
      ["image"]: state.image,
      ["order"]: state.order,
      ["short_description"]: state.short_description,
      ["embed"]: state.embed_code,
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
          <h2>Edit Book</h2>
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
                  label="Book Title "
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Type *</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="docType"
                    value={inputs.docType}
                    label=" Type*"
                    onChange={handleChange}
                  >
                    <MenuItem value="external_url">External URL</MenuItem>
                    <MenuItem value="document_file">Document</MenuItem>
                    <MenuItem value="embed_code">Embed Code</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Book Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label="Book Status *"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                <FormControl className="mt-3" fullWidth required>
                  <Autocomplete
                    multiple
                    options={tagsList}
                    getOptionLabel={(option) => option?.name}
                    value={groupsName}
                    onChange={handleChangeGroup}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tags *"
                        placeholder="Search tags..."
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <MenuItem {...props} selected={selected} value={option}>
                        {option.name}
                      </MenuItem>
                    )}
                  />
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
              {inputs.docType == "external_url" && (
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-multiline-flexible"
                      label=" External URL"
                      multiline
                      required
                      name="embed_code"
                      value={inputs.embed_code}
                      onChange={handleChange}
                    />
                  </FormControl>
                </div>
              )}

              {inputs.docType == "document_file" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Upload Document *</p>
                      <FormHelperText className="pt-0">
                        Other Resource *("PDF", "DOC", "XLSX",
                        "DOCX","CSV","200MB")
                      </FormHelperText>
                    </div>
                    <div className="col-2"></div>
                    <div className="col-5 text-end pt-2">
                      {oldImageOther && (
                        <a
                          href={s3baseUrl + state.document_file}
                          target="_blank"
                          className="me-2 small-contained-button-search a-style"
                        >
                          View File
                        </a>
                      )}
                      <label htmlFor="contained-button-file-other">
                        <Input
                          accept=".xlsx,.xls,.doc, .docx,.txt,.pdf,.csv"
                          id="contained-button-file-other"
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
                  {inputs.otherDocument?.name == "" ? (
                    ""
                  ) : (
                    <p className="text-secondary">
                      {inputs.otherDocument?.name}
                    </p>
                  )}
                </div>
              )}
              {inputs.docType == "embed_code" && (
                <div className="col-lg-12  mt-4">
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-multiline-flexible"
                      label=" Embed Code"
                      multiline
                      rows={6}
                      required
                      name="embed"
                      value={inputs.embed}
                      onChange={handleChange}
                    />
                  </FormControl>
                </div>
              )}

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Book Image* </p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 100*100) ("JPG", "JPEG", "PNG","WEBP")
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
                {inputs.image_thumbnail?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">
                    {inputs.image_thumbnail?.name}
                  </p>
                )}
              </div>

              <div className="col-12 mt-5">
                <FormControl fullWidth>
                  <TextField
                    required
                    id="outlined-multiline-flexible"
                    label="Short Description"
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
          <button type="submit" className="small-contained-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
