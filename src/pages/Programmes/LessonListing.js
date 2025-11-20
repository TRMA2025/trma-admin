import PropTypes from "prop-types";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import faker from "faker";
// material
import {
  Box,
  Card,
  Container,
  Link,
  Typography,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import { lessonListingApi } from "src/DAL/lessons/lessons";
import { useEffect, useState } from "react";
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
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
const ProgrammesImgStyle = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

const Lessons = [
  {
    id: faker.datatype.uuid(),
    name: "Module 1: Secrets of Serenity",
    description:
      " Discover the 5 essential elements to quantum leap your results and create a repeatable winning formula. Freedom is a Mindset. Discover your Purpose",
  },
  {
    id: faker.datatype.uuid(),
    name: "Module 2 - Creative Consciousness",
    description:
      " Discover the 5 essential elements to quantum leap your results and create a repeatable winning formula. Freedom is a Mindset 2.Discover your Purpose. Success is a Habit. Lead in the New Economy",
  },
  {
    id: faker.datatype.uuid(),
    name: "Module 3: Abundance Accelerator",
    description:
      " Discover the 5 essential elements to quantum leap your results and create a repeatable winning formula.",
  },
];

// ----------------------------------------------------------------------

export default function LessonListing() {
  const id = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [lesson, setLesson] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },
    {
      title: `${id.slug}`,
      navigation: `/programmes/programmes-detail/${id.slug}`,
      active: false,
    },
    {
      title: "Programme Lessons",
      navigation: null,
      active: true,
    },
  ];
  console.log(breadCrumbMenu, "breadCrumbMenubreadCrumbMenubreadCrumbMenu");
  const getLessonsList = async () => {
    let result = await lessonListingApi(id.slug);
    console.log(result, "/lessons-listing");
    if (result.code == 200) {
      setIsLoading(false);
      console.log(result, "lessonListingApi");
      setLesson(result.lesson);
    }
  };
  useEffect(() => {
    getLessonsList();
  }, []);
  return (
    <>
      <div className="container">
        <div className="row mobile-margin display-flex">
          <div>
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          </div>
        </div>{" "}
        <div className=" text-end">
          <button
            className="small-contained-button"
            onClick={() =>
              navigate(`/programmes/add-lessons`, {
                state: id.slug,
              })
            }
          >
            Add Lesson
          </button>
        </div>
        <div className="row section-space">
          <div className="col-12">
            <h1>
              {state?.name ? state?.name : lesson[0]?.program[0]?._id?.title}
            </h1>
            {/* <h1>{state.slug}</h1> */}
          </div>
        </div>
        {isLoading && <CardSkeleton />}
        <div className="row">
          {lesson.length < 1 ? (
            <RecordNotFound title="Lessons" />
          ) : (
            lesson.map((x, i) => {
              // if (!x) return null;
              return (
                <>
                  <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={i}>
                    <div className="card mt-1 pods-cards-shadow cursor h-100">
                      {!x.status && (
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
                        src={s3baseUrl + x.lesson_images.thumbnail_1}
                        className="card-img-top pods-image"
                        alt="Lessons"
                        onClick={() =>
                          navigate(
                            `/programmes/lessons-detail/${x.lesson_slug}`,
                            {
                              state: x,
                            }
                          )
                        }
                      />
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12">
                            <h3
                              className="h2-heading"
                              // onClick={() => handleNavigateDetail(value)}
                              onClick={() =>
                                navigate(
                                  `/programmes/lessons-detail/${x.lesson_slug}`,
                                  {
                                    state: x,
                                  }
                                )
                              }
                            >
                              {htmlDecode(x.title)}
                            </h3>
                          </div>

                          <div className="col-2 menu-option">
                            {/* <CustomPopover menu={MENU_OPTIONS} data={value} /> */}
                          </div>
                        </div>
                        <p
                          className="programme-card-desc mb-3"
                          // onClick={() => handleNavigateDetail(value)}
                        >
                          {htmlDecode(x.short_description).substring(0, 250) +
                            "..."}
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
    </>
  );
}
