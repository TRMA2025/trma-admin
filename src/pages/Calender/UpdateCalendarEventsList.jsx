import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import "react-datepicker/dist/react-datepicker.css";
import { makeStyles } from "@mui/styles";
import { get_root_value } from "src/utils/domUtils";

// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import moment, { weekdays } from "moment";
// import { add_new_event_api } from "src/DAL/Calender/Calender";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
// import MUIAutocomplete from "src/components/GeneralComponents/MUIAutocomplete";
// import { memberAndGroupsListApi } from "src/DAL/member/member";
import { eventDetailApi, update_member_event_api } from "src/DAL/Events/events";
import {
  TIME_ZONE_CONVERSION,
  get_date_with_admin_time_zone,
} from "src/utils/constant";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import { memberAndGroupsListApi } from "src/DAL/memberNew/member";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker, DesktopDatePicker, TimePicker } from "@mui/lab";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { useContentSetting } from "src/Hooks/ContentSettingState";

const useStyles = makeStyles(() => ({
  paper: {
    background: get_root_value("--popup-background-color"),
    color: get_root_value("--input-text-color"),
  },
}));

const notification_object = {
  notify_before_unit: "minutes",
  notify_before_time: 30,
  notification_title: "",
};

export default function UpdateCalendarEventsList({
  dataList,
  onCloseDrawer,
  defaultTimeZone,
  editValues,
}) {
  console.log(editValues, "editValueseditValueseditValueseditValueseditValues");
  console.log(defaultTimeZone, "defaultTimeZonedefaultTimeZone");
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLoader, setIsLoadingLoader] = useState(false);
  const [personName, setPersonName] = useState([]);
  const [groupsName, setGroupsName] = useState([]);
  const [groupListing, setGroupListing] = useState([]);
  // const { userInfo, adminTimeZone } = useContentSetting();
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  console.log(detailDescriptionCk, "detailDescriptionCkdetailDescriptionCk");

  const [serchText, setSerchText] = useState("");
  const [member, setMember] = useState([]);
  const [notificationArray, setNotificationArray] = useState([
    notification_object,
  ]);
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
    // console.log(moment.utc(date).format("DD-MM-YYYY hh:mm A"), "flkjadskfhakj");
    // return moment.utc(date).format("YYYY-MM-DD HH:mm");
    // return get_date_with_admin_time_zone(
    //   date,
    //   "YYYY-MM-DD HH:mm",
    //   defaultTimeZone
    // );
    return TIME_ZONE_CONVERSION(
      date,
      "YYYY-MM-DD HH:mm",
      defaultTimeZone,
      defaultTimeZone
    );
  };
  console.log(defaultTimeZone, "default time zone........");
  const handleChangeNotification = (event, index) => {
    const { name, value } = event.target;
    let temp_state = [...notificationArray];
    let temp_element = { ...temp_state[index] };
    temp_element[name] = value;
    temp_state[index] = temp_element;
    setNotificationArray(temp_state);
  };

  const handleChangeDate = (name, event) => {
    setState((prevState) => {
      return {
        ...prevState,
        [name]: event.$d,
      };
    });
  };

  const handleAddNotification = () => {
    setNotificationArray((old_array) => [...old_array, notification_object]);
  };
  const handleChangeGroup = (value) => {
    setGroupsName(value);
  };

  const handleRemoveNotification = (index) => {
    const updatedItems = [...notificationArray];
    updatedItems.splice(index, 1);
    setNotificationArray(updatedItems);
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

    const formData = {
      title: state.title,
      color: state.color,
      description: detailDescriptionCk,
      recurring_type: state.recurring_type,
      weekday: state.weekday,
      status: state.status,
      start_date: moment(state.start_date).format("YYYY-MM-DD"),
      end_date: moment(state.end_date).format("YYYY-MM-DD"),
      start_time: moment(state.start_time).format("HH:mm"),
      end_time: moment(state.end_time).format("HH:mm"),
      group: group_array,
      member: selected_member_array,
    };

    const result = await update_member_event_api(formData, state.event_slug);
    if (result.code === 200) {
      dataList();
      onCloseDrawer();
      enqueueSnackbar(result.message, { variant: "success" });
      dataList();
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const getGroupsAndMembers = async () => {
    const result = await memberAndGroupsListApi(serchText);
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
  const handleSearch = (event) => {
    event.preventDefault();
    const value = event.target.value;
    setSerchText(value);
  };
  const getEventinformation = async () => {
    setIsLoadingLoader(true);
    console.log("called");
    const result = await eventDetailApi(editValues.event_slug);
    if (result.code === 200) {
      console.log(result, "resultresultresultrida");
      console.log(editValues, "resultresultresultrida1");
      setGroupsName(result.event_groups);
      setMember(result.event_members);
      setDetailDescriptionCk(result?.event?.description);

      setState({
        ...editValues,
        start_date: dayjs(get_start_end_date(result.event.start_date_time)).$d,
        end_date: dayjs(get_start_end_date(result.event.end_date_time)).$d,
        start_time: dayjs(get_start_end_time(editValues.start_date_time)).$d,
        end_time: dayjs(get_start_end_time(editValues.end_date_time)).$d,
        weekday: editValues.weekday
          ? editValues.weekday
          : [new Date().getDay()],
      });
      let notify_before = [];
      if (result.event.notify_before && result.event.notify_before.length > 0) {
        notify_before = result.event.notify_before;
      }
      setNotificationArray(notify_before);

      setIsLoadingLoader(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingLoader(false);
    }
  };

  useEffect(() => {
    getGroupsAndMembers();
    getEventinformation();
  }, []);

  useEffect(() => {
    if (serchText.length > 2) {
      getGroupsAndMembers();
    }
  }, [serchText]);

  useEffect(() => {
    setState({
      ...editValues,
      weekday: editValues.weekday ? editValues.weekday : [new Date().getDay()],
    });

    let group_array = [];
    if (editValues?.group.length > 0) {
      editValues?.group?.map((group) => {
        if (group?._id !== null) {
          group_array.push(group?._id);
        }
      });
    }
    setGroupsName(group_array);

    let member_array = [];
    if (editValues?.member.length > 0) {
      editValues?.member?.map((member) => {
        member_array.push(member?._id);
      });
    }
    setMember(member_array);
    console.log(editValues, "editValueseditValueseditValues");
  }, [editValues]);
  useEffect(() => {
    let value = 30;
    if (state.notify_before_unit == "days") value = 7;
    else if (state.notify_before_unit == "hours") value = 24;

    setState((prevState) => {
      return {
        ...prevState,
        notify_before_time: value,
      };
    });
  }, [state.notify_before_unit]);
  console.log(state, "statestatestatestatestatestatestate");
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
            name="title"
            value={state.title}
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
            id="color"
            type="color"
            label="Color"
            name="color"
            className="mt-3 w-100"
            variant="outlined"
            required={true}
            value={state.color}
            onChange={handleChange}
          />
        </div>
        <div
          className={`col-12 col-md-6 ${
            state.recurring_type == "weekly" ? "col-lg-2" : "col-lg-4"
          }`}
        >
          <FormControl variant="outlined" className="mt-3 w-100">
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
            <FormControl variant="outlined" className="mt-3 w-100">
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
              className="mt-3 w-100"
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
              className="mt-3 w-100"
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
              className="mt-3 w-100"
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
              className="mt-3 w-100"
              onChange={(e) => handleChangeDate("end_time", e)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="col-12 col-md-2 col-lg-3">
          <div className="col-12">
            <FormControl variant="outlined" className="mt-3 w-100">
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
        <div className={`col-12 col-md-5 col-lg-4`}>
          <FormControl className="mt-3  w-100">
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
        </div>{" "}
        <div className={`col-12 col-md-5 col-lg-5`}>
          <FormControl className="mt-3 w-100 w-100">
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
        <div className="col-12 mt-3 w-100 mb-4">
          <h4 className="heading-calender">Detail Description </h4>
          <TinyEditor
            setDetailDescription={setDetailDescriptionCk}
            detailDescriptionCk={detailDescriptionCk}
          />
        </div>
      </form>
    </div>
  );
}
