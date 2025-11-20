import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { s3baseUrl } from "src/config/config";

import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";

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

export default function SocialSharingCenter() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { state } = useLocation();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [fb, setFBImage] = React.useState();
  const [oldFb, setOldFb] = useState("");
  const [oldTwitter, setOldTwitter] = useState("");
  const [oldInstagram, setOldInstagram] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageName, setpageName] = useState("");
  const [shortDescriptionCk, setShortDescriptionCk] = useState("");
  const [oldImage, setOldImage] = useState();
  const [inputs, setInputs] = React.useState({
    title: "",
    link: "",
    plan_image: "",
  });
  // console.log(state, "stateData");
  const fileChangedHandler = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "250");
    formData.append("height", "250");
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      console.log(imageUpload, "imageUploadimageUpload");
      setInputs({
        ...inputs,
        ["plan_image"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(imageUpload.message, { variant: "error" });
    }
  };
  console.log(params, "params");
  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await detailPageApi(
      state ? state?.object?.sale_page_title_slug : params.page_slug
    );
    console.log(result, "kokoko");
    if (result.code == 200) {
      setPageSlug(result?.sale_page?.sale_page_title_slug);
      // setInputs({
      //   ...inputs,
      //   ["template_type"]: result?.sale_page?.template?.template_slug,
      // });
      setpageName(result?.sale_page?.sale_page_title);
      setShortDescriptionCk(result?.sale_page?.social_sharing?.description);
      setOldImage(result?.sale_page?.social_sharing?.icon);
      setOldFb(result?.sale_page.brand_logo);
      setOldTwitter(result?.sale_page.footer_logo);
      setOldInstagram(result?.sale_page.brand_favicon);
      setInputs({
        ...inputs,
        ["title"]: result?.sale_page?.social_sharing?.title,
        // ["link"]: result?.sale_page?.social_sharing?.link,
        ["plan_image"]: result?.sale_page?.social_sharing?.icon,
      });
    }
    setIsLoading(false);
  };
  console.log(state, "state");
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data_obj = {
      title: inputs.title,
      // link: inputs.link,
      description: shortDescriptionCk,
      icon: inputs.plan_image,
    };
    let social_sharing = {
      social_sharing: data_obj,
    };
    console.log(social_sharing);
    setIsLoading(true);
    const result = await socail_links(
      social_sharing,
      state?.object?.sale_page_title_slug
    );

    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
      navigate("/website-pages");
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
  React.useEffect(() => {
    getPageDetail();
  }, []);

  React.useEffect(() => {}, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12 mb-4">
          <IconButton
            style={{ marginTop: "6px" }}
            className="back-screen-button margin-botton"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          <span style={{ marginLeft: "1px" }} className="sale-page-title">
            {pageName}
          </span>
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
        <div className="col-12">
          <h2>Social Sharing Setting</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              fullWidth
              name="title"
              required
              value={inputs.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Icon </p>
                <FormHelperText className="pt-0">
                  Icon Size(250 X 250) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-3">
                <div className="col-3">
                  {inputs.plan_image && (
                    <img
                      className="image-border"
                      src={s3baseUrl + inputs.plan_image}
                      height="70"
                    />
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
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {/* {inputs?.plan_image == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.plan_image}</p>
            )} */}
          </div>
          <div className="col-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              name="description"
              required
              value={shortDescriptionCk}
              onChange={(e) => setShortDescriptionCk(e.target.value)}
            />
          </div>
          <div className="text-end mt-4">
            <button className="small-contained-button">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}
