import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, IconButton, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { s3baseUrl } from "src/config/config";
import ReactVideoPlayer from "../../components/ReactVideoPlayer/ReactVideoPlayer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import {
  deleteProgramme,
  programmeDetail,
} from "src/DAL/HelpingVideos/AdminHelpingVideos";
import {
  admin_videos_detail,
  admin_delete_videos,
} from "src/DAL/HelpingVideos/AdminHelpingVideos";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const ITEM_HEIGHT = 48;

export default function AdminVideoDetail() {
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isLoading, setIsLoading] = useState(false);

  const [programmeDetailInfo, setProgrammeDetailInfo] = useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);
  const handleNavigateEdit = (value) => {
    navigate(`/admin-videos/edit-admin-videos`, {
      state: state.detailValues,
    });
  };
  const handleDelete = async () => {
    let result = await admin_delete_videos(
      state.detailValues.helping_video_slug
    );
    if (result.code === 200) {
      handleCloseDelete();
      enqueueSnackbar(result.message, { variant: "success" });
      navigate("/admin-videos");
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleDetail = async () => {
    setIsLoading(true);
    let result = await admin_videos_detail(
      state.detailValues.helping_video_slug
        ? state.detailValues.helping_video_slug
        : params.id
    );
    if (result.code === 200) {
      setProgrammeDetailInfo(result.helpingvideo);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  useEffect(() => {
    // if (location.state !== null) {
    //   localStorage.setItem("program_name", location.state.name);
    //   localStorage.setItem("program_description", location.state.description);
    // }
    handleDetail();
    setTimeout(() => {}, 5000);
  }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <Container>
      <CustomConfirmation
        handleOpenDelete={handleOpenDelete}
        setOpen={setOpenDelete}
        handleCloseDelete={handleCloseDelete}
        handleAgree={handleDelete}
        open={openDelete}
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
        <div className="col-8">
          <h2>{programmeDetailInfo?.title}</h2>
        </div>
        <div className="col-4 text-end">
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
        </div>
      </div>

      <div className="row media-margin">
        <div className="col-12">
          {programmeDetailInfo?.video_url == "" ? (
            <img
              src={s3baseUrl + programmeDetailInfo.thumbnail_image.thumbnail_1}
            />
          ) : (
            <div className="row">
              <section className="container top-section-video mb-lg-3">
                <div className="row pt-70 mt-1">
                  <div className="col-2"></div>
                  <div className="col-8">
                    <ReactVideoPlayer url={programmeDetailInfo?.video_url} />
                  </div>
                  <div className="col-2"></div>
                </div>
              </section>
            </div>
            // <ReactVideoPlayer url={programmeDetailInfo?.video_url} />
          )}
        </div>
        {/* audio
        <div className="col-12 section-space">
          {programmeDetailInfo?.audio_file == "" ? (
            ""
          ) : (
            <audio
              className="w-100"
              src={s3baseUrl + programmeDetailInfo?.audio_file}
              controls
            />
          )}
        </div> */}
        <div className="col-12 section-space">
          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: programmeDetailInfo?.long_description,
              }}
            ></div>
          </p>
        </div>
      </div>
      <div className="row section-space">
        <div className="col-12"></div>

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
              width: "28ch",
            },
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleNavigateEdit} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Edit
          </MenuItem>
          <MenuItem onClick={handleOpenDelete} className="normal-font">
            <DeleteIcon className="me-3" height="10px" />
            Delete
          </MenuItem>
        </Menu>
      </div>
    </Container>
  );
}
