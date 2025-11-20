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
  lockedProgramInfo,
} from "src/DAL/Programme/Programme";
import { s3baseUrl } from "src/config/config";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

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


export default function LockedProgram() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useLocation();
  const { slug } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [oldImage, setOldImage] = React.useState();
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [imageStatus, setImageStatus] = React.useState(false);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "",
    image: {},
    videoUrl: "",
    short_description: "",
    detailed_description: "",
  });
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },
    {
      title: `${slug}`,
      navigation: `/programmes/programmes-detail/${slug}`,
      active: false,
    },
    {
      title: "Locked Programme",
      navigation: null,
      active: true,
    },
  ];
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
    setProgramName(data.program_slug);
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
    e.preventDefault();
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
    } else {
      const formData = new FormData();
      formData.append("video_url", inputs.videoUrl);
      formData.append("short_description", inputs.short_description);
      formData.append("detailed_description", detailDescriptionCk);
      if (imageStatus) {
        formData.append("locked_programme_image", inputs.image);
      }

      //console form data
      //console.log(...formData, "form data");

      setIsLoading(true);
      const result = await lockedProgramInfo(formData, slug);
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
    getNavItemList();
  }, []);
  React.useEffect(() => {
    let data = params?.state?.locked_program_info;
    setOldImage(data.image);
    //console.log(data, "kkkkkkkkkkkkk");
    setDetailDescriptionCk(data.detailed_description);
    setInputs((input) => ({
      ...input,
      ["videoUrl"]: data.video_url,
      ["short_description"]: data.short_description,
      ["detailed_description"]: data.detailed_description,
    }));
  }, []);

  //   //console.log(typeof audioFile, "values of audio to be send ");

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //console.log(params.state.locked_program_info, "inputs.days");

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12 mb-2">
          {/* <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton> */}
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

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
          <h2>Locked Programme</h2>
        </div>
      </div>
      <div class="card main-card">
        <div class="card-body">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Locked Main Video URL"
                variant="outlined"
                fullWidth
                name="videoUrl"
                value={inputs.videoUrl}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
              <div className="row w-100 div-style ms-0 pt-0">
                <div className="col-5">
                  <p className="">Upload Image </p>
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
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Short Description "
                  multiline
                  rows={6}
                  name="short_description"
                  value={inputs.short_description}
                  onChange={handleChange}
                />
                <FormHelperText>Maximum limit 500 characters</FormHelperText>
              </FormControl>
            </div>
            {/* <div className="col-12 mt-5">
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-flexible"
              label="Detail Description "
              multiline
              rows={6}
              name="detailed_description"
              value={inputs.detailed_description}
              onChange={handleChange}
            />
          </FormControl>
        </div> */}
            <div className="col-12 mt-5">
              <h4>Detail Description</h4>
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
