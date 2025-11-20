import React, { useEffect } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { Container, CircularProgress } from "@mui/material";
import ReactVideoPlayer from "../../components/ReactVideoPlayer/ReactVideoPlayer";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import { challenges_recordings_detail_api } from "src/DAL/GrowthTools/Challenges";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ChallengeRecordingDetail() {
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [programmeDetailInfo, setProgrammeDetailInfo] = React.useState();

  const handleDetail = async () => {
    console.log("hndle detail  called.........");
    setIsLoading(true);
    let result = await challenges_recordings_detail_api(params?.id);
    console.log(result, "result result");
    console.log(result, "................");
    if (result.code === 200) {
      setProgrammeDetailInfo(result.challenge_recording);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  console.log(
    programmeDetailInfo,
    "programmeDetailInfoprogrammeDetailInfoprogrammeDetailInfo"
  );
  let breadCrumbMenu = [
    {
      title: "Challenge Recordings",
      navigation: -1,
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
  console.log(
    programmeDetailInfo,
    "programmeDetailInfoprogrammeDetailInfoprogrammeDetailInfo after"
  );
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <Container>
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
      </div>
      <div className="row section-space">
        <div className="col-8">
          <h2>{programmeDetailInfo?.title}</h2>
        </div>
      </div>

      <div className="row media-margin">
        <div className="col-12">
          <div className="row">
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
        </div>

        <div className="col-12 section-space">
          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: programmeDetailInfo?.description,
              }}
            ></div>
          </p>
        </div>
      </div>
    </Container>
  );
}
