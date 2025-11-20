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
import PlayLessonIcon from "@mui/icons-material/PlayLesson";

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

function LessonsDetail(props) {
  const id = useParams();
  console.log(id, "ididid");
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
  console.log(program_slug_navgation, "dsfkhsdkjfha");
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
      title: "Lessons",
      navigation: `/programmes/${program_slug_navgation}/lessons-listing`,
      active: false,
    },
    {
      title: lessonDetailInfo?.title,
      navigation: null,
      active: true,
    },
    // {
    //   title: "Lesson Documents",
    //   navigation: ``,
    //   active: true,
    // },
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
    //console.log(id, "delete it ");
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteLessonApi(id.id);
    if (result.code === 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleNavigateEdit = (value) => {
    //console.log(lessonDetailInfo, "edit value");
    navigate(`/programmes/${lessonDetailInfo.lesson_slug}/edit-lessons`, {
      state: lessonDetailInfo,
    });
  };
  const handleNavigateRecordings = (value) => {
    //console.log(lessonDetailInfo, "edit value");
    navigate(`/programmes/lessons/${lessonDetailInfo.lesson_slug}/recordings`);
  };
  const handleNavigateManageDoc = (value) => {
    //console.log(lessonDetailInfo, "edit value");
    //console.log(lessonDetailInfo.lesson_slug, "edit slug");
    navigate(`/programmes/lesson/${lessonDetailInfo.lesson_slug}/lesson-doc`);
  };
  const handleNavigateManageLesson = (value) => {
    //console.log(lessonDetailInfo, "edit value");
    //console.log(lessonDetailInfo.lesson_slug, "edit slug");
    navigate(
      `/programmes/lesson/${lessonDetailInfo.lesson_slug}/lesson-evaliation`
    );
  };
  const handleNavigateSection = () => {
    //console.log("ok");
    navigate(`/programmes/lesson/${lessonDetailInfo.lesson_slug}/section`, {
      state: lessonDetailInfo,
    });
  };

  const handleDetail = async () => {
    setIsLoading(true);
    let result = await lesson_detail_api(id.id);
    if (result.code === 200) {
      // setlessonName(result.lesson.title);
      console.log(
        result.lesson,
        lessonDetailInfo,
        "dfaksdkjfhakdsjhfkjads",
        result?.lesson?.program[0]?._id?.program_slug
      );
      setLessonsDetailInfo(result.lesson);
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

  return (
    <div className="container">
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete Lesson?"}
        handleAgree={handleDelete}
      />
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          {/* <IconButton
            className="back-screen-button"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton> */}
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

          {/* <button
            className="small-contained-button float-end mt-1"
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: lessonDetailInfo })}
          >
            Mark Complete
          </button> */}
        </div>
      </div>

      <div className="row section-space">
        <div className="col-9">
          <h1 className="programmes-heading">{lessonDetailInfo?.title}</h1>
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
              onClick={handleNavigateManageLesson}
              className="normal-font"
            >
              <PlayLessonIcon className="me-3" height="10px" />
              Lesson's Evaluation
            </MenuItem>{" "}
            <MenuItem onClick={handleNavigateManageDoc} className="normal-font">
              <SubjectIcon className="me-3" height="10px" /> Manage Resources
            </MenuItem>{" "}
            <MenuItem
              onClick={handleNavigateRecordings}
              className="normal-font"
            >
              <VideoLibraryIcon className="me-3" height="10px" /> Manage
              Recording
            </MenuItem>{" "}
            <MenuItem onClick={handleNavigateSection} className="normal-font">
              <EditIcon className="me-3" height="10px" /> Manage Sections
            </MenuItem>
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
          {lessonDetailInfo?.landing_lesson_video_url == "" ? (
            <img
              width="100%"
              src={s3baseUrl + lessonDetailInfo?.lesson_images.thumbnail_1}
            />
          ) : (
            <div className="row">
              {/* <ReactVideoPlayer
                url={lessonDetailInfo?.landing_lesson_video_url}
              /> */}
              <section className="container top-section-video mb-lg-3">
                <div className="row pt-70 mt-1">
                  <div className="col-2"></div>
                  <div className="col-8">
                    <ReactVideoPlayer
                      url={lessonDetailInfo?.landing_lesson_video_url}
                    />
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
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: lessonDetailInfo })}
          >
            {"<<"} Previous
          </button>
          <button
            className="small-contained-button float-end"
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: lessonDetailInfo })}
          >
            Next >>
          </button>
        </div> */}

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

export default LessonsDetail;
