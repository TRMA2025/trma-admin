import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Stack from "@mui/material/Stack";
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
import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  add_daily_message_api,
  daily_message_detail_api,
  update_daily_message_api,
} from "src/DAL/GrowthTools/GrowthTools";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function AddorUpdateGratitude() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState({});
  const [oldAudio, setOldAudio] = useState("");
  const [uploadAudio, setUploadAudio] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [formType, setFormType] = useState("ADD");
  const [inputs, setInputs] = useState({
    title: "",
    status: true,
    created_for: "dynamite_gratitude",
    type: "audio",
    note_for_admin: "",
    image: {},
    button_link: "",
    button_text: "",
    media_url: "",
    short_description: "",
    detail_description: "",
  });
  const audioFileChange = (e) => {
    setAudioFile(e.target.files[0]);
    setUploadAudio(true);
  };
  const handleFormatData = (state) => {
    setFormType("EDIT");
    setInputs(state);
    setDate(
      state.message_date
        ? moment(state.message_date, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null
    );
    setendDate(
      state.message_date
        ? moment(state?.message_end_date, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null
    );
    if (state.type == "audio") {
      setOldAudio(state.media_url);
    }
    // setting state to empty so that data should fetch on reload
    window.history.replaceState({}, document.title);
    setIsLoading(false);
  };

  const getMessageData = async () => {
    // setIsLoading(true);
    // let result = await daily_message_detail_api(params.message_id);
    // if (result.code == 200) {
    //   handleFormatData(result.daily_message);
    // } else {
    //   navigate(`/daily-messages`);
    //   enqueueSnackbar(result.message, { variant: "success" });
    //   setIsLoading(false);
    // }
  };
  const handleChangeDate = (newValue) => {
    setDate(newValue);
  };
  const handleChangeDates = (newValue) => {
    setendDate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("status", inputs.status);
    formData.append("button_link", inputs.button_link);
    formData.append("button_text", inputs.button_text);
    formData.append(
      "message_date",
      date ? moment(date).format("DD-MM-YYYY") : null
    );
    formData.append(
      "message_end_date",
      endDate ? moment(endDate).format("DD-MM-YYYY") : null
    );

    formData.append("created_for", inputs.created_for);
    formData.append("note_for_admin", inputs.note_for_admin);
    formData.append("type", inputs.type);
    formData.append("short_description", inputs.short_description);
    formData.append("detail_description", inputs.detail_description);
    if (inputs.type == "audio") {
      if (uploadAudio) {
        formData.append("audio_file", audioFile);
      }
    } else {
      formData.append("media_url", inputs.media_url);
    }
    // console.log(...formData, "fomrData");
    const result =
      formType === "ADD"
        ? await add_daily_message_api(formData)
        : await update_daily_message_api(formData, params.message_id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/daily-messages`, {
        state: state,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  useEffect(() => {
    if (params && params.message_id) {
      if (state) {
        // console.log(state, "state");
        handleFormatData(state);
      } else {
        getMessageData();
      }
    }
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
            onClick={() =>
              navigate(`/daily-messages`, {
                state: state,
              })
            }
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
          <h2>{`${formType === "ADD" ? "Add" : "Edit"} Gratitude`}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row main-card">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Message Title"
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
              <InputLabel id="demo-simple-select-label">
                Daily Message Created For *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="created_for"
                required
                value={inputs.created_for}
                label="Daily Message Created For *"
                onChange={handleChange}
              >
                <MenuItem value="dynamite_gratitude">Gratitude Daily</MenuItem>
                <MenuItem value="dynamite_diary">Diary</MenuItem>
                <MenuItem value="meditation">Meditation</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Text"
              variant="outlined"
              fullWidth
              name="button_text"
              value={inputs.button_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basicLink"
              label="Button Link"
              variant="outlined"
              fullWidth
              name="button_link"
              value={inputs.button_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Daily Message Start Date *"
                  inputFormat="dd-MM-yyyy"
                  value={date}
                  onChange={handleChangeDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Daily Message End Date *"
                  inputFormat="dd-MM-yyyy"
                  value={endDate}
                  onChange={handleChangeDates}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
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
                label="Status *"
                onChange={handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basicLink"
              label="Admin Text Box"
              variant="outlined"
              fullWidth
              name="note_for_admin"
              value={inputs.note_for_admin}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="type"
                required
                value={inputs.type}
                label="Type*"
                onChange={handleChange}
              >
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="url">URL</MenuItem>
              </Select>
            </FormControl>
          </div>
          {inputs.type == "audio" ? (
            <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
              <div className="row w-100 div-style ms-0 pt-0 ">
                <div className="col-lg-8 col-md-3 col-sm-12">
                  <p className="">Upload Audio *</p>
                  <FormHelperText className="pt-0">
                    Audio mp3 (max 100mb)
                  </FormHelperText>
                </div>

                <div className="col-lg-4 col-md-12 col-sm-12 text-end pt-2 ps-0">
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
                      className="small-contained-button"
                      startIcon={<FileUploadIcon />}
                      component="span"
                    >
                      Upload
                    </Button>
                  </label>
                </div>
              </div>
              <div className="col-12 mt-1">
                {oldAudio && (
                  <audio
                    className="w-100"
                    src={s3baseUrl + oldAudio}
                    controls
                  />
                )}
              </div>
              <p className="text-secondary">{audioFile && audioFile.name}</p>
            </div>
          ) : (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basicLink"
                label="URL"
                variant="outlined"
                fullWidth
                name="media_url"
                required
                value={inputs.media_url}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="col-12 mt-4">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Short Description"
                multiline
                rows={6}
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <h4>Detail Description</h4>
            <TinyEditor
              setInputs={setInputs}
              inputs={inputs}
              name="detail_description"
              editorHeight={320}
            />
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
