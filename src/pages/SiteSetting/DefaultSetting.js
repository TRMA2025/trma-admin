import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { defaultMenuListApi } from "src/DAL/Menu/Menu";
import { programmeActiveListing } from "src/DAL/Programme/Programme";
import {
  addDefaultSettingApi,
  defaultSettingApi,
} from "src/DAL/SiteSetting/siteSetting";

import { s3baseUrl } from "src/config/config";
import { TimeZones } from "../../utils/constant";
import { useEffect } from "react";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import Skeleton from "react-loading-skeleton";
import SettingsSkelton from "src/components/allSkeleton/SettingsSkelton";

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
      personName?.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function DefaultSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = useState();
  const [AdminlogImg, setAdminlogImg] = useState();
  const [fb, setFBImage] = useState();
  const [oldFav, setOldFav] = useState("");
  const [programList, setProgramList] = useState([]);
  const [menuLists, setMenuList] = useState([]);
  const [brandFavIcon, setBrandFavIcon] = useState();
  const [programName, setProgramName] = useState("");
  const [favStatus, setFavStatus] = useState(false);
  const [navItems, setNavitems] = useState([]);
  const [oldFb, setOldFb] = useState("");
  const [oldLogo, setOldLogo] = useState("");
  const [OldLogin, setOldLogin] = useState("");
  const [Websitelogo, seWebsitelogo] = useState();
  const [oldFooterLogo, setOldFooterLogo] = useState("");
  const [WebsiteLogoStatus, setWebsiteLogoStatus] = useState(false);
  const [groupsName, setGroupsName] = useState([]);
  const [programmeListing, setProgramListing] = useState([]);
  const [oldwebsiteLogo, setoldwebsiteLogo] = useState("");
  const [oldFldedEvent, setoldFldedEvent] = useState();
  const [footerLogo, setFooterLogo] = useState();
  const [FooterStatus, setFooterStatus] = useState(false);
  const [timeZoneValue, setTimeZoneValue] = useState();
  const [loginFormHeading, setloginFormHeading] = React.useState("");
  const [inputValue, setInputValue] = useState("");
  const [otherDocumentMemberFile, setotherDocumentMemberFile] =
    React.useState();
  const [membershipNavItems, setMembershipNavitems] = useState([]);

  const [inputs, setInputs] = useState({
    image: {},
    facebookIcon: {},
    websiteLogo: {},
    footerLogo: {},
    title: "",
    description: "",
    import_event_user_sample_file: {},
    support_ticket_email: "",
    time_zone: "",
    contact_us_support_email: "",
  });

  const getNavItemList = async () => {
    const result = await defaultMenuListApi();
    if (result.code === 200) {
      setMenuList(result.menus);
    }
  };
  const fileChangedHandlerBrandFavIcon = (e) => {
    setBrandFavIcon(URL.createObjectURL(e.target.files[0]));
    setFavStatus(true);
    setInputs({
      ...inputs,
      ["brandFavIcon"]: e.target.files[0],
    });
  };
  const getDefaultSetting = async () => {
    setIsLoading(true);
    const result = await defaultSettingApi();
    if (result.code === 200) {
      console.log(result?.default_setting, "result?.default_setting?");
      let groups_slug = result?.default_setting?.default_access_program;
      let selected_group = [];
      console.log(groups_slug, "groups_sluggroups_slug");
      if (groups_slug.length > 0) {
        groups_slug.map((group) => {
          selected_group.push(group._id?.program_slug);
        });
      }
      if (selected_group.includes(undefined)) {
        console.log("undefined selected group");
      } else {
        if (selected_group && selected_group.length > 0) {
          setGroupsName(selected_group);
        }
      }

      setInputs({
        ...inputs,
        ["title"]: result?.default_setting?.meta_title,
        ["description"]: result?.default_setting?.meta_description,
        ["time_zone"]: result?.default_setting?.time_zone,
        ["support_ticket_email"]: result?.default_setting?.support_ticket_email,
        ["admin_login_page_text"]:
          result?.default_setting?.admin_login_page_text,
        ["contact_us_support_email"]:
          result?.default_setting?.contact_us_support_email,
      });
      setOldFb(result?.default_setting?.admin_favicon);
      setOldLogo(result?.default_setting?.admin_logo);
      setOldFav(result?.default_setting?.brand_favicon);
      setProgramName(result?.default_setting?.default_program?._id);
      setNavitems(result?.default_setting?.nav_items);
      setMembershipNavitems(result?.default_setting?.membership_nav_items);
      setTimeZoneValue(result?.default_setting?.time_zone);
      setOldFooterLogo(result?.default_setting?.footer_logo);
      setoldwebsiteLogo(result?.default_setting?.website_brand_logo);
      setoldFldedEvent(result?.default_setting?.import_event_user_sample_file);
      setOldLogin(result?.default_setting?.admin_background_image);
      setloginFormHeading(result?.default_setting?.admin_login_page_text);
      setIsLoading(false);
    }
  };
  const fileChangedHandlerOtherSampleFile = (e) => {
    setotherDocumentMemberFile(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["import_event_user_sample_file"]: e.target.files[0],
    });
  };
  const getProgrammes = async () => {
    setIsLoading(true);
    const result = await programmeActiveListing();
    if (result.code === 200) {
      setProgramListing(result.program);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const fileChangedWebsiteLogoBrandLogo = (e) => {
    seWebsitelogo(URL.createObjectURL(e.target.files[0]));
    setWebsiteLogoStatus(true);
    setInputs({
      ...inputs,
      ["websiteLogo"]: e.target.files[0],
    });
  };
  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(
      // On autofill we get a stringified value.
      typeof value === "st  ring" ? value.split(",") : value
    );
  };
  const getProgramListing = async () => {
    const result = await programmeActiveListing();
    setIsLoading(true);
    if (result.code === 200) {
      setProgramList(result.program);
      console.log(result.program, "result.programresult.program");
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangeMembershipNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setMembershipNavitems(
      // On autofill we get a stringified value.
      typeof value === "st  ring" ? value.split(",") : value
    );
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerAdminBAckground = (e) => {
    setAdminlogImg(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["admin_background_image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerFB = (e) => {
    setFBImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["facebookIcon"]: e.target.files[0],
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

  const handleChangeGroup = (event) => {
    const {
      target: { value },
    } = event;
    setGroupsName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let group_array1 = [];
    let group_object = {};
    groupsName.map((group) => {
      group_object = {
        program_slug: group,
      };
      group_array1.push(group_object);
    });
    let navArray = [];
    navArray.push(navItems);
    const formData = new FormData();
    console.log(programName, "programNameprogramName");
    formData.append("meta_title", inputs.title);
    formData.append("meta_description", inputs.description);
    formData.append("default_program", programName);
    formData.append("support_ticket_email", inputs.support_ticket_email);
    formData.append("admin_login_page_text", loginFormHeading);
    formData.append("nav_items", JSON.stringify(navItems));
    // formData.append("membership_nav_items", JSON.stringify(membershipNavItems));
    formData.append("default_access_program", JSON.stringify(group_array1));
    formData.append("time_zone", timeZoneValue);
    if (otherDocumentMemberFile) {
      formData.append(
        "import_event_user_sample_file",
        inputs.import_event_user_sample_file
      );
    }
    if (WebsiteLogoStatus) {
      formData.append("website_brand_logo", inputs.websiteLogo);
    }
    if (favStatus) {
      formData.append("brand_favicon", inputs.brandFavIcon);
    }
    formData.append(
      "contact_us_support_email",
      inputs.contact_us_support_email
    );

    if (fb) {
      formData.append("admin_favicon", inputs.facebookIcon);
    }

    if (file) {
      formData.append("admin_logo", inputs.image);
    }
    if (AdminlogImg) {
      formData.append("admin_background_image", inputs.admin_background_image);
    }
    if (FooterStatus) {
      formData.append("footer_logo", inputs.footerLogo);
    }
    console.log(...formData);
    const result = await addDefaultSettingApi(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeProgram = (e) => {
    setProgramName(e.target.value);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    getNavItemList();
    getProgramListing();
    getProgrammes();
    getDefaultSetting();
  }, []);

  useEffect(() => {
    setTimeZoneValue(inputs.time_zone);
  }, [inputs.time_zone]);

  console.log(inputs, "inputsinputsinputsinputsinputsinputs");

  // if (isLoading === true) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }

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
          <h2>Default Setting</h2>
        </div>
      </div>
      {isLoading ? (
        <SettingsSkelton />
      ) : (
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Default Programme
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={programName}
                    label="Default Programme"
                    onChange={handleChangeProgram}
                  >
                    {programList.map((program, i) => {
                      return (
                        <MenuItem key={i} value={program._id}>
                          {program.title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="mt-4">
                  <Autocomplete
                    value={timeZoneValue}
                    onChange={(event, newValue) => {
                      setTimeZoneValue(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    id="controllable-states-demo"
                    options={TimeZones}
                    renderInput={(params) => (
                      <TextField {...params} label="Time Zone" />
                    )}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Contact Us Support Email"
                  variant="outlined"
                  fullWidth
                  name="contact_us_support_email"
                  value={inputs.contact_us_support_email}
                  onChange={handleChange}
                />
              </div>{" "}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Support Ticket Email"
                  variant="outlined"
                  fullWidth
                  name="support_ticket_email"
                  value={inputs.support_ticket_email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Admin Portal Logo</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 778 X 430)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {file ? (
                      <img className="image-border" src={file} height="50" />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldLogo}
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
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Admin Portal Favicon</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 32 X 32)
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
                    <p className="">Website Logo</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 150 X 22)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {Websitelogo ? (
                      <img
                        className="image-border"
                        src={Websitelogo}
                        height="50"
                      />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldwebsiteLogo}
                        height="50"
                      />
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
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Website Footer Logo</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 150 X 22)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {footerLogo ? (
                      <img
                        className="image-border"
                        src={footerLogo}
                        height="50"
                      />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + oldFooterLogo}
                        height="50"
                      />
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
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Website FavIcon</p>
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
                  <p className="text-secondary">{inputs?.brandFavIcon?.name}</p>
                )}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className=""> Import Event Users Sample File</p>
                    <FormHelperText className="pt-0">
                      Import Event Users Sample File *("CSV","csv")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {/* {otherDocument && <img className="image-border"  src={otherDocument} height="50" />} */}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-file-other-sample-file">
                      <Input
                        accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.png,.csv"
                        id="contained-button-file-other-sample-file"
                        multiple
                        type="file"
                        name="otherDocument"
                        onChange={fileChangedHandlerOtherSampleFile}
                      />
                      {oldFldedEvent !== "" && (
                        <a
                          href={oldFldedEvent ? s3baseUrl + oldFldedEvent : ""}
                          target="_blank"
                          className="me-2 small-contained-button-search file small-contained-button-2"
                        >
                          View File
                        </a>
                      )}
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
                {inputs?.import_event_user_sample_file?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">
                    {inputs?.import_event_user_sample_file?.name}
                  </p>
                )}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Admin Login Background Image</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 778 X 430)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {AdminlogImg ? (
                      <img
                        className="image-border"
                        src={AdminlogImg}
                        height="50"
                      />
                    ) : (
                      <img
                        className="image-border"
                        src={s3baseUrl + OldLogin}
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-file5">
                      <Input
                        accept="image/*"
                        id="contained-button-file5"
                        multiple
                        type="file"
                        name="image"
                        onChange={fileChangedHandlerAdminBAckground}
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
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Meta Title"
                  variant="outlined"
                  fullWidth
                  name="title"
                  required
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Meta Description"
                  variant="outlined"
                  fullWidth
                  name="description"
                  required
                  value={inputs.description}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">
                    Nav Items
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={navItems}
                    onChange={handleChangeNavItem}
                    input={<OutlinedInput label=" Nav Items" />}
                    MenuProps={MenuProps}
                  >
                    {menuLists.map((name) => (
                      <MenuItem
                        key={name}
                        value={name.option_value}
                        style={getStyles(name, navItems, theme)}
                      >
                        {name.option_label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {/* <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-name-label">
              Membership Nav Items
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={membershipNavItems}
              onChange={handleChangeMembershipNavItem}
              input={<OutlinedInput label="Membership Nav Items" />}
              MenuProps={MenuProps}
            >
              {menuLists.map((name) => (
                <MenuItem
                  key={name}
                  value={name.option_value}
                  style={getStyles(name, membershipNavItems, theme)}
                >
                  {name.option_label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div> */}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <FormControl className="mt-3" fullWidth>
                  <InputLabel id="demo-multiple-name-label">
                    Default Programmes Access
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={groupsName}
                    onChange={handleChangeGroup}
                    input={<OutlinedInput label="Default Programmes Access" />}
                    MenuProps={MenuProps}
                  >
                    {programmeListing.map((name) => (
                      <MenuItem
                        key={name}
                        value={name.program_slug}
                        style={getStyles(name, groupsName, theme)}
                      >
                        {name.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-12 mt-5">
                <h4>Admin Login Form Heading</h4>
                <TinyEditor
                  setDetailDescription={setloginFormHeading}
                  detailDescriptionCk={loginFormHeading}
                />
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
