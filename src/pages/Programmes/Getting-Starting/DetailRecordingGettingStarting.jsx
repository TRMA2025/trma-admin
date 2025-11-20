import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactPlayer from "react-player";
import ReactVideoPlayer from "src/components/ReactVideoPlayer/ReactVideoPlayer";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { s3baseUrl } from "src/config/config";
import {
  GettingREcordingDetailApi,
  GettingStratingDelte,
} from "src/DAL/gettingStarting/GettingStarting";
import { useSnackbar } from "notistack";
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

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

function Getting_Starting_Recording_Detail(props) {
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
    let result = await GettingREcordingDetailApi(params.slug);
    if (result.code === 200) {
      setIsLoading(false);
      setRecording(result?.recording);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleAgree = async () => {
    let result = await GettingStratingDelte(params.slug);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleNavigateEdit = (value) => {
    navigate(`/programmes/${params.slug}/edit-getting-started-ecording`, {
      state: value,
    });
  };
  const handleNavigateRecordings = () => {
    navigate(`/programmes/lessons/${location.state.lesson_slug}/recordings`);
  };
  useEffect(() => {
    detailRecording();
  }, []);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

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
        </div>
      </div>

      <div className="row section-space">
        <div className="col-9">
          <h1 className="programmes-heading">{recording.title}</h1>
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
          {recording.video_url ? (
            <div className="row">
              <section className="container top-section-video mb-lg-3">
                <div className="row pt-70 mt-1">
                  <div className="col-2"></div>
                  <div className="col-8">
                    <ReactVideoPlayer url={recording?.video_url} />
                  </div>
                  <div className="col-2"></div>
                </div>
              </section>
            </div>
          ) : (
            <img
              src={s3baseUrl + recording.recording_image?.thumbnail_1}
              alt="Recording Thumbnail"
            />
          )}
        </div>

        {recording.audio_recording && (
          <div className="col-12 mt-3 text-center">
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
        )}

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

export default Getting_Starting_Recording_Detail;
