import React, { useEffect } from "react";
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
import {
  gratitudeDeleteApi,
  gratitudeDetailApi,
} from "src/DAL/gratitude/gratitudeApi";

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

function GratitudeDetail(props) {
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  let url = "https://www.youtube.com/watch?v=bU2NNFJ-UXA";
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isLoading, setIsLoading] = React.useState(false);

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
    //console.log(openDelete, "openDelete");
  };
  const handleCloseDelete = () => setOpenDelete(false);

  // const handleNavigateEdit = (value) => {
  //   navigate(`/programmes/edit-programme`, {
  //     state: { detailValues: value },
  //   });
  // };
  const handleNavigateEdit = (value) => {
    //console.log(programmeDetailInfo, "edit value");
    navigate(`/gratitude/edit-gratitude`, {
      state: state.detailValues,
    });
  };
  const handleNavigateGroup = (value) => {
    //console.log(state, "edit value");
    navigate(`/programmes/automated-group/${params.id}`, {
      state: state.detailValues,
    });
  };
  const handleDelete = async () => {
    //console.log(programmeDetailInfo._id, "state.program_slug");
    let result = await gratitudeDeleteApi(programmeDetailInfo._id);
    if (result.code === 200) {
      handleCloseDelete();
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleDetail = async () => {
    setIsLoading(true);
    let result = await gratitudeDetailApi(params.id);
    if (result.code === 200) {
      //console.log(result, "okokok");
      setProgrammeDetailInfo(result.general_gratitude);
      setIsLoading(false);
    } else {
      //console.log(result, "okokok");
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  //console.log(programmeDetailInfo, "programmeDetailInfoprogrammeDetailInfo");
  const handleNavigateDocs = () => {
    navigate(`/programmes/programm-resources/${params.id}`, {
      state: state.detailValues,
    });
  };
  const handleNavigateSection = () => {
    //console.log("ok");
    navigate(`/programmes/section/${params.id}`, {
      state: state.detailValues,
    });
  };
  const handleNavigateReviews = () => {
    //console.log("ok");
    navigate(`/programmes/reviews/${params.id}`, {
      state: state.detailValues,
    });
  };
  const handleLockedProgramInfo = () => {
    //console.log("ok");
    navigate(`/programmes/locked-programme/${params.id}`, {
      state: programmeDetailInfo,
    });
  };

  const getVideoUrl = () => {
    return "https://www.youtube.com/watch?v=bU2NNFJ-UXA";
  };
  //console.log(state.detailValues.program_slug, "state");

  useEffect(() => {
    if (location.state !== null) {
      localStorage.setItem("program_name", location.state.name);
      localStorage.setItem("program_description", location.state.description);
    }
    handleDetail();
  }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //console.log(params.id, "params");
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
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() =>
              navigate(`/programmes/lessons-listing/${program_slug}`, {
                state: { name: title, slug: program_slug },
              })
            }
          >
            View Lessons
          </button> */}
        </div>
      </div>
      <div className="row section-space">
        <div className="col-8">
          <h2>Gratitude Detail</h2>
        </div>
        <div className="col-4 text-end">
          {/* <MenuOption
            path={`/programmes/edit-programme`}
            editObject={state}
            handleNavigateEdit={handleNavigateEdit}
          /> */}
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
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
          {
            <img
              width="100%"
              src={
                s3baseUrl +
                programmeDetailInfo?.general_gratitude_image.thumbnail_1
              }
            />
          }
        </div>
        <div className="col-12 section-space">
          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: programmeDetailInfo?.general_gratitude_text,
              }}
            ></div>
          </p>
        </div>
      </div>

      <div className="row section-space">
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
              width: "15ch",
            },
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
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
  );
}

export default GratitudeDetail;
