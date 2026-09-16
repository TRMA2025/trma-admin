import * as React from "react";
import { useRef } from "react";

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
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { AddGettingResourcesApi } from "src/DAL/gettingStarting/GettingStarting";

import KsStagesSelect, { appendKsStages } from "src/components/KsStagesSelect";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function AddGettingResources() {
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail_file, setThumbnailFile] = React.useState();
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();

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
  });

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerOther = (e) => {
    setInputs({
      ...inputs,
      ["otherDocument"]: e.target.files[0],
    });
  };
  const fileChangedHandlerThumbnails = (e) => {
    setThumbnailFile(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image_thumbnail"]: e.target.files[0],
    });
  };
  const audioFileChange = (e) => {
    setAudio(e.target.files[0]);
    e.target.value = null;
  };
  const handldeDeleteAudio = () => {
    clearAudioFile();
    setAudio("");
  };

  const clearAudioFile = () => {
    // Clear your state or do any necessary cleanup
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.docType == "audio" && !audioFile) {
      enqueueSnackbar("Audio is required", {
        variant: "error",
      });
      return;
    }
    if (inputs.docType == "image" && !file) {
      enqueueSnackbar("Image is required", {
        variant: "error",
      });

      return;
    }
    if (
      inputs.docType === "other_document" &&
      (!inputs.otherDocument || !inputs.otherDocument.type)
    ) {
      enqueueSnackbar("Other resource is required", {
        variant: "error",
      });
      return;
    }

    if (inputs.detailed_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
    } else {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("getting_started_slug", params.slug);
      formData.append("detailed_description", inputs.detailed_description);
      formData.append("document_thumbnail", inputs.image_thumbnail);
      formData.append("status", inputs.status);
      formData.append("document_type", inputs.docType);
      appendKsStages(formData, ksStages);

      if (inputs.docType == "audio") {
        formData.append("document_file", audioFile);
      } else if (inputs.docType == "image") {
        if (file) {
          formData.append("document_file", inputs.image);
        }
      } else if (inputs.docType == "other_document") {
        formData.append("document_file", inputs.otherDocument);
      } else if (inputs.docType == "embed_code") {
        formData.append("embed_code", inputs.embed_code);
      }

      console.log(...formData, "form data value");
      setIsLoading(true);
      const result = await AddGettingResourcesApi(formData);
      if (result.code === 200) {
        enqueueSnackbar("Getting Started Resource added successfully.", {
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

  React.useEffect(() => {}, []);

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
          <h2>Add Resource</h2>
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
                        <>
                          <DeleteIcon
                            onClick={handldeDeleteAudio}
                            className="mt-3 icon-color"
                          />
                          <p className="text-secondary mt-1">
                            {audioFile.name.length > 13
                              ? `${audioFile.name.slice(0, 13)}...`
                              : audioFile.name}
                          </p>
                        </>
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
                          inputProps={{ ref: fileInputRef }}
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
                    {/* {audioFile && audioFile.name} */}
                  </p>
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
                    <div className="col-2"></div>
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
                      Image Size ("JPG", "JPEG", "PNG","WEBP")(Recommended Size
                      100*100)
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
                    id="outlined-multiline-flexible"
                    label="Short Description "
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
