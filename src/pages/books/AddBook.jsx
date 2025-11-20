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
import TinyEditor from "src/components/ckeditor/Ckeditor";
import { activeTagsApi, addBookApi } from "src/DAL/book";
import MUIAutocomplete from "src/components/GeneralComponents/MUIAutocomplete";
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

export default function AddBook() {
  const EMPTY_FILTER = {
    start_date: new Date(),
    end_date: new Date(),
    sale_page: null,
    payment_plan: null,
    expiry_in: "",
    expired: null,
    filter: "all",
    filter: "all",
    expiry_name: null,
    search_text: "",
  };

  const [filterState, setFilterState] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);
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
  const [tagsList, setTagsList] = useState([]); // State to store active tags
  const [groupsName, setGroupsName] = useState([]);
  const [selectedProgramIds, setSelectedProgramIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [errors, setErrors] = useState({});

  //   const [value, setValue] = React.useState(new Date());

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    docType: "document_file",
    embed_code: "",
    image: {},
    image_thumbnail: {},
    otherDocument: {},
    detailed_description: "",
    tags: "",
    short_description: "",
    embed: "",
  });
  console.log(tagsList, "tagsListtagsListtagsListtagsList");
  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(typeof value === "string" ? value.split(",") : value);
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    const localUrl = URL.createObjectURL(file);
    console.log("Local file URL:", localUrl);

    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerOther = (e) => {
    const file = e.target.files[0];
    console.log(file, "daaaaaaaaaaa");
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
    ];

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
  console.log(otherDocument, "Sasxaskxcgsa");
  const fileChangedHandlerThumbnails = (e) => {
    const file = e.target.files[0];

    setThumbnailFile(URL.createObjectURL(e.target.files[0]));
    console.log(thumbnail_file, "thumbnail_filefile");
    setInputs({
      ...inputs,
      ["image_thumbnail"]: e.target.files[0],
    });
  };
  const handleThumbnail = (e) => {};
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
  const handleChangeGroup = (event, value) => {
    console.log(value, "event value is......"); // This will log the array of selected items

    const programme_ids = value.map((tag) => tag.chip_value); // Assuming `chip_value` is what you want to store

    console.log(programme_ids, "programme_ids value is......");

    // Set the selected names and IDs
    setGroupsName(value); // This sets the entire selected tag objects
    setSelectedProgramIds(programme_ids); // This sets just the IDs of the selected tags
  };

  const getTagsList = async () => {
    const result = await activeTagsApi();
    if (result.code === 200) {
      const tags = result.activeTags.map((tag) => ({
        chip_label: tag.name,
        chip_value: tag._id,
        ...tag,
      }));
      setTagsList(tags);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  React.useEffect(() => {
    getTagsList();
  }, []);
  const handleChangeOther = (name, value) => {
    setFilterState((values) => ({ ...values, [name]: value }));
  };
  console.log(tagsList, "nnnnnnnnnn");

  const handleTagChange = (value) => {
    handleChangeOther("sale_page", value);
  };
  console.log(selectedProgramIds, "selectedprogramidsss");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupsName.length === 0) {
      enqueueSnackbar("At least choose one tag", { variant: "error" });
      return;
    }

    if (!thumbnail_file) {
      enqueueSnackbar("Book image is required", { variant: "error" });
      return;
    }
    if (
      inputs.docType === "document_file" &&
      (!inputs.otherDocument || !inputs.otherDocument.type)
    ) {
      enqueueSnackbar("Document is required", {
        variant: "error",
      });
      return;
    }
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

      // Check for spaces in the URL
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
    }

    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("detailed_description", detailDescriptionCk);
    formData.append("short_description", inputs.short_description);

    formData.append("status", inputs.status);
    formData.append("type", inputs.docType);
    formData.append("tags", JSON.stringify(selectedProgramIds));

    if (inputs.docType == "document_file") {
      formData.append("document_file", inputs.otherDocument);
    } else if (inputs.docType == "external_url") {
      formData.append("external_url", inputs.embed_code);
    } else if (inputs.docType == "embed_code") {
      formData.append("embed_code", inputs.embed);
    }
    if (thumbnail_file) {
      formData.append("image", inputs.image_thumbnail);
    }
    console.log(...formData, "formdata .......");
    for (var value of formData.values()) {
    }
    setIsLoading(true);
    const result = await addBookApi(formData);
    const fileUrl = result;
    console.log(fileUrl, "fileUrlfileUrlfileUrl");
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

    setInputs((values) => ({ ...values, [name]: value }));

    if (name === "embed_code") {
      if (value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          embed_code: "White spaces are not allowed.",
        }));
        // enqueueSnackbar("White spaces are not allowed for this URL field.", {
        //   variant: "error",
        //   autoHideDuration: 3000,
        // });
      } else if (!/^(https?:\/\/)/.test(value)) {
        // Check if the URL starts with http:// or https://
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
  };

  React.useEffect(() => {}, []);
  const filteredTags = tagsList.filter((tag) =>
    tag.chip_label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="col-12">
          <h2>Add Book</h2>
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
                    {/* <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem> */}
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
              <div className="col-lg-6 col-md-6 col-sm-12 mt-1">
                <FormControl className="mt-3" fullWidth required>
                  <Autocomplete
                    multiple
                    options={tagsList}
                    getOptionLabel={(option) => option.chip_label}
                    value={groupsName}
                    onChange={handleChangeGroup}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tags *"
                        placeholder="Search tags..."
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <MenuItem
                        {...props}
                        selected={selected}
                        value={option.chip_value}
                      >
                        {option.chip_label}
                      </MenuItem>
                    )}
                  />
                </FormControl>
              </div>

              {/* {inputs.docType === "audio" && (
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
                </div>
              )} */}
              {/* {inputs.docType == "image" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Upload Image *</p>
                      <FormHelperText className="pt-0">
                        Image Size( 1000*670) ("JPG", "JPEG", "PNG","WEBP")
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
              )} */}
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
                    <div className="col-2">
                      {/* {otherDocument && <img src={otherDocument} height="50" />} */}
                    </div>
                    <div className="col-5 text-end pt-2">
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
                  {inputs.otherDocument.name == "" ? (
                    ""
                  ) : (
                    <p className="text-secondary">
                      {inputs.otherDocument.name}
                    </p>
                  )}
                </div>
              )}
              {inputs.docType == "external_url" && (
                <div className="col-lg-6 col-md-6 col-sm-6 mt-4">
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="External Url"
                      multiline
                      required
                      name="embed_code"
                      value={inputs.embed_code}
                      onChange={handleChange}
                    />
                  </FormControl>
                </div>
              )}
              {inputs.docType == "embed_code" && (
                <div className="col-lg-12 mt-4">
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Embed Code"
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
                      Image Size (100*100) ("JPG", "JPEG", "PNG","WEBP")
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
                        className="small-contained-button-search"
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
                  <p className="text-secondary">
                    {inputs.image_thumbnail.name}
                  </p>
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
                <h4>Detail Description </h4>
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
