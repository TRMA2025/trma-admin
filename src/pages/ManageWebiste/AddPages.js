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
import {
  IconButton,
  Divider,
  CircularProgress,
  TextareaAutosize,
} from "@mui/material";
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

import { get_root_value } from "src/utils/domUtils";
import {
  addPageApi,
  templateListingApi,
} from "src/DAL/WebsitePages/websitepages";

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


export default function AddPages() {
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
  const [templates, setTemplates] = React.useState([]);
  const [shortDescriptionCk, setShortDescriptionCk] = React.useState("");

  const [inputs, setInputs] = React.useState({
    instagramIcon: {},
    facebookIcon: {},
    twitterIcon: {},
    title: "",
    isWhatsIncluded: "true",
    meta_title: "",
    meta_keyword: "",
    active_campaign_list_id: "",
    active_campaign_list_tag: "",
    redirect: "thanks",
    testimonial: "false",
    navMenu: "",
    metaDescription: "",
    pixel_code_header: "",
    pixel_code_body: "",
    general_testimonial: "false",
    template_type: "",
    isPaymentPlan: "false",
    generalPaymentPlan: "true",
    isEvent: "false",
    generalEvent: "true",
    isFaq: "false",
    generalFaq: "false",
    logos: "false",
    socialMediaLinks: "true",
    facebookLink: "",
    pinterestLink: "",
    instagramLink: "",
    youtubeLink: "",
    mailboxLink: "",
    isPaymentPlan: "false",
    generalPaymentPlan: "true",
    isEvent: "false",
    generalEvent: "true",
    isFaq: "false",
    generalFaq: "false",
    logos: "true",
    socialMediaLinks: "true",
    facebookLink: "",
    pinterestLink: "",
    instagramLink: "",
    youtubeLink: "",
    mailboxLink: "",
    google_tracking_code_header: "",
    google_tracking_code_body: "",
  });

  const getNavItemList = async () => {
    const result = await menuList();
    if (result.code === 200) {
      setMenuList(result.menu);
      //   setVaultName(result.vault_category[0].vault_slug);
    }
  };

  const siteSettingData = async () => {
    setIsLoading(false);
    const result = await emailSettingApi();
    if (result.code == 200) {
      //   setInputs({
      //     ...inputs,
      //     ["contactLink"]: result?.email_setting?.contact_us_link,
      //     ["fbLink"]: result?.email_setting?.facebook_link,
      //     ["email"]: result?.email_setting?.support_email,
      //     ["address"]: result?.email_setting?.office_address,
      //     ["name"]: result?.email_setting?.team_name,
      //     ["faqLink"]: result?.email_setting?.faq_link,
      //     ["copyRightText"]: result?.email_setting?.copy_right_text,
      //     ["teamName"]: result?.email_setting?.team_name,
      //     ["twLink"]: result?.email_setting?.twitter_link,
      //     ["instaLink"]: result?.email_setting?.instagram_link,
      //     ["linkedinLink"]: result?.email_setting?.linkedin_link,
      //     ["supportName"]: result?.email_setting?.support_name,
      //   });
      //   setOldInstagram(result?.email_setting?.instagram_icon?.thumbnail_1);
      //   setOldLinkedIn(result?.email_setting?.linkedin_icon?.thumbnail_1);
      //   setOldTwitter(result?.email_setting?.twitter_icon?.thumbnail_1);
      //   setOldFb(result?.email_setting?.facebook_icon?.thumbnail_1);
      //   setIsLoading(false);
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
    setAudio(e.target.files[0]);
  };
  const templatesListData = async () => {
    setIsLoading(true);
    let result = await templateListingApi();
    if (result.code == 200) {
      console.log(result, "resultresultresult");
      setTemplates(result.Template_configuration);
      setInputs({
        ...inputs,
        ["template_type"]: result.Template_configuration[0].template_slug,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
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
    setDate(newValue);
  };
  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("meta_title", inputs.meta_title);
  //   formData.append("meta_description", inputs.metaDescription);
  //   formData.append("meta_keywords", inputs.meta_keyword);
  //   formData.append("pixel_code_header", inputs.pixel_code_header);
  //   formData.append("pixel_code_body", inputs.pixel_code_body);
  //   formData.append("active_campaign_list_id", inputs.active_campaign_list_id);
  //   formData.append("active_campaign_tag_id", inputs.active_campaign_list_tag);
  //   formData.append("redirect_user", inputs.redirect);
  //   formData.append("template", inputs.template_type);
  //   formData.append("is_testimonial", inputs.testimonial);
  //   formData.append("is_general_testimonial", inputs.general_testimonial);
  //   formData.append("is_payment_plan", inputs.isPaymentPlan);
  //   formData.append("is_general_payment_plan", inputs.generalPaymentPlan);
  //   formData.append("sale_page_title", inputs.sale_page_title);
  //   formData.append("thankyou_page_content", shortDescriptionCk);
  //   formData.append("is_general_brand_logo", inputs.logos);
  //   formData.append("is_event", inputs.isEvent);
  //   formData.append("is_faq", inputs.isFaq);
  //   formData.append("is_general_faq", inputs.generalFaq);
  //   formData.append("is_general_social_links", inputs.socialMediaLinks);

  //   if (inputs.logos == "false" || inputs.logos == false) {
  //     formData.append("brand_logo", inputs.facebookIcon);
  //     formData.append("brand_favicon", inputs.instagramIcon);
  //     formData.append("footer_logo", inputs.twitterIcon);
  //   }
  //   // if (fb) {
  //   //   formData.append("brand_logo", inputs.facebookIcon);
  //   // } else {
  //   //   enqueueSnackbar("Brand Logo Is Required", { variant: "error" });
  //   // }
  //   // if (instagram) {
  //   //   formData.append("brand_favicon", inputs.instagramIcon);
  //   // } else {
  //   //   enqueueSnackbar("FavIcon Is Required", { variant: "error" });
  //   // }
  //   // if (twitterImage) {
  //   //   formData.append("footer_logo", inputs.twitterIcon);
  //   // } else {
  //   //   enqueueSnackbar("Footer Logo Is Required", { variant: "error" });
  //   // }

  //   //console form data

  //   console.log(...formData, "form data value");

  //   setIsLoading(true);
  //   const result = await addPageApi(formData);
  //   if (result.code === 200) {
  //     console.log(result, "result");
  //     enqueueSnackbar(result.message, { variant: "success" });
  //     setIsLoading(false);
  //     navigate("/website-pages");
  //   } else {
  //     console.log(result, "error case");
  //     enqueueSnackbar(result.message, { variant: "error" });
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("meta_title", inputs.meta_title);
    formData.append("meta_description", inputs.metaDescription);
    formData.append("meta_keywords", inputs.meta_keyword);
    formData.append("pixel_code_header", inputs.pixel_code_header);
    formData.append("pixel_code_body", inputs.pixel_code_body);
    // formData.append("active_campaign_list_id", inputs.active_campaign_list_id);
    // formData.append("active_campaign_tag_id", inputs.active_campaign_list_tag);
    formData.append("redirect_user", inputs.redirect);
    formData.append("template", inputs.template_type);
    formData.append("is_what_include", inputs.isWhatsIncluded);
    formData.append("is_testimonial", inputs.testimonial);
    formData.append("is_general_testimonial", inputs.general_testimonial);
    formData.append("is_payment_plan", inputs.isPaymentPlan);
    formData.append("is_general_payment_plan", inputs.generalPaymentPlan);
    formData.append("sale_page_title", inputs.sale_page_title);
    formData.append("thankyou_page_content", shortDescriptionCk);
    formData.append("is_faq", inputs.isFaq);
    formData.append("is_general_faq", inputs.generalFaq);
    // formData.append("is_team", inputs.is_team);
    // formData.append("is_general_team", inputs.general_team);
    formData.append("is_event", inputs.isEvent);
    formData.append("is_general_event", inputs.generalEvent);
    formData.append("is_general_brand_logo", inputs.logos);
    formData.append("is_general_social_links", inputs.socialMediaLinks);
    formData.append("facebook_link", inputs.facebookLink);
    formData.append("pinterest_link", inputs.pinterestLink);
    formData.append("instagram_link", inputs.instagramLink);
    formData.append("youtube_link", inputs.youtubeLink);
    formData.append("mailbox_link", inputs.mailboxLink);
    formData.append(
      "google_tracking_code_header",
      inputs.google_tracking_code_header
    );
    formData.append(
      "google_tracking_code_body",
      inputs.google_tracking_code_body
    );
    // formData.append("is_what_include", "true");

    if (fb) {
      formData.append("brand_logo", inputs.facebookIcon);
    }
    if (instagram) {
      formData.append("brand_favicon", inputs.instagramIcon);
    }
    if (twitterImage) {
      formData.append("footer_logo", inputs.twitterIcon);
    }

    //console form data

    setIsLoading(true);
    const result = await addPageApi(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
      navigate("/website-pages");
    } else {
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
    templatesListData();
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
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
        <div className="col-12">
          <h2>Add Page</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Page Title"
              variant="outlined"
              fullWidth
              name="sale_page_title"
              required
              value={inputs.sale_page_title}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Meta Title"
              variant="outlined"
              fullWidth
              name="meta_title"
              required
              value={inputs.meta_title}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Meta Keyword"
              variant="outlined"
              fullWidth
              name="meta_keyword"
              required
              value={inputs.meta_keyword}
              onChange={handleChange}
            />
          </div>
          {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Active Campaign List id"
            variant="outlined"
            fullWidth
            name="active_campaign_list_id"
            required
            value={inputs.active_campaign_list_id}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Active Campaign Tag Id Id"
            variant="outlined"
            fullWidth
            name="active_campaign_list_tag"
            required
            value={inputs.active_campaign_list_tag}
            onChange={handleChange}
          />
        </div> */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Choose Template
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="template_type"
                value={inputs.template_type}
                label="Choose Template"
                onChange={handleChange}
              >
                {templates.map((template) => {
                  return (
                    <MenuItem value={template.template_slug}>
                      {template.template_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Redirect User
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="redirect"
                value={inputs.redirect}
                label="Redirect User"
                onChange={handleChange}
              >
                <MenuItem value="thanks">Thanks Page</MenuItem>
                <MenuItem value="dashboard">Dashboard</MenuItem>
                <MenuItem value="programme">Programme</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Is Testimonial?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="testimonial"
                value={inputs.testimonial}
                label="Is testimonial"
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          {inputs.testimonial == "true" ? (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">
                  Do You want to use general Testimonials?
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="general_testimonial"
                  value={inputs.general_testimonial}
                  label="Do You want to use general Testimonials?"
                  onChange={handleChange}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </div>
          ) : (
            ""
          )}
          {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Nav Menu</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="navMenu"
              value={inputs.navMenu}
              label="navMenu"
              onChange={handleChange}
            >
              {menuLists.map((menu) => {
                return (
                  <MenuItem value={menu.menu_slug}>{menu.menu_title}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div> */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Is Payment Plan?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="isPaymentPlan"
                required
                value={inputs.isPaymentPlan}
                label="Is Payment Plan"
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          {inputs.isPaymentPlan == "true" && (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">
                  Do You want to use general Pyament Plans?
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="generalPaymentPlan"
                  required
                  value={inputs.generalPaymentPlan}
                  label="Do You want to use general Pyament Plans?"
                  onChange={handleChange}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Is Event?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="isEvent"
                required
                value={inputs.isEvent}
                label="Is Event"
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          {inputs.isEvent == "true" && (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">
                  Do You want to use general Event?
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="generalEvent"
                  required
                  value={inputs.generalEvent}
                  label="Do You want to use general Event?"
                  onChange={handleChange}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Is FAQ?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="isFaq"
                required
                value={inputs.isFaq}
                label="Is FAQ"
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          {inputs.isFaq == "true" && (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">
                  Do You want to use general FAQ?
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="generalFaq"
                  required
                  value={inputs.generalFaq}
                  label="Do You want to use general Event?"
                  onChange={handleChange}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Is What's Included Section?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="isWhatsIncluded"
                required
                value={inputs.isWhatsIncluded}
                label="Is What's Included Section?"
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Use general brand logo, footer logo and favicon?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="logos"
                required
                value={inputs.logos}
                label="Use general brand logo, footer logo and favicon?"
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Use general Social Media Links?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="socialMediaLinks"
                required
                value={inputs.socialMediaLinks}
                label="Use general Social Media Links?"
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          {inputs.socialMediaLinks == "false" && (
            <>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Facebook Link"
                  variant="outlined"
                  fullWidth
                  name="facebookLink"
                  value={inputs.facebookLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Pinterest Link"
                  variant="outlined"
                  fullWidth
                  name="pinterestLink"
                  value={inputs.pinterestLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Instagram Link"
                  variant="outlined"
                  fullWidth
                  name="instagramLink"
                  value={inputs.instagramLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Youtube Link"
                  variant="outlined"
                  fullWidth
                  name="youtubeLink"
                  value={inputs.youtubeLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Mailbox Link"
                  variant="outlined"
                  fullWidth
                  name="mailboxLink"
                  value={inputs.mailboxLink}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          {inputs.logos == "false" && (
            <>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Brand Logo</p>
                    {/* <FormHelperText className="pt-0">
                ( "PNG",778 X 430)
              </FormHelperText> */}
                  </div>
                  <div className="col-2">
                    {fb ? (
                      <img className="image-border" src={fb} height="50" />
                    ) : (
                      ""
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
                        className="small-contained-button"
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
                    <p className="">Brand Favicon</p>
                    {/* <FormHelperText className="pt-0">
                ( "PNG",778 X 430)
              </FormHelperText> */}
                  </div>
                  <div className="col-2">
                    {instagram ? (
                      <img
                        className="image-border"
                        src={instagram}
                        height="50"
                      />
                    ) : (
                      ""
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
                        className="small-contained-button"
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
                    <p className="">Footer Logo</p>
                    <FormHelperText className="pt-0">
                      {/* ( "PNG",778 X 430) */}
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
                      ""
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
                        className="small-contained-button"
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
            </>
          )}
          <div className="col-12 mt-5">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Meta Description"
                multiline
                rows={3}
                required
                name="metaDescription"
                value={inputs.metaDescription}
                onChange={handleChange}
              />
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <p className="tracking_code_heading">
              Facebook Tracking Code Header
            </p>
            <TextareaAutosize
              aria-label="empty textarea"
              value={inputs.pixel_code_header}
              name="pixel_code_header"
              onChange={handleChange}
              placeholder="Facebook Tracking Code Header"
              style={{
                width: "100%",
                height: "100px",
                backgroundColor: "transparent",
                color: get_root_value("--input-text-color"),
                borderRadius: "10px",
                paddingTop: "8px",
                paddingLeft: "5px",
                focus: "green",
              }}
            />
          </div>
          <div className="col-12 mt-4">
            {/* <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Pixel Code Body"
                multiline
                rows={3}
                name="pixel_code_body"
                value={inputs.pixel_code_body}
                onChange={handleChange}
              />
            </FormControl> */}
            <p className="tracking_code_heading">Facebook Tracking Code Body</p>
            <TextareaAutosize
              aria-label="empty textarea"
              value={inputs.pixel_code_body}
              name="pixel_code_body"
              onChange={handleChange}
              placeholder="Facebook Tracking Code Body"
              style={{
                width: "100%",
                height: "100px",
                backgroundColor: "transparent",
                color: get_root_value("--input-text-color"),
                borderRadius: "10px",
                paddingTop: "8px",
                paddingLeft: "5px",
              }}
            />
            <div className="col-12 mt-4">
              <p className="tracking_code_heading">
                Google Tracking Code Header
              </p>
              <TextareaAutosize
                aria-label="empty textarea"
                value={inputs.google_tracking_code_header}
                name="google_tracking_code_header"
                onChange={handleChange}
                placeholder="Google Tracking Code Header"
                style={{
                  width: "100%",
                  height: "100px",
                  backgroundColor: "transparent",
                  color: get_root_value("--input-text-color"),
                  borderRadius: "10px",
                  paddingTop: "8px",
                  paddingLeft: "5px",
                  focus: "green",
                }}
              />
            </div>
            <div className="col-12 mt-4">
              <p className="tracking_code_heading">Google Tracking Code Body</p>
              <TextareaAutosize
                aria-label="empty textarea"
                value={inputs.google_tracking_code_body}
                name="google_tracking_code_body"
                onChange={handleChange}
                placeholder="Google Tracking Code Body"
                style={{
                  width: "100%",
                  height: "100px",
                  backgroundColor: "transparent",
                  color: get_root_value("--input-text-color"),
                  borderRadius: "10px",
                  paddingTop: "8px",
                  paddingLeft: "5px",
                  focus: "green",
                }}
              />
            </div>
          </div>
          <div className="col-12 mt-4">
            <h4>Thank You Page Content</h4>
            <TinyEditor
              setDetailDescription={setShortDescriptionCk}
              detailDescriptionCk={shortDescriptionCk}
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
