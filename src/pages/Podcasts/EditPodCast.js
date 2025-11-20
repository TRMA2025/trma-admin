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

import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, Divider, CircularProgress } from "@mui/material";
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
import {
  addWebsitePodCast,
  editWebsitePodCast,
} from "src/DAL/Podcasts/PodcastApi";
import { s3baseUrl } from "src/config/config";
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

export default function EditPodCast() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [oldImage, setOldImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [groupListing, setGroupListing] = React.useState([]);
  const [groupAutomatedListing, setGroupAutomatedListing] = React.useState([]);
  const [groupsAutomatedName, setGroupsAutomatedName] = React.useState([]);
  const [groupsName, setGroupsName] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [shortDescriptionCk, setShortDescriptionCk] = React.useState("");

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "",
    room_type: "",
    image: {},
    short_description: "",
    detailed_description: "",
    zoom_link: "",
    code: "",
    podcast_url: "",
    order: "",
  });

  const fileChangedHandler = (e) => {
    console.log(e.target.files[0]);
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  const getAutomatedGroups = async () => {
    setIsLoading(true);
    const result = await GroupAutomatedListingApi();
    if (result.code === 200) {
      console.log(result, "automated");
      let total_groups = result.group;
      let active_groups = [];
      total_groups.map((group) => {
        if (group.status === true) {
          active_groups.push(group);
        }
      });
      console.log(result, "list of group");
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
      console.log(result, "list of group");
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
      console.log(result, "list of member");
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
    console.log(e.target.files[0]);
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
  console.log(groupsName, "groupsNamegroupsName");
  console.log(person, "personpersonperson");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
    } else {
      const formData = new FormData();

      formData.append("title", inputs.title);
      formData.append("short_description", shortDescriptionCk);
      formData.append("detail_description", detailDescriptionCk);
      formData.append("status", inputs.status);
      formData.append("podcast_type", inputs.room_type);
      formData.append("video_url", inputs.zoom_link);
      formData.append("podcast_url_name", inputs.podcast_url);
      formData.append("podcast_embed_code", inputs.code);
      formData.append("order", inputs.order);
      formData.append("room_slug", state?.object?.room_slug);
      if (file) {
        formData.append("image", inputs.image);
      }
      //console form data

      console.log(...formData, "form data value");

      setIsLoading(true);
      const result = await editWebsitePodCast(
        formData,
        state?.object?.room_slug
      );
      if (result.code === 200) {
        console.log(result, "result");
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
      } else {
        console.log(result);
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  //   console.log(typeof audioFile, "values of audio to be send ");
  console.log(state, "statestatestate");
  React.useEffect(() => {
    let data = state.object;
    setOldImage(data.room_image.thumbnail_1);
    setDetailDescriptionCk(data.detail_description);
    setShortDescriptionCk(data.short_description);
    setInputs({
      ...inputs,
      ["title"]: data.title,
      ["short_description"]: data.title,
      ["code"]: data.podcast_embed_code,
      ["room_type"]: data.podcast_type,
      ["zoom_link"]: data.video_url,
      ["order"]: data.order,
      ["podcast_url"]: data.room_slug,
      ["status"]: data.status,
    });
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(
    groupsAutomatedName,
    "groupAutomatedListinggroupAutomatedListing"
  );

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
          <h2>Edit Podcast</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              fullWidth
              required
              name="title"
              value={inputs.title}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Podcast Type"
              variant="outlined"
              fullWidth
              name="room_type"
              value={inputs.room_type}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Order"
              variant="outlined"
              fullWidth
              name="order"
              value={inputs.order}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Podcast Status *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                required
                value={inputs.status}
                label="Podcast Status"
                onChange={handleChange}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Podcast Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="room_type"
              value={inputs.room_type}
              label="Pod Type"
              onChange={handleChange}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="automated">Automated</MenuItem>
            </Select>
          </FormControl>
        </div> */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Podcast Url"
              variant="outlined"
              fullWidth
              required
              name="podcast_url"
              value={inputs.podcast_url}
              onChange={handleChange}
            />
          </div>
          {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Video Url"
            variant="outlined"
            fullWidth
            name="zoom_link"
            value={inputs.zoom_link}
            onChange={handleChange}
          />
        </div> */}

          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-6">
                <p className="">Upload Image *</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {file ? (
                  <img className="image-border" src={file} height="50px"></img>
                ) : (
                  <img
                    className="image-border"
                    src={s3baseUrl + oldImage}
                    height="50px"
                  ></img>
                )}
              </div>
              <div className="col-4 text-end pt-2">
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="image"
                    onChange={fileChangedHandler}
                  />
                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs.image.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs.image.name}</p>
            )}
          </div>

          <div className="col-12 mt-5">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Embed Code"
                multiline
                rows={6}
                name="code"
                value={inputs.code}
                onChange={handleChange}
              />
              {/* <FormHelperText>Maximum limit 500 characters</FormHelperText> */}
            </FormControl>
          </div>
          {/* <div className="col-12 mt-5">
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-flexible"
              label="Short Description"
              multiline
              rows={6}
              required
              name="short_description"
              value={inputs.short_description}
              onChange={handleChange}
            />
            <FormHelperText>Maximum limit 500 characters</FormHelperText>
          </FormControl>
        </div> */}
          <div className="col-12 mt-4">
            <h4>Short Description</h4>
            <TinyEditor
              setDetailDescription={setShortDescriptionCk}
              detailDescriptionCk={shortDescriptionCk}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Detailed Description *</h4>
            <TinyEditor
              setDetailDescription={setDetailDescriptionCk}
              detailDescriptionCk={detailDescriptionCk}
            />
          </div>

          <div className="text-end mt-4">
            <button className="small-contained-button">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}
