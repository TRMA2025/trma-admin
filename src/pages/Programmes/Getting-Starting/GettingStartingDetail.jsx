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
import { s3baseUrl } from "src/config/config";
import ReactVideoPlayer from "src/components/ReactVideoPlayer/ReactVideoPlayer";
import MenuOption from "src/components/MenuOption/MenuOptions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import {
  lessonDelete,
  lessonListingApi,
  lesson_detail_api,
} from "src/DAL/lessons/lessons";
import { useSnackbar } from "notistack";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import SubjectIcon from "@mui/icons-material/Subject";
import { deleteLessonApi } from "src/DAL/lessonDocument/LessonDocument";
import { makeStyles } from "@mui/styles";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import {
  Getting_starting_api,
  GettingStartingDeleteApi,
} from "src/DAL/gettingStarting/GettingStarting";

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

function GettingStartingDetail(props) {
  const id = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonDetailInfo, setLessonsDetailInfo] = useState();

  let programName = lessonDetailInfo?.program[0]?._id?.title;

  let program_slug_navgation = lessonDetailInfo?.program[0]?._id?.program_slug;
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },
    {
      title: programName,
      navigation: `/programmes/programmes-detail/${program_slug_navgation}`,
      active: false,
    },
    {
      title: "Getting Started",
      navigation: `/programmes/${program_slug_navgation}/getting-started-list`,
      active: false,
    },
    {
      title: lessonDetailInfo?.title,
      navigation: null,
      active: true,
    },
  ];
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

  const handleDelete = async (value) => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await GettingStartingDeleteApi(id.id);
    if (result.code === 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/programmes/${program_slug_navgation}/getting-started-list`);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleNavigateEdit = (value) => {
    navigate(
      `/programmes/${lessonDetailInfo.getting_started_slug}/edit-getting-started`,
      {
        state: lessonDetailInfo,
      }
    );
  };
  const handleNavigateRecordings = (value) => {
    navigate(
      `/programmes/getting-starting/${lessonDetailInfo.getting_started_slug}/getting-started-recording`
    );
  };
  const handleNavigateManageDoc = (value) => {
    navigate(
      `/programmes/getting-started/${lessonDetailInfo.getting_started_slug}/document`
    );
  };
  const handleNavigateGettingStartedEvaluation = (value) => {
    navigate(
      `/programmes/getting-started/${lessonDetailInfo.getting_started_slug}/evaluation`
    );
  };
  const handleDetail = async () => {
    setIsLoading(true);
    let result = await Getting_starting_api(id.id);
    if (result.code === 200) {
      setLessonsDetailInfo(result.getting_started);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  useEffect(() => {
    handleDetail();
  }, []);
  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  console.log(id, "idididid");
  return (
    <div className="container">
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete?"}
        handleAgree={handleDelete}
      />
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
      </div>

      <div className="row section-space">
        <div className="col-9">
          <h1 className="programmes-heading">{lessonDetailInfo?.title}</h1>
        </div>
        <div className="col-3 text-end">
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
                width: "40ch",
                fontSize: "12px",
              },
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={handleNavigateGettingStartedEvaluation}
              className="normal-font"
            >
              <HourglassEmptyIcon className="me-3" height="10px" /> Getting
              Started Evaluation
            </MenuItem>{" "}
            <MenuItem onClick={handleNavigateManageDoc} className="normal-font">
              <SubjectIcon className="me-3" height="10px" /> Manage Resources
            </MenuItem>{" "}
            <MenuItem
              onClick={handleNavigateRecordings}
              className="normal-font"
            >
              <VideoLibraryIcon className="me-3" height="10px" /> Manage
              Recordings
            </MenuItem>{" "}
            <MenuItem onClick={handleNavigateEdit} className="normal-font">
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
          {lessonDetailInfo?.landing_video_url == "" ? (
            <img
              width="100%"
              src={s3baseUrl + lessonDetailInfo?.images?.thumbnail_1}
            />
          ) : (
            <div className="row">
              <section className="container top-section-video mb-lg-3">
                <div className="row pt-70 mt-1">
                  <div className="col-2"></div>
                  <div className="col-8">
                    <ReactVideoPlayer
                      url={lessonDetailInfo?.landing_video_url}
                    />
                  </div>
                  <div className="col-2"></div>
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="col-12 mt-3 text-center">
          <div>
            {lessonDetailInfo?.audio_file == "" ? (
              ""
            ) : (
              <audio className="w-100" controls>
                <source
                  src={s3baseUrl + lessonDetailInfo?.audio_file}
                  type="audio/mp3"
                />
                <track
                  src="captions_en.vtt"
                  kind="captions"
                  srcLang="en"
                  label="english_captions"
                />
              </audio>
            )}
          </div>
        </div>
        <div
          className="col-12 section-space"
          style={{ backgroundColor: "#fff", padding: "20px" }}
        >
          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: lessonDetailInfo?.detailed_description,
              }}
            ></div>
          </p>
        </div>
      </div>
    </div>
  );
}

export default GettingStartingDetail;
