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
import { DatePicker } from "@mui/lab";
import { useSnackbar } from "notistack";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
// import { AddEventApi } from "src/DAL/Calendar/Calendar";
import { makeStyles } from "@mui/styles";
import { get_root_value } from "src/utils/domUtils";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import { addEventApi } from "src/DAL/Events/events";
import { activeMemberListing } from "src/DAL/member/member";
import Autocomplete from "@mui/material/Autocomplete";
// import { GroupListing } from "src/DAL/Groups/Groups";
// import { MemberListing } from "src/DAL/member/Member";
import { activeGroupListingApi } from "../../DAL/group/group";
import TinyEditor from "src/components/ckeditor/Ckeditor";

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

  const [state, setState] = useState({
    eventDescription: "",
    eventTitle: "",
    eventColor: "",
    startTime: "00:00",
    endTime: "00:00",
    status: "true",
    itrationNumber: "",
    recurringType: "daily",
    startDate: new Date(),
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
  const getGroups = async () => {
    setIsLoading(true);
    const result = await activeGroupListingApi();
    if (result.code === 200) {
      let total_groups = result.group;
      let active_groups = [];
      total_groups.map((group) => {
        if (group.status === true) {
          active_groups.push(group);
        }
      });
      setGroupListing(active_groups);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const getMember = async () => {
    setIsLoading(true);
    const result = await activeMemberListing();
    if (result.code === 200) {
      setPersonName(result.member);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangeDate = (event) => {
    setState((prevState) => {
      return {
        ...prevState,
        startDate: event,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let group_array = [];
    let group_object = {};
    groupsName.map((group) => {
      group_object = {
        group_slug: group,
      };
      group_array.push(group_object);
    });
    let selected_member_array = [];
    let selected_member_object = {};
    person.map((member) => {
      selected_member_object = {
        member_id: member,
      };
      selected_member_array.push(selected_member_object);
    });
    var dateString = moment(state.startDate).format("YYYY-MM-DD");
    const formDataObject = {
      title: state.eventTitle,
      color: state.eventColor,
      status: state.status,
      recurring_type: state.recurringType,
      start_date: dateString,
      recurring_iteration: state.itrationNumber,
      description: detailDescriptionCk,
      start_time: state.startTime,
      end_time: state.endTime,
      group: group_array,
      member: selected_member_array,
    };

    const result = await addEventApi(JSON.stringify(formDataObject));
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
  React.useEffect(() => {
    getGroups();
    getMember();
  }, []);

  return (
    <div className="container new-memories">
      <form onSubmit={handleSubmit}>
        <TextField
          className="mt-4 inputs-fields"
          id="outlined-basic"
          label="Event Title"
          variant="outlined"
          name="eventTitle"
          value={state.eventTitle}
          required={true}
          onChange={(e) => handleChange(e)}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            name="startDate"
            value={state.startDate}
            format="YYYY-MM-DD"
            inputFormat="dd/MM/yyyy"
            onChange={(e) => handleChangeDate(e)}
            renderInput={(params) => (
              <TextField
                {...params}
                className="mt-3 inputs-fields"
                required={true}
              />
            )}
          />
        </LocalizationProvider>
        <TextField
          id="color"
          type="color"
          label="Event Color"
          name="eventColor"
          className="mt-3 inputs-fields"
          variant="outlined"
          required={true}
          value={state.eventColor}
          onChange={(e) => handleChange(e)}
        />
        <TextField
          variant="outlined"
          id="time"
          label="Start Time"
          type="time"
          className="mt-3 inputs-fields"
          name="startTime"
          required={true}
          value={state.startTime}
          onChange={(e) => handleChange(e)}
        />
        <TextField
          variant="outlined"
          id="time"
          label="End Time"
          type="time"
          className="mt-3 inputs-fields"
          name="endTime"
          required={true}
          value={state.endTime}
          onChange={(e) => handleChange(e)}
        />
        <TextField
          id="outlined-basic"
          label="Number of Times To Repeat"
          variant="outlined"
          name="itrationNumber"
          value={state.itrationNumber}
          required={true}
          onChange={(e) => handleChange(e)}
          type="number"
          className="mt-3 inputs-fields"
          onWheel={(event) => event.target.blur()}
        />
        <FormControl variant="outlined" className="mt-3">
          <InputLabel id="demo-simple-select-outlined-label">
            Recurring Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={state.recurringType}
            onChange={(e) => handleChange(e)}
            label="recurring Type"
            name="recurringType"
            className="inputs-fields svg-color"
            MenuProps={{
              classes: {
                paper: classes.paper,
              },
            }}
            sx={{
              color: get_root_value("--input-text-color"),
            }}>
            <MenuItem value="daily">
              <em>Daily</em>
            </MenuItem>
            <MenuItem value="weekly">
              <em>Weekly</em>
            </MenuItem>
            <MenuItem value="monthly">
              <em>Monthly</em>
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="mt-3">
          <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={state.status}
            onChange={(e) => handleChange(e)}
            label="Status"
            name="status"
            className="inputs-fields svg-color"
            MenuProps={{
              classes: {
                paper: classes.paper,
              },
            }}
            sx={{
              color: get_root_value("--input-text-color"),
            }}>
            <MenuItem value="true">
              <em>Active</em>
            </MenuItem>
            <MenuItem value="weekly">
              <em>Inactive</em>
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl className="mt-3">
          <InputLabel id="demo-multiple-name-label">Groups</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={groupsName}
            onChange={handleChangeGroup}
            input={<OutlinedInput label="Groups" />}
            MenuProps={MenuProps}>
            {groupListing.map((name) => (
              <MenuItem
                key={name}
                value={name.group_slug}
                style={getStyles(name, groupsName, theme)}>
                {name.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="mt-3">
          {/* <InputLabel id="demo-multiple-name-label">Members</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={person}
            onChange={handleChangeMember}
            input={<OutlinedInput label="Members" />}
            MenuProps={MenuProps}
          >
            {personName.map((name) => (
              <MenuItem
                key={name}
                value={name._id}
                style={getStyles(name, person, theme)}
              >
                {name.first_name + " " + name.last_name}
              </MenuItem>
            ))}
          </Select> */}
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
              <TextField {...params} label="Members" placeholder="Members" />
            )}
          />
        </FormControl>
        {/* <TextField
          id="outlined-multiline-static"
          label="Event Description"
          multiline
          rows={5}
          variant="outlined"
          style={{ width: "100%" }}
          name="eventDescription"
          value={state.eventDescription}
          onChange={(e) => handleChange(e)}
          className="mt-3 inputs-fields"
          required={true}
        /> */}
        <div className="col-12 mt-5">
          <h4>Detail Description *</h4>
          <TinyEditor
            setDetailDescription={setDetailDescriptionCk}
            detailDescriptionCk={detailDescriptionCk}
          />
        </div>

        <div className="text-end mt-3 mb-3">
          <button className="small-contained-button" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
