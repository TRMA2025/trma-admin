import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker, DesktopDatePicker, TimePicker } from "@mui/lab";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSnackbar } from "notistack";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { makeStyles } from "@mui/styles";
import { get_root_value } from "src/utils/domUtils";

import { useTheme } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { activeGroupListingApi } from "src/DAL/group/group";
import { activeMemberListing } from "src/DAL/member/member";
import {
  editEventApi,
  eventDetailApi,
  update_member_event_api,
} from "src/DAL/Events/events";
import Autocomplete from "@mui/material/Autocomplete";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  TIME_ZONE_CONVERSION,
  get_date_with_admin_time_zone,
} from "src/utils/constant";
import { memberAndGroupsListApi } from "src/DAL/memberNew/member";

// import { get_date_with_user_time_zone } from "src/utils/constants";
// import { useContentSetting } from "src/Hooks/ContentSettingState";

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
export default function EditEvent({
  editValues,
  dataList,
  defaultTimeZone,
  handleCloseDrawer,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [groupListing, setGroupListing] = React.useState([]);
  const [personName, setPersonName] = React.useState([]);
  const [groupsName, setGroupsName] = React.useState([]);
  const [groupsNameFromEdit, setGroupsNameFromEdit] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [startTimes, setStartTime] = useState("");
  const [endTimes, setEndTime] = useState("");
  const [member, setMember] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const { userInfo, adminTimeZone } = "";
  const [serchText, setSerchText] = useState("");
  const [isLoadingLoader, setIsLoadingLoader] = useState(false);

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
  // Time conversion
  const timeConversion = () => {
    let eventStartTime = "";
    let eventEndTime = "";
    let time_new = "";
    time_new = editValues.start_date_time;

    eventStartTime = editValues.start_date_time;
    const TimeBeginning = moment(eventStartTime, "hh:mm A").format("HH:mm:ss");
    setStartTime(editValues.start_time);

    eventEndTime = editValues.end_date_time;
    const TimeEnding = moment(eventEndTime).format("HH:mm:ss");
    setEndTime(editValues.end_time);
  };

  // Time conversion end here
  const handleSearch = (event) => {
    event.preventDefault();
    const value = event.target.value;
    setSerchText(value);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleChangeDate = (name, event) => {
    setState((prevState) => {
      return {
        ...prevState,
        [name]: event.$d,
      };
    });
  };

  const handleChangeTime = (e) => {
    setStartTime(e.target.value);
  };
  const handleChangeEndTime = (e) => {
    setEndTime(e.target.value);
  };
  const get_start_end_date = (date) => {
    return TIME_ZONE_CONVERSION(
      date,
      "YYYY-MM-DD",
      defaultTimeZone,
      defaultTimeZone
    );
    return get_date_with_admin_time_zone(date, "YYYY-MM-DD", defaultTimeZone);
  };
  const get_start_end_time = (date) => {
    return TIME_ZONE_CONVERSION(
      date,
      "YYYY-MM-DD HH:mm",
      defaultTimeZone,
      defaultTimeZone
    );

    // return get_date_with_admin_time_zone(
    //   date,
    //   "YYYY-MM-DD HH:mm",
    //   defaultTimeZone
    // );
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
    if (groupsName.length > 0) {
      group_array = groupsName.map((group) => {
        return {
          group_slug: group.group_slug,
        };
      });
    }

    let selected_member_array = [];
    member.map((member) => {
      selected_member_array.push({
        member_id: member._id,
      });
    });
    const startDate = new Date(state.start_date);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const endDate = new Date(state.end_date);
    const yearEnd = endDate.getFullYear();
    const monthEnd = String(endDate.getMonth() + 1).padStart(2, "0");
    const dayEnd = String(endDate.getDate()).padStart(2, "0");
    const formattedEndDate = `${yearEnd}-${monthEnd}-${dayEnd}`;
    // console.log(formattedDate, "formattedDateformattedDate");
    // console.log(state.start_date, "state.start_date");
    const formData = {
      title: state.event_title,
      color: state.event_color,
      description: detailDescriptionCk,
      recurring_type: state.recurring_type,
      weekday: state.weekday,
      status: state.status,
      // start_date: moment(state.start_date).format("YYYY-MM-DD"),
      start_date: formattedDate,
      // end_date: moment(state.end_date).format("YYYY-MM-DD"),
      end_date: formattedEndDate,
      start_time: moment(state.start_time).format("HH:mm"),
      end_time: moment(state.end_time).format("HH:mm"),
      group: group_array,
      member: selected_member_array,
    };

    const result = await update_member_event_api(formData, state.event_slug);
    let eventObject = {};
    if (result.code === 200) {
      console.log("calledcalledcalledcalledcalledcalled");
      dataList();
      enqueueSnackbar(result.message, { variant: "success" });
      handleCloseDrawer();
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  // React.useEffect(() => {
  //   getGroups();
  //   getMember();
  // }, [editValues]);

  let finalArray = [];
  for (let i = 0; i < personName.length; i++) {
    let count = 0;
    for (let j = 0; j < member.length; j++) {
      if (personName[i]._id == member[j]._id) {
        count++;
      }
    }
    if (count == 0) {
      finalArray.push(personName[i]);
    }
  }
  const getGroupsAndMembers = async () => {
    const result = await memberAndGroupsListApi(serchText);

    if (result.code === 200) {
      console.log(result, "dsfkjas");
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
  const getEventinformationForEdit = async () => {
    setIsLoadingLoader(true);
    console.log("called");
    const result = await eventDetailApi(editValues.event_slug);
    if (result.code === 200) {
      console.log(result, "resultresultresultrida");
      console.log(editValues, "resultresultresultrida1");
      setGroupsName(result.event_groups);
      setMember(result.event_members);
      setState({
        ...editValues,
        start_date: dayjs(get_start_end_date(result.event.start_date_time)).$d,
        end_date: dayjs(get_start_end_date(result.event.end_date_time)).$d,
        start_time: dayjs(get_start_end_time(editValues.start_date_time)).$d,
        end_time: dayjs(get_start_end_time(editValues.end_date_time)).$d,
      });
      // setEventDetail(result.event);
      setDetailDescriptionCk(result?.event?.description);

      setIsLoadingLoader(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingLoader(false);
    }
  };
  useEffect(() => {
    if (serchText.length > 2) {
      getGroupsAndMembers();
    }
  }, [serchText]);
  useEffect(() => {
    getGroupsAndMembers();
    getEventinformationForEdit();
  }, []);
  // useEffect(() => {
  //   setState({
  //     ...editValues,
  //     start_date: dayjs(get_start_end_date(result.event.start_date_time)).$d,
  //     end_date: dayjs(get_start_end_date(result.event.end_date_time)).$d,
  //     start_time: dayjs(get_start_end_time(editValues.start_date_time)).$d,
  //     end_time: dayjs(get_start_end_time(editValues.end_date_time)).$d,
  //   });
  //   let notify_before = [];
  //   if (editValues.notify_before && editValues.notify_before.length > 0) {
  //     notify_before = editValues.notify_before;
  //   }
  //   setNotificationArray(notify_before);
  //   let group_array = [];
  //   if (editValues?.group?.length > 0) {
  //     editValues?.group?.map((group) => {
  //       if (group?._id !== null) {
  //         group_array.push(group?._id);
  //       }
  //     });
  //   }
  //   setGroupsName(group_array);

  //   let member_array = [];
  //   if (editValues?.member?.length > 0) {
  //     editValues?.member?.map((member) => {
  //       member_array.push(member?._id);
  //     });
  //   }
  //   setMember(member_array);
  //   console.log(editValues, "editValueseditValues");
  // }, [editValues]);
  if (isLoadingLoader == true) {
    return (
      <CircularProgress
        className={classes.loading}
        style={{ marginLeft: "50%", marginTop: "20%" }}
        color="primary"
      />
    );
  }
  return (
    <div className="container new-memories">
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
            className="mt-3"
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
            className="mt-3"
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
          <FormControl variant="outlined" className="mt-3">
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
              className="inputs-fields svg-color"
              MenuProps={{
                classes: {
                  paper: classes.paper,
                },
              }}
              sx={{
                color: get_root_value("--input-text-color"),
              }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </div>
        {state.recurring_type == "weekly" && (
          <div className={`col-12 col-md-6 col-lg-3`}>
            <FormControl variant="outlined" className="mt-3">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Day
              </InputLabel>
              <Select
                multiple
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={state.weekday ? state.weekday : []}
                onChange={(e) => handleChange(e)}
                label="Select Day"
                name="weekday"
                className="inputs-fields svg-color"
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Start Date"
              name="start_date"
              inputFormat="DD-MM-YYYY"
              value={state.start_date}
              format="DD-MM-YYYY"
              className="mt-3"
              onChange={(e) => handleChangeDate("start_date", e)}
              renderInput={(params) => (
                <TextField {...params} required={true} />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className="col-12 col-md-6 col-lg-3 full-modal-field-margin">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Start Time"
              name="start_time"
              value={state.start_time}
              sx={{ color: "#fff" }}
              className="mt-3"
              onChange={(e) => handleChangeDate("start_time", e)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="col-12 col-md-6 col-lg-3 full-modal-field-margin">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="End Time"
              name="end_time"
              value={state.end_time}
              sx={{ color: "#fff" }}
              className="mt-3"
              onChange={(e) => handleChangeDate("end_time", e)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="col-12 col-md-2 col-lg-3">
          <div className="col-12">
            <FormControl variant="outlined" className="mt-3">
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
                className="svg-color"
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
              value={groupsName ? groupsName : null}
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
              options={personName}
              clearOnBlur={true}
              getOptionLabel={(option) =>
                option.first_name + " (" + option.email + ")"
              }
              filterSelectedOptions
              value={member ? member : null}
              onChange={(event, newValue) => {
                setMember(newValue);
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
        {/* <div className="text-end mt-3">
          <button className="small-contained-button" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div> */}
      </form>
    </div>
  );
}
