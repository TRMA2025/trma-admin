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
import { AddKReplyApi } from "src/DAL/member/member";
import { project_name } from "src/config/config";
import TinyEditor from "src/components/ckeditor/Ckeditor";
// import { ProgramListing } from "src/DAL/Program/Programs";
// import { AddRecording } from "src/DAL/Recording/Recordings";
// import { get_root_value } from "src/utils/domUtils";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
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

export default function AddKimsReply({ goalDetail }) {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState({});
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programList, setProgramList] = React.useState([]);
  const [vaultList, setVaultList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  //console.log(params, "params");

  const [inputs, setInputs] = React.useState({
    title: "",
    zoomLink: "",
    status: "",
    recordingStatus: "true",
    program: "",
    image: {},
    password: "",
    areaCode: "",
    videoUrl: "",
    groups: [],
    members: [],
    short_description: "",
    detailed_description: "",
    video_show_Status: "",
  });

  //   const getProgramListing = async () => {
  //     const result = await ProgramListing();
  //     setIsLoading(true);
  //     if (result.code === 200) {
  //       console.log(result, "getProgramListing");
  //       setProgramList(result.program);
  //       setProgramName(result.program[0].program_slug);
  //       setIsLoading(false);
  //     } else {
  //       enqueueSnackbar(result.message, { variant: "error" });
  //       setIsLoading(false);
  //     }
  //   };
  //   const getVaultList = async () => {
  //     const result = await VaultListing();
  //     if (result.code === 200) {
  //       console.log(result, "result");
  //       setVaultList(result.vault_category);
  //       setVaultName(result.vault_category[0].vault_slug);
  //     }
  //   };

  const fileChangedHandler = (e) => {
    //console.log(e.target.files[0]);
    // setProfileImage(e.target.files[0]);
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const audioFileChange = (e) => {
    //console.log(e.target.files[0]);
    setAudio(e.target.files[0]);
  };
  const handleProgramName = (data) => {
    //console.log(data, "programName");
    setProgramName(data.program_slug);
  };
  const handleVaultName = (data) => {
    //console.log(data, "Name");
    setVaultName(data.vault_slug);
  };
  const handldeDeleteAudio = () => {
    //console.log("deleteAudio");
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
    //console.log(typeof dateType, "dateType");
    setDate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("member_id", params.id);
    formData.append("message", detailDescriptionCk);
    if (audioFile) {
      formData.append("audio_file", audioFile);
    }

    //console form data
    for (var value of formData.values()) {
      //console.log(value, "form data value");
    }

    setIsLoading(true);
    const result = await AddKReplyApi(formData);
    if (result.code === 200) {
      //console.log(result, "result");
      enqueueSnackbar(result.message, { variant: "success" });
      goalDetail();
      setIsLoading(false);
    } else {
      //console.log(result);
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeProgram = (e) => {
    //console.log(e, "handleChangeProgram");
    setProgramName(e.target.value);
  };
  const handleChangeVault = (event) => {
    //console.log(event.target.value, "handleChangeVault");
    setVaultName(event.target.value);
  };

  const handleChange = (event) => {
    //console.log(event.target.value);
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    // getProgramListing();
    // getVaultList();
  }, []);
  //   //console.log(typeof audioFile, "values of audio to be send ");
  //console.log(programList, "programListprogramList");
  //console.log(programName, "programName");

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mt-5">
          <div className="col-12 mt-5">
            <h4></h4>
            <TinyEditor
              setDetailDescription={setDetailDescriptionCk}
              detailDescriptionCk={detailDescriptionCk}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Audio</p>
                <FormHelperText className="pt-0">
                  Audio mp3 (max 200mb)
                </FormHelperText>
              </div>
              <div className="col-2">
                {audioFile && (
                  <DeleteIcon
                    onClick={handldeDeleteAudio}
                    className="mt-3 icon-color"
                  />
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="audio">
                  <Input
                    accept="audio/mp3,audio/*;capture=microphone"
                    id="audio"
                    multiple
                    name="audio"
                    type="file"
                    onChange={audioFileChange}
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
            <p className="text-secondary">{audioFile && audioFile.name}</p>
          </div>
        </div>

        <div className="text-end mt-4">
          <button onClick={handleSubmit} className="small-contained-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
