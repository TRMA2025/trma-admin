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
import {
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { s3baseUrl } from "src/config/config";
import { useEffect } from "react";
import {
  updateThanksSettingApi,
  updateUnpublishSetting,
} from "src/DAL/ClientSetting/ClientSetting";
import { detailContentPageApi } from "src/DAL/WebsitePages/websitepages";
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

export default function UnpublishSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const state = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [thankYouLogo, setThankYouLogo] = useState();
  const [oldThankyouLogo, setOldThankyouLogo] = useState("");

  const [inputs, setInputs] = useState({
    is_publish: true,
    unpublish_link: "",
    unpublish_detail: "",
  });

  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await detailContentPageApi(params.id);
    if (result.code == 200) {
      setInputs(result.sale_page);
      setOldThankyouLogo(result.sale_page.thankyou_page_icon);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const fileChangedHandlerFB = async (e) => {
    setThankYouLogo(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["thank_you_logo"]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    let unpublishData = {
      is_publish: inputs.is_publish,
      unpublish_link: inputs.unpublish_link,
      unpublish_detail: inputs.unpublish_detail,
    };
    let postData = {
      sale_page_id: params.id,
      unpublish_page_access_info: unpublishData,
    };
    const result = await updateUnpublishSetting(postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoadingForm(false);
      navigate(-1);
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
  console.log(state, "statestatestate");
  useEffect(() => {
    if (state.state == null || state.state == "" || state.state == undefined) {
    } else {
      let unpublishData = state.state.unpublish_page_access_info;
      setInputs((inputs) => ({
        ...inputs,
        ["is_publish"]: unpublishData?.is_publish,
        ["unpublish_link"]:
          unpublishData?.is_publish == true
            ? unpublishData?.unpublish_link
            : "",
        ["unpublish_detail"]:
          unpublishData?.is_publish == false
            ? unpublishData?.unpublish_detail
            : "",
      }));
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
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <h2>Update Unpublish Setting</h2>
          </div>
        </div>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Do You Want To Publish This Page ?
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_publish"
                    value={inputs.is_publish}
                    label="Do You Want To Publish This Page ?"
                    onChange={handleChange}
                  >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {inputs.is_publish == true ? (
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Enter link"
                    variant="outlined"
                    fullWidth
                    type="url"
                    name="unpublish_link"
                    value={inputs.unpublish_link}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                ""
              )}
              {inputs.is_publish == false ? (
                <div className="col-12 mt-5">
                  <h4>Detail:</h4>
                  <GeneralCkeditor
                    setInputs={setInputs}
                    inputs={inputs}
                    name="unpublish_detail"
                    editorHeight={320}
                  />
                </div>
              ) : (
                ""
              )}
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
