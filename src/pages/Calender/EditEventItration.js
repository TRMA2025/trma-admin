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
  update_event_iteration_api,
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
export default function EditEventItration({
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
    event_title: "",
    event_color: "#000",
    event_slug: "",
    status: true,
    start_date: dayjs(new Date()).$d,
    end_date: dayjs(new Date()).$d,
    start_time: dayjs(new Date()).$d,
    end_time: dayjs(new Date()).$d,
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

  const handleChangeDate = (name, event) => {
    setState((prevState) => {
      return {
        ...prevState,
        [name]: event.$d,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
    const formData = {
      iteration_id: editValues._id,
      start_date: formattedDate,
      end_date: formattedEndDate,
      // start_date: moment(state.start_date).format("YYYY-MM-DD"),
      // end_date: moment(state.end_date).format("YYYY-MM-DD"),
      start_time: moment(state.start_time).format("HH:mm"),
      end_time: moment(state.end_time).format("HH:mm"),
      title: state.event_title,
      color: state.event_color,
      description: detailDescriptionCk,
      status: state.status,
    };
    const result = await update_event_iteration_api(
      formData,
      editValues.event_slug
    );

    if (result.code === 200) {
      dataList();
      handleCloseDrawer();
      enqueueSnackbar(result.message, { variant: "success" });
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

  useEffect(() => {
    if (serchText.length > 2) {
      getGroupsAndMembers();
    }
  }, [serchText]);
  const getEventinformation = async () => {
    console.log("called");
    const result = await eventDetailApi(editValues.event_slug);
    console.log(result, "resultresultresult");
    if (result.code === 200) {
      console.log(result, "resultresultresult");
      setGroupsName(result.event_groups);
      setMember(result.event_members);
      // setEventDetail(result.event);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  useEffect(() => {
    getGroupsAndMembers();
    getEventinformation();
  }, []);
  useEffect(() => {
    setState({
      ...editValues,
      start_date: dayjs(get_start_end_date(editValues.start_date_time)).$d,
      end_date: dayjs(get_start_end_date(editValues.end_date_time)).$d,
      start_time: dayjs(get_start_end_time(editValues.start_date_time)).$d,
      end_time: dayjs(get_start_end_time(editValues.end_date_time)).$d,
    });

    let group_array = [];
    if (editValues?.group?.length > 0) {
      editValues?.group?.map((group) => {
        if (group?._id !== null) {
          group_array.push(group?._id);
        }
      });
    }
    setGroupsName(group_array);

    let member_array = [];
    if (editValues?.member?.length > 0) {
      editValues?.member?.map((member) => {
        member_array.push(member?._id);
      });
    }
    setMember(member_array);
    console.log(editValues, "editValueseditValues");
  }, [editValues]);
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
            disabled={isLoading}>
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
        <div className={`col-12 col-md-6 ${"col-lg-4"}`}>
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
        <div className="col-12 col-md-2 col-lg-4">
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
                }}>
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
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

        <div className="col-12 mt-5 mb-3">
          <h4>Event Description</h4>
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
