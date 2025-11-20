import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import RecordNotFound from "src/components/RecordNotFound";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import { GettingStartingApi } from "src/DAL/gettingStarting/GettingStarting";
import Skeleton from "react-loading-skeleton";

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

// ----------------------------------------------------------------------

export default function GettingStarting() {
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
      title: "Programme Getting Started",
      navigation: null,
      active: true,
    },
  ];
  const getLessonsList = async () => {
    let result = await GettingStartingApi(id.slug);
    if (result.code == 200) {
      setIsLoading(false);
      setLesson(result.getting_started);
    }
  };

  useEffect(() => {
    getLessonsList();
  }, []);
  if (isLoading) {
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
                    // style={{ marginBottom: 10 }}
                    className="programme-card-desc mb-3"
                    baseColor="#dddde8"
                    highlightColor="#ffffff"
                  />
                  <Skeleton
                    height={20}
                    width="60%"
                    baseColor="#dddde8"
                    highlightColor="#ffffff"
                    // className="programme-card-desc mb-3"
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
    <>
      <div className="container">
        <div className="row mobile-margin display-flex">
          <div>
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          </div>
        </div>{" "}
        <div
          className=" col-12 mt-3 mb-0"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <h1>
              {state?.name ? state?.name : lesson[0]?.program[0]?._id?.title}
            </h1>
          </div>
          <div>
            <button
              className="small-contained-button"
              onClick={() =>
                navigate(`/programmes/add-getting-started`, {
                  state: id.slug,
                })
              }
            >
              Add Getting Started
            </button>
          </div>
        </div>
        <div className="row section-space">
          <div className="col-12"></div>
        </div>
        <div className="row">
          {lesson.length < 1 ? (
            <RecordNotFound title="Getting Started" />
          ) : (
            lesson.map((x, i) => {
              return (
                <>
                  <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={i}>
                    <div className="card  pods-cards-shadow cursor h-100">
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
                        src={s3baseUrl + x.images?.thumbnail_1}
                        className="card-img-top pods-image"
                        alt="Lessons"
                        onClick={() =>
                          navigate(
                            `/programmes/getting-started-detail/${x.getting_started_slug}`,
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
                              onClick={() =>
                                navigate(
                                  `/programmes/getting-started-detail/${x.getting_started_slug}`,
                                  {
                                    state: x,
                                  }
                                )
                              }
                            >
                              {htmlDecode(x.title)}
                            </h3>
                          </div>

                          <div className="col-2 menu-option"></div>
                        </div>
                        <p className="programme-card-desc mb-3">
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
