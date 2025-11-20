import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactPlayer from "react-player";
import RatingCard from "../../components/_dashboard/programmes/RatingCard";
import ProgrammRecording from "../../components/_dashboard/programmes/ProgrammeRecording";
import ResourcesCard from "../../components/_dashboard/programmes/ResourcesCard";
import { s3baseUrl } from "src/config/config";
import ReactVideoPlayer from "src/components/ReactVideoPlayer/ReactVideoPlayer";
import MenuOption from "src/components/MenuOption/MenuOptions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import {
  lessonDelete,
  lessonRecordingDelete,
  recordingDetailApi,
} from "src/DAL/lessons/lessons";
import { useSnackbar } from "notistack";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import SubjectIcon from "@mui/icons-material/Subject";
import LessonRecordingListing from "./LessonRecordingListing";
import { makeStyles } from "@mui/styles";

const ITEM_HEIGHT = 48;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

function LessonRecordingDetail(props) {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [recording, setRecording] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
    setAnchorEl(null);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const detailRecording = async () => {
    let result = await recordingDetailApi(params.slug);
    if (result.code == 200) {
      setIsLoading(false);
      //console.log(result.recording, "ikkkkkkk");
      setRecording(result.recording);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleAgree = async () => {
    //console.log("clicked");
    let result = await lessonRecordingDelete(params.slug);
    if (result.code == 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleNavigateEdit = (value) => {
    navigate(`/programmes/${params.slug}/edit-lessons-recording`, {
      state: value,
    });
  };
  const handleNavigateRecordings = (value) => {
    //console.log(location.state, "edit value");
    navigate(`/programmes/lessons/${location.state.lesson_slug}/recordings`);
  };
  useEffect(() => {
    detailRecording();
  }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  //console.log(params, "params");
  return (
    <Container>
      <CustomConfirmation
        handleOpenDelete={handleClickOpenDelete}
        handleCloseDelete={handleCloseDelete}
        handleAgree={handleAgree}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          {/* <button
            className="small-contained-button float-end mt-1"
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: location.state })}
          >
            Mark Complete
          </button> */}
        </div>
      </div>

      <div className="row section-space">
        <div className="col-9">
          <h1 className="programmes-heading">{recording.title}</h1>
        </div>
        <div className="col-3 text-end">
          {/* <MenuOption /> */}
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon
              sx={{ fontWeight: 600, fontSize: "2rem", color: "white" }}
            />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 6.5,
                width: "30ch",
                fontSize: "12px",
              },
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => handleNavigateEdit(recording)}
              className="normal-font"
            >
              <EditIcon className="me-3" height="10px" /> Edit
            </MenuItem>
            <MenuItem onClick={handleClickOpenDelete} className="normal-font">
              <DeleteIcon className="me-3" height="10px" />
              Delete
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className="row media-margin">
        <div className="col-12">
          {/* <ReactPlayer
            controls
            playIcon
            url="https://vimeo.com/226053498"
            width="100%"
            className="custom-video-player"
            pip
            stopOnUnmount
            playsinline
            volume={0}
            muted={0}
          /> */}
          {/* <video width="100%" controls>
            <source src="https://vimeo.com/226053498" type="video/mp4" />
            <track
              src="captions_en.vtt"
              kind="captions"
              srcLang="en"
              label="english_captions"
            />
          </video> */}
          {recording.video_url == "" ? (
            <img src={s3baseUrl + recording.recording_image.thumbnail_1} />
          ) : (
            // <ReactVideoPlayer url={recording.video_url} />
            <div className="row">
              <section className="container top-section-video mb-lg-3">
                <div className="row pt-70 mt-1">
                  <div className="col-2"></div>
                  <div className="col-8">
                    <ReactVideoPlayer url={recording.video_url} />
                  </div>
                  <div className="col-2"></div>
                </div>
              </section>
            </div>
          )}
        </div>
        {/* <div className="col-12 section-space">
          <button
            className="small-contained-button"
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: location.state })}
          >
            {"<<"} Previous
          </button>
          <button
            className="small-contained-button float-end"
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: location.state })}
          >
            Next >>
          </button>
        </div> */}

        <div className="col-12 mt-3 text-center">
          <div>
            {/* <p>Audio only</p> */}
            <audio className="w-100" controls>
              <source
                src={s3baseUrl + recording.audio_recording}
                type="audio/mp3"
              />
              <track
                src="captions_en.vtt"
                kind="captions"
                srcLang="en"
                label="english_captions"
              />
            </audio>
          </div>
        </div>
        <div className="col-12 section-space">
          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: recording.short_description,
              }}
            ></div>
          </p>
        </div>
      </div>
    </Container>
  );
}

export default LessonRecordingDetail;
