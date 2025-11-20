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
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";

import {
  useNavigate,
  Link as RouterLink,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  IconButton,
  CircularProgress,
  Stack,
  Autocomplete,
  Box,
} from "@mui/material";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { addVaultCategoryApi } from "src/DAL/Vault/vault";
import moment from "moment";
import { countries } from "src/utils/country";
import { TimeZones } from "src/utils/constant";
import { AddChildApi } from "src/DAL/Child/Child";
import { useEffect } from "react";
import {
  addChildProgrammeListing,
  childProgrammeListing,
} from "src/DAL/Programme/Programme";

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
export default function AddChild() {
  const navigate = useNavigate();
  const theme = useTheme();

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [inputValue, setInputValue] = React.useState("");
  const params = useParams();
  const [groupsName, setGroupsName] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [selectedProgramIds, setSelectedProgramIds] = useState([]);
  const [timeZoneValue, setTimeZoneValue] = React.useState("Europe/Dublin");
  const [country, setCountry] = React.useState({
    code: "IE",
    label: "Ireland",
    phone: "353",
  });
  const [inputs, setInputs] = React.useState({
    first_name: "",
    last_name: "",
    contact_number: "",
    email: "",
    instagram_handle: "",
    city: "",
    short_description: "",
    zip_code: "",
    state: "",
    street: "",
    status: "true",
    image: {},
  });
  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setDate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (country == "" || country == undefined) {
    //   enqueueSnackbar("Country is required", {
    //     variant: "error",
    //   });
    // } else {

    const formData = new FormData();
    formData.append("last_name", inputs.last_name);
    formData.append("first_name", inputs.first_name);
    formData.append("email", inputs.email);
    formData.append("dob", moment(date).format("YYYY-MM-DD"));
    if (file) {
      formData.append("profile_image", inputs.image);
    }
    formData.append("program", JSON.stringify(selectedProgramIds));

    formData.append("country", country ? country.code : "");
    formData.append("city", inputs.city);
    formData.append("member_biography", inputs.short_description);
    formData.append("state", inputs.state);
    formData.append("street", inputs.street);
    formData.append("zip_code", inputs.zip_code);
    formData.append("instagram_handle", inputs.instagram_handle);
    formData.append("contact_number", inputs.contact_number);
    formData.append("time_zone", timeZoneValue);

    // formData.append("vault_description", detailDescriptionCk);
    formData.append("status", inputs.status);
    formData.append("parent", params?.id);

    //console form data
    console.log(...formData, "form value");

    setIsLoading(true);
    const result = await AddChildApi(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
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
  const getProgramListing = async () => {
    setIsLoading(true);
    const result = await addChildProgrammeListing(params?.id);

    if (result.code === 200) {
      setProgramList(result.programs);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getProgramListing();
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
          <h2>Add Child / Teacher</h2>
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
                  required
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
                  fullWidth
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      label="Date of Birth *"
                      inputFormat="dd/MM/yyyy"
                      value={date}
                      onChange={handleChangeDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
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
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    required
                    value={inputs.status}
                    label="Status *"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
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
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
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
                    {programList.map((name) => (
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
                      Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {file && (
                      <img className="image-border" src={file} height="50" />
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
                  // required
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
                  // required
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
                  // required
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
                  // required
                  name="zip_code"
                  value={inputs.zip_code}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 mt-3">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Biography"
                    multiline
                    rows={6}
                    name="short_description"
                    value={inputs.short_description}
                    onChange={handleChange}
                  />
                  <FormHelperText>
                    Biography (Maximum limit 500 characters)
                  </FormHelperText>
                </FormControl>
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
