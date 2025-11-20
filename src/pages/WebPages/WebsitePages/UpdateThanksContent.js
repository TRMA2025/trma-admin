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

export default function UpdateThanksContent() {
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
    thank_you_logo: {},
    thankyou_page_contact_us_content: "",
    thankyou_page_button_text: "",
    thankyou_page_video_url: "",
    thankyou_page_button_link: "",
    thankyou_page_bottom_content: "",
    thankyou_page_video_url: "",
    thankyou_page_content: "",
    thankyou_page_content: "",
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
    const formData = new FormData();

    formData.append(
      "thankyou_page_contact_us_content",
      inputs.thankyou_page_contact_us_content
        ? inputs.thankyou_page_contact_us_content
        : ""
    );
    formData.append(
      "thankyou_page_button_text",
      inputs.thankyou_page_button_text
    );
    formData.append("thankyou_page_video_url", inputs.thankyou_page_video_url);
    formData.append(
      "thankyou_page_button_link",
      inputs.thankyou_page_button_link
    );
    formData.append(
      "thankyou_page_bottom_content",
      inputs.thankyou_page_bottom_content
        ? inputs.thankyou_page_bottom_content
        : ""
    );
    formData.append("thankyou_page_content", inputs.thankyou_page_content);
    if (thankYouLogo) {
      formData.append("thankyou_page_icon", inputs.thank_you_logo);
    }

    const result = await updateThanksSettingApi(formData, params.id);
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
    if (state.state == null || state.state == "" || state.state == undefined) {
      getPageDetail();
    } else {
      setInputs(state?.state);
      setOldThankyouLogo(state.state?.thankyou_page_icon);
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
            <h2>Update Thanks Setting</h2>
          </div>
        </div>{" "}
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
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
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Thank You Button Text"
                  variant="outlined"
                  fullWidth
                  name="thankyou_page_button_text"
                  value={inputs.thankyou_page_button_text}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Thank You Button Link"
                  variant="outlined"
                  fullWidth
                  name="thankyou_page_button_link"
                  value={inputs.thankyou_page_button_link}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Thank You Page Icon</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 1000 X 250)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {thankYouLogo ? (
                      <img
                        className="image-border"
                        src={thankYouLogo}
                        height="50"
                      />
                    ) : (
                      oldThankyouLogo && (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldThankyouLogo}
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
              </div>{" "}
              <div className="col-12 mt-5">
                <h4>Thank You Content </h4>
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="thankyou_page_bottom_content"
                  editorHeight={320}
                />
              </div>
              <div className="col-12 mt-5">
                <h4>Thank You Box Content</h4>
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="thankyou_page_content"
                  editorHeight={320}
                />
              </div>
              <div className="col-12 mt-5">
                <h4>Thank You page Contact Us Content</h4>
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="thankyou_page_contact_us_content"
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
