import { useFormik } from "formik";
import { useEffect, useState } from "react";
// material
import { CircularProgress } from "@mui/material";
//
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { admin_videos_listing } from "src/DAL/HelpingVideos/AdminHelpingVideos";
import Skeleton from "react-loading-skeleton";
import VideosSkeleton from "src/components/allSkeleton/VideosSkeleton";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ClientVideos() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [adminVideos, setAdminVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const programsList = async () => {
    const result = await admin_videos_listing("client");
    if (result.code == 200) {
      setIsLoading(false);
      setAdminVideos(result.helpingvideo);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleNavigateDetail = (value) => {
    navigate(
      `/client-portal-videos/client-videos-detail/${value.helping_video_slug}`,
      {
        state: { detailValues: value },
      }
    );
  };
  useEffect(() => {
    programsList();
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-7 col-sm-12">
          <h2>Client Portal Helping videos </h2>
        </div>
        <div className="col-lg-5 col-sm-12 text-end">
          <button
            onClick={() => navigate(`/client-portal-videos/add-client-videos`)}
            className="small-contained-button"
          >
            Add Client Videos
          </button>
        </div>
        {isLoading && <VideosSkeleton />}
        {adminVideos.map((value, index) => {
          return (
            <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
              <div className="card mt-4 pods-cards-shadow cursor h-100">
                <img
                  src={s3baseUrl + value.thumbnail_image.thumbnail_1}
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
                  <p className="programme-card-desc">
                    {htmlDecode(value.short_description)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
