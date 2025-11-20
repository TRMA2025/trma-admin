import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
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
// import { s3baseUrl } from "src/config/config";
// import { EditPods } from "src/DAL/Pods/Pods";
// import { GroupListing } from "src/DAL/Groups/Groups";
import { activeMemberListing } from "src/DAL/member/member";
import { programmeActiveListing } from "src/DAL/Programme/Programme";
import { EditGroupApi } from "src/DAL/group/group";
import { dynamiteEventsListApi } from "src/DAL/WebsitePagesold/DynamiteEvents/DynamiteEvents";

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

export default function EditCalendarGroup() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState(false);
  const [file, setProfileImage] = React.useState({});
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programmeListing, setProgramListing] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [groupsName, setGroupsName] = React.useState([]);
  const [members, setMember] = React.useState([]);
  const [eventsListing, setEventsListing] = React.useState([]);
  const [eventsName, setEventsName] = React.useState([]);

  const [inputs, setInputs] = React.useState({
    title: "",
    zoomLink: "",
    status: "",
    order: "",
    // image: {},
    password: "",
    roomType: "general",
    short_description: "",
    detailed_description: "",
    groupBy: "",
  });
  const { id, name, status, member, program, object, group_by } = state;
  console.log(state, "statestatestatestate");

  const fileChangedHandler = (e) => {
    // setProfileImage(e.target.files[0]);
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
    setImageStatus(true);
  };
  const getEvents = async () => {
    const result = await dynamiteEventsListApi();
    setEventsListing(result.dynamite_event);
  };

  const getProgrammes = async () => {
    setIsLoading(true);
    const result = await programmeActiveListing();
    if (result.code === 200) {
      let active_programmes = result.program;

      program?.map((group) => {
        if (group?._id?.status == false) {
          active_programmes.push(group._id);
        }
      });
      setProgramListing(active_programmes);
      // setProgramListing(result.program);
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
    let group_array = [];
    let group_object = {};
    groupsName.map((group) => {
      group_object = {
        program_slug: group,
      };
      group_array.push(group_object);
    });
    let selected_member_array = [];
    let selected_member_object = {};
    members.map((member) => {
      selected_member_object = {
        member_id: member._id,
      };
      selected_member_array.push(selected_member_object);
    });
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
      program: group_array,
      member: selected_member_array,
      // event: selected_event_array,
      group_by: inputs.groupBy,
    };
    // if (inputs.groupBy == "program") {
    //   postData.program = group_array;
    // } else if (inputs.groupBy == "event") {
    //   postData.event = selected_event_array;
    // }

    setIsLoading(true);
    const result = await EditGroupApi(postData, object.group_slug);
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
  useEffect(() => {
    setInputs((inputs) => ({
      ...inputs,
      ["title"]: name,
      ["status"]: status,
      ["groupBy"]: state?.object?.group_by,

      // ["areaCode"]: areaCode,
    }));
    let groups_slug = program;
    let selected_group = [];
    groups_slug.map((group) => {
      selected_group.push(group._id.program_slug);
    });
    let member_id = member;
    let member_object = [];
    member_id.map((member) => {
      member_object.push(member._id);
    });

    //event data manipulate
    let event_slug = state?.object?.event;
    let events_array = [];
    event_slug?.map((event) => {
      // console.log(event?._id?.event_slug, "to set event");
      events_array.push(event?._id?.event_slug);
    });
    setGroupsName(selected_group);
    setMember(member_object);
    setEventsName(events_array);
    console.log(state, "statestate");
  }, []);
  useEffect(() => {
    getProgrammes();
    getMember();
    getEvents();
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  let finalArray = [];
  for (let i = 0; i < personName.length; i++) {
    let count = 0;
    for (let j = 0; j < members.length; j++) {
      if (personName[i]._id == members[j]._id) {
        count++;
      }
    }
    if (count == 0) {
      finalArray.push(personName[i]);
    }
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
          <h2>Edit Group</h2>
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
                    Group Status*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label="pod status*"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <FormControl className="mt-3" fullWidth>
                  <InputLabel id="demo-multiple-name-label">
                    Programme
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={groupsName}
                    onChange={handleChangeGroup}
                    input={<OutlinedInput label="Programme " />}
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
                  options={finalArray}
                  getOptionLabel={(option) =>
                    option.first_name + " (" + option.email + ")"
                  }
                  filterSelectedOptions
                  value={members}
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
