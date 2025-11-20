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
import Autocomplete from "@mui/material/Autocomplete";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, Divider, CircularProgress } from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
import { object } from "prop-types";
// import { AddPods } from "src/DAL/Pods/Pods";
// import { GroupListing } from "src/DAL/Groups/Groups";
// import { MemberListing } from "src/DAL/member/Member";
import moment from "moment";
import { AddGroupApi } from "src/DAL/group/group";
import {
  programmeActiveListing,
  programmeListing,
} from "src/DAL/Programme/Programme";
import { activeMemberListing } from "src/DAL/member/member";
// import { websiteEventListApi } from "src/DAL/WebsitePages/websitepages";
import { eventListApi } from "src/DAL/Events/events";
import { dynamiteEventsListApi } from "src/DAL/WebsitePagesold/DynamiteEvents/DynamiteEvents";
// import { dynamiteEventsListApi } from "src/DAL/WebsitePages/DynamiteEvents/DynamiteEvents";
// import MWEditor from "src/components/Editor/CKEditor";

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

export default function AddCalendarGroup() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState({});
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [member, setMember] = React.useState([]);
  const [programmeListing, setProgramListing] = React.useState([]);
  const [groupsName, setGroupsName] = React.useState([]);
  const [eventsListing, setEventsListing] = React.useState([]);
  const [eventsName, setEventsName] = React.useState([]);

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    room_type: "general",
    image: {},
    short_description: "",
    detailed_description: "",
    zoom_link: "",
    password: "",
    groupBy: "program",
  });

  const fileChangedHandler = (e) => {
    // setProfileImage(e.target.files[0]);
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const getEvents = async () => {
    // const result = await websiteEventListApi();
    const result = await dynamiteEventsListApi();
    console.log(result, "api events");
    setEventsListing(result.dynamite_event);
  };

  const getProgrammes = async () => {
    setIsLoading(true);
    const result = await programmeActiveListing();
    if (result.code === 200) {
      setProgramListing(result.program);
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
  const handleChangeEvents = (event) => {
    const {
      target: { value },
    } = event;
    setEventsName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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

  const audioFileChange = (e) => {
    setAudio(e.target.files[0]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    //program manipulation
    let program_array = [];
    let group_object = {};
    groupsName.map((group) => {
      group_object = {
        program_slug: group,
      };
      program_array.push(group_object);
    });
    //member manipulation

    let selected_member_array = [];
    let selected_member_object = {};
    member.map((member) => {
      selected_member_object = {
        member_id: member._id,
      };
      selected_member_array.push(selected_member_object);
    });

    // event manipulation
    let selected_event_array = [];
    let selected_event_object = {};
    eventsName.map((event) => {
      selected_event_object = {
        event_slug: event,
      };
      selected_event_array.push(selected_event_object);
    });
    let postData = {
      title: inputs.title,
      status: inputs.status,
      program: program_array,
      member: selected_member_array,
      // event: selected_event_array,
      // group_by: inputs.groupBy,
    };
    // if (inputs.groupBy == "program") {
    //   postData.program = program_array;
    // } else if (inputs.groupBy == "event") {
    //   postData.event = selected_event_array;
    // }
    console.log(postData, "postData");
    setIsLoading(true);
    const result = await AddGroupApi(postData);
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
  React.useEffect(() => {
    getProgrammes();
    getMember();
    getEvents();
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
        <div className="col-12">
          <h2>Add Group</h2>
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
                  label="Group Name"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Group Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label="Pod Status*"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Group By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="groupBy"
              value={inputs.groupBy}
              label="Group By*"
              onChange={handleChange}
            >
              <MenuItem value="program">Group By Program</MenuItem>
              <MenuItem value="event">Group By Event</MenuItem>
            </Select>
          </FormControl>
        </div> */}

              {inputs.groupBy == "event" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <FormControl className="mt-3" fullWidth>
                    <InputLabel id="demo-multiple-name-label">
                      Events
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple
                      value={eventsName}
                      onChange={handleChangeEvents}
                      input={<OutlinedInput label="Events" />}
                      MenuProps={MenuProps}
                    >
                      {eventsListing.map((name) => (
                        <MenuItem
                          key={name}
                          value={name.event_slug}
                          style={getStyles(name, eventsName, theme)}
                        >
                          {name.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
              {inputs.groupBy == "program" && (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <FormControl className="mt-3" fullWidth>
                    <InputLabel id="demo-multiple-name-label">
                      Programmes
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple
                      value={groupsName}
                      onChange={handleChangeGroup}
                      input={<OutlinedInput label="Programmes" />}
                      MenuProps={MenuProps}
                    >
                      {programmeListing.map((name) => (
                        <MenuItem
                          key={name}
                          value={name.program_slug}
                          style={getStyles(name, groupsName, theme)}
                        >
                          {name.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
              {/* <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <FormControl className="mt-3" fullWidth>
            <InputLabel id="demo-multiple-name-label">Members</InputLabel>
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
            </Select>
          </FormControl>
        </div> */}
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
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button type="submit" className="small-contained-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
