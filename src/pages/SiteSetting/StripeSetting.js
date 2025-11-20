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
import { AddProgrammeApi } from "src/DAL/Programme/Programme";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { addQuotesApi } from "src/DAL/quotes/Quotes";
import {
  addCampaignApi,
  addSandGrid,
  addStripeApi,
  siteSettingApi,
} from "src/DAL/SiteSetting/siteSetting";
import Skeleton from "react-loading-skeleton";
import SmallSettingSkeleton from "src/components/allSkeleton/SmallSettingSkeleton";

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

export default function AddStripeSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
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

  const [inputs, setInputs] = React.useState({
    key: "Active Campaign",
    secretKey: "",
    publishKey: "",
    livesSecretKey: "",
    stripeMode: "",
  });
  const siteSettingData = async () => {
    setIsLoading(true);
    const result = await siteSettingApi();
    if (result.code == 200) {
      //console.log(result, "siteSettingApi");
      setInputs({
        ...inputs,
        ["key"]: result?.site_setting?.sandBox_publish_key,
        ["secretKey"]: result?.site_setting?.sandBox_secret_key,
        ["publishKey"]: result?.site_setting?.live_publish_key,
        ["livesSecretKey"]: result?.site_setting?.live_secret_key,
        ["stripeMode"]: result?.site_setting?.stripe_mode,
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    //console.log(detailDescriptionCk, "lolololo");
    e.preventDefault();

    let postData = {
      sandBox_publish_key: inputs.key,
      sandBox_secret_key: inputs.secretKey,
      live_publish_key: inputs.publishKey,
      live_secret_key: inputs.livesSecretKey,
      stripe_mode: inputs.stripeMode,
    };

    //console form data

    setIsLoading(true);
    const result = await addStripeApi(postData);
    if (result.code === 200) {
      //console.log(result, "result");
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    } else {
      //console.log(result, "error case");
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
    siteSettingData();
  }, []);
  //   //console.log(typeof audioFile, "values of audio to be send ");

  //console.log(detailDescriptionCk, "detailDescriptionCk");

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          {/* <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton> */}
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
          <h2>Stripe Setting</h2>
        </div>
      </div>
      {isLoading ? (
        <SmallSettingSkeleton />
      ) : (
        // <div class="card main-card">
        //   <div class="card-body">
        //     <div className="row mt-2 ">
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <>
          <div class="card main-card">
            <div class="card-body">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Sandbox Publish Key"
                    variant="outlined"
                    fullWidth
                    required
                    aria-readonly
                    name="key"
                    value={inputs.key}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Sandbox Secret Key "
                    variant="outlined"
                    fullWidth
                    required
                    aria-readonly
                    name="secretKey"
                    value={inputs.secretKey}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Live Publish Key"
                    variant="outlined"
                    fullWidth
                    required
                    name="publishKey"
                    value={inputs.publishKey}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Live Secret Key"
                    variant="outlined"
                    fullWidth
                    required
                    name="livesSecretKey"
                    value={inputs.livesSecretKey}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Stripe Mode"
            variant="outlined"
            fullWidth
            required
            name="stripeMode"
            value={inputs.stripeMode}
            onChange={handleChange}
          />
        </div> */}
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Stripe Mode *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="stripeMode"
                      value={inputs.stripeMode}
                      label="Stripe Mode *"
                      onChange={handleChange}
                    >
                      <MenuItem value="sandBox">SandBox</MenuItem>
                      <MenuItem value="live">Live</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
          <div className="text-end mt-4">
            <button onClick={handleSubmit} className="small-contained-button">
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
}
