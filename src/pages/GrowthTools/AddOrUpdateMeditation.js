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
import {
  daily_message_detail_api,
  add_meditation,
  update_meditation,
  meditation_detail_api,
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

export default function AddOrUpdateMeditation() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("ADD");
  const [file, setProfileImage] = React.useState();
  const [oldImage, setOldImage] = useState();

  const [inputs, setInputs] = useState({
    title: "",
    status: true,
    image: {},
    video_url: "",
  });

  const handleFormatData = (state) => {
    setFormType("EDIT");
    setInputs(state);
    setOldImage(state?.image?.thumbnail_1);
    // setting state to empty so that data should fetch on reload
    // window.history.replaceState({}, document.title);
    setIsLoading(false);
  };

  const getMeditationDetail = async () => {
    setIsLoading(true);
    let result = await meditation_detail_api(params.id);
    if (result.code == 200) {
      handleFormatData(result.meditation);
      setIsLoading(false);
    } else {
      //   navigate(`/daily-messages`);
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("status", inputs.status);
    formData.append("video_url", inputs.video_url);
    if (file) {
      formData.append("image", inputs.image);
    } else {
      if (oldImage) {
        // formData.append("image", oldImage);
      }
    }
    console.log(...formData, "fomrData");
    if (file || oldImage) {
      setIsLoading(true);
      const result =
        formType === "ADD"
          ? await add_meditation(formData)
          : await update_meditation(formData, params.id);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(`/meditation-videos`, {
          state: state,
        });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    } else {
      if (formType === "ADD") {
        enqueueSnackbar("Thumbnail Image is Required", { variant: "error" });
      }
    }
  };
  const fileChangedHandler = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  useEffect(() => {
    if (params && params.id) {
      if (state) {
        console.log(state, "state");
        console.log(params, params?.id, "state");
        handleFormatData(state);
      } else {
        getMeditationDetail();
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
              navigate(`/meditation-videos`, {
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
          <h2>{`${formType === "ADD" ? "Add" : "Edit"} Meditation Video`}</h2>
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
            <TextField
              id="outlined-basicLink"
              label="Video Url"
              variant="outlined"
              fullWidth
              required
              name="video_url"
              value={inputs.video_url}
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
                label="Status *"
                onChange={handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>InActive</MenuItem>
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
