import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import { activeMemberListing } from "../../DAL/member/member";
import { useNavigate } from "react-router-dom";
import { IconButton, CircularProgress, Autocomplete } from "@mui/material";

import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  activeGroupListingApi,
  GroupAutomatedListingApi,
} from "src/DAL/group/group";
import { AddPodsApi, AddPodsNewApi } from "src/DAL/Pods/pods";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { useEffect } from "react";
import moment from "moment";

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

export default function AddCalendarPods() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [member, setMember] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groupListing, setGroupListing] = useState([]);
  const [groupAutomatedListing, setGroupAutomatedListing] = useState([]);
  const [groupsAutomatedName, setGroupsAutomatedName] = useState([]);
  const [groupsName, setGroupsName] = useState([]);
  const [image, setImage] = useState({});
  const [detailDescriptionCk, setDetailDescriptionCk] = useState("");
  const [shortDescriptionCk, setShortDescriptionCk] = useState("");
  const [startDateMin, setStartDateMin] = useState(new Date());
  const [endDateMin, setEndDateMin] = useState(new Date());
  const [endDateMax, setEndDateMax] = useState(new Date());

  const [inputs, setInputs] = useState({
    title: "",
    status: "true",
    room_type: "general",
    image: {},
    short_description: "",
    detailed_description: "",
    zoom_link: "",
    password: "",
    start_date: new Date(),
    start_time: "00:00",
    end_date: new Date(),
    duration_hour: 1,
    duration_minute: 0,
    is_recurring: false,
    recurring_type: "weekly",
  });

  const fileChangedHandler = (e) => {
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const getAutomatedGroups = async () => {
    setIsLoading(true);
    const result = await GroupAutomatedListingApi();
    if (result.code === 200) {
      let total_groups = result.group;
      let active_groups = [];
      total_groups.map((group) => {
        if (group.status === true) {
          active_groups.push(group);
        }
      });
      setGroupAutomatedListing(result.group);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
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
  const handleChangeAutomatedGroup = (event) => {
    const {
      target: { value },
    } = event;
    setGroupsAutomatedName(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      enqueueSnackbar("image is required", { variant: "error" });
      return;
    }
    setIsLoading(true);
    let group_array_automated = [];
    let group_object_automated = {};
    groupsAutomatedName.map((group) => {
      group_object_automated = {
        group_slug: group,
      };
      group_array_automated.push(group_object_automated);
    });

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
    member.map((member) => {
      selected_member_object = {
        member_id: member._id,
      };
      selected_member_array.push(selected_member_object);
    });
    const formData = new FormData();
    formData.append("title", inputs.title);
    if (image.length > 0) {
      formData.append("image", inputs.image);
    }

    formData.append("short_description", shortDescriptionCk);
    formData.append("detail_description", detailDescriptionCk);
    formData.append("status", inputs.status);
    formData.append("room_type", inputs.room_type);
    formData.append("zoom_link", inputs.zoom_link);
    formData.append("password", inputs.password);
    // formData.append("is_recurring", inputs.is_recurring);
    // formData.append("start_time", inputs.start_time);
    // formData.append("duration_hour", inputs.duration_hour);
    // formData.append("duration_minute", inputs.duration_minute);
    // formData.append(
    //   "start_date",
    //   moment(inputs.start_date).format("YYYY-MM-DD")
    // );
    formData.append(
      "group",
      JSON.stringify(
        inputs.room_type == "general" ? group_array : group_array_automated
      )
    );
    if (inputs.room_type == "general") {
      formData.append("member", JSON.stringify(selected_member_array));
    }
    if (inputs.is_recurring === true) {
      formData.append("end_date", moment(inputs.end_date).format("YYYY-MM-DD"));
      formData.append("recurring_type", inputs.recurring_type);
    }
    console.log(...formData, "formData");

    const result = await AddPodsApi(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/meetings`);
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

  const handleChangeTime = (event) => {
    const { name, value } = event.target;

    setInputs((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleChangeDate = (name, value) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const get_dropdown_menu = (limit) => {
    let arr = [];
    for (let index = 0; index <= limit; index++) {
      arr.push(index);
    }

    return arr;
  };

  useEffect(() => {
    if (inputs.recurring_type === "daily") {
      let myDate = new Date(inputs.start_date);
      myDate.setDate(myDate.getDate() + 30);
      setEndDateMin(() => inputs.start_date);
      setEndDateMax(() => myDate);
    } else if (inputs.recurring_type === "weekly") {
      let myDate = new Date(inputs.start_date);
      myDate.setDate(myDate.getDate() + 168);
      setEndDateMin(() => inputs.start_date);
      setEndDateMax(() => myDate);
    } else if (inputs.recurring_type === "monthly") {
      let myDate = new Date(inputs.start_date);
      myDate.setDate(myDate.getDate() + 180);
      setEndDateMin(() => inputs.start_date);
      setEndDateMax(() => myDate);
    }
    setInputs((prev) => {
      return { ...prev, end_date: inputs.start_date };
    });
  }, [inputs.start_date, inputs.recurring_type]);

  useEffect(() => {
    getGroups();
    getMember();
    getAutomatedGroups();
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
            onClick={() => navigate(`/meetings`)}
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
          <h2>Add Meeting</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  required
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Meeting Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label="Meeting Status*"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Meeting Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="room_type"
                    value={inputs.room_type}
                    label="Meeting Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="automated">Automated</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Zoom Link"
                  variant="outlined"
                  fullWidth
                  type="URL"
                  name="zoom_link"
                  value={inputs.zoom_link}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-name-label">Recursion</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                name="is_recurring"
                value={inputs.is_recurring}
                onChange={handleChange}
                input={<OutlinedInput label="Recursion" />}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value={true}
                  style={getStyles(name, groupsName, theme)}
                >
                  Yes
                </MenuItem>
                <MenuItem
                  value={false}
                  style={getStyles(name, groupsName, theme)}
                >
                  No
                </MenuItem>
              </Select>
            </FormControl>
          </div> */}

              {/* <div className="col-12 mt-4">
            <h4 className="ms-1">When</h4>
          </div> */}

              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4 mt-md-2">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                name="startDate"
                inputFormat="dd/MM/yyyy"
                minDate={startDateMin}
                value={inputs.start_date}
                onChange={(e) => {
                  handleChangeDate("start_date", e);
                }}
                format="YYYY-MM-DD"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="inputs-fields"
                    required={true}
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 mt-4 mt-md-2">
            <TextField
              variant="outlined"
              id="time"
              label="Start Time"
              type="time"
              className="inputs-fields"
              name="start_time"
              required={true}
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={inputs.start_time}
              onChange={(e) => handleChangeTime(e)}
            />
          </div> */}

              {/* <div className="col-12 mt-4">
            <h4 className="ms-1">Duration</h4>
          </div> */}

              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4 mt-md-2">
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-name-label">Hours</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                name="duration_hour"
                value={inputs.duration_hour}
                onChange={handleChange}
                input={<OutlinedInput label="Hours" />}
                MenuProps={MenuProps}
              >
                {get_dropdown_menu(24).map((value) => (
                  <MenuItem
                    value={value}
                    style={getStyles(name, groupsName, theme)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4 mt-md-2">
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-name-label">Minutes</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                name="duration_minute"
                value={inputs.duration_minute}
                onChange={handleChange}
                input={<OutlinedInput label="Minutes" />}
                MenuProps={MenuProps}
              >
                {get_dropdown_menu(60).map((value) => (
                  <MenuItem
                    value={value}
                    style={getStyles(name, groupsName, theme)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div> */}
              {inputs.is_recurring && (
                <>
                  <div className="col-12 mt-4">
                    <h4 className="ms-1">Recurrence</h4>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4 mt-md-2">
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">
                        Recurrence Type
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        name="recurring_type"
                        value={inputs.recurring_type}
                        onChange={handleChange}
                        input={<OutlinedInput label="Recurrence Type" />}
                        MenuProps={MenuProps}
                      >
                        <MenuItem
                          value={"daily"}
                          style={getStyles(name, groupsName, theme)}
                        >
                          Daily
                        </MenuItem>
                        <MenuItem
                          value={"weekly"}
                          style={getStyles(name, groupsName, theme)}
                        >
                          Weekly
                        </MenuItem>
                        <MenuItem
                          value={"monthly"}
                          style={getStyles(name, groupsName, theme)}
                        >
                          Monthly
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4 mt-md-2">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        name="startDate"
                        minDate={endDateMin}
                        maxDate={endDateMax}
                        value={inputs.end_date}
                        inputFormat="dd/MM/yyyy"
                        onChange={(e) => {
                          handleChangeDate("end_date", e);
                        }}
                        format="YYYY-MM-DD"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className="inputs-fields"
                            required={true}
                            fullWidth
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                </>
              )}
              {inputs.room_type == "general" && (
                <>
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">
                        Groups
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={groupsName}
                        onChange={handleChangeGroup}
                        input={<OutlinedInput label="Groups" />}
                        MenuProps={MenuProps}
                      >
                        {groupListing.map((name) => (
                          <MenuItem
                            key={name}
                            value={name.group_slug}
                            style={getStyles(name, groupsName, theme)}
                          >
                            {name.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
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
                        />
                      )}
                    />
                  </div>
                </>
              )}
              {inputs.room_type == "automated" && (
                <>
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">
                        Automated Groups
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        value={groupsAutomatedName}
                        onChange={handleChangeAutomatedGroup}
                        input={<OutlinedInput label="Automated Groups" />}
                        MenuProps={MenuProps}
                      >
                        {groupAutomatedListing.map((name) => (
                          <MenuItem
                            key={name}
                            value={name.group_slug}
                            style={getStyles(name, groupsAutomatedName, theme)}
                          >
                            {name.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </>
              )}

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Meeting Image *</p>
                    <FormHelperText className="pt-0">
                      Image Size(350 X 100) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {image.length > 0 && (
                      <img className="image-border" src={image} height="50" />
                    )}
                  </div>

                  <div className="col-5 text-end pt-2">
                    <label htmlFor="contained-button-file-logo">
                      <Input
                        accept="image/*"
                        id="contained-button-file-logo"
                        multiple
                        type="file"
                        name="logo"
                        hidden
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
                {inputs?.image?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs?.image?.name}</p>
                )}
              </div>
              <div className="col-12 mt-4">
                <h4>Short Description </h4>
                <TinyEditor
                  setDetailDescription={setShortDescriptionCk}
                  detailDescriptionCk={shortDescriptionCk}
                />
              </div>
              <div className="col-12 mt-4">
                <h4>Detailed Description </h4>
                <TinyEditor
                  setDetailDescription={setDetailDescriptionCk}
                  detailDescriptionCk={detailDescriptionCk}
                />
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
