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
  Link,
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
import { get_root_value } from "src/utils/domUtils";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

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

function ProgrammesDetail(props) {
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
    // console.log(state, "edit value", params?.id);
    navigate(`/programmes/${params?.id}/edit-programme`, {
      state: params?.id,
    });
  };
  const handleNavigateGroup = (value) => {
    //console.log(state, "edit value");
    navigate(`/programmes/${params?.id}/automated-group`, {
      state: state?.detailValues,
    });
  };
  const handleDelete = async () => {
    //console.log(state.detailValues.program_slug, "state.program_slug");
    let result = await deleteProgramme(params?.id);
    if (result.code === 200) {
      handleCloseDelete();
      enqueueSnackbar(result.message, { variant: "success" });
      navigate("/programmes");
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      handleCloseDelete();
    }
  };
  const handleDetail = async () => {
    setIsLoading(true);
    let result = await programmeDetail(
      state?.detailValues.program_slug
        ? state?.detailValues.program_slug
        : params?.id
    );
    if (result.code === 200) {
      //console.log(result, "okokok");
      setProgrammeDetailInfo(result.program);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  //console.log(programmeDetailInfo, "programmeDetailInfoprogrammeDetailInfo");
  const handleNavigateDocs = () => {
    navigate(`/programmes/${params.id}/programm-resources`, {
      state: state?.detailValues,
    });
  };
  const handleNavigateSection = () => {
    //console.log("ok");
    navigate(`/programmes/${params.id}/section`, {
      state: state?.detailValues,
    });
  };
  const handleNavigateStage = () => {
    navigate(`/programmes/${params.id}/stages`, {
      state: state?.detailValues,
    });
  };
  const handleNavigateReviews = () => {
    //console.log("ok");
    navigate(`/programmes/${params.id}/reviews`, {
      state: state?.detailValues,
    });
  };
  const handleLockedProgramInfo = () => {
    //console.log("ok");
    navigate(`/programmes/${params.id}/locked-programme`, {
      state: programmeDetailInfo,
    });
  };
  const handleNavigateAdd = () => {
    navigate(`/programmes/${"add"}/${programmeDetailInfo._id}`, {
      state: programmeDetailInfo,
    });
  };
  const handleNavigateRemove = () => {
    navigate(`/programmes/${"remove"}/${programmeDetailInfo._id}`, {
      state: programmeDetailInfo,
    });
  };
  const handleManageMember = () => {
    navigate(`/programmes/members/${programmeDetailInfo._id}`, {
      state: programmeDetailInfo,
    });
  };
  const getVideoUrl = () => {
    return "https://www.youtube.com/watch?v=bU2NNFJ-UXA";
  };
  //console.log(state.detailValues.program_slug, "state");
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },

    {
      title: programmeDetailInfo?.title,
      navigation: null,
      active: true,
    },
  ];
  useEffect(() => {
    if (location.state !== null) {
      localStorage.setItem("program_name", location.state.name);
      localStorage.setItem("program_description", location.state.description);
    }
    handleDetail();
    setTimeout(() => {
      //console.log(get_root_value("--sidebars-background-color"), "test-var");
    }, 5000);
  }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(params, "params");
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
          <h2>{programmeDetailInfo?.title}</h2>
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
            <MoreVertIcon
              sx={{ fontWeight: 600, fontSize: "2rem", color: "white" }}
            />
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
          {programmeDetailInfo?.video_url == "" ? (
            <img
              className="image-style"
              src={s3baseUrl + programmeDetailInfo.program_images.thumbnail_1}
            />
          ) : (
            <div className="row">
              {/* <ReactVideoPlayer url={programmeDetailInfo?.video_url} /> */}
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
          )}
        </div>
        {programmeDetailInfo?.audio_file == "" ? (
          ""
        ) : (
          <div className="col-12 section-space">
            <audio
              className="w-100"
              src={s3baseUrl + programmeDetailInfo?.audio_file}
              controls
            />
          </div>
        )}

        <div className="col-12 section-space">
          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: programmeDetailInfo?.detailed_description,
              }}
            ></div>
          </p>
        </div>
      </div>

      <div className="row section-space">
        <div className="col-12">{/* <ProgrammDetailTab /> */}</div>

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
              width: "41ch",
            },
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            className="normal-font"
            onClick={() =>
              navigate(
                `/programmes/${programmeDetailInfo?.program_slug}/getting-started-list`,
                {
                  state: {
                    name: programmeDetailInfo?.title,
                    slug: programmeDetailInfo?.program_slug,
                  },
                }
              )
            }
          >
            <EditIcon className="me-3" height="10px" /> Manage Getting Started
          </MenuItem>
          <MenuItem onClick={handleNavigateDocs} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Manage Resources
          </MenuItem>
          <MenuItem onClick={handleNavigateSection} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Manage Sections
          </MenuItem>
          <MenuItem
            className="normal-font"
            onClick={() =>
              navigate(
                `/programmes/${programmeDetailInfo?.program_slug}/lessons-listing`,
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
          <MenuItem onClick={handleNavigateStage} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Manage Stages
          </MenuItem>
          <MenuItem onClick={handleManageMember} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Manage Member
          </MenuItem>
          {/* <MenuItem onClick={handleNavigateReviews} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Programme Reviews
          </MenuItem> */}
          <MenuItem onClick={handleNavigateGroup} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Automated Group
          </MenuItem>{" "}
          <MenuItem onClick={handleLockedProgramInfo} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Locked Programme Info
          </MenuItem>
          <MenuItem onClick={handleNavigateAdd} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Add Member Programme
            Access
          </MenuItem>
          <MenuItem onClick={handleNavigateRemove} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Remove Member Programme
            Access
          </MenuItem>
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

export default ProgrammesDetail;
