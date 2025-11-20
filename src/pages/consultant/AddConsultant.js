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
import countryList from "react-select-country-list";
import { TimeZones } from "src/utils/constant";

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
import { countries } from "src/utils/country";
import { AddMemberApi } from "src/DAL/member/member";
import {
  AddConsultantApi,
  consultantListing,
} from "src/DAL/consultant/consultant";

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

export default function AddConsultant() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeZoneValue, setTimeZoneValue] = React.useState("Europe/Dublin");
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [country, setCountry] = React.useState("");
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [consultantValue, setConsultantValue] = React.useState([]);
  const [selectCountry, setSelectCountry] = useState("");
  const options = useMemo(() => countryList().getData(), []);

  const [inputs, setInputs] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    contact_number: "",
    goal_status: "",
    consultant_status: "true",
    street: "",
    city: "",
    state: "",
    first_payment_date: "",
    member_biography: "",
    image: {},
    short_description: "",
    time_zone: "",
    team_type: "consultant",
    main_heading: "",
  });

  const getNavItemList = async () => {
    const result = await menuList();
    if (result.code === 200) {
      setMenuList(result.menu);
      //   setVaultName(result.vault_category[0].vault_slug);
    }
  };

  const consultantListData = async () => {
    setIsLoading(true);
    let result = await consultantListing();
    if (result.code == 200) {
      setConsultantValue(result.consultant);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
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
  const audioFileChange = (e) => {
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

  const changeHandlerCountry = (value) => {
    setSelectCountry(value.target.value);
  };

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setDate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.days < 0) {
      enqueueSnackbar("No of days must be positive number ", {
        variant: "error",
      });
    } else {
      const formData = new FormData();
      formData.append("first_name", inputs.first_name);
      formData.append("last_name", inputs.last_name);
      formData.append("image", inputs.image);
      formData.append("biography", inputs.short_description);
      formData.append("email", inputs.email);
      formData.append("password", inputs.password);
      formData.append("contact_number", inputs.contact_number);
      formData.append("main_heading", inputs.main_heading);
      formData.append("status", inputs.consultant_status);
      formData.append("address", inputs.street);
      formData.append("city", inputs.city);
      //   formData.append("zip_code", inputs.zip_code);
      formData.append("state", inputs.state);
      formData.append("time_zone", timeZoneValue);
      formData.append("team_type", inputs.team_type);
      //   formData.append("country", selectCountry);
      //   formData.append("consultant_id", inputs.consultant_id);
      //   formData.append("first_payment_date", moment(date).format("YYYY-MM-DD"));
      //   formData.append("goal_statement_status", inputs.goal_status);

      //console form data

      setIsLoading(true);
      const result = await AddConsultantApi(formData);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
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
    consultantListData();
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
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Add Success Ambassador</h2>
        </div>
      </div>
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
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            required
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Main Heading"
            variant="outlined"
            fullWidth
            required
            name="main_heading"
            value={inputs.main_heading}
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Ambassador Status *
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="consultant_status"
              value={inputs.consultant_status}
              label="Ambassador  Status*"
              onChange={handleChange}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Support Team Type*
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="team_type"
              value={inputs.team_type}
              label="Support Team Type*"
              onChange={handleChange}
            >
              <MenuItem value="consultant">Save As Success Ambassador</MenuItem>
              <MenuItem value="team">Save As Team</MenuItem>
              <MenuItem value="both">Save As Both</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            fullWidth
            required
            name="street"
            value={inputs.street}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="City"
            variant="outlined"
            fullWidth
            required
            name="city"
            value={inputs.city}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="State/County"
            variant="outlined"
            fullWidth
            required
            name="state"
            value={inputs.state}
            onChange={handleChange}
          />
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
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Upload Image *</p>
              <FormHelperText className="pt-0">
                Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
              </FormHelperText>
            </div>
            <div className="col-2">
              {file && <img className="image-border" src={file} height="50" />}
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
                  className="small-contained-button"
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
        <div className="col-12 mt-5">
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-flexible"
              label="Biography "
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

        <div className="text-end mt-4">
          <button onClick={handleSubmit} className="small-contained-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
