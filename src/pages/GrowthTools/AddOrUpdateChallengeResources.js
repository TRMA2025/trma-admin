import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { s3baseUrl } from "src/config/config";
import { useEffect } from "react";

import moment from "moment";
import { update_challenges } from "src/DAL/GrowthTools/GrowthTools";
import DeleteIcon from "@mui/icons-material/Delete";
import { audioImage } from "src/assets";
import {
  add_challenges_resources,
  challenges_resource_detail_api,
  update_challenges_resources,
} from "src/DAL/GrowthTools/Challenges";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});
export default function AddOrUpdateChallengeResources() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("ADD");
  const [file, setProfileImage] = React.useState();
  const [oldImage, setOldImage] = useState();
  const [audioFile, setAudio] = React.useState();
  const [oldAudioFile, setOldAudio] = React.useState();
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [otherDocument, setOtherDocument] = React.useState();
  const [oldImageOther, setOldImageOther] = React.useState("");
  const [otherStatus, setOtherStatus] = useState(false);

  const [inputs, setInputs] = useState({
    title: "",
    videoUrl: "",
    embed_code: "",
    short_description: "",
    docType: "audio",
    status: true,
    video_thumbnail: {},
    otherDocument: {},
  });
  const handleFormatData = (state) => {
    setFormType("EDIT");
    setOldImage(state.resource_thumbnail);
    setInputs((prevState) => ({
      ...prevState,
      ["title"]: state?.title,
      ["short_description"]: state?.description,
      ["status"]: state.status,
      ["docType"]: state.resource_type,
      ["embed_code"]: state.embed_code,
    }));
    if (state?.resource_type == "audio") {
      setOldAudio(state.resource_file);
    } else if (state?.resource_type == "other_document") {
      setOldImageOther(state.resource_file);
    }
    setIsLoading(false);
  };

  const getChallengesDetail = async () => {
    setIsLoading(true);
    let result = await challenges_resource_detail_api(params.resource_id);
    if (result.code == 200) {
      handleFormatData(result.challenge_resource);
      setIsLoading(false);
    } else {
      //   navigate(`/daily-messages`);
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.short_description.length > 200) {
      enqueueSnackbar("Short Description Must Be Less Than 200 Characters", {
        variant: "error",
      });
      return;
    }

    if (formType === "ADD" && !file) {
      enqueueSnackbar("Please Upload Image", {
        variant: "error",
      });
      return;
    }
    if (formType === "ADD" && inputs.docType == "audio" && !audioFile) {
      enqueueSnackbar("Please Upload Audio", {
        variant: "error",
      });
      return;
    }
    if (
      formType === "ADD" &&
      inputs.docType == "other_document" &&
      !otherStatus
    ) {
      enqueueSnackbar("Please Upload PDF", {
        variant: "error",
      });
      return;
    }
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("status", inputs.status);
    formData.append("description", inputs.short_description);
    formData.append("resource_type", inputs.docType);
    if (formType === "ADD") {
      formData.append("challenge_id", params.id);
    }

    if (inputs.docType == "audio") {
      if (audioFile) {
        formData.append("resource_file", audioFile);
      }
    } else if (inputs.docType == "other_document") {
      if (formType === "ADD") {
        formData.append("resource_file", inputs.otherDocument);
      } else if (otherStatus == true) {
        formData.append("resource_file", inputs.otherDocument);
      }
    } else if (inputs.docType == "embed_code") {
      formData.append("embed_code", inputs.embed_code);
    }
    if (file) {
      formData.append("resource_thumbnail", inputs.video_thumbnail);
    } else {
      if (oldImage) {
      }
    }
    console.log(...formData, "fomrData");
    setIsLoading(true);
    const result =
      formType === "ADD"
        ? await add_challenges_resources(formData)
        : await update_challenges_resources(formData, params.resource_id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const fileChangedHandler = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["video_thumbnail"]: e.target.files[0],
    });
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handldeDeleteAudio = () => {
    setAudio();
  };
  const audioFileChange = (e) => {
    setAudio(e.target.files[0]);
  };
  const fileChangedHandlerOther = (e) => {
    setOtherStatus(true);
    setOtherDocument(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["otherDocument"]: e.target.files[0],
    });
  };
  useEffect(() => {
    if (params && params.resource_id) {
      if (state) {
        handleFormatData(state);
      } else {
        getChallengesDetail();
      }
    }
  }, []);

  const getResourceImage = (doc) => {
    console.log(doc, "docdocdocdoc");
    const ext = doc?.split(".").pop();
    console.log(ext, "extext");
    return ext;
  };

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
          <h2>{`${formType === "ADD" ? "Add" : "Edit"} Resource`}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row main-card">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              fullWidth
              required
              name="title"
              value={inputs.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                required
                value={inputs.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>InActive</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Resource Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="docType"
                value={inputs.docType}
                label="Resource Type"
                onChange={handleChange}
              >
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="embed_code">Embed Code</MenuItem>
                <MenuItem value="other_document">Pdf</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Thumbnail Image*</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-3">
                <div className="col-3">
                  {file ? (
                    <img className="image-border" src={file} height="70" />
                  ) : (
                    oldImage && (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldImage}
                        height="70"
                      />
                    )
                  )}
                </div>
              </div>
              <div className="col-4 text-end pt-2">
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="plan_image"
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
              <p className="text-secondary">{audioFile && audioFile.name}</p>
              {oldAudioFile && (
                <audio
                  className="w-100"
                  src={s3baseUrl + oldAudioFile}
                  controls
                />
              )}
            </div>
          )}
          {inputs.docType == "other_document" && (
            <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
              <div className="row w-100 div-style ms-0 pt-0">
                <div className="col-5">
                  <p className="">Upload PDF Resource *</p>
                  {/* <FormHelperText className="pt-0">
                      Other Resource *("PDF", "DOC", "XLSX",
                      "DOCX","CSV","200MB")
                    </FormHelperText> */}
                </div>
                <div className="col-2">
                  {/* {otherDocument && <img src={otherDocument} height="50" />} */}
                </div>
                <div className="col-5 text-end view-file pt-2">
                  {state && getResourceImage(state.resource_file) != "mp3" && (
                    <a
                      href={s3baseUrl + state.resource_file}
                      target="_blank"
                      className="me-2 small-contained-button-search"
                    >
                      View File
                    </a>
                  )}
                  <label htmlFor="contained-button-file-other">
                    <Input
                      accept=".pdf"
                      id="contained-button-file-other"
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
                <p className="text-secondary">{inputs.otherDocument.name}</p>
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
          <div className="col-12 mt-5">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Description"
                multiline
                required
                rows={6}
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
              <FormHelperText>Maximum limit 200 characters</FormHelperText>
            </FormControl>
          </div>
        </div>
        <div className="text-end mt-4">
          <button className="small-contained-button">
            {formType == "ADD" ? "Submit" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
