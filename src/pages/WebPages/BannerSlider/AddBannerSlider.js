import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
//import Editor from "../../components/Editor/Editor";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, Divider, CircularProgress } from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
// import { object } from "prop-types";
// import { AddPods, AddPodsApi } from "src/DAL/Pods/Pods";
// import { GroupListing } from "src/DAL/Groups/Groups";
// import { MemberListing } from "src/DAL/member/Member";
import moment from "moment";
import TinyEditor from "src/components/ckeditor/Ckeditor";

import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import { handleImageExtensions, handleMenu } from "src/utils/constant";
import { s3baseUrl } from "src/config/config";
import { addBannerApi, editBannerApi } from "src/DAL/bannerSliderApi/bannerApi";
// import MWEditor from "src/components/Editor/CKEditor";

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

export default function AddBannerSlider() {
  const navigate = useNavigate();
  const classes = useStyles();
  const page_id = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [groupListing, setGroupListing] = React.useState([]);
  const [groupAutomatedListing, setGroupAutomatedListing] = React.useState([]);
  const [groupsAutomatedName, setGroupsAutomatedName] = React.useState([]);
  const [groupsName, setGroupsName] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [shortDescriptionCk, setShortDescriptionCk] = React.useState("");
  const [moduleData, setModuleData] = useState({});
  const [pageData, setPageData] = useState({});
  const [moduleSizes, setModuleSizes] = useState({});
  const [oldImage, setOldImage] = React.useState();
  const module_actual_name = "banner_slider";

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    image: {},
    short_description: "",
    sliderType: "image",
    video_url: "",
    designation: "",
    button_text: "",
    button_link: "",
    youtubeLink: "",
    facebookLink: "",
    linkedinLink: "",
    tiktokLink: "",
    twitterLink: "",
    snapchatLink: "",
    instagramLink: "",
    pinterestLink: "",
  });

  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await page_detail_by_id(page_id.page_id);
    if (result.code == 200) {
      const get_module_info = result?.sale_page?.module_info?.filter(
        (item) => item.module_actual_name == module_actual_name
      )[0];
      setModuleData(get_module_info.module_replica_info);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handlePageDetail = (data) => {
    setPageData(data);
    const get_module_info = data?.module_info?.filter(
      (item) => item.module_actual_name == module_actual_name
    )[0];
    setModuleData(get_module_info);
    setModuleSizes(get_module_info);
  };

  const fileChangedHandler = (e) => {
    //console.log(e.target.files[0]);
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  //console.log(groupsName, "groupsNamegroupsName");
  //console.log(person, "personpersonperson");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
    } else {
      const formData = new FormData();

      formData.append("title", inputs.title);
      formData.append("status", inputs.status);
      formData.append("short_description", inputs.short_description);
      formData.append("detail_description", detailDescriptionCk);
      formData.append(
        "button_text",
        inputs.button_text ? inputs.button_text : ""
      );
      formData.append(
        "button_link",
        inputs.button_link ? inputs.button_link : ""
      );
      formData.append("slider_type", inputs.sliderType);
      if (page_id?.banner_id) {
        formData.append("order", inputs.order);
      }
      if (file && inputs.sliderType == "image") {
        formData.append("image", inputs.image);
      }
      if (inputs.sliderType == "video") {
        formData.append("video_url", inputs.video_url);
      }
      if (page_id.page_id) {
        formData.append("created_for", "sale_page");
        formData.append("page_id", page_id.page_id);
      } else {
        formData.append("created_for", "general");
      }

      //console form data

      console.log(...formData, "form data value");

      setIsLoading(true);
      const result =
        page_id.banner_id !== undefined
          ? await editBannerApi(formData, page_id.banner_id)
          : await addBannerApi(formData);
      if (result.code === 200) {
        //console.log(result, "result");
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
      } else {
        //console.log(result);
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    //console.log(event.target.value);
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  //   //console.log(typeof audioFile, "values of audio to be send ");
  //console.log(inputs, "Remaining fields");
  React.useEffect(() => {
    if (state) {
      let data = page_id.banner_id ? state.state : state;
      handlePageDetail(data);
    } else {
      getPageDetail();
    }
  }, []);
  React.useEffect(() => {
    let data = page_id?.page_id ? state?.value?.object : state?.object;
    setDetailDescriptionCk(data?.detail_description);
    setOldImage(data?.images?.thumbnail_1);
    setInputs({
      ...inputs,
      ["title"]: data?.title,
      ["short_description"]: data?.short_description,
      ["order"]: data?.order,
      ["status"]: data?.status,
      ["button_text"]: data?.button_text,
      ["button_link"]: data?.button_link,
      ["sliderType"]: data?.slider_type,
      ["video_url"]: data?.video_url,
    });
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12 mb-4">
          <IconButton
            className="back-screen-button "
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          <span className="sale-page-title">{pageData?.sale_page_title}</span>
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h2>
            {page_id.banner_id
              ? moduleData?.module_replica_info
                ? moduleData?.module_replica_info?.edit_page_heading
                : "Edit Banner Slider"
              : moduleData?.module_replica_info
              ? moduleData?.module_replica_info?.add_page_heading
              : "Add Banner Slider"}
          </h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
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
              {page_id?.banner_id && (
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Order"
                    variant="outlined"
                    fullWidth
                    required
                    name="order"
                    value={inputs.order}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Slider Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="sliderType"
                    value={inputs.sliderType}
                    label="Slider Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {inputs.sliderType == "video" && (
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basicLink"
                    label="Video Url"
                    variant="outlined"
                    fullWidth
                    type="url"
                    required
                    name="video_url"
                    value={inputs.video_url}
                    onChange={handleChange}
                  />
                </div>
              )}

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
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">Status </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {inputs.sliderType == "image" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Upload Image *</p>
                      <FormHelperText className="pt-0">
                        Image Size(
                        {moduleSizes?.image_width +
                          " x " +
                          moduleSizes?.image_height}
                        ) ({handleImageExtensions(moduleSizes.image_extension)})
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {file ? (
                        <img className="image-border" src={file} height="50" />
                      ) : (
                        oldImage && (
                          <img
                            className="image-border"
                            src={s3baseUrl + oldImage}
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
                  {inputs?.image?.name == "" ? (
                    ""
                  ) : (
                    <p className="text-secondary">{inputs?.image?.name}</p>
                  )}
                </div>
              )}
              <div className="col-12 mt-5">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Short Description"
                    multiline
                    rows={6}
                    required
                    name="short_description"
                    value={inputs.short_description}
                    onChange={handleChange}
                  />
                  <FormHelperText>Maximum limit 500 characters</FormHelperText>
                </FormControl>
              </div>
              <div className="col-12 mt-5">
                <h4>Detail Description </h4>
                <TinyEditor
                  setDetailDescription={setDetailDescriptionCk}
                  detailDescriptionCk={detailDescriptionCk}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button className="small-contained-button">Submit</button>
        </div>
      </form>
    </div>
  );
}
