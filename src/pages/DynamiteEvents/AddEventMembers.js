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
import { activeMemberListing } from "../../DAL/member/member";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

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
  Autocomplete,
} from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
// import { object } from "prop-types";
// import { AddPods, AddPodsApi } from "src/DAL/Pods/Pods";
// import { GroupListing } from "src/DAL/Groups/Groups";
// import { MemberListing } from "src/DAL/member/Member";
import moment from "moment";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  activeGroupListingApi,
  GroupAutomatedListingApi,
} from "src/DAL/group/group";
import { AddPodsApi } from "src/DAL/Pods/pods";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { array } from "yup/lib/locale";

// import MWEditor from "src/components/Editor/CKEditor";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import DateRangePickerInput from "@mui/lab/DateRangePicker/DateRangePickerInput";
import {
  dynamiteEventsCategoryListApi,
  get_live_dynamite_event_another_member,
} from "src/DAL/WebsitePagesold/DynamiteEventsCategories/DynamiteEventsCategories";
import { add_dynamite_event_member } from "src/DAL/WebsitePagesold/DynamiteEvents/DynamiteEvents";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function AddEventMembers() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [personName, setPersonName] = useState([]);
  const [member, setMember] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [serchText, setSerchText] = useState("all");
  const [endDate, setEndDate] = useState("");
  const [memberSelection, setMemberSelection] = useState("false");
  const [inputs, setInputs] = useState({
    name: "",
    lastName: "",
    email: "",
  });

  const getStartEndDate = () => {
    var new_date = moment(date, "YYYY-MM-DD").add(30, "days");
    setEndDate(new_date);
  };

  const getEventDetailData = async () => {
    const result = await dynamiteEventsCategoryListApi(params.event_id);
    if (result.code === 200) {
      console.log(result, "result of events");
      // var new_date = moment(
      //   "YYYY-MM-DD"
      // setEndDate(new_date);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const getMember = async () => {
    const result = await get_live_dynamite_event_another_member(
      params.event_id,
      serchText
    );
    if (result.code === 200) {
      setPersonName(result.member);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeAdd = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChangeDate = (newValue) => {
    setDate(newValue);
  };
  const handleChangeSelection = (value) => {
    setMemberSelection(value.target.value);
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const value = event.target.value;
    setSerchText(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    let selected_member_array = [];
    let selected_member_object = {};
    member.map((member) => {
      selected_member_object = {
        member_id: member._id,
      };
      selected_member_array.push(selected_member_object);
    });

    if (memberSelection == "false") {
      formData.append("start_date", moment(date).format("YYYY-MM-DD"));
      formData.append("expiry_date", moment(endDate).format("YYYY-MM-DD"));
      formData.append("member", JSON.stringify(selected_member_array));
      formData.append("dynamite_event", params.event_id);
      formData.append("is_member_create", memberSelection);
    }
    if (memberSelection == "true") {
      formData.append("dynamite_event", params.event_id);
      formData.append("is_member_create", memberSelection);
      formData.append("start_date", moment(date).format("YYYY-MM-DD"));
      formData.append("expiry_date", moment(endDate).format("YYYY-MM-DD"));
      formData.append("first_name", inputs.name);
      formData.append("last_name", inputs.lastName);
      formData.append("email", inputs.email);
    }
    const result = await add_dynamite_event_member(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/dynamite-events/${params.event_id}/members`);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEventDetailData();
    getMember();
  }, []);

  useEffect(() => {
    getMember();
  }, [serchText]);
  useEffect(() => {
    getStartEndDate();
  }, [date]);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() =>
              navigate(`/dynamite-events/${params.event_id}/members`)
            }
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2>Add Members to Event</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Member *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="memberSelection"
              value={memberSelection}
              label="Member *"
              onChange={handleChangeSelection}
            >
              <MenuItem value="false">Add Existing Member</MenuItem>
              <MenuItem value="true">Add New Member</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="Start Date"
                // inputFormat="dd/MM/yyyy"
                inputFormat="dd/MM/yyyy"
                value={date}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="Expiry Date"
                // inputFormat="dd/MM/yyyy"
                inputFormat="dd/MM/yyyy"
                value={endDate}
                onChange={handleChangeEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </div>

        {memberSelection == "false" && (
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={personName}
              getOptionLabel={(option) =>
                option.first_name + " (" + option.email + ")"
              }
              filterSelectedOptions
              value={member}
              onChange={(event, newValue) => {
                setMember(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Members"
                  placeholder="Members"
                  onChange={handleSearch}
                />
              )}
            />
          </div>
        )}
        {memberSelection == "true" && (
          <>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                fullWidth
                required
                name="name"
                value={inputs.name}
                onChange={handleChangeAdd}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                name="lastName"
                value={inputs.lastName}
                onChange={handleChangeAdd}
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
                onChange={handleChangeAdd}
              />
            </div>
          </>
        )}

        <div className="text-end mt-4">
          <button onClick={handleSubmit} className="small-contained-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
