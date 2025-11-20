import { useEffect, useState } from "react";
// Material imports
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
// Custom components
import VideosSkeleton from "src/components/allSkeleton/VideosSkeleton";
import RecordNotFound from "src/components/RecordNotFound";
// Utility imports
import { admin_videos_listing } from "src/DAL/HelpingVideos/AdminHelpingVideos";
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";

// Styles
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function AdminVideos() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [adminVideos, setAdminVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const programsList = async () => {
    const result = await admin_videos_listing("admin");
    if (result.code === 200) {
      setAdminVideos(result.helpingvideo);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleNavigateDetail = (value) => {
    navigate(`/admin-videos/admin-videos-detail/${value.helping_video_slug}`, {
      state: { detailValues: value },
    });
  };

  useEffect(() => {
    programsList();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-7 col-sm-12">
          <h2>Admin Helping Videos</h2>
        </div>
        <div className="col-lg-5 col-sm-12 text-end">
          <button
            onClick={() => navigate(`/admin-videos/add-admin-videos`)}
            className="small-contained-button"
          >
            Add Admin Videos
          </button>
        </div>

        {isLoading ? (
          <VideosSkeleton />
        ) : adminVideos.length === 0 ? (
          <RecordNotFound title=" Admin Helping Videos" />
        ) : (
          adminVideos.map((value, index) => (
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
                  </div>
                  <p className="programme-card-desc">
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
