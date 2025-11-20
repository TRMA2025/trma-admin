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
  clientSettingApi,
  updateClientDashboardSettingApi,
} from "src/DAL/ClientSetting/ClientSetting";
import { s3baseUrl } from "src/config/config";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import Skeleton from "react-loading-skeleton";
import SettingsSkelton from "src/components/allSkeleton/SettingsSkelton";

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

export default function ClientDashboardSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [oldImage, setOldImage] = React.useState();
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [footerLogo, setFooterLogo] = React.useState();
  const [brandFavIcon, setBrandFavIcon] = React.useState();
  const [detailDescriptionCks, setDetailDescriptionCks] = React.useState("");

  const [inputs, setInputs] = React.useState({
    UpcomingEventHeading: "",
    welcomeVideo: "",
    welcome_video_url: "",
    clientReviewsHeading: "",
    wellcome_text: "",
  });

  // const fileChangedHandler = (e) => {
  //   setProfileImage(URL.createObjectURL(e.target.files[0]));
  //   setInputs({
  //     ...inputs,
  //     ["image"]: e.target.files[0],
  //   });
  // };
  const fileChangedHandler = async (e, i) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    const name = e.target.name;
    setIsLoading(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["image"]: imageUpload.image_path,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
    // setProfileImage(URL.createObjectURL(e.target.files[0]));
  };
  const clientDashboardData = async () => {
    setIsLoading(true);
    const result = await clientSettingApi();
    if (result.code == 200) {
      let setting = result?.content_setting?.client_dashboard_setting;
      console.log(setting, "setting");
      setOldImage(setting?.cover_image_url);
      setDetailDescriptionCks(setting?.welcome_image);

      setInputs({
        ...inputs,
        ["UpcomingEventHeading"]: setting?.upcoming_events_heading,
        ["clientReviewsHeading"]: setting?.client_reviews_heading,
        ["welcomeVideo"]: setting?.video_type,
        ["welcome_video_url"]: setting?.video_url,
        ["wellcome_text"]: setting?.wellcome_text,
      });
      setIsLoading(false);
      setDetailDescriptionCk(setting?.live_section_text);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    s;
    let postData = {
      client_reviews_heading: inputs.clientReviewsHeading,
      upcoming_events_heading: inputs.UpcomingEventHeading,
      video_type: inputs.welcomeVideo,
      video_url: inputs.welcome_video_url,
      wellcome_text: inputs.wellcome_text,
      welcome_image: detailDescriptionCks,
    };

    let data = {
      client_dashboard_setting: postData,
    };

    setIsLoading(true);
    const result = await updateClientDashboardSettingApi(data);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
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
    clientDashboardData();
  }, []);

  // if (isLoading === true) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }

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
          <h2>Client Dashboard</h2>
        </div>
      </div>
      {isLoading ? (
        <SettingsSkelton />
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
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={200}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <form onSubmit={handleSubmit}>
          <div class="card main-card">
            <div class="card-body">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Video URL"
                    variant="outlined"
                    fullWidth
                    name="welcome_video_url"
                    value={inputs.welcome_video_url}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
             <TextField
               id="outlined-basic"
               label="Upcoming Event Heading"
               variant="outlined"
               fullWidth
               required
               name="UpcomingEventHeading"
               value={inputs.UpcomingEventHeading}
               onChange={handleChange}
             />
           </div> */}
                {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
             <TextField
               id="outlined-basic"
               label="Client Reviews Heading"
               variant="outlined"
               fullWidth
               required
               name="clientReviewsHeading"
               value={inputs.clientReviewsHeading}
               onChange={handleChange}
             />
           </div> */}
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Welcome Video *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="welcomeVideo"
                      value={inputs.welcomeVideo}
                      label="Welcome Video *"
                      onChange={handleChange}
                    >
                      <MenuItem value="once">Welcome Video For Once</MenuItem>
                      <MenuItem value="repeat">
                        Welcome Video Repeating
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Welcome Heading"
                    variant="outlined"
                    fullWidth
                    required
                    name="wellcome_text"
                    value={inputs.wellcome_text}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 mt-5">
                  <h4>Detail Description</h4>
                  <TinyEditor
                    setDetailDescription={setDetailDescriptionCks}
                    detailDescriptionCk={detailDescriptionCks}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-end mt-4">
            <button className="small-contained-button">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
}
