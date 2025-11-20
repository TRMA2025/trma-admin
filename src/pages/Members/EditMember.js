import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useMemo } from "react";
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
import { TimeZones } from "src/utils/constant";
import countryList from "react-select-country-list";

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
  Checkbox,
  Tooltip,
} from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
import { object } from "prop-types";
import { menuList } from "src/DAL/Menu/Menu";
import {
  AddProgrammeApi,
  programmeActiveListing,
} from "src/DAL/Programme/Programme";
import { countries } from "src/utils/country";
import { AddMemberApi, EditMemberApi } from "src/DAL/member/member";
import { consultantListing } from "src/DAL/consultant/consultant";
import { s3baseUrl } from "src/config/config";
import { height } from "@mui/system";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import { useEffect } from "react";

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


export default function EditMember() {
  const navigate = useNavigate();
  const classes = useStyles();
  const param = useParams();
  const { state, pathname } = useLocation();
  console.log(state, "statestatestate");
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [country, setCountry] = React.useState("");
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(null);
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [consultantValue, setConsultantValue] = React.useState([]);
  const [oldImage, setOldImage] = useState("");
  const options = useMemo(() => countryList().getData(), []);
  const [selectCountry, setSelectCountry] = useState("");
  const [imageStatus, setImageStatus] = useState(false);
  const [timeZoneValue, setTimeZoneValue] = React.useState("Europe/Dublin");
  const [inputValue, setInputValue] = React.useState("");
  const [checked, setChecked] = React.useState();
  const [postalCountry, setPostalCountry] = React.useState("");
  const is_consultant_pages = window.location.pathname.includes("/consultant/");
  const [selectedProgramIds, setSelectedProgramIds] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const [programList, setProgramList] = useState([]);

  const [groupsName, setGroupsName] = useState([]);

  const [breadCrumbMenu, setBreadCrumbMenu] = useState([
    {
      title: "Parents",
      navigation: -1,
      // navigation: `/member`,
      active: false,
    },

    {
      title: "Edit Parent",
      navigation: null,
      active: true,
    },
  ]);
  const [inputs, setInputs] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    contact_number: "",
    instagram_handle: "",
    max_child_limit: 1,
    goal_status: "",
    member_status: "",
    approval_status: "approve",
    street: "",
    city: "",
    zip_code: "",
    state: "",
    consultant_id: "",
    first_payment_date: new Date(),
    member_biography: "",
    image: {},
    short_description: "",
    time_zone: "",
    coins_count: "",
    referral_name: "",
    is_membership_purchase: "",
    is_executive: "",
    street2: "",
    postalStreet: "",
    postalStreet2: "",
    postalZip_code: "",
    postalState: "",
    postalCity: "",
    selectedPrograms: [],
    school_organisation: "",
    work_role: "",
  });

  const changeHandlerCountry = (value) => {
    //console.log(value.target.value, "asdfghjkl");
    setSelectCountry(value.target.value);
  };
  const getNavItemList = async () => {
    const result = await menuList();
    if (result.code === 200) {
      setMenuList(result.menu);
      //   setVaultName(result.vault_category[0].vault_slug);
    }
  };
  console.log(state, "statestate");

  // const consultantListData = async () => {
  //   setIsLoading(true);
  //   let result = await consultantListing();
  //   //console.log(result, "lololololo");
  //   if (result.code == 200) {
  //     //console.log(result.consultant_list, "result.consultant");
  //     setConsultantValue(result.consultant_list);
  //     setIsLoading(false);
  //   } else {
  //     enqueueSnackbar(result.message, { variant: "success" });
  //     setIsLoading(false);
  //   }
  //   //console.log(result, "okokoko");
  // };

  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  console.log(programList, "programListprogramListprogramList edit");
  const getProgramListing = async () => {
    const result = await programmeActiveListing();
    console.log(result, "ssssssssssssssssssssssss");
    setIsLoading(true);
    if (result.code === 200) {
      setProgramList(result.program);
      setProgramName(result.program._id);

      console.log(result.program._id, "result.programresult.program");
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setImageStatus(true);
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const handleChangeIsPostalAddress = (event) => {
    setChecked(event.target.checked);
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

  //console.log(inputs.time_zone, "inputs.time_zone");

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    //console.log(typeof dateType, "dateType");
    setDate(newValue);
  };
  const handleChangeGroup = (event) => {
    console.log(event, "event value is......");
    const {
      target: { value },
    } = event;
    let programme_ids = [];
    for (let i = 0; i < value.length; i++) {
      programme_ids.push({ program_id: value[i] });
    }
    console.log(programme_ids, "programme_ids value is......");

    const selectedNames = typeof value === "string" ? value.split(",") : value;
    setGroupsName(selectedNames);
    setSelectedProgramIds(programme_ids);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (country == "" || country == undefined) {
      enqueueSnackbar("Country is required", {
        variant: "error",
      });
    } else {
      if (inputs.days < 0) {
        enqueueSnackbar("No of days must be positive number ", {
          variant: "error",
        });
      } else {
        const formData = new FormData();
        formData.append("first_name", inputs.first_name);
        formData.append("last_name", inputs.last_name);
        formData.append("member_biography", inputs.short_description);
        formData.append("program", JSON.stringify(selectedProgramIds));
        formData.append("school_organisation", inputs.school_organisation);
        formData.append("work_role", inputs.work_role);

        formData.append("email", inputs.email);
        // formData.append("password", inputs.password);
        formData.append("contact_number", inputs.contact_number);
        formData.append("instagram_handle", inputs.instagram_handle);
        formData.append("max_child_limit", inputs.max_child_limit);
        formData.append("status", inputs.member_status);
        // formData.append("approval_status", inputs.approval_status);
        formData.append("street", inputs.street);
        // formData.append("street2", inputs.street2);
        formData.append("city", inputs.city);
        formData.append("zip_code", inputs.zip_code);
        formData.append("state", inputs.state);
        formData.append("country", country?.code);
        // formData.append(
        //   "consultant_id",
        //   inputs.consultant_id == undefined ? "" : inputs.consultant_id
        // );
        formData.append(
          "first_payment_date",
          date ? moment(date).format("YYYY-MM-DD") : ""
        );
        formData.append("goal_statement_status", inputs.goal_status);
        // formData.append("coins_count", inputs.coins_count);
        formData.append("time_zone", timeZoneValue);
        // formData.append("refferal_name", inputs.referral_name);
        // formData.append("is_membership_purchase", inputs.is_membership_purchase);
        // formData.append("is_executive", inputs.is_executive);
        if (imageStatus == true) {
          formData.append("profile_image", inputs.image);
        }

        console.log(...formData, "form data value");

        setIsLoading(true);
        const result = await EditMemberApi(formData, state.id);
        console.log(result, "edit result api ........");
        if (result.code === 200) {
          //console.log(result, "result");
          enqueueSnackbar(result.message, { variant: "success" });
          navigate(-1);
        } else {
          //console.log(result, "error case");
          enqueueSnackbar(result.message, { variant: "error" });
          setIsLoading(false);
        }
      }
    }
  };
  React.useEffect(() => {
    getProgramListing();
  }, []);

  //console.log(inputs, "inputs");
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
  const {
    id,
    name,
    lastName,
    status,
    approval_status,
    email,
    profile,
    program,
    goal,
    contact_number,
    instagram_handle,
    payment_info,
    max_child_limit,
    street,
    city,
    zip_code,
    // consultant_id,
    time_zone,
    member_biography,
    profile_image,
    first_payment_date,
    selected_country,
    coinsCount,
    postal_addess_info,
    school_organisation,
    work_role,
  } = state;
  console.log(postal_addess_info, "postal_addess_info");

  React.useEffect(() => {
    let obj = {};
    if (state?.is_postal_address_same) {
      let beforePars =
        postal_addess_info == undefined
          ? ""
          : JSON.stringify(postal_addess_info);

      obj = beforePars == "" ? "" : JSON.parse(beforePars);
    } else {
      let strigifyObj = JSON.stringify(postal_addess_info);
      obj = postal_addess_info && JSON.parse(strigifyObj);
    }

    let postalInfo = obj;

    console.log(postalInfo, "ok info");
    setChecked(state.is_postal_address_same);
    let findCountry = countries.find((item) => {
      if (String(item.code) === String(selected_country)) {
        return item;
      }
    });
    let findPostalCountry = countries.find((item) => {
      if (String(item.code) === String(postalInfo?.country)) {
        return item;
      }
    });
    // //console.log(findCountry, "found");
    setDate(
      first_payment_date == "" || first_payment_date == "Invalid date"
        ? null
        : first_payment_date
    );
    setOldImage(profile_image);
    setSelectCountry(selected_country);
    setCountry(findCountry);
    setPostalCountry(findPostalCountry);
    setTimeZoneValue(time_zone);
    setGroupsName(state?.program.map((val) => val?._id?._id));
    setSelectedPrograms(selectedProgramIds);
    setInputs((inputs) => ({
      ...inputs,
      ["first_name"]: name,
      ["last_name"]: lastName,
      ["last_name"]: lastName,
      ["email"]: email,
      ["school_organisation"]: school_organisation,
      ["work_role"]: work_role,
      // ["password"]: password,
      ["contact_number"]: contact_number,
      ["instagram_handle"]: instagram_handle,
      ["max_child_limit"]: payment_info?.max_child_limit,
      ["member_status"]: status,
      ["approval_status"]: approval_status,
      ["goal_status"]: goal,
      ["street"]: street,
      ["city"]: city,
      ["state"]: state.state,
      ["zip_code"]: zip_code,
      ["time_zone"]: time_zone,
      // ["consultant_id"]: consultant_id,
      ["short_description"]: member_biography,

      // ["memberShipPurchase"]: state?.object?.is_membership_purchase,
      // ["coins_count"]: coinsCount,
      // ["referral_name"]: state?.object?.refferal_name,
      // ["is_membership_purchase"]: state?.object?.is_membership_purchase,
      // ["is_executive"]: state?.object?.is_executive,
      // ["street2"]: state?.street2,
      // ["postalCity"]: postalInfo?.city,
      // ["postalState"]: postalInfo?.state,
      // ["postalStreet"]: postalInfo?.street,
      // ["postalStreet2"]: postalInfo?.street2,
      // ["postalZip_code"]: postalInfo?.zip_code,
    }));
  }, []);
  useEffect(() => {
    if (pathname.match("/consultant/")) {
      setBreadCrumbMenu([
        {
          title: "Success Ambassador",
          navigation: `/consultant`,
          active: false,
        },
        {
          title: "Parent",
          navigation: `/consultant/member-list/${param.consultantId}`,
          active: false,
        },
        {
          title: "Edit Parent",
          navigation: null,
          active: true,
        },
      ]);
    }
  }, [pathname]);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  // console.log(timeZoneValue, "timeZoneValue");

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
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-6">
          <h2>Edit Parent / School</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                  name="first_name"
                  value={inputs.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  name="last_name"
                  value={inputs.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  defaultValue="Hello World"
                  fullWidth
                  required
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Contact Number"
                  variant="outlined"
                  fullWidth
                  name="contact_number"
                  value={inputs.contact_number}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Instagram Handle"
                  variant="outlined"
                  fullWidth
                  name="instagram_handle"
                  value={inputs.instagram_handle}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Maximum Child / Teacher Count"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  name="max_child_limit"
                  value={inputs.max_child_limit}
                  onChange={handleChange}
                  onWheel={(event) => event.target.blur()}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="School / Organisation"
                  variant="outlined"
                  fullWidth
                  name="school_organisation"
                  value={inputs.school_organisation}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="work_role"
                    value={inputs.work_role}
                    label="Role"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select role…</MenuItem>
                    <MenuItem value="Principal / SLT">Principal / SLT</MenuItem>
                    <MenuItem value="Teacher">Teacher</MenuItem>
                    <MenuItem value="SEN / Pastoral">SEN / Pastoral</MenuItem>
                    <MenuItem value="Trust / MAT">Trust / MAT</MenuItem>
                    <MenuItem value="Parent">Parent</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Parent / School Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="member_status"
                    value={inputs.member_status}
                    label="Parent / School Status *"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <Tooltip title={"You Cannot Edit Approval Status"}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Parent / School Approval Status *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="approval_status"
                      disabled
                      value={inputs.approval_status}
                      label="Parent / School Approval Status *"
                      onChange={handleChange}
                    >
                      <MenuItem value="approve">Approved</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Tooltip>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                <FormControl className="mt-3" fullWidth>
                  <InputLabel id="demo-multiple-name-label">
                    Programmes Access
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={groupsName}
                    onChange={handleChangeGroup}
                    input={<OutlinedInput label=" Programmes Access" />}
                    MenuProps={MenuProps}
                  >
                    {programList.map((name, i) => (
                      <MenuItem
                        key={name}
                        value={name._id}
                        style={getStyles(name, groupsName, theme)}
                      >
                        {name.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Image </p>
                    <FormHelperText className="pt-0">
                      Image Size(500 X 500) ("JPG", "JPEG", "PNG","WEBP")
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
                        ></img>
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
                {inputs.image.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs.image.name}</p>
                )}
              </div>

              <div className="col-12">
                <h3>Address Details</h3>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <Autocomplete
                  id="country-select-demo"
                  // sx={{ width: 300 }}
                  options={countries}
                  autoHighlight
                  value={country}
                  onChange={(event, newValue) => {
                    setCountry(newValue);
                  }}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      <img
                        className="image-border"
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        alt=""
                      />
                      {option.label} ({option.code}) +{option.phone}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose a country "
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="City"
                  variant="outlined"
                  fullWidth
                  name="city"
                  value={inputs.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="State"
                  variant="outlined"
                  fullWidth
                  name="state"
                  value={inputs.state}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Street Address 1"
                  variant="outlined"
                  fullWidth
                  name="street"
                  value={inputs.street}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Zip Code"
                  variant="outlined"
                  fullWidth
                  name="zip_code"
                  value={inputs.zip_code}
                  onChange={handleChange}
                />
              </div>

              <Divider className="mt-2" />
              <h3 className="mt-3">Configurations</h3>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Date of first payment"
                    inputFormat="dd/MM/yyyy"
                    value={date}
                    onChange={handleChangeDate}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Success Ambassador
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={inputs.consultant_id}
              name="consultant_id"
              label="Success Ambassador"
              onChange={handleChange}
            >
              {consultantValue.map((consultant) => {
                return (
                  <MenuItem value={consultant.data._id}>
                    {consultant.data.first_name +
                      " " +
                      consultant.data.last_name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div> */}
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel required id="demo-simple-select-label">
              Goal Statement Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="goal_status"
              value={inputs.goal_status}
              label="Goal Statement Status"
              onChange={handleChange}
            >
              <MenuItem value="false">Lock</MenuItem>
              <MenuItem value="true">Unlock</MenuItem>
            </Select>
          </FormControl>
        </div> */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
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
                    <TextField {...params} label="Time Zone *" />
                  )}
                />
              </div>
              <div className="col-12 mt-5">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Short Description "
                    multiline
                    rows={6}
                    name="short_description"
                    value={inputs.short_description}
                    onChange={handleChange}
                  />
                  <FormHelperText>
                    Member Biography (Maximum limit 500 characters)
                  </FormHelperText>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button type="submit" className="small-contained-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
