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
  AddProgrammeDocumentApi,
} from "src/DAL/Programme/Programme";
import { AddLessonApi, AddLessonRecordingApi } from "src/DAL/lessons/lessons";
import { DatePicker, TimePicker } from "@mui/lab";
import { AddLessonDocumentApi } from "src/DAL/lessonDocument/LessonDocument";
import { programmeListing } from "../../DAL/Programme/Programme";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { AddStudySessionApi } from "src/DAL/studySession/studySessionApi";
import {
  AddStripeListApi,
  EditStripeListApi,
} from "src/DAL/StripeProduct/stripeProductApi";

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


export default function EditStripeProduct() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail_file, setThumbnailFile] = React.useState();
  const [otherDocument, setOtherDocument] = React.useState();
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programList, setProgramList] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [recordingDate, setRecordingDate] = React.useState(null);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [docStatus, setDocStatus] = React.useState("false");

  //   const [value, setValue] = React.useState(new Date());

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "",
    showOnConsultant: "",
    docType: "image",
    image: {},
    image_thumbnail: {},
    otherDocument: {},
    short_description: "",
  });

  //console.log(state, "statestatestatestatestate");

  const getProgramListing = async () => {
    const result = await programmeListing();
    setIsLoading(true);
    if (result.code === 200) {
      //console.log(result, "getProgramListing");
      setProgramList(result.program);
      setProgramName(result.program[0].program_slug);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  //console.log(programName, "programNameprogramNameprogramNameprogramName");

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const fileChangedHandlerOther = (e) => {
    setOtherDocument(URL.createObjectURL(e.target.files[0]));
    setDocStatus(true);
    setInputs({
      ...inputs,
      ["otherDocument"]: e.target.files[0],
    });
  };
  const fileChangedHandlerThumbnails = (e) => {
    //console.log("kkkkkkkk");
    setThumbnailFile(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image_thumbnail"]: e.target.files[0],
    });
  };
  const handleThumbnail = (e) => {
    //console.log("kkkkkkkk");
    // setThumbnailFile(URL.createObjectURL(e.target.files[0]));
    // setInputs({
    //   ...inputs,
    //   ["image_thumbnail"]: e.target.files[0],
    // });
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

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    //console.log(typeof dateType, "dateType");
    setDate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let postData = {
      name: inputs.title,
      description: detailDescriptionCk,
      show_on_consultant: inputs.showOnConsultant,
    };

    setIsLoading(true);
    const result = await EditStripeListApi(postData, state.product_slug);
    if (result.code === 200) {
      //console.log(result, "result");
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      //console.log(result, "error case");
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
    setDetailDescriptionCk(state.description);
    setInputs({
      ...inputs,
      ["title"]: state.name,
      ["showOnConsultant"]: state.show_on_consultant,
    });
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(state, "state.object.action_by");

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
          <h2>Edit Product</h2>
        </div>
      </div>
      <div class="card main-card">
        <div class="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Name *"
                variant="outlined"
                fullWidth
                name="title"
                value={inputs.title}
                onChange={handleChange}
              />
            </div>
            {/* {state.action_by == "admin_user" ? (
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Consultant Access *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="showOnConsultant"
                value={inputs.showOnConsultant}
                label="Consultant Access *"
                onChange={handleChange}
              >
                <MenuItem value="no">No Access</MenuItem>
                <MenuItem value="list">Listing Access</MenuItem>
                <MenuItem value="all">All Access</MenuItem>
              </Select>
            </FormControl>
          </div>
        ) : (
          ""
        )} */}

            <div className="col-12 mt-5">
              <h4>Description</h4>
              <TinyEditor
                setDetailDescription={setDetailDescriptionCk}
                detailDescriptionCk={detailDescriptionCk}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-end mt-4">
        <button onClick={handleSubmit} className="small-contained-button">
          Submit
        </button>
      </div>
    </div>
  );
}
