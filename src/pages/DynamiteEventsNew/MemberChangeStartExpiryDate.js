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
import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  activeSupportTeamListApi,
  addDepartmentApi,
} from "src/DAL/Department/Department";
import { add_dynamite_event_start_expiry_api } from "src/DAL/DynamiteEvents/DynamiteEvents";
import DynamiteEventStartExpiryMembers from "./EventMembers/DynamiteEventStartExpiryMembers";
import { programmeListing } from "src/DAL/Programme/Programme";

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

export default function MemberChangeStartExpiryDate() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [programValue, setProgramValue] = React.useState([]);

  const id = params.start_date_event
    ? params.start_date_event
    : params.expiry_date_event;

  const handleChangeDate = (newValue) => {
    setDate(newValue);
  };

  const handleChangeProgram = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedProgram(value);
  };

  const [inputs, setInputs] = React.useState({
    change_for: "all",
    detailed_description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (date == null) {
      enqueueSnackbar("Please Enter Date", { variant: "error" });
      return;
    }
    let memberSelection = [];
    selected.map((value) => {
      memberSelection.push(value._id);
    });
    let postData = {
      change_type: params.start_date_event ? "start_date" : "expiry_date",
      change_for: inputs.change_for,
      members: memberSelection,
      dynamite_event: id,
    };
    if (inputs.change_for == "program") {
      postData.program = selectedProgram;
    }
    if (params.start_date_event) {
      postData.start_date = date ? moment(date).format("YYYY-MM-DD") : "";
    } else {
      postData.expiry_date = date ? moment(date).format("YYYY-MM-DD") : "";
    }
    console.log(postData, "post Data");
    setIsLoading(true);
    const result = await add_dynamite_event_start_expiry_api(postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      //   navigate(-1);
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
  const programmeListData = async () => {
    let result = await programmeListing();
    if (result.code == 200) {
      setProgramValue(result.program);
    }
  };

  React.useEffect(() => {
    programmeListData();
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
          <h2>
            {params.start_date_event
              ? "Change Start Date"
              : "Change Expiry Date"}
          </h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-5">
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Change {params.start_date_event ? "Start" : "Expiry"} Date
                    For All Users
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="change_for"
                    value={inputs.change_for}
                    label="Change Start Date For All Users"
                    onChange={handleChange}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="specific">Specific</MenuItem>
                    <MenuItem value="program">Program</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      label={`Change ${
                        params.start_date_event ? "Start" : "Expiry"
                      } Date `}
                      inputFormat="dd-MM-yyyy"
                      value={date}
                      onChange={handleChangeDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
              {inputs.change_for == "program" && (
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <FormControl fullWidth className="mt-3">
                    <InputLabel id="demo-multiple-name-label1">
                      Programme *
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-name-label1"
                      id="demo-multiple-name"
                      // multiple
                      value={selectedProgram}
                      onChange={handleChangeProgram}
                      input={<OutlinedInput label="Programme *" />}
                      MenuProps={MenuProps}
                    >
                      {programValue?.map((name) => (
                        <MenuItem
                          key={name}
                          value={name._id}
                          // style={getStyles(name, selectedProgram, theme)}
                        >
                          {name.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="text-end mt-4"
          id={`${inputs.change_for == "specific" ? "fixedbutton" : ""}`}
        >
          <button className="small-contained-button">Submit</button>
        </div>
      </form>
      {inputs.change_for == "specific" && (
        <DynamiteEventStartExpiryMembers
          id={id}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </div>
  );
}
