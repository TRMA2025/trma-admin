import { useFormik } from "formik";
import { useEffect, useState } from "react";
// material
import {
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { programmeListing } from "src/DAL/Programme/Programme";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { lesson_detail_api, recordingListApi } from "src/DAL/lessons/lessons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RecordNotFound from "src/components/RecordNotFound";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import {
  Getting_starting_api,
  GettingStartingrecordingListApi,
} from "src/DAL/gettingStarting/GettingStarting";
import Skeleton from "react-loading-skeleton";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function GettingStartingRecordingListing() {
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(true);
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
      navigation: `/programmes/getting-started-detail/${params.slug}`,
      active: false,
    },
    {
      title: "Recordings",
      navigation: null,
      active: true,
    },
  ];
  const formik = useFormik({
    initialValues: {
      gender: "",
      category: "",
      colors: "",
      priceRange: "",
      rating: "",
    },
    onSubmit: () => {
      setOpenFilter(false);
    },
  });

  const { resetForm, handleSubmit } = formik;
  const recordingList = async () => {
    const result = await GettingStartingrecordingListApi(params.slug);
    if (result.code == 200) {
      setIsLoading(false);
      setRecordings(result?.recordings);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleNavigateDetail = (value) => {
    navigate(
      `/programmes/${value?.recording_slug}/getting-started-recording-detail`,
      {
        state: { detailValues: value },
      }
    );
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };
  const handleDetail = async () => {
    setIsWaiting(true);
    let result = await Getting_starting_api(params.slug);
    if (result.code === 200) {
      setLessonsDetailInfo(result.getting_started);

      // setIsWaiting(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  useEffect(() => {
    recordingList();
    handleDetail();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // Run this effect only once after the component mounts

  if (isWaiting) {
    return (
      <div className="container mt-2">
        <div className="row">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
              <div className="card mt-1 pods-cards-shadow cursor h-100">
                <Skeleton
                  height={200}
                  className="card-img-top pods-image"
                  baseColor="#dddde8"
                  highlightColor="#ffffff"
                />
                <div className="card-body">
                  <Skeleton
                    height={30}
                    width="80%"
                    style={{ marginBottom: 10 }}
                    className="h2-heading"
                    baseColor="#dddde8"
                    highlightColor="#9F00FF"
                  />

                  <Skeleton
                    height={20}
                    width="90%"
                    className="programme-card-desc mb-3"
                    baseColor="#dddde8"
                    highlightColor="#ffffff"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-3">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
        <div className="col-lg-7 col-sm-12">
          <h2>Getting Started Recordings </h2>
        </div>
        <div className="col-lg-5 col-sm-12 text-end">
          <button
            onClick={() =>
              navigate(`/programmes/${params.slug}/add-getting-recording`)
            }
            className="small-contained-button"
          >
            Add Recording
          </button>
        </div>
        {recordings?.length < 1 && isLoading ? (
          <RecordNotFound title="Recordings" />
        ) : (
          recordings.map((value, index) => {
            return (
              <>
                <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
                  <div className="card mt-4 pods-cards-shadow cursor h-100">
                    {!value.status && (
                      <div
                        className="inactive-badge"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          backgroundColor: "red",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "16px 0 10px 0",
                          zIndex: 1,
                        }}
                      >
                        Inactive
                      </div>
                    )}
                    <img
                      src={s3baseUrl + value.recording_image.thumbnail_1}
                      className="card-img-top pods-image"
                      alt=""
                      onClick={() => handleNavigateDetail(value)}
                    />
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <h3
                            className="h2-heading"
                            onClick={() => handleNavigateDetail(value)}
                          >
                            {htmlDecode(value.title)}
                          </h3>
                        </div>

                        <div className="col-2 menu-option"></div>
                      </div>
                      <p className="programme-card-desc mb-3">
                        {htmlDecode(value.short_description)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            );
          })
        )}
      </div>
    </div>
  );
}
