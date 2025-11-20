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
import { addVaultCategoryApi, editVaultCategoryApi } from "src/DAL/Vault/vault";
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

export default function EditVaultCategory() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [oldImage, setOldImage] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [imageStatus, setImageStatus] = useState(false);
  const [programList, setProgramList] = React.useState([]);

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "",
    image: {},
  });
  console.log(state, "statestatestate");
  const {
    status,
    vault_description,
    vault_image,
    vault_slug,
    vault_title,
    program,
  } = state;

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
  const getProgramListing = async () => {
    const result = await programmeActiveListing();
    setIsLoading(true);
    if (result.code === 200) {
      console.log(result, "getProgramListing");
      setProgramList(result.program);
      // setProgramName(result.program[0].program_slug);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setImageStatus(true);
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const audioFileChange = (e) => {
    //console.log("clicked");
    setAudio(e.target.files[0]);
  };
  const handleProgramName = (data) => {
    setProgramName(data?.program_slug);
  };
  const handleVaultName = (data) => {
    setVaultName(data.vault_slug);
  };
  const handldeDeleteAudio = () => {
    setAudio();
    //console.log("reset State");
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
    //console.log(detailDescriptionCk, "lolololo");
    e.preventDefault();
    if (!detailDescriptionCk) {
      enqueueSnackbar("detail description is required ", {
        variant: "error",
      });
      return;
    }
    if (inputs.days < 0) {
      enqueueSnackbar("No of days must be positive number ", {
        variant: "error",
      });
    } else {
      const formData = new FormData();
      formData.append("vault_title", inputs.title);
      formData.append("vault_description", detailDescriptionCk);
      // formData.append(
      //   "program_slug",
      //   programName == undefined ? "" : programName
      // );
      formData.append("status", inputs.status);
      if (imageStatus == true) {
        formData.append("image", inputs.image);
      }
      //console form data
      // console.log(...formData, "form Data value");

      setIsLoading(true);
      const result = await editVaultCategoryApi(formData, vault_slug);
      if (result.code === 200) {
        //console.log(result, "result");
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
      } else {
        //console.log(result, "error case");
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
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
    // getNavItemList();
    getProgramListing();
  }, []);
  React.useEffect(() => {
    setOldImage(vault_image.thumbnail_1);
    setDetailDescriptionCk(vault_description);
    setProgramName(program?.program_slug);
    setInputs((prevState) => ({
      ...prevState,
      ["title"]: vault_title,
      ["status"]: status,
    }));
  }, []);

  //   console.log(typeof audioFile, "values of audio to be send ");

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //console.log(detailDescriptionCk, "detailDescriptionCk");

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
          <h2>Edit Category</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Category Title"
                  variant="outlined"
                  fullWidth
                  required
                  name="title"
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Status </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    required
                    value={inputs.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Programme</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={programName}
              label="Programme"
              onChange={handleChangeProgram}
            >
              {programList.map((program, i) => {
                return (
                  <MenuItem key={i} value={program?.program_slug}>
                    {program.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div> */}

              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Image *</p>
                    <FormHelperText className="pt-0">
                      Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {file ? (
                      <img className="image-border" src={file} height="50" />
                    ) : (
                      oldImage && (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldImage}
                          height="50"
                        />
                      )
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
                        className="small-contained-button-search"
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
                <h4>Detail Description *</h4>
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
