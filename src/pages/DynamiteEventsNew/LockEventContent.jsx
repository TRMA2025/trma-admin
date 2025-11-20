import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
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
import { updateThanksSettingApi } from "src/DAL/ClientSetting/ClientSetting";
import { detailContentPageApi } from "src/DAL/WebsitePages/websitepages";
import {
  dynamite_event_detail_api,
  update_dynamite_lock_content_event_api,
} from "src/DAL/DynamiteEvents/DynamiteEvents";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import GeneralCkeditor from "src/components/GeneralCkeditor";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function UpdateLockEventContent() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [logo, setLogo] = useState();
  const [oldLogo, setOldLogo] = useState("");

  const [inputs, setInputs] = useState({
    lock_event_button_text: "",
    lock_event_button_link: "",
    detail_event_button_text: "",
    lock_event_description: "",
    lock_event_logo: {},
  });

  const getDetail = async () => {
    setIsLoading(true);
    const result = await dynamite_event_detail_api(params.event_id);
    if (result.code == 200) {
      setInputs(result?.dynamite_event?.lock_configration);
      setOldLogo(result?.dynamite_event?.lock_configration?.lock_event_logo);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const fileChangedHandlerFB = async (e) => {
    setLogo(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "300");
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      console.log(imageUpload, "imageUpload result");
      setInputs((input) => ({
        ...input,
        ["lock_event_logo"]: imageUpload.image_path,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    let postData = {
      lock_event_description: inputs.lock_event_description
        ? inputs.lock_event_description
        : "",
      lock_event_button_text: inputs.lock_event_button_text,
      lock_event_button_link: inputs.lock_event_button_link,
      lock_event_logo: inputs.lock_event_logo,
      detail_event_button_text: inputs.detail_event_button_text,
    };
    let lockData = {
      lock_configration: postData,
    };
    // console.log(lockData, "lockDatalockData");
    const result = await update_dynamite_lock_content_event_api(
      lockData,
      params.event_id
    );
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

  useEffect(() => {
    console.log(state, "statestate");
    if (state == null || state == "" || state == undefined) {
      getDetail();
    } else if (state.lock_configration) {
      setInputs(state.lock_configration);
      setOldLogo(state.lock_configration?.lock_event_logo);
    } else {
    }
    // setInputs(state?.state);
    // setOldLogo(state.state?.lock_event_logo);
  }, []);
  console.log(state, "state");
  console.log(inputs, "inputsinputsinputs");
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
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <h2>Update Lock Event Content</h2>
          </div>
        </div>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Thank You Page Video URL"
              variant="outlined"
              fullWidth
              type="url"
              name="thankyou_page_video_url"
              value={inputs.thankyou_page_video_url}
              onChange={handleChange}
            />
          </div> */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Lock Button Text"
                  variant="outlined"
                  fullWidth
                  name="lock_event_button_text"
                  value={inputs?.lock_event_button_text}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Inner Button Text"
                  variant="outlined"
                  fullWidth
                  name="detail_event_button_text"
                  value={inputs?.detail_event_button_text}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Inner Button Link"
                  variant="outlined"
                  fullWidth
                  type="url"
                  name="lock_event_button_link"
                  value={inputs?.lock_event_button_link}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Lock Button Icon</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 1000 X 250)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {logo ? (
                      <img className="image-border" src={logo} height="50" />
                    ) : (
                      oldLogo && (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldLogo}
                          height="50"
                        />
                      )
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-fileFb">
                      <Input
                        accept="image/*"
                        id="contained-button-fileFb"
                        multiple
                        type="file"
                        name="InvoiceImage"
                        onChange={fileChangedHandlerFB}
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
                {inputs?.logo?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs?.logo?.name}</p>
                )}
              </div>
              <div className="col-12 mt-5">
                <h4>Lock Event Description</h4>
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="lock_event_description"
                  editorHeight={320}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-end mt-4" id="fixedbutton">
          <button className="small-contained-button" disabled={isLoadingForm}>
            {isLoadingForm ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
