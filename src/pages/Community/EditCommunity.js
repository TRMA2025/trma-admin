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
// import { VaultListing } from "src/DAL/Vault/Vault";
import Autocomplete from "@mui/material/Autocomplete";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, Divider, CircularProgress } from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
import { object } from "prop-types";
import { menuList } from "src/DAL/Menu/Menu";
import {
  AddProgrammeApi,
  programmeActiveListing,
} from "src/DAL/Programme/Programme";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { addQuotesApi } from "src/DAL/quotes/Quotes";
import {
  addCommunityRewardApi,
  editCommunityListing,
} from "src/DAL/CommunityArea/Community";
import { s3baseUrl } from "src/config/config";

// import { get_root_value } from "src/utils/domUtils";

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

export default function EditCommunity() {
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
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programList, setProgramList] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [oldImage1, setOldImage1] = React.useState("");
  const [oldImage2, setOldImage2] = React.useState("");
  const [oldImageBorder, setOldImageBorder] = React.useState("");
  const [borderLessFile, setProfileImageBorderLess] = React.useState();

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    programStatus: "true",
    showStatus: "true",
    image: {},
    borderImage: {},
    accessType: "limited",
    videoUrl: "",
    short_description: "",
    detailed_description: "",
    video_show_Status: "",
    days: "",
    reward_type: "",
    reward_level: "",
    priority: "",
    order: "",
    program_id: "",
  });

  const getNavItemList = async () => {
    const result = await menuList();
    if (result.code === 200) {
      setMenuList(result.menu);
      //   setVaultName(result.vault_category[0].vault_slug);
    }
  };
  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const getProgram = async () => {
    setIsLoading(true);
    const result = await programmeActiveListing();
    if (result.code === 200) {
      setProgramList(result.program);
      setIsLoading(false);
    }
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const audioFileChange = (e) => {
    setAudio(e.target.files[0]);
  };
  const handleProgramName = (data) => {
    setProgramName(data.program_slug);
  };
  const handleVaultName = (data) => {
    setVaultName(data.vault_slug);
  };
  const handldeDeleteAudio = () => {
    setAudio();
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

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setDate(newValue);
  };
  const fileChangedHandlerBorder = (e) => {
    setProfileImageBorderLess(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["borderImage"]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("status", inputs.status);
    formData.append("reward_type", inputs.reward_level);
    formData.append("created_for", inputs.reward_type);
    formData.append("priority", inputs.priority);
    formData.append("order", inputs.order);

    if (inputs.reward_type === "program") {
      formData.append("program_id", inputs.program_id);
    }

    if (file) {
      formData.append("main_image", inputs.image);
    }
    if (borderLessFile) {
      formData.append("icon_without_border", inputs.borderImage);
    }
    //console form data

    setIsLoading(true);
    const result = await editCommunityListing(formData, state.id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeProgram = (e) => {
    setProgramName(e.target.value);
  };
  const handleChangeVault = (event) => {
    setVaultName(event.target.value);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    const data = state.object;
    setOldImage1(data.icon_with_border.thumbnail_1);
    setOldImage2(data.icon_without_border.thumbnail_1);
    setInputs({
      ...inputs,
      ["title"]: data.title,
      ["status"]: data.status,
      ["reward_type"]: data.created_for,
      ["reward_level"]: data.reward_type,
      ["priority"]: data.priority,
      ["order"]: data.order,
      ["program_id"]: data.program,
    });
  }, []);
  React.useEffect(() => {
    getProgram();
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
        <div className="col-6">
          <h2>Edit Community</h2>
        </div>
      </div>
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
            label="Order"
            variant="outlined"
            fullWidth
            required
            name="order"
            value={inputs.order}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Level</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="reward_level"
              value={inputs.reward_level}
              label="Level"
              onChange={handleChange}
            >
              <MenuItem value="dynamite">BeeMe</MenuItem>
              <MenuItem value="mastery">Mastery</MenuItem>
              <MenuItem value="elite">Elite</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Reward Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="reward_type"
              value={inputs.reward_type}
              label="Reward Type"
              onChange={handleChange}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="program">Program</MenuItem>
              <MenuItem value="dynamite_membership">
                BeeMe Membership
              </MenuItem>
              <MenuItem value="basic_membership">Basic Membership</MenuItem>
            </Select>
          </FormControl>
        </div>
        {inputs.reward_type == "program" && (
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Program *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="program_id"
                value={inputs.program_id}
                label="Program *"
                onChange={handleChange}
              >
                {programList.map((program) => {
                  return (
                    <MenuItem value={program._id}>{program.title}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        )}
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Priority"
            variant="outlined"
            fullWidth
            required
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            name="priority"
            value={inputs.priority}
            onChange={handleChange}
            onWheel={(event) => event.target.blur()}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="status"
              value={inputs.status}
              label="Status *"
              onChange={handleChange}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Upload Icon *</p>
              <FormHelperText className="pt-0">
                Image Size(50 X 50) ("PNG", "SVG")
              </FormHelperText>
            </div>
            <div className="col-2">
              {file ? (
                <img className="image-border" src={file} height="50" />
              ) : (
                <img
                  className="image-border"
                  src={s3baseUrl + oldImage1}
                  height="50"
                />
              )}
            </div>
            <div className="col-5 text-end pt-2">
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
          {inputs?.image?.name == "" ? (
            ""
          ) : (
            <p className="text-secondary">{inputs?.image?.name}</p>
          )}
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <div className="row w-100 div-style ms-0 pt-0">
            <div className="col-5">
              <p className="">Upload Icon Without Border*</p>
              <FormHelperText className="pt-0">("PNG", "SVG")</FormHelperText>
            </div>
            <div className="col-2">
              {borderLessFile ? (
                <img src={borderLessFile} height="50" />
              ) : (
                <img src={s3baseUrl + oldImage2} height="50" />
              )}
            </div>
            <div className="col-5 text-end pt-2">
              <label htmlFor="contained-button-file-border">
                <Input
                  accept="image/*"
                  id="contained-button-file-border"
                  multiple
                  type="file"
                  name="image"
                  onChange={fileChangedHandlerBorder}
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
          {inputs?.borderImage?.name == "" ? (
            ""
          ) : (
            <p className="text-secondary">{inputs?.borderImage?.name}</p>
          )}
        </div>

        {/* <div className="col-12 mt-5">
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-flexible"
              label="Short Description *"
              multiline
              rows={6}
              name="short_description"
              value={inputs.short_description}
              onChange={handleChange}
            />
            <FormHelperText>Maximum limit 500 characters</FormHelperText>
          </FormControl>
        </div> */}

        <div className="text-end mt-4">
          <button onClick={handleSubmit} className="small-contained-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
