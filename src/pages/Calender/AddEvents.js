import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker, DesktopDatePicker, TimePicker } from "@mui/lab";
import { useSnackbar } from "notistack";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
// import { AddEventApi } from "src/DAL/Calendar/Calendar";
import { makeStyles } from "@mui/styles";
import { get_root_value } from "src/utils/domUtils";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import { addEventApi, add_new_event_api } from "src/DAL/Events/events";
import dayjs from "dayjs";
import { activeMemberListing } from "src/DAL/member/member";
import Autocomplete from "@mui/material/Autocomplete";
// import { GroupListing } from "src/DAL/Groups/Groups";
// import { MemberListing } from "src/DAL/member/Member";
import { activeGroupListingApi } from "../../DAL/group/group";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { memberAndGroupsListApi } from "src/DAL/memberNew/member";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  { id: 1, name: "zuabir" },
  { id: 2, name: "zuabir1" },
  { id: 3, name: "zuabir2" },
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const useStyles = makeStyles(() => ({
  paper: {
    background: get_root_value("--popup-background-color"),
    color: get_root_value("--input-text-color"),
  },
}));
export default function AddWebsiteEvent({ onCloseDrawer, dataList }) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [personName, setPersonName] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [groupsName, setGroupsName] = React.useState([]);
  const [groupListing, setGroupListing] = React.useState([]);
  const [member, setMember] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [serchText, setSerchText] = useState("");

  // const [state, setState] = useState({
  //   eventDescription: "",
  //   eventTitle: "",
  //   eventColor: "#000000",
  //   startTime: "00:00",
  //   endTime: "00:00",
  //   status: "true",
  //   itrationNumber: "",
  //   recurringType: "daily",
  //   no_of_days_to_repeat_after: 0,
  //   startDate: new Date(),
  // });
  console.log(serchText, "serchTextserchTextserchTextserchText");
  const [state, setState] = useState({
    description: "",
    event_title: "",
    event_color: "#000",
    recurring_type: "daily",
    notify_before_unit: "minutes",
    notify_before_time: 30,
    start_date: dayjs(new Date()).$d,
    weekday: [new Date().getDay()],
    end_date: dayjs(new Date()).$d,
    start_time: dayjs(new Date()).$d,
    end_time: dayjs(new Date()).$d,
    status: true,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;

    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
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
  const handleChangeMember = (event) => {
    const {
      target: { value },
    } = event;
    setPerson(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleSearch = (event) => {
    event.preventDefault();
    const value = event.target.value;
    console.log(value, "valuevaluevalue");
    setSerchText(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let group_array = [];
    let group_object = {};
    groupsName.map((group) => {
      // console.log(group, "fdaslkfj");
      group_object = {
        group_slug: group?.group_slug,
      };
      group_array.push(group_object);
    });
    let selected_member_array = [];
    let selected_member_object = {};
    member.map((member) => {
      selected_member_object = {
        member_id: member._id,
      };
      selected_member_array.push(selected_member_object);
    });
    const startDate = new Date(state.start_date);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const formDataObject = {
      title: state.event_title,
      color: state.event_color,
      status: state.status,
      recurring_type: state.recurring_type,
      weekday: state.weekday,
      description: detailDescriptionCk,
      start_date: moment(state.start_date).format("YYYY-MM-DD"),
      end_date: moment(state.end_date).format("YYYY-MM-DD"),
      start_time: moment(state.start_time).format("HH:mm"),
      end_time: moment(state.end_time).format("HH:mm"),
      group: group_array,
      member: selected_member_array,
      // no_of_days_to_repeat_after: state.no_of_days_to_repeat_after,
    };
    console.log(formDataObject, "dslfkdjsaa");

    const result = await add_new_event_api(formDataObject);
    if (result.code === 200) {
      dataList();
      setIsLoading(false);
      onCloseDrawer();
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleChangeDate = (name, event) => {
    setState((prevState) => {
      return {
        ...prevState,
        [name]: event.$d,
      };
    });
  };
  const getGroupsAndMembers = async () => {
    console.log(serchText, "serchTextserchText...");
    const result = await memberAndGroupsListApi(serchText);
    console.log(result, "api result search");
    if (result.code === 200) {
      if (!serchText.length) {
        setGroupListing(result.group);
      }
      setPersonName(result.members);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGroupsAndMembers();
  }, []);

  useEffect(() => {
    if (serchText.length > 2) {
      getGroupsAndMembers();
    }
  }, [serchText]);
  return (
    <div className="container">
      <form className="row" onSubmit={handleSubmit}>
        <div className="text-end mb-4">
          <button
            className="small-contained-button-search event-submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <TextField
            className="mt-3 w-100"
            id="outlined-basic"
            label="Title"
            variant="outlined"
            name="event_title"
            value={state.event_title}
            required={true}
            onChange={handleChange}
          />
        </div>
        <div
          className={`col-12 col-md-6 ${
            state.recurring_type == "weekly" ? "col-lg-3" : "col-lg-4"
          }`}
        >
          <TextField
            id="event_color"
            type="color"
            label="Color"
            name="event_color"
            className="mt-3 w-100"
            variant="outlined"
            required={true}
            value={state.event_color}
            onChange={handleChange}
          />
        </div>
        <div
          className={`col-12 col-md-6 ${
            state.recurring_type == "weekly" ? "col-lg-2" : "col-lg-4"
          }`}
        >
          <FormControl
            variant="outlined"
            className="full-modal-field-margin w-100"
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Recurring Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={state.recurring_type}
              onChange={(e) => handleChange(e)}
              label="recurring Type"
              name="recurring_type"
              className="inputs-fields svg-color w-100"
              MenuProps={{
                classes: {
                  paper: classes.paper,
                },
              }}
              sx={{
                color: get_root_value("--input-text-color"),
                width: "100%",
              }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </div>
        {state.recurring_type == "weekly" && (
          <div className={`col-12 col-md-6 col-lg-3 `}>
            <FormControl variant="outlined" className="mt-3 w-100">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Day
              </InputLabel>
              <Select
                multiple
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={state.weekday}
                onChange={(e) => handleChange(e)}
                label="Select Day"
                name="weekday"
                className="inputs-fields svg-color w-100"
                MenuProps={{
                  classes: {
                    paper: classes.paper,
                  },
                }}
                sx={{
                  color: get_root_value("--input-text-color"),
                }}
              >
                <MenuItem value={0}>Sunday</MenuItem>
                <MenuItem value={1}>Monday</MenuItem>
                <MenuItem value={2}>Tuesday</MenuItem>
                <MenuItem value={3}>Wednesday</MenuItem>
                <MenuItem value={4}>Thursday</MenuItem>
                <MenuItem value={5}>Friday</MenuItem>
                <MenuItem value={6}>Saturday</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}
        <div className="col-12 col-md-6 col-lg-3 full-modal-field-margin">
          <LocalizationProvider dateAdapter={AdapterDayjs} className="w-100">
            <DesktopDatePicker
              label="Start Date"
              name="start_date"
              inputFormat="DD-MM-YYYY"
              value={state.start_date}
              format="DD-MM-YYYY"
              // className="w-100"
              onChange={(e) => handleChangeDate("start_date", e)}
              renderInput={(params) => (
                <TextField {...params} required={true} />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className="col-12 col-md-6 col-lg-3 full-modal-field-margin">
          <LocalizationProvider dateAdapter={AdapterDayjs} className="w-100">
            <TimePicker
              label="Start Time"
              name="start_time"
              value={state.start_time}
              sx={{ color: "#fff" }}
              className="mt-3 "
              onChange={(e) => handleChangeDate("start_time", e)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="col-12 col-md-6 col-lg-3 full-modal-field-margin">
          <LocalizationProvider dateAdapter={AdapterDayjs} className="w-100">
            <DesktopDatePicker
              label="End Date"
              name="end_date"
              inputFormat="DD-MM-YYYY"
              value={state.end_date}
              format="DD-MM-YYYY"
              className="mt-3"
              onChange={(e) => handleChangeDate("end_date", e)}
              renderInput={(params) => (
                <TextField {...params} required={true} />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className="col-12 col-md-6 col-lg-3 full-modal-field-margin">
          <LocalizationProvider dateAdapter={AdapterDayjs} className="w-100">
            <TimePicker
              label="End Time"
              name="end_time"
              value={state.end_time}
              sx={{ color: "#fff", mt: 14 }}
              onChange={(e) => handleChangeDate("end_time", e)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="col-12 col-md-2 col-lg-3 full-modal-field-margin ">
          <div className="col-12">
            <FormControl variant="outlined" className="w-100">
              <InputLabel id="demo-simple-select-outlined-label">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={state.status}
                onChange={handleChange}
                label="Status"
                name="status"
                className="svg-color "
                MenuProps={{
                  classes: {
                    paper: classes.paper,
                  },
                }}
                sx={{
                  color: get_root_value("--input-text-color"),
                }}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="col-12 col-md-5 col-lg-4">
          <FormControl className="mt-3 w-100">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={groupListing}
              clearOnBlur={true}
              getOptionLabel={(option) => option.title}
              filterSelectedOptions
              value={groupsName}
              onChange={(event, newValue) => {
                setGroupsName(newValue);
              }}
              className="mui-autocomplete"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Groups"
                  placeholder="Groups"
                  onChange={handleSearch}
                />
              )}
            />
          </FormControl>
        </div>
        <div className="col-12 col-md-5 col-lg-5">
          <FormControl className="mt-3 w-100">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={personName.filter(
                (option) =>
                  !member.some((selected) => selected.email === option.email)
              )}
              clearOnBlur={true}
              getOptionLabel={(option) =>
                option.first_name + " (" + option.email + ")"
              }
              filterSelectedOptions
              value={member}
              onChange={(event, newValue) => {
                setMember(newValue);
                setSerchText("");
              }}
              className="mui-autocomplete"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Members"
                  placeholder="Members"
                  onChange={handleSearch}
                />
              )}
            />
          </FormControl>
        </div>

        <div className="col-12 mt-5 mb-3">
          <h4>Detail Description</h4>
          <TinyEditor
            setDetailDescription={setDetailDescriptionCk}
            detailDescriptionCk={detailDescriptionCk}
          />
        </div>
      </form>
    </div>
  );
}
