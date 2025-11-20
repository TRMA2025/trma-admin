import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import {
  dynamite_event_video_detail_api,
  update_question_configration,
} from "src/DAL/DynamiteEvents/Categories/EventsCategoryVideos/EventsCategoryVideos";
import GeneralCkeditor from "src/components/GeneralCkeditor";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function QuestionConfigurationForEvent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { video_id } = useParams();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [inputs, setInputs] = useState({
    show_question: false,
    is_show_thank_you_page: true,
    button_text: "",
    questions_top_description: "",
    thank_you_page_description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      inputs.show_question &&
      inputs.is_show_thank_you_page &&
      !inputs.thank_you_page_description
    ) {
      enqueueSnackbar("Thank You Page Description is required", {
        variant: "error",
      });
      return;
    }

    setIsLoadingForm(true);
    let postData = {
      question_configration: inputs,
      module_type: "dynamite_event_video",
    };
    const result = await update_question_configration(postData, video_id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoadingForm(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingForm(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const get_video_detail = async () => {
    setIsLoading(true);
    let result = await dynamite_event_video_detail_api(video_id);
    if (result.code == 200) {
      if (result.dynamite_event_category_video?.question_configration) {
        setInputs(result.dynamite_event_category_video?.question_configration);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state?.question_configration) {
      setInputs(state.question_configration);
      window.history.replaceState({}, document.title);
    } else {
      get_video_detail();
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
          <h2>Questions Configuration</h2>
        </div>
      </div>

      <form className="row" onSubmit={handleSubmit}>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Show Questions
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="show_question"
              value={inputs.show_question}
              label="Show Questions"
              onChange={handleChange}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
        {inputs.show_question == true && (
          <>
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
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Show Thank You Page
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="is_show_thank_you_page"
                  value={inputs.is_show_thank_you_page}
                  label="Show Thank You Page"
                  onChange={handleChange}
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </div>
          </>
        )}
        <div className="col-12 mt-4">
          <h4>Questions Top Description</h4>
          <GeneralCkeditor
            setInputs={setInputs}
            inputs={inputs}
            name="questions_top_description"
            editorHeight={320}
          />
        </div>
        {inputs.show_question && inputs.is_show_thank_you_page && (
          <div className="col-12 mt-4">
            <h4>Thank You Page Description *</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="thank_you_page_description"
              editorHeight={320}
            />
          </div>
        )}
        <div className="text-end mt-4">
          <button className="small-contained-button">
            {isLoadingForm ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
