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
import { siteSettingApi } from "src/DAL/SiteSetting/siteSetting";
import {
  AddEmailSettingApi,
  emailSettingApi,
} from "src/DAL/ClientSetting/ClientSetting";
import { s3baseUrl } from "src/config/config";
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


export default function EmailSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [fb, setFBImage] = React.useState();
  const [instagram, setInstagramImage] = React.useState();
  const [linkedInImage, setLinkedInImage] = React.useState();
  const [twitterImage, setTwitterImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programList, setProgramList] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [oldFb, setOldFb] = useState("");
  const [oldLinkedIn, setOldLinkedIn] = useState("");
  const [oldTwitter, setOldTwitter] = useState("");
  const [oldInstagram, setOldInstagram] = useState("");
  const [oldEmailBrandLogo, setOldEmailBrandLogo] = useState("");

  const [inputs, setInputs] = React.useState({
    image: {},
    fbLink: "",
    instagramIcon: {},
    facebookIcon: {},
    twitterIcon: {},
    linkedInIcon: {},
    email: "",
    contactLink: "",
    address: "",
    name: "",
    faqLink: "",
    copyRightText: "",
    teamName: "",
    twLink: "",
    instaLink: "",
    linkedinLink: "",
    supportName: "",
  });

  const getNavItemList = async () => {
    const result = await menuList();
    if (result.code === 200) {
      setMenuList(result.menu);
      //   setVaultName(result.vault_category[0].vault_slug);
    }
  };

  const siteSettingData = async () => {
    setIsLoading(true);
    const result = await emailSettingApi();
    if (result.code == 200) {
      // console.log(result.email_setting, "emailSettingApi");
      setInputs({
        ...inputs,
        ["contactLink"]: result?.email_setting?.contact_us_link,
        ["fbLink"]: result?.email_setting?.facebook_link,
        ["email"]: result?.email_setting?.support_email,
        ["address"]: result?.email_setting?.office_address,
        ["name"]: result?.email_setting?.team_name,
        ["faqLink"]: result?.email_setting?.faq_link,
        ["copyRightText"]: result?.email_setting?.copy_right_text,
        ["teamName"]: result?.email_setting?.team_name,
        ["twLink"]: result?.email_setting?.twitter_link,
        ["instaLink"]: result?.email_setting?.instagram_link,
        ["linkedinLink"]: result?.email_setting?.linkedin_link,
        ["supportName"]: result?.email_setting?.support_name,
      });
      setOldInstagram(result?.email_setting?.instagram_icon?.thumbnail_1);
      setOldLinkedIn(result?.email_setting?.linkedin_icon?.thumbnail_1);
      setOldTwitter(result?.email_setting?.twitter_icon?.thumbnail_1);
      setOldFb(result?.email_setting?.facebook_icon?.thumbnail_1);
      setOldEmailBrandLogo(result?.email_setting?.email_brand_logo);
      setIsLoading(false);
    }
  };

  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerFB = (e) => {
    setFBImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["facebookIcon"]: e.target.files[0],
    });
  };
  const fileChangedHandlerInsta = (e) => {
    setInstagramImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["instagramIcon"]: e.target.files[0],
    });
  };
  const fileChangedHandlerTwitter = (e) => {
    setTwitterImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["twitterIcon"]: e.target.files[0],
    });
  };
  const fileChangedHandlerLinkedIn = (e) => {
    setLinkedInImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["linkedInIcon"]: e.target.files[0],
    });
  };
  const audioFileChange = (e) => {
    //console.log("clicked");
    setAudio(e.target.files[0]);
  };
  const handleProgramName = (data) => {
    setProgramName(data.program_slug);
  };
  const handleVaultName = (data) => {
    setVaultName(data.vault_slug);
  };
  const handldeDeleteAudio = () => {
    setAudio();
    //console.log("reset State");
  };
  const handleChangeMembers = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const membersName = typeof value === "string" ? value.split(",") : value;
    setInputs((input) => ({
      ...input,
      ["members"]: membersName,
    }));
  };
  const handleChangeGroups = (event) => {
    const {
      target: { value },
    } = event;
    setGroups(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const groupName = typeof value === "string" ? value.split(",") : value;
    setInputs((input) => ({
      ...input,
      ["groups"]: groupName,
    }));
  };

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    //console.log(typeof dateType, "dateType");
    setDate(newValue);
  };
  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };
  const handleSubmit = async (e) => {
    //console.log(detailDescriptionCk, "lolololo");
    e.preventDefault();

    const formData = new FormData();
    formData.append("support_email", inputs.email);
    formData.append("support_name", inputs.supportName);
    formData.append("contact_us_link", inputs.contactLink);
    formData.append("faq_link", inputs.faqLink);
    formData.append("copy_right_text", inputs.copyRightText);
    formData.append("office_address", inputs.address);
    formData.append("team_name", inputs.name);
    formData.append("facebook_link", inputs.fbLink);
    formData.append("instagram_link", inputs.instaLink);
    formData.append("twitter_link", inputs.twLink);
    formData.append("linkedin_link", inputs.linkedinLink);

    if (fb) {
      formData.append("facebook_icon", inputs.facebookIcon);
    }
    if (instagram) {
      formData.append("instagram_icon", inputs.instagramIcon);
    }
    if (twitterImage) {
      formData.append("twitter_icon", inputs.twitterIcon);
    }
    if (linkedInImage) {
      formData.append("linkedin_icon", inputs.linkedInIcon);
    }
    if (file) {
      formData.append("email_brand_logo", inputs.image);
    }

    //console form data
    for (var value of formData.values()) {
      //console.log(value, "form data value");
    }

    setIsLoading(true);
    const result = await AddEmailSettingApi(formData);
    if (result.code === 200) {
      //console.log(result, "result");
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    } else {
      //console.log(result, "error case");
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeProgram = (e) => {
    setProgramName(e.target.value);
  };
  const handleChangeVault = (event) => {
    setVaultName(event.target.value);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    getNavItemList();
    siteSettingData();
  }, []);
  //   //console.log(typeof audioFile, "values of audio to be send ");

  // if (isLoading === true) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }
  //console.log(detailDescriptionCk, "detailDescriptionCk");

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          {/* <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}>
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton> */}
          {/* <button
            className="small-contained-button-search float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Email Setting</h2>
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
        //             style={{ borderRadius: "12px" }}
        //           />
        //         </div>
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
        //             style={{ borderRadius: "12px" }}
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
        //             style={{ borderRadius: "12px" }}
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
        //             style={{ borderRadius: "12px" }}
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
        //             style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  required
                  value={inputs.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Contact Link"
                  variant="outlined"
                  fullWidth
                  required
                  name="contactLink"
                  value={inputs.contactLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Office Address"
                  variant="outlined"
                  fullWidth
                  name="address"
                  value={inputs.address}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Support Name"
            variant="outlined"
            fullWidth
            name="supportName"
            value={inputs.supportName}
            onChange={handleChange}
          />
        </div> */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Faq Link"
                  variant="outlined"
                  fullWidth
                  name="faqLink"
                  value={inputs.faqLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="CopyRight Text"
                  variant="outlined"
                  fullWidth
                  name="copyRightText"
                  value={inputs.copyRightText}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Team Name"
            variant="outlined"
            fullWidth
            name="teamName"
            value={inputs.teamName}
            onChange={handleChange}
          />
        </div> */}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Email Brand Logo *</p>
                    <FormHelperText className="pt-0">
                      ("PNG",300 X 300)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {file ? (
                      <img className="image-border" src={file} height="50" />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldEmailBrandLogo}
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
                {inputs.image.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs.image.name}</p>
                )}
              </div>
              <h3 className="mt-5 welcome-back">Social Media</h3>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Facebook link"
                  variant="outlined"
                  fullWidth
                  name="fbLink"
                  value={inputs.fbLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Twitter Link"
                  variant="outlined"
                  fullWidth
                  name="twLink"
                  value={inputs.twLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Instagram link"
                  variant="outlined"
                  fullWidth
                  name="instaLink"
                  value={inputs.instaLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Linkedin Link"
                  variant="outlined"
                  fullWidth
                  name="linkedinLink"
                  value={inputs.linkedinLink}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Linkedin Link"
            variant="outlined"
            fullWidth
            name="linkedinLink"
            value={inputs.linkedinLink}
            onChange={handleChange}
          />
        </div> */}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Facebook icon</p>
                    <FormHelperText className="pt-0">
                      ( "PNG",778 X 430)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {fb ? (
                      <img className="image-border" src={fb} height="50" />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldFb}
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-fileFb">
                      <Input
                        accept="image/*"
                        id="contained-button-fileFb"
                        multiple
                        type="file"
                        name="facebookIcon"
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
                {inputs.image.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs.image.name}</p>
                )}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Instagram icon</p>
                    <FormHelperText className="pt-0">
                      ( "PNG",778 X 430)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {instagram ? (
                      <img
                        className="image-border"
                        src={instagram}
                        height="50"
                      />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldInstagram}
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-fileInstagram">
                      <Input
                        accept="image/*"
                        id="contained-button-fileInstagram"
                        multiple
                        type="file"
                        name="instagramIcon"
                        onChange={fileChangedHandlerInsta}
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
                {inputs.image.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs.image.name}</p>
                )}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Twitter icon</p>
                    <FormHelperText className="pt-0">
                      ( "PNG",778 X 430)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {twitterImage ? (
                      <img
                        className="image-border"
                        src={twitterImage}
                        height="50"
                      />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldTwitter}
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-fileTwitter">
                      <Input
                        accept="image/*"
                        id="contained-button-fileTwitter"
                        multiple
                        type="file"
                        name="twitterIcon"
                        onChange={fileChangedHandlerTwitter}
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
                {inputs.image.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs.image.name}</p>
                )}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">LinkedIn icon</p>
                    <FormHelperText className="pt-0">
                      ( "PNG",778 X 430)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {linkedInImage ? (
                      <img
                        className="image-border"
                        src={linkedInImage}
                        height="50"
                      />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldLinkedIn}
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-fileLinkedIn">
                      <Input
                        accept="image/*"
                        id="contained-button-fileLinkedIn"
                        multiple
                        type="file"
                        name="LinkedInIcon"
                        onChange={fileChangedHandlerLinkedIn}
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
                {inputs.image.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs.image.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-end mt-4">
        <button onClick={handleSubmit} className="small-contained-button">
          Submit
        </button>
      </div>
    </div>
  );
}
