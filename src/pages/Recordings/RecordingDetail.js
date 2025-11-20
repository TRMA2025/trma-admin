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
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactPlayer from "react-player";
import RatingCard from "../../components/_dashboard/programmes/RatingCard";
import ProgrammDetailTab from "../../components/_dashboard/programmes/ProgrammDetailTab";
import { s3baseUrl } from "src/config/config";
import ReactVideoPlayer from "../../components/ReactVideoPlayer/ReactVideoPlayer";
import { htmlDecode } from "src/utils/convertHtml";
import MenuOption from "src/components/MenuOption/MenuOptions";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { deleteProgramme, programmeDetail } from "src/DAL/Programme/Programme";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import DocumentModelBox from "src/components/ModelBox/DocumentModelBox";
import EmbedResource from "src/components/resourceCard/EmbedResource";

const options = [
  "None",
  "Atria",
  "Callisto",
  "Dione",
  "Ganymede",
  "Hangouts Call",
  "Luna",
  "Oberon",
  "Phobos",
  "Pyxis",
  "Sedna",
  "Titania",
  "Triton",
  "Umbriel",
];
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const ITEM_HEIGHT = 48;

function ProgrammeRecordingDetail(props) {
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  let url = "https://www.youtube.com/watch?v=bU2NNFJ-UXA";
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewDoc, setPreviewDoc] = React.useState("");
  const [open, setOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  console.log(state, "state state scnz.......");
  let breadCrumbMenu = [
    {
      title: "Programme Recordings",
      navigation: `/recording-list`,
      active: false,
    },

    {
      title: state?.title,
      navigation: null,
      active: true,
    },
  ];
  const [programmeDetailInfo, setProgrammeDetailInfo] = React.useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleOpenDelete = () => {
    setOpenDelete(true);
    console.log(openDelete, "openDelete");
  };
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpen = (value) => {
    console.log(value, "value..............");
    console.log(value, "==== value ====");
    let path = "";
    setDocumentType(value.document_type);
    setPreviewDoc(value);
    path = value.document_file_url;
    setImageUrl(s3baseUrl + path);
    console.log(s3baseUrl + path, "s3baseUrl + path");
    setOpen(true);
  };

  // const handleNavigateEdit = (value) => {
  //   navigate(`/programmes/edit-programme`, {
  //     state: { detailValues: value },
  //   });
  // };
  const handleNavigateEdit = (value) => {
    console.log(state, "edit value");
    navigate(`/programmes/edit-programme`, {
      state: state.detailValues,
    });
  };
  const handleNavigateGroup = (value) => {
    console.log(state, "edit value");
    navigate(`/programmes/${params.id}/automated-group`, {
      state: state.detailValues,
    });
  };
  const handleCloseImage = () => {
    setImageUrl("");
    setOpen(false);
  };

  console.log(programmeDetailInfo, "programmeDetailInfoprogrammeDetailInfo");
  const handleNavigateDocs = () => {
    navigate(`/programmes/${params.id}/programm-resources`, {
      state: state.detailValues,
    });
  };
  const handleNavigateSection = () => {
    console.log("ok");
    navigate(`/programmes/${params.id}/section`, {
      state: state.detailValues,
    });
  };
  const handleNavigateReviews = () => {
    console.log("ok");
    navigate(`/programmes/${params.id}/reviews`, {
      state: state.detailValues,
    });
  };
  const handleLockedProgramInfo = () => {
    console.log("ok");
    navigate(`/programmes/${params.id}/locked-programme`, {
      state: programmeDetailInfo,
    });
  };

  const getVideoUrl = () => {
    return "https://www.youtube.com/watch?v=bU2NNFJ-UXA";
  };

  //   useEffect(() => {
  //     if (location.state !== null) {
  //       localStorage.setItem("program_name", location.state.name);
  //       localStorage.setItem("program_description", location.state.description);
  //     }
  //   }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(params, "params");
  return (
    <>
      <Container>
        <div className="row mobile-margin display-flex">
          <div className="col-12">
            {/* <IconButton
            className="back-screen-button"
            onClick={() => navigate(-1)}>
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton> */}
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          </div>
        </div>
        <div className="row section-space">
          <div className="col-8">
            <h2>{state?.title}</h2>
          </div>
        </div>

        <div className="row media-margin">
          <div className="col-12">
            {state?.type === "video" && state?.video_url ? (
              <div className="row">
                <section className="container top-section-video mb-lg-3">
                  <div className="row pt-70 mt-1">
                    <div className="col-2"></div>
                    <div className="col-8">
                      <ReactVideoPlayer url={state.video_url} />
                    </div>
                    <div className="col-2"></div>
                  </div>
                </section>
              </div>
            ) : state?.type === "embed_code" ? (
              <>
                <div className="html-embed-resource">
                  <EmbedResource htmlCode={state?.embed_code} />
                </div>
              </>
            ) : null}
          </div>
          <div className="col-12 section-space">
            {state?.audio_recording == "" ? (
              ""
            ) : (
              <audio
                className="w-100"
                src={s3baseUrl + state?.audio_recording}
                controls
              />
            )}
          </div>
          <div className="col-12 description-style section-space">
            <p>
              <div
                dangerouslySetInnerHTML={{
                  __html: state?.short_description,
                }}
              ></div>
            </p>
          </div>
        </div>

        <div className="row section-space">
          <div className="col-12">{/* <ProgrammDetailTab /> */}</div>
          {/* <div className="col-12 mt-4 text-center">
          <Divider />
        </div> */}
          {/* <div className="col-12 mt-4">
          <ReactPlayer
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
          />
        </div> */}
          {/* <div className="col-12 mt-5 text-center">
          <Divider />
        </div> */}
          {/* <div className="row">
          <div className="col-12 mt-4 text-center">
            <span className="feedback-programme">WHAT OUR CLIENTS SAY</span>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <RatingCard />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <RatingCard />
          </div>
          <div className=" col-lg-4 col-md-6 col-sm-12 mt-4">
            <RatingCard />
          </div>
        </div> */}
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
            <MenuItem onClick={handleNavigateDocs}>
              <EditIcon className="me-3" height="10px" /> Manage Resources
            </MenuItem>
            <MenuItem onClick={handleNavigateSection}>
              <EditIcon className="me-3" height="10px" /> Manage Sections
            </MenuItem>
            <MenuItem
              onClick={() =>
                navigate(
                  `/programmes/lessons-listing/${programmeDetailInfo?.program_slug}`,
                  {
                    state: {
                      name: programmeDetailInfo?.title,
                      slug: programmeDetailInfo?.program_slug,
                    },
                  }
                )
              }
            >
              <EditIcon className="me-3" height="10px" /> Manage Lessons
            </MenuItem>
            <MenuItem onClick={handleNavigateReviews}>
              <EditIcon className="me-3" height="10px" /> Programme Reviews
            </MenuItem>
            <MenuItem onClick={handleNavigateGroup}>
              <EditIcon className="me-3" height="10px" /> Automated Group
            </MenuItem>{" "}
            <MenuItem onClick={handleLockedProgramInfo}>
              <EditIcon className="me-3" height="10px" /> Locked Programme Info
            </MenuItem>
            <MenuItem onClick={handleNavigateEdit}>
              <EditIcon className="me-3" height="10px" /> Edit
            </MenuItem>
            <MenuItem onClick={handleOpenDelete}>
              <DeleteIcon className="me-3" height="10px" />
              Delete
            </MenuItem>
          </Menu>
        </div>
      </Container>
    </>
  );
}

export default ProgrammeRecordingDetail;
