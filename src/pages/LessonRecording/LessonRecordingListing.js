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
// components
import Page from "../../components/Page";
import {
  ProgrammesSort,
  ProgrammesList,
  ProgrammesCartWidget,
  ProgrammesFilterSidebar,
  ProgrammesCard,
} from "../../components/_dashboard/programmes";
//
import PRODUCTS from "../../_mocks_/products";
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
import Skeleton from "react-loading-skeleton";
import CardSkeleton from "src/components/cardSkeletons/CardSkeleton";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function LessonRecordingListing() {
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [waiting, setWaiting] = useState(true);
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
      title: "Lessons",
      navigation: `/programmes/${program_slug_navgation}/lessons-listing`,
      active: false,
    },
    {
      title: lessonDetailInfo?.title,
      navigation: `/programmes/lessons-detail/${params.slug}`,
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
    setWaiting(true); // Start loading
    try {
      const result = await recordingListApi(params.slug);
      //console.log(result, "kkkkkkkkkkk");
      if (result.code === 200) {
        setRecordings(result.recording);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while fetching recordings.", {
        variant: "error",
      });
      console.error(error);
    } finally {
      // setIsLoading(false); // Stop loading
    }
  };

  const handleNavigateDetail = (value) => {
    //console.log(value, "valueeeee");
    navigate(`/programmes/${value.recording_slug}/lesson-recording-detail`, {
      state: { detailValues: value },
    });
  };
  const handleAddNavigate = (row) => {
    console.log(row, "rowrowrow");
    navigate(`/programmes/${params.slug}/add-lesson-recording`);
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
    setIsLoading(true);
    let result = await lesson_detail_api(params.slug);
    if (result.code === 200) {
      setLessonsDetailInfo(result.lesson);

      setIsLoading(false);
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
      setWaiting(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Run this effect only once after the component mounts

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-3">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
        <div className="col-lg-7 col-sm-12">
          <h2>Recordings </h2>
        </div>
        <div className="col-lg-5 col-sm-12 text-end">
          <button
            onClick={handleAddNavigate}
            className="small-contained-button"
          >
            Add Recording
          </button>
        </div>
        {waiting ? (
          <CardSkeleton />
        ) : recordings.length === 0 ? (
          <RecordNotFound title="Recordings" />
        ) : (
          recordings.map((value, index) => (
            <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
              <div className="card mt-1 pods-cards-shadow cursor h-100">
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
                        onClick={() => handleNavigateDetail(value)}
                        className="h2-heading"
                      >
                        {htmlDecode(value.title)}
                      </h3>
                    </div>
                  </div>
                  <p className="programme-card-desc mb-3">
                    {htmlDecode(value.short_description)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
