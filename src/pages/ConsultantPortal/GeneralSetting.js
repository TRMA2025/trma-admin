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
import { useNavigate } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import {
  clientSettingApi,
  updateConsultantGeneralSettingApi,
} from "src/DAL/ClientSetting/ClientSetting";
import { s3baseUrl } from "src/config/config";
import { useEffect } from "react";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function UpdateConsultantGeneralSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");

  const [inputs, setInputs] = useState({
    meta_title: "",
    meta_description: "",
    brandLogo: {},
    brandFavIcon: {},
    brand_name: "",
    oldBrandLogo: "",
    oldbrandFavIcon: "",
  });

  const [images, setImages] = useState({
    brandLogo: "",
    brandFavIcon: "",
  });

  const fileChangedHandler = (e) => {
    const name = e.target.name;
    const value = e.target.files[0];
    setInputs({
      ...inputs,
      [name]: value,
    });

    setImages({
      ...images,
      [name]: URL.createObjectURL(value),
    });
  };

  const clientDetail = async () => {
    const result = await clientSettingApi();
    if (result.code == 200) {
      let generalSetting = result?.content_setting?.consultant_general_setting;
      setInputs({
        ...generalSetting,
        ["brandLogo"]: generalSetting?.brand_logo,
        ["oldBrandLogo"]: generalSetting?.brand_logo,
        ["brandFavIcon"]: generalSetting?.brand_favicon,
        ["oldBrandFavIcon"]: generalSetting?.brand_favicon,
      });
      setDetailDescriptionCk(generalSetting.dashboard_content);

      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("meta_title", inputs.meta_title);
    formData.append("meta_description", inputs.meta_description);
    formData.append("brand_name", inputs.brand_name);
    // formData.append("dashboard_content", detailDescriptionCk);
    if (images.brandLogo) {
      formData.append("brand_logo", inputs.brandLogo);
    }
    if (images.brandFavIcon) {
      formData.append("brand_favicon", inputs.brandFavIcon);
    }

    console.log(...formData, "form data");
    const result = await updateConsultantGeneralSettingApi(formData);
    if (result.code === 200) {
      clientDetail();
      enqueueSnackbar(result.message, { variant: "success" });
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
    clientDetail();
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
          <h2>General Settings</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Meta title for client"
            variant="outlined"
            fullWidth
            required
            name="meta_title"
            value={inputs.meta_title}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Meta description for client"
            variant="outlined"
            fullWidth
            required
            name="meta_description"
            value={inputs.meta_description}
            onChange={handleChange}
          />
        </div>
        <h3 className="mt-3">General Information</h3>

        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Brand Name"
            variant="outlined"
            fullWidth
            required
            name="brand_name"
            value={inputs.brand_name}
            onChange={handleChange}
          />
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Brand Logo</p>
              <FormHelperText className="pt-0">
                (Recommended Size 150 X 22)
              </FormHelperText>
            </div>
            <div className="col-2">
              {images.brandLogo ? (
                <img
                  className="image-border"
                  src={images.brandLogo}
                  height="50"
                />
              ) : (
                inputs.oldBrandLogo && (
                  <img
                    className="image-border"
                    src={s3baseUrl + inputs.oldBrandLogo}
                    height="50"
                  />
                )
              )}
            </div>
            <div className="col-5 text-end pt-2">
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  name="brandLogo"
                  onChange={fileChangedHandler}
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
          {inputs?.brandLogo?.name == "" ? (
            ""
          ) : (
            <p className="text-secondary">{inputs?.brandLogo?.name}</p>
          )}
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Brand FavIcon</p>
              <FormHelperText className="pt-0">
                (Recommended Size 32 X 32)
              </FormHelperText>
            </div>
            <div className="col-2">
              {images.brandFavIcon ? (
                <img src={images.brandFavIcon} height="50" />
              ) : (
                inputs.oldBrandFavIcon && (
                  <img src={s3baseUrl + inputs.oldBrandFavIcon} height="50" />
                )
              )}
            </div>
            <div className="col-5 text-end pt-2">
              <label htmlFor="contained-button-fileFavIcon">
                <Input
                  accept="image/*"
                  id="contained-button-fileFavIcon"
                  multiple
                  type="file"
                  name="brandFavIcon"
                  onChange={fileChangedHandler}
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
          {inputs?.brandFavIcon?.name == "" ? (
            ""
          ) : (
            <p className="text-secondary">{inputs?.brandFavIcon?.name}</p>
          )}
        </div>
        {/* <div className="col-12 mt-5">
          <h4>Dashboard Content *</h4>
          <TinyEditor
            setDetailDescription={setDetailDescriptionCk}
            detailDescriptionCk={detailDescriptionCk}
          />
        </div> */}

        <div className="text-end mt-4">
          <button onClick={handleSubmit} className="small-contained-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
