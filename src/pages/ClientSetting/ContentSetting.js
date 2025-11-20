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
// import { VaultListing } from "src/DAL/Vault/Vault";
import Autocomplete from "@mui/material/Autocomplete";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, Divider, CircularProgress } from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
import { object } from "prop-types";
import { menuList } from "src/DAL/Menu/Menu";
import { AddProgrammeApi } from "src/DAL/Programme/Programme";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { addQuotesApi } from "src/DAL/quotes/Quotes";
import {
  clientSettingApi,
  updateClientContentSettingApi,
  updateClientGeneralSettingApi,
} from "src/DAL/ClientSetting/ClientSetting";
import { s3baseUrl } from "src/config/config";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import Skeleton from "react-loading-skeleton";
import SettingsSkelton from "src/components/allSkeleton/SettingsSkelton";

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


export default function UpdateContentSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programList, setProgramList] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [forgetPageImage, setForgetPageImage] = React.useState();
  const [verificationImage, setVerificationImage] = React.useState();
  const [clientGeneralSetting, setClientGeneralSetting] = useState();
  const [oldLoginImage, setOldLoginImage] = useState();
  const [OldForgetImage, setOldForgetImage] = useState();
  const [oldVerificationImage, setOldVerificationImage] = useState();
  const [loginStatus, setLoginStatus] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [forgetStatus, setForgetStatus] = useState(false);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [portalDescriptionCk, setPortalDescriptionCk] = React.useState("");
  const [profileDescriptionCk, setProfileDescriptionCk] = React.useState("");
  const [programDescriptionCk, setProgramDescriptionCk] = React.useState("");
  const [LessonDescriptionCk, setLessonDescriptionCk] = React.useState("");
  const [podsDescriptionCk, setPodsDescriptionCk] = React.useState("");
  const [quotesDescriptionCk, setQuotesDescriptionCk] = React.useState("");
  const [memoriesDescriptionCk, setMemoriesDescriptionCk] = React.useState("");
  const [dailyDescriptionCk, setDailyDescriptionCk] = React.useState("");
  const [gratitudeDescriptionCk, setGratitudeDescriptionCk] =
    React.useState("");
  const [affirmationDescriptionCk, setAffirmationDescriptionCk] =
    React.useState("");
  const [calendarDescriptionCk, setCalendarDescriptionCk] = React.useState("");
  const [dailyTaskDescriptionCk, setDailyTaskDescriptionCk] =
    React.useState("");
  // const [calendarDescriptionCk, setCalendarDescriptionCk] = React.useState("");
  const [lessonRecordingDescriptionCk, setLessonRecordingDescriptionCk] =
    React.useState("");
  const [cPRDescriptionCk, setCPRDescriptionCk] = React.useState("");
  const [ProgramRecordingDescriptionCk, setProgramRecordingDescriptionCk] =
    React.useState("");
  const [vaultDescriptionCk, setVaultDescriptionCk] = React.useState("");
  const [goalStatementDescriptionCk, setGoalStatementDescriptionCk] =
    React.useState("");
  const [consultantDescriptionCk, setConsultantDescriptionCk] =
    React.useState("");
  const [loginPageDescription, setLoginPageDescription] = React.useState("");
  const [forgetPageDescription, setForgetPageDescription] = React.useState("");
  const [verificationPageDescription, setVerificationPageDescription] =
    React.useState("");
  const [supportTicketDescriptionCk, setSupportTicketDescriptionCk] =
    React.useState("");
  const [reviewsDescriptionCk, setReviewsDescriptionCk] = React.useState("");
  const [dailyGratitudeTitle, setDailyGratitudeTitle] = React.useState("");
  const [dailyGratitudeHeading, setDailyGratitudeHeading] = React.useState("");
  const [dailyMeditationTitle, setDailyMeditationTitle] = React.useState("");
  const [dailyMeditationHeading, setDailyMeditationHeading] =
    React.useState("");
  const [dailyAffirmationHeading, setDailyAffirmationHeading] =
    React.useState("");
  const [challengesHeading, setChallengesHeading] = React.useState("");
  const [visionHeading, setVisionHeading] = React.useState("");
  const [goalsHeading, setGoalsHeading] = React.useState("");
  const [rewardChartHeading, setRewardChartHeading] = React.useState("");

  const [visionDescription, setVisionDescription] = React.useState("");

  const [inputs, setInputs] = React.useState({
    title: "",
    description: "",
    loginImage: {},
    forgetImage: {},
    verificationImage: {},
    brandName: "",
    daily_gratitude_url: "",
    // daily_gratitude_coins: 1,
    daily_meditation_url: "",
    daily_affirmation_url: "",
    vision_board_url: "",
    goal_statement_button_text: "",
    goal_statement_button_info: "",
  });

  const clientDetail = async () => {
    setIsLoading(true);
    const result = await clientSettingApi();
    if (result.code == 200) {
      let generalSetting = result?.content_setting?.client_content_setting;
      setInputs(generalSetting);
      setLoginPageDescription(generalSetting?.login_page_description);
      setForgetPageDescription(
        generalSetting?.forgot_password_page_description
      );
      setVerificationPageDescription(
        generalSetting?.email_verification_page_description
      );

      setOldLoginImage(generalSetting?.login_page_image);
      setOldForgetImage(generalSetting?.forgot_password_page_image);
      setOldVerificationImage(generalSetting?.email_verification_page_image);
      setDetailDescriptionCk(generalSetting?.dashboard_description);
      setProfileDescriptionCk(generalSetting?.profile_description);
      setProgramDescriptionCk(generalSetting?.programs_description);
      setLessonDescriptionCk(generalSetting?.portal_description);
      setPortalDescriptionCk(generalSetting?.lessons_description);
      setPodsDescriptionCk(generalSetting?.pods_description);
      setQuotesDescriptionCk(generalSetting?.quotes_description);
      setMemoriesDescriptionCk(generalSetting?.memories_description);
      setPortalDescriptionCk(generalSetting?.portal_description);
      setDailyDescriptionCk(generalSetting?.ninteen_day_plan_description);
      setGratitudeDescriptionCk(generalSetting?.gratitude_description);
      setAffirmationDescriptionCk(generalSetting?.affirmation_description);
      setCalendarDescriptionCk(generalSetting?.ninteen_day_chart_description);
      setDailyTaskDescriptionCk(generalSetting?.daily_task_description);
      setCalendarDescriptionCk(generalSetting?.calender_description);
      setLessonRecordingDescriptionCk(
        generalSetting?.lesson_recording_description
      );
      setCPRDescriptionCk(
        generalSetting?.consultant_program_recording_description
      );
      setProgramRecordingDescriptionCk(
        generalSetting?.program_recording_description
      );
      setVaultDescriptionCk(generalSetting?.vault_description);
      setGoalStatementDescriptionCk(generalSetting?.goal_statement_description);
      setConsultantDescriptionCk(
        generalSetting?.consultant_program_recording_description
      );
      setSupportTicketDescriptionCk(generalSetting?.support_ticket_page_title);
      setReviewsDescriptionCk(generalSetting?.program_reviews_heading);
      setDailyGratitudeTitle(generalSetting?.daily_gratitude_title);
      setDailyGratitudeHeading(generalSetting?.daily_gratitude_heading);
      // setDailyMeditationTitle(generalSetting?.daily_meditation_title);
      setDailyMeditationHeading(generalSetting?.daily_meditation_heading);
      setDailyAffirmationHeading(generalSetting?.daily_affirmation_heading);
      setChallengesHeading(generalSetting?.challenges_heading);
      setVisionDescription(generalSetting?.vision_description);
      setVisionHeading(generalSetting?.vision_heading);
      setGoalsHeading(generalSetting?.goals_heading);
      setRewardChartHeading(generalSetting?.reward_chart_heading);

      setIsLoading(false);
    }
  };

  const fileChangedHandlerLogin = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setLoginStatus(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", "1920");
    setIsLoading(true);
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["loginImage"]: imageUpload.image_path,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const fileChangedHandlerForgetPassword = async (e) => {
    setForgetPageImage(URL.createObjectURL(e.target.files[0]));
    setForgetStatus(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", "1920");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["forgetImage"]: imageUpload.image_path,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const fileChangedHandlerVerification = async (e) => {
    setVerificationImage(URL.createObjectURL(e.target.files[0]));
    setVerificationStatus(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", "1920");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["verificationImage"]: imageUpload.image_path,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var postData = {
      dashboard_description: detailDescriptionCk,
      portal_description: portalDescriptionCk,
      profile_description: profileDescriptionCk,
      programs_description: programDescriptionCk,
      lessons_description: LessonDescriptionCk,

      affirmation_description: affirmationDescriptionCk,
      gratitude_description: gratitudeDescriptionCk,
      pods_description: podsDescriptionCk,
      quotes_description: quotesDescriptionCk,
      memories_description: memoriesDescriptionCk,
      // ninteen_day_plan_description: dailyDescriptionCk,
      ninteen_day_chart_description: calendarDescriptionCk,
      // daily_task_description: dailyTaskDescriptionCk,
      calender_description: calendarDescriptionCk,
      program_recording_description: ProgramRecordingDescriptionCk,
      consultant_program_recording_description: cPRDescriptionCk,
      lesson_recording_description: lessonRecordingDescriptionCk,
      vault_description: vaultDescriptionCk,
      goal_statement_description: goalStatementDescriptionCk,

      login_page_description: loginPageDescription,
      forgot_password_page_description: forgetPageDescription,
      email_verification_page_description: verificationPageDescription,
      support_ticket_page_title: supportTicketDescriptionCk,
      program_reviews_heading: reviewsDescriptionCk,
      daily_gratitude_title: dailyGratitudeTitle,
      daily_gratitude_heading: dailyGratitudeHeading,
      // daily_meditation_title: dailyMeditationTitle,
      daily_meditation_heading: dailyMeditationHeading,
      daily_affirmation_heading: dailyAffirmationHeading,
      reward_chart_heading: rewardChartHeading,

      challenges_heading: challengesHeading,
      vision_description: visionDescription,
      vision_heading: visionHeading,
      goals_heading: goalsHeading,
      goal_statement_button_info: inputs.goal_statement_button_info,
      daily_gratitude_url: inputs.daily_gratitude_url,
      // daily_gratitude_coins: inputs.daily_gratitude_coins,
      daily_meditation_url: inputs.daily_meditation_url,
      daily_affirmation_url: inputs.daily_affirmation_url,
      vision_board_url: inputs.vision_board_url,
      goal_statement_button_text: inputs.goal_statement_button_text,
      email_verification_page_image: inputs.verificationImage
        ? inputs.verificationImage
        : oldVerificationImage,
      forgot_password_page_image: inputs.forgetImage
        ? inputs.forgetImage
        : OldForgetImage,
      login_page_image: inputs.loginImage ? inputs.loginImage : oldLoginImage,
    };

    // if (loginStatus) {
    //   // postData.login_page_image = inputs.loginImage;
    //   postData["login_page_image"] = inputs.loginImage;
    // } else {
    //   postData["login_page_image"] = oldLoginImage;
    // }
    // if (forgetStatus) {
    //   // postData.forgot_password_page_image = inputs.forgetImage;
    //   postData["forgot_password_page_image"] = inputs.forgetImage;
    // } else {
    //   postData["forgot_password_page_image"] = OldForgetImage;
    // }
    // if (verificationStatus) {
    //   // postData.email_verification_page_image = inputs.verificationImage;
    //   postData["email_verification_page_image"] = inputs.verificationImage;
    // } else {
    //   postData["email_verification_page_image"] = oldVerificationImage;
    // }
    let Data = {
      client_content_setting: postData,
    };
    // if (inputs.daily_gratitude_url == "") {
    //   enqueueSnackbar("Upload Daily Gratitude Url", { variant: "error" });
    // } else {
    //   if (inputs.daily_meditation_url == "") {
    //     enqueueSnackbar("Upload Daily Meditation Url", { variant: "error" });
    //   } else {

    //   }
    // }
    setIsLoading(true);
    const result = await updateClientContentSettingApi(Data);
    if (result.code === 200) {
      clientDetail();
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
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
    clientDetail();
  }, []);

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        {/* <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton>
        </div> */}
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Content Settings</h2>
        </div>
      </div>
      {isLoading ? (
        <SettingsSkelton />
      ) : (
        // <div class="card main-card">
        //   <div class="card-body">
        //     <div className="row mt-2 ">
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
        //       </div>{" "}
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
        //       </div>{" "}
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
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={200}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={200}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={200}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={200}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={200}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={200}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div class="card main-card">
          <div class="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Login Page Background Image </p>
                      <FormHelperText className="pt-0">
                        Recommended Size(1920 X 1080) ("JPG", "JPEG",
                        "PNG","WEBP")
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {file ? (
                        <img src={file} height="50" />
                      ) : (
                        oldLoginImage && (
                          <img src={s3baseUrl + oldLoginImage} height="50" />
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
                          onChange={fileChangedHandlerLogin}
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
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Forgot Password Page Background Image </p>
                      <FormHelperText className="pt-0">
                        Recommended Size (1920 X 1080) ("JPG", "JPEG",
                        "PNG","WEBP")
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {forgetPageImage ? (
                        <img src={forgetPageImage} height="50" />
                      ) : (
                        OldForgetImage && (
                          <img src={s3baseUrl + OldForgetImage} height="50" />
                        )
                      )}
                    </div>
                    <div className="col-5 text-end pt-2">
                      <label htmlFor="contained-button-file1">
                        <Input
                          accept="image/*"
                          id="contained-button-file1"
                          multiple
                          type="file"
                          name="image"
                          onChange={fileChangedHandlerForgetPassword}
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
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Verification Page Background Image</p>
                      <FormHelperText className="pt-0">
                        Recommended Size (1920 X 1080) ("JPG", "JPEG",
                        "PNG","WEBP")
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {verificationImage ? (
                        <img src={verificationImage} height="50" />
                      ) : (
                        oldVerificationImage && (
                          <img
                            src={s3baseUrl + oldVerificationImage}
                            height="50"
                          />
                        )
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
                          onChange={fileChangedHandlerVerification}
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
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Login Page Description</h4>
          <TinyEditor
            setDetailDescription={setLoginPageDescription}
            detailDescriptionCk={loginPageDescription}
          />
        </div> */}
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Forget Page Description</h4>
          <TinyEditor
            setDetailDescription={setForgetPageDescription}
            detailDescriptionCk={forgetPageDescription}
          />
        </div>
        <div className="col-12 mt-5">
          <h4 className="mb-3">Email Verification Page Description</h4>
          <TinyEditor
            setDetailDescription={setVerificationPageDescription}
            detailDescriptionCk={verificationPageDescription}
          />
        </div> */}
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Dashboard Description</h4>
                  <TinyEditor
                    setDetailDescription={setDetailDescriptionCk}
                    detailDescriptionCk={detailDescriptionCk}
                  />
                </div>
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Profile Description </h4>
          <TinyEditor
            setDetailDescription={setProfileDescriptionCk}
            detailDescriptionCk={profileDescriptionCk}
          />
        </div> */}
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Programme Description </h4>
                  <TinyEditor
                    setDetailDescription={setProgramDescriptionCk}
                    detailDescriptionCk={programDescriptionCk}
                  />
                </div>
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Lessons Description </h4>
          <TinyEditor
            setDetailDescription={setLessonDescriptionCk}
            detailDescriptionCk={LessonDescriptionCk}
          />
        </div> */}
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Meetings Description </h4>
                  <TinyEditor
                    setDetailDescription={setPodsDescriptionCk}
                    detailDescriptionCk={podsDescriptionCk}
                  />
                </div>{" "}
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Affirmations Description </h4>
          <TinyEditor
            setDetailDescription={setAffirmationDescriptionCk}
            detailDescriptionCk={affirmationDescriptionCk}
          />
        </div>{" "} */}
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Gratitude Description </h4>
          <TinyEditor
            setDetailDescription={setGratitudeDescriptionCk}
            detailDescriptionCk={gratitudeDescriptionCk}
          />
        </div> */}
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Quotes Description </h4>
          <TinyEditor
            setDetailDescription={setQuotesDescriptionCk}
            detailDescriptionCk={quotesDescriptionCk}
          />
        </div>{" "} */}
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Memories Description </h4>
                  <TinyEditor
                    setDetailDescription={setMemoriesDescriptionCk}
                    detailDescriptionCk={memoriesDescriptionCk}
                  />
                </div>
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Daily Description </h4>
          <TinyEditor
            setDetailDescription={setDailyDescriptionCk}
            detailDescriptionCk={dailyDescriptionCk}
          />
        </div> */}
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Portals Description </h4>
                  <TinyEditor
                    setDetailDescription={setPortalDescriptionCk}
                    detailDescriptionCk={portalDescriptionCk}
                  />
                </div>
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Calendar Description </h4>
                  <TinyEditor
                    setDetailDescription={setCalendarDescriptionCk}
                    detailDescriptionCk={calendarDescriptionCk}
                  />
                </div>
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Daily Task Description </h4>
          <TinyEditor
            setDetailDescription={setDailyTaskDescriptionCk}
            detailDescriptionCk={dailyTaskDescriptionCk}
          />
        </div> */}
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Lesson Recording Description </h4>
          <TinyEditor
            setDetailDescription={setLessonRecordingDescriptionCk}
            detailDescriptionCk={lessonRecordingDescriptionCk}
          />
        </div> */}
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Consultant Program Recording Description </h4>
          <TinyEditor
            setDetailDescription={setCPRDescriptionCk}
            detailDescriptionCk={cPRDescriptionCk}
          />
        </div>{" "} */}
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Program Recording Description </h4>
          <TinyEditor
            setDetailDescription={setProgramRecordingDescriptionCk}
            detailDescriptionCk={ProgramRecordingDescriptionCk}
          />
        </div> */}
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Replay Library Description </h4>
                  <TinyEditor
                    setDetailDescription={setVaultDescriptionCk}
                    detailDescriptionCk={vaultDescriptionCk}
                  />
                </div>
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Goal Statement Description </h4>
          <TinyEditor
            setDetailDescription={setGoalStatementDescriptionCk}
            detailDescriptionCk={goalStatementDescriptionCk}
          />
        </div> */}
                {/* <div className="col-12 mt-5">
          <h4 className="mb-3">Consultant Description </h4>
          <TinyEditor
            setDetailDescription={setConsultantDescriptionCk}
            detailDescriptionCk={consultantDescriptionCk}
          />
        </div> */}
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Support Ticket Page Title</h4>
                  <TinyEditor
                    setDetailDescription={setSupportTicketDescriptionCk}
                    detailDescriptionCk={supportTicketDescriptionCk}
                  />
                </div>
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Programme Reviews Heading</h4>
                  <TinyEditor
                    setDetailDescription={setReviewsDescriptionCk}
                    detailDescriptionCk={reviewsDescriptionCk}
                  />
                </div>
                <h3 className="col-12 mt-5"> Daily Gratitude</h3>
                <div className="col-12 mt-3">
                  <h4 className="mb-3">Daily Gratitude Heading</h4>
                  <TinyEditor
                    setDetailDescription={setDailyGratitudeHeading}
                    detailDescriptionCk={dailyGratitudeHeading}
                  />
                </div>
                <div className="col-12 mt-5">
                  <h4 className="mb-3">Daily Gratitude Title</h4>
                  <TinyEditor
                    setDetailDescription={setDailyGratitudeTitle}
                    detailDescriptionCk={dailyGratitudeTitle}
                  />
                </div>
                {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-5">
                <TextField
                  id="outlined-basic"
                  label="Daily Gratitude Coins Count"
                  variant="outlined"
                  fullWidth
                  type="number"
                  onWheel={(event) => event.target.blur()}
                  required
                  name="daily_gratitude_coins"
                  value={inputs.daily_gratitude_coins}
                  onChange={handleChange}
                />
              </div> */}
                <div className="col-12 mt-5">
                  <TextField
                    id="outlined-basic"
                    label="Daily Gratitude Video Url "
                    variant="outlined"
                    fullWidth
                    required
                    name="daily_gratitude_url"
                    value={inputs.daily_gratitude_url}
                    onChange={handleChange}
                  />
                </div>
                {/* meditation */}
                <h3 className="col-12 mt-5"> Daily Meditation</h3>
                <div className="col-12 mt-3">
                  <h4 className="mb-3">Daily Meditation Heading</h4>
                  <TinyEditor
                    setDetailDescription={setDailyMeditationHeading}
                    detailDescriptionCk={dailyMeditationHeading}
                  />
                </div>
                {/*<div className="col-12 mt-5">
                <h4 className="mb-3">Daily Meditation Title</h4>
                <TinyEditor
                  setDetailDescription={setDailyMeditationTitle}
                  detailDescriptionCk={dailyMeditationTitle}
                />
              </div>*/}
                <div className="col-12 mt-5">
                  <TextField
                    id="outlined-basic"
                    label="Daily Meditation Video Url "
                    variant="outlined"
                    fullWidth
                    required
                    name="daily_meditation_url"
                    value={inputs.daily_meditation_url}
                    onChange={handleChange}
                  />
                </div>
                {/* affirmation */}
                <h3 className="col-12 mt-5"> Daily Affirmation</h3>
                <div className="col-12 mt-3">
                  <h4 className="mb-3">Daily Affirmation Heading</h4>
                  <TinyEditor
                    setDetailDescription={setDailyAffirmationHeading}
                    detailDescriptionCk={dailyAffirmationHeading}
                  />
                </div>
                <div className="col-12 mt-5">
                  <TextField
                    id="outlined-basic"
                    label="Daily Affirmation Video Url "
                    variant="outlined"
                    fullWidth
                    required
                    name="daily_affirmation_url"
                    value={inputs.daily_affirmation_url}
                    onChange={handleChange}
                  />
                </div>
                {/* Challenges */}
                <h3 className="col-12 mt-5"> Challenges</h3>
                <div className="col-12 mt-3">
                  <h4 className="mb-3">Challenges Heading</h4>
                  <TinyEditor
                    setDetailDescription={setChallengesHeading}
                    detailDescriptionCk={challengesHeading}
                  />
                </div>
                {/* Vision Board */}
                <h3 className="col-12 mt-5">Vision Board</h3>
                <div className="col-12 mt-3">
                  <h4 className="mb-3">Vision Board Heading</h4>
                  <TinyEditor
                    setDetailDescription={setVisionHeading}
                    detailDescriptionCk={visionHeading}
                  />
                </div>
                <div className="col-12 mt-3">
                  <h4 className="mb-3">Vision Board Description</h4>
                  <TinyEditor
                    setDetailDescription={setVisionDescription}
                    detailDescriptionCk={visionDescription}
                  />
                </div>
                <div className="col-12 mt-5">
                  <TextField
                    id="outlined-basic"
                    label="Vision Board Video Url"
                    variant="outlined"
                    fullWidth
                    required
                    name="vision_board_url"
                    value={inputs.vision_board_url}
                    onChange={handleChange}
                  />
                </div>
                {/* Goals */}
                <h3 className="col-12 mt-5"> Goals</h3>
                <div className="col-12 mt-3">
                  <h4 className="mb-3">Goals Heading</h4>
                  <TinyEditor
                    setDetailDescription={setGoalsHeading}
                    detailDescriptionCk={goalsHeading}
                  />
                </div>
                <h3 className="col-12 mt-5"> Reward Chart</h3>
                <div className="col-12 mt-3">
                  <h4 className="mb-3">Reward Chart Heading</h4>
                  <TinyEditor
                    setDetailDescription={setRewardChartHeading}
                    detailDescriptionCk={rewardChartHeading}
                  />
                </div>
              </div>
              <div className="text-end mt-4">
                <button className="small-contained-button-search">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
