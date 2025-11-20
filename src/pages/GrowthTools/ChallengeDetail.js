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
import { challenges_detail_api } from "src/DAL/GrowthTools/GrowthTools";

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

export default function ChallengeDetail() {
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
    let result = await challenges_detail_api(params?.id);
    if (result.code === 200) {
      setProgrammeDetailInfo(result.challenge);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  //console.log(programmeDetailInfo, "programmeDetailInfoprogrammeDetailInfo");
  const handleNavigateDocs = () => {
    navigate(`/challenge-resources/${params.id}`, {
      state: programmeDetailInfo,
    });
  };
  const handleNavigateRecordings = () => {
    navigate(`/challenge-recordings/${params.id}`, {
      state: programmeDetailInfo,
    });
  };
  let breadCrumbMenu = [
    {
      title: "Challenges",
      navigation: `/challenges`,
      active: false,
    },

    {
      title: programmeDetailInfo?.title,
      navigation: null,
      active: true,
    },
  ];
  useEffect(() => {
    handleDetail();
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
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
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
            onClick={handleClick}>
            <MoreVertIcon sx={{ fontWeight: 600, fontSize: "2rem" }} />
          </IconButton>
        </div>
      </div>

      <div className="row media-margin">
        <div className="col-12">
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

        <div className="col-12 section-space">
          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: programmeDetailInfo?.detail_description,
              }}></div>
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
              width: "41ch",
            },
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}>
          <MenuItem onClick={handleNavigateDocs} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Manage Resources
          </MenuItem>
          <MenuItem onClick={handleNavigateRecordings} className="normal-font">
            <EditIcon className="me-3" height="10px" /> Manage Recordings
          </MenuItem>
        </Menu>
      </div>
    </Container>
  );
}
