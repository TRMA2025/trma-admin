import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, IconButton, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { s3baseUrl } from "src/config/config";
import ReactVideoPlayer from "../../components/ReactVideoPlayer/ReactVideoPlayer";
import { admin_videos_detail } from "src/DAL/HelpingVideos/AdminHelpingVideos";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { meditation_detail_api } from "src/DAL/GrowthTools/GrowthTools";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function MeditaionVideoDetail() {
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [meditationDetail, setMeditationDetail] = useState();

  const handleDetail = async () => {
    setIsLoading(true);
    let result = await meditation_detail_api(params.id);
    if (result.code === 200) {
      setMeditationDetail(result.meditation);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  useEffect(() => {
    handleDetail();
  }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <Container>
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
        </div>
      </div>
      <div className="row section-space">
        <div className="col-8">
          <h2>{meditationDetail?.title}</h2>
        </div>
        <div className="col-4 text-end"></div>
      </div>

      <div className="row media-margin">
        <div className="col-12">
          {meditationDetail?.video_url == "" ? (
            <img
              src={s3baseUrl + meditationDetail.thumbnail_image.thumbnail_1}
            />
          ) : (
            <div className="row">
              <section className="container top-section-video mb-lg-3">
                <div className="row pt-70 mt-1">
                  <div className="col-2"></div>
                  <div className="col-8">
                    <ReactVideoPlayer url={meditationDetail?.video_url} />
                  </div>
                  <div className="col-2"></div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
