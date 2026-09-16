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
import { useNavigate } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import {
  clientSettingApi,
  updateClientGeneralSettingApi,
} from "src/DAL/ClientSetting/ClientSetting";
import { s3baseUrl } from "src/config/config";
import { useEffect } from "react";
import { getActiveDynamiteEventsList } from "src/DAL/WebsitePagesold/DynamiteEventsCategories/DynamiteEventsCategories";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import Skeleton from "react-loading-skeleton";
import SettingsSkelton from "src/components/allSkeleton/SettingsSkelton";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function UpdateGeneralSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = useState();
  const [LoginBackGround, setLoginBackGround] = useState();
  const [rewardimagesetter, setrewardImageSetter] = useState();

  const [Websitelogo, seWebsitelogo] = useState();
  const [footerLogo, setFooterLogo] = useState();
  const [brandFavIcon, setBrandFavIcon] = useState();
  const [oldBrandLogo, setOldBrandLogo] = useState("");
  const [oldLoginImg, setoldLoginImg] = useState("");
  const [rewardImage, setRewardImage] = useState("");

  const [oldFooterLogo, setOldFooterLogo] = useState("");
  const [oldwebsiteLogo, setoldwebsiteLogo] = useState("");
  const [FooterStatus, setFooterStatus] = useState(false);
  const [oldFav, setOldFav] = useState("");
  const [brandLogoStatus, setBrandLogoStatus] = useState(false);
  const [rewardImageStatus, setRewardImageStatus] = useState(false);

  const [CLientStatus, setCLientStatus] = useState(false);
  const [detailDescriptionCks, setDetailDescriptionCks] = React.useState("");
  const [disclaimerText, setDisclaimerText] = useState("");
  const [loginFormHeading, setloginFormHeading] = React.useState("");
  const [WebsiteLogoStatus, setWebsiteLogoStatus] = useState(false);
  const [favStatus, setFavStatus] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    gratitude_coins: 1,
    meditation_coins: 1,
    affirmation_coins: 1,
    challenges_coins: 1,
    goal_coins_count: 1,
    gratitude_point: 1,
    meditation_point: 1,
    affirmation_point: 1,
    good_attitude_point: 1,
    type: "attitude",
    bonus_point: 1,
    chart_image: {},
    brandLogo: {},
    footerLogo: {},
    websiteLogo: {},
    brandFavIcon: {},
    client_background_image: {},
    brandName: "",
    copyright_text: "",
    privacy_policy_text: "",
    terms_of_use_text: "",
    facebook_link: "",
    pinterest_link: "",
    instagram_link: "",
    youtube_link: "",
    twitter_link: "",
    mailbox_link: "",
    linkedin_link: "",
    pixelCodeHeader: "",
    pixelCodeBody: "",
    googleAnalyticCode: "",
    dynamite_event: "",
    navbar_text: "",
    navbar_link: "",
    disclaimer_button: "",
    disclaimer_heading: "",
    checkbox_label: "",
    analytic_google_code: "",
    disclaimer_status: true,
  });

  const getEventsList = async () => {
    const result = await getActiveDynamiteEventsList();
    if (result.code === 200) {
      setEventList(result.dynamite_event);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const clientDetail = async () => {
    setIsLoading(true);
    const result = await clientSettingApi();
    if (result.code == 200) {
      let generalSetting = result?.content_setting?.client_general_setting;
      setInputs((prevState) => ({
        ...prevState,
        ["bonus_point"]: generalSetting?.bonus_point,
        ["gratitude_point"]: generalSetting?.gratitude_point,
        ["meditation_point"]: generalSetting?.meditation_point,
        ["affirmation_point"]: generalSetting?.affirmation_point,
        ["good_attitude_point"]: generalSetting?.good_attitude_point,

        ["title"]: generalSetting?.meta_title,
        ["gratitude_coins"]: generalSetting?.gratitude_coins,
        ["meditation_coins"]: generalSetting?.meditation_coins,
        ["affirmation_coins"]: generalSetting?.affirmation_coins,
        ["challenges_coins"]: generalSetting?.challenges_coins,
        ["goal_coins_count"]: generalSetting?.goal_coins_count,
        ["description"]: generalSetting?.meta_description,
        ["brandName"]: generalSetting?.brand_name,
        ["copyright_text"]: generalSetting?.copyright_text,
        ["privacy_policy_text"]: generalSetting?.privacy_policy_text,
        ["terms_of_use_text"]: generalSetting?.terms_of_use_text,
        ["facebook_link"]: generalSetting?.facebook_link,
        ["pinterest_link"]: generalSetting?.pinterest_link,
        ["instagram_link"]: generalSetting?.instagram_link,
        ["youtube_link"]: generalSetting?.youtube_link,
        ["mailbox_link"]: generalSetting?.mailbox_link,
        ["linkedin_link"]: generalSetting?.linkedin_link,
        ["twitter_link"]: generalSetting?.twitter_link,
        ["navbar_text"]: generalSetting?.navbar_text,
        ["navbar_link"]: generalSetting?.navbar_link,
        ["disclaimer_button"]: generalSetting?.disclaimer_button_text,
        ["disclaimer_heading"]: generalSetting?.disclaimer_heading,
        ["checkbox_label"]: generalSetting?.checkbox_label,
        ["disclaimer_status"]: generalSetting?.is_disclaimer_show,
        // ["pixelCodeHeader"]: generalSetting.pixel_code_header,
        // ["pixelCodeBody"]: generalSetting.pixel_code_body,
        ["analytic_google_code"]: generalSetting?.analytic_google_code,
      }));
      setOldBrandLogo(generalSetting?.brand_logo);
      setOldFav(generalSetting?.brand_favicon);
      setOldFooterLogo(generalSetting?.footer_logo);
      setoldwebsiteLogo(generalSetting?.website_brand_logo);
      setDetailDescriptionCks(generalSetting?.login_page_text);
      setloginFormHeading(generalSetting?.welcome_login_page_text);
      setDisclaimerText(generalSetting?.disclaimer_text);
      setoldLoginImg(generalSetting?.client_background_image);
      setRewardImage(generalSetting?.chart_image);

      // getEventsList();
      setIsLoading(false);
    }
  };

  const fileChangedHandlerBrandLogo = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setBrandLogoStatus(true);
    setInputs({
      ...inputs,
      ["brandLogo"]: e.target.files[0],
    });
  };
  const handleRewardImage = (e) => {
    setrewardImageSetter(URL.createObjectURL(e.target.files[0]));
    setRewardImageStatus(true);
    setInputs({
      ...inputs,
      ["chart_image"]: e.target.files[0],
    });
  };

  const fileChangedHandlerloginimage = (e) => {
    setLoginBackGround(URL.createObjectURL(e.target.files[0]));
    setCLientStatus(true);
    setInputs({
      ...inputs,
      ["client_background_image"]: e.target.files[0],
    });
  };
  const fileChangedWebsiteLogoBrandLogo = (e) => {
    seWebsitelogo(URL.createObjectURL(e.target.files[0]));
    setWebsiteLogoStatus(true);
    setInputs({
      ...inputs,
      ["websiteLogo"]: e.target.files[0],
    });
  };

  const fileChangedHandlerFooterLogo = (e) => {
    setFooterLogo(URL.createObjectURL(e.target.files[0]));
    setFooterStatus(true);
    setInputs({
      ...inputs,
      ["footerLogo"]: e.target.files[0],
    });
  };
  const fileChangedHandlerBrandFavIcon = (e) => {
    setBrandFavIcon(URL.createObjectURL(e.target.files[0]));
    setFavStatus(true);
    setInputs({
      ...inputs,
      ["brandFavIcon"]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("meta_title", inputs.title);
    formData.append("gratitude_coins", inputs.gratitude_coins);
    formData.append("meditation_coins", inputs.meditation_coins);
    formData.append("affirmation_coins", inputs.affirmation_coins);
    formData.append("challenges_coins", inputs.challenges_coins);
    formData.append("goal_coins_count", inputs.goal_coins_count);
    formData.append("gratitude_point", inputs.gratitude_point);
    formData.append("meditation_point", inputs.meditation_point);
    formData.append("affirmation_point", inputs.affirmation_point);
    formData.append("bonus_point", inputs.bonus_point);
    formData.append("good_attitude_point", inputs.good_attitude_point);

    formData.append("meta_description", inputs.description);
    formData.append("brand_name", inputs.brandName);
    formData.append("copyright_text", inputs.copyright_text);
    formData.append("privacy_policy_text", inputs.privacy_policy_text);
    formData.append("terms_of_use_text", inputs.terms_of_use_text);
    formData.append("facebook_link", inputs.facebook_link);
    formData.append("instagram_link", inputs.instagram_link);
    formData.append("youtube_link", inputs.youtube_link);
    formData.append("mailbox_link", inputs.mailbox_link);
    formData.append("analytic_google_code", inputs.analytic_google_code);
    formData.append("linkedin_link", inputs.linkedin_link);
    formData.append("pinterest_link", inputs.pinterest_link);
    formData.append("navbar_text", inputs.navbar_text);
    formData.append("navbar_link", inputs.navbar_link);
    formData.append("disclaimer_button_text", inputs.disclaimer_button);
    formData.append("disclaimer_heading", inputs.disclaimer_heading);
    formData.append("checkbox_label", inputs.checkbox_label);
    formData.append("is_disclaimer_show", inputs.disclaimer_status);
    formData.append("twitter_link", inputs.twitter_link);
    formData.append("login_page_text", detailDescriptionCks);
    formData.append("welcome_login_page_text", loginFormHeading);
    formData.append("disclaimer_text", disclaimerText);

    if (brandLogoStatus) {
      formData.append("brand_logo", inputs.brandLogo);
    }
    if (rewardImageStatus) {
      formData.append("chart_image", inputs.chart_image);
    }

    if (favStatus) {
      formData.append("brand_favicon", inputs.brandFavIcon);
    }
    if (FooterStatus) {
      formData.append("footer_logo", inputs.footerLogo);
    }
    if (WebsiteLogoStatus) {
      formData.append("website_brand_logo", inputs.websiteLogo);
    }
    if (CLientStatus) {
      formData.append(
        "client_background_image",
        inputs.client_background_image
      );
    }
    console.log(...formData, "form data");
    const result = await updateClientGeneralSettingApi(formData);
    //new feature
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

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        {/* <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}>
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton>
        </div> */}
      </div>
      <div className="row">
        <div className="col-6">
          <h2>General Settings</h2>
        </div>
      </div>
      {isLoading ? (
        <SettingsSkelton />
      ) : (
        // <div class="card main-card">
        //   <div class="card-body">
        //     <div className="row mt-2 ">
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width="100%"
        //           height={90}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={350}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div
        //         className="col-lg-12  mt-4"
        //         style={{ display: "flex", justifyContent: "space-between" }}
        //       >
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={200}
        //             height={60}
        //             style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //         <div style={{ marginRight: "10px" }}>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={60}
        //             height={80}
        //           />
        //         </div>
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#9F00FF"
        //             width={100}
        //             height={60}
        //             // style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //       </div>
        //       <div
        //         className="col-lg-12  mt-4"
        //         style={{ display: "flex", justifyContent: "space-between" }}
        //       >
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={200}
        //             height={60}
        //             style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //         <div style={{ marginRight: "10px" }}>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={60}
        //             height={80}
        //           />
        //         </div>
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#9F00FF"
        //             width={100}
        //             height={60}
        //             // style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //       </div>
        //       <div
        //         className="col-lg-12  mt-4"
        //         style={{ display: "flex", justifyContent: "space-between" }}
        //       >
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={200}
        //             height={60}
        //             style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //         <div style={{ marginRight: "10px" }}>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={60}
        //             height={80}
        //           />
        //         </div>
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#9F00FF"
        //             width={100}
        //             height={60}
        //             // style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={400}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //     </div>
        //     <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //       <Skeleton
        //         baseColor="#fff"
        //         highlightColor="#ddd"
        //         width={200}
        //         height={20}
        //       />
        //     </div>
        //     <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //       <Skeleton
        //         baseColor="#dddde8"
        //         highlightColor="#fff"
        //         width="100%"
        //         height={400}
        //       />
        //     </div>
        //     <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //       <Skeleton
        //         baseColor="#fff"
        //         highlightColor="#ddd"
        //         width={200}
        //         height={20}
        //       />
        //     </div>
        //     <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //       <Skeleton
        //         baseColor="#dddde8"
        //         highlightColor="#fff"
        //         width="100%"
        //         height={400}
        //       />
        //     </div>
        //   </div>
        // </div>
        <form onSubmit={handleSubmit}>
          <div class="card main-card">
            <div class="card-body">
              <div className="row">
                {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Live Event
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="dynamite_event"
              value={inputs.dynamite_event}
              label="Select Live Event"
              onChange={handleChange}
            >
              <MenuItem value="not-selected">No Live Event</MenuItem>
              {eventList.map((event) => {
                return <MenuItem value={event._id}>{event.title}</MenuItem>;
              })}
            </Select>  
          </FormControl>
        </div> */}
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Meta title for client"
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
                    id="outlined-basic"
                    label="Meta description for client"
                    variant="outlined"
                    fullWidth
                    required
                    name="description"
                    value={inputs.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Copyright Text"
                    variant="outlined"
                    fullWidth
                    required
                    name="copyright_text"
                    value={inputs.copyright_text}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Terms Of Use Text "
                    variant="outlined"
                    fullWidth
                    required
                    name="terms_of_use_text"
                    value={inputs.terms_of_use_text}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Privacy Policy Text"
                    variant="outlined"
                    fullWidth
                    required
                    name="privacy_policy_text"
                    value={inputs.privacy_policy_text}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Pixel Code Header"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            name="pixelCodeHeader"
            value={inputs.pixelCodeHeader}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Pixel Code Body"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            name="pixelCodeBody"
            value={inputs.pixelCodeBody}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Google Analytic Code"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            name="googleAnalyticCode"
            value={inputs.googleAnalyticCode}
            onChange={handleChange}
          />
        </div> */}
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Google Analytic Code"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    name="analytic_google_code"
                    value={inputs.analytic_google_code}
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
                    name="brandName"
                    value={inputs.brandName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Client Portal Logo</p>
                      <FormHelperText className="pt-0">
                        (Recommended Size 150 X 22)
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {file ? (
                        <img className="image-border" src={file} height="50" />
                      ) : (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldBrandLogo}
                          height="50"
                        />
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
                          onChange={fileChangedHandlerBrandLogo}
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
                  {inputs?.brandLogo?.name == "" ? (
                    ""
                  ) : (
                    <p className="text-secondary">{inputs?.brandLogo?.name}</p>
                  )}
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Client Portal Login Page Image</p>
                      <FormHelperText className="pt-0">
                        (Recommended Size 150 X 22)
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {LoginBackGround ? (
                        <img
                          className="image-border"
                          src={LoginBackGround}
                          height="50"
                        />
                      ) : (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldLoginImg}
                          height="50"
                        />
                      )}
                    </div>
                    <div className="col-5 text-end pt-2">
                      <label htmlFor="contained-button-filelogin">
                        <Input
                          accept="image/*"
                          id="contained-button-filelogin"
                          multiple
                          type="file"
                          name="image"
                          onChange={fileChangedHandlerloginimage}
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
                  {inputs?.client_background_image?.name == "" ? (
                    ""
                  ) : (
                    <p className="text-secondary">
                      {inputs?.client_background_image?.name}
                    </p>
                  )}
                </div>
                {/* <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Website Logo</p>
              <FormHelperText className="pt-0">
                (Recommended Size 150 X 22)
              </FormHelperText>
            </div>
            <div className="col-2">
              {Websitelogo ? (
                <img src={Websitelogo} height="50" />
              ) : (
                <img src={s3baseUrl + oldwebsiteLogo} height="50" />
              )}
            </div>
            <div className="col-5 text-end pt-2">
              <label htmlFor="contained-button-file2">
                <Input
                  accept="image/*"
                  id="contained-button-file2"
                  multiple
                  type="file"
                  name="image"
                  onChange={fileChangedWebsiteLogoBrandLogo}
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
          {inputs?.brandLogo?.name == "" ? (
            ""
          ) : (
            <p className="text-secondary">{inputs?.brandLogo?.name}</p>
          )}
        </div> */}
                {/* <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Footer Logo</p>
              <FormHelperText className="pt-0">
                (Recommended Size 150 X 22)
              </FormHelperText>
            </div>
            <div className="col-2">
              {footerLogo ? (
                <img src={footerLogo} height="50" />
              ) : (
                <img src={s3baseUrl + oldFooterLogo} height="50" />
              )}
            </div>
            <div className="col-5 text-end pt-2">
              <label htmlFor="contained-button-fileFooter">
                <Input
                  accept="image/*"
                  id="contained-button-fileFooter"
                  multiple
                  type="file"
                  name="footerLogo"
                  onChange={fileChangedHandlerFooterLogo}
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
          {inputs?.footerLogo?.name == "" ? (
            ""
          ) : (
            <p className="text-secondary">{inputs?.footerLogo?.name}</p>
          )}
        </div> */}
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Client Portal FavIcon</p>
                      <FormHelperText className="pt-0">
                        (Recommended Size 32 X 32)
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {brandFavIcon ? (
                        <img
                          className="image-border"
                          src={brandFavIcon}
                          height="50"
                        />
                      ) : (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldFav}
                          height="50"
                        />
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
                          onChange={fileChangedHandlerBrandFavIcon}
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
                  {inputs?.brandFavIcon?.name == "" ? (
                    ""
                  ) : (
                    <p className="text-secondary">
                      {inputs?.brandFavIcon?.name}
                    </p>
                  )}
                </div>
                <h3 className="mt-3">Social Link</h3>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Facebook link"
                    variant="outlined"
                    fullWidth
                    required
                    name="facebook_link"
                    value={inputs.facebook_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Twitter link"
                    variant="outlined"
                    fullWidth
                    name="twitter_link"
                    value={inputs.twitter_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Pinterest link"
                    variant="outlined"
                    fullWidth
                    name="pinterest_link"
                    value={inputs.pinterest_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Instagram link"
                    variant="outlined"
                    fullWidth
                    required
                    name="instagram_link"
                    value={inputs.instagram_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Youtube link"
                    variant="outlined"
                    fullWidth
                    required
                    name="youtube_link"
                    value={inputs.youtube_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Mailbox link"
                    variant="outlined"
                    fullWidth
                    name="mailbox_link"
                    value={inputs.mailbox_link}
                    onChange={handleChange}
                  />
                </div>{" "}
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Linkedin link"
                    variant="outlined"
                    fullWidth
                    name="linkedin_link"
                    value={inputs.linkedin_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Navbar Text"
                    variant="outlined"
                    fullWidth
                    name="navbar_text"
                    value={inputs.navbar_text}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Navbar Link"
                    variant="outlined"
                    fullWidth
                    name="navbar_link"
                    value={inputs.navbar_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Is Disclaimer Show? *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="disclaimer_status"
                      value={inputs.disclaimer_status}
                      label="Is Disclaimer Show? *"
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {/* disclaimer */}
                {inputs.disclaimer_status && (
                  <>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                      <TextField
                        id="outlined-basic"
                        label="Disclaimer Heading"
                        variant="outlined"
                        fullWidth
                        name="disclaimer_heading"
                        value={inputs.disclaimer_heading}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                      <TextField
                        id="outlined-basic"
                        label="Disclaimer Checkbox Label"
                        variant="outlined"
                        fullWidth
                        name="checkbox_label"
                        value={inputs.checkbox_label}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                      <TextField
                        id="outlined-basic"
                        label="Disclaimer Button Text"
                        variant="outlined"
                        fullWidth
                        name="disclaimer_button"
                        value={inputs.disclaimer_button}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 mt-5">
                      <h4>Disclaimer Text</h4>
                      <TinyEditor
                        setDetailDescription={setDisclaimerText}
                        detailDescriptionCk={disclaimerText}
                      />
                    </div>
                  </>
                )}
                <div className="col-12 mt-5">
                  <h4>Login Page Text</h4>
                  <TinyEditor
                    setDetailDescription={setDetailDescriptionCks}
                    detailDescriptionCk={detailDescriptionCks}
                  />
                </div>{" "}
                <div className="col-12 mt-5">
                  <h4>Login Form Heading</h4>
                  <TinyEditor
                    setDetailDescription={setloginFormHeading}
                    detailDescriptionCk={loginFormHeading}
                  />
                </div>
                <h3 className="mt-3">Growth Tools</h3>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Daily Gratitude Coins Count"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="gratitude_coins"
                    value={inputs.gratitude_coins}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Daily Meditation Coins Count"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="meditation_coins"
                    value={inputs.meditation_coins}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Daily Affirmation Coins Count"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="affirmation_coins"
                    value={inputs.affirmation_coins}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Challenges Coins Count"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="challenges_coins"
                    value={inputs.challenges_coins}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label=" Goal Coins Count"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="goal_coins_count"
                    value={inputs.goal_coins_count}
                    onChange={handleChange}
                  />
                </div>
                <h3 className="mt-3">Reward Chart</h3>
                <p className="mb-0" style={{ color: "gray" }}>
                  Reward Weekly Chart Settings{" "}
                </p>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Gratitude point"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="gratitude_point"
                    value={inputs.gratitude_point}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Meditation Point"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="meditation_point"
                    value={inputs.meditation_point}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Affirmation Point"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="affirmation_point"
                    value={inputs.affirmation_point}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Good Attitude Point"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="good_attitude_point"
                    value={inputs.good_attitude_point}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label=" Bonus point"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="bonus_point"
                    value={inputs.bonus_point}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Reward Chart Image</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 1600 X 2000)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {rewardimagesetter ? (
                      <img
                        className="image-border"
                        src={rewardimagesetter}
                        height="50"
                      />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + rewardImage}
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-chart_image">
                      <Input
                        accept="image/*"
                        id="contained-button-chart_image"
                        multiple
                        type="file"
                        name="image"
                        onChange={handleRewardImage}
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
                {inputs?.client_background_image?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">
                    {inputs?.client_background_image?.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button type="submit" className="small-contained-button">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
