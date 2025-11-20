import React from "react";
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
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactPlayer from "react-player";
import RatingCard from "../../components/_dashboard/programmes/RatingCard";
import ProgrammRecording from "../../components/_dashboard/programmes/ProgrammeRecording";
import ResourcesCard from "../../components/_dashboard/programmes/ResourcesCard";

function ProgrammRecordingDetail(props) {
  const id = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  let word =
    "https://play-lh.googleusercontent.com/9kABykeGovHPy-dN19lRxxnCp8IZK3Pkl8qLFNxrEe-hhKVZeiyhTBEIRUt6t-vhxQ";
  let pdf =
    "https://play-lh.googleusercontent.com/3tLaTWjP9kz56OwkbnbAnZoNp4HL28zcDMt5DEjt-kfuVhraWJBYC5XQRuMBf084JQ";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <Container>
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button"
            onClick={() => handleNavigate()}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          {/* <button
            className="small-contained-button float-end"
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: location.state })}
          >
            Mark Complete
          </button> */}
        </div>
      </div>

      <div className="row section-space">
        <div className="col-12">
          <h1 className="programmes-heading">{location.state.name}</h1>
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
          <video width="100%" controls>
            <source src="https://vimeo.com/226053498" type="video/mp4" />
            <track
              src="captions_en.vtt"
              kind="captions"
              srcLang="en"
              label="english_captions"
            />
          </video>
        </div>
        {/* <div className="col-12 section-space">
          <button
            className="small-contained-button"
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: location.state })}
          >
            {"<<"} Previous
          </button>
          <button
            className="small-contained-button float-end"
            // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: location.state })}
          >
            Next >>
          </button>
        </div> */}

        <div className="col-12 mt-3 text-center">
          <div>
            {/* <p>Audio only</p> */}
            <audio className="w-100" controls>
              <source
                src="https://gaana.com/song/dance-meri-rani-1"
                type="audio/mp3"
              />
              <track
                src="captions_en.vtt"
                kind="captions"
                srcLang="en"
                label="english_captions"
              />
            </audio>
          </div>
        </div>
        <div className="col-12 section-space">
          {/* <p>{location.state.description}</p> */}
          <p>
            The Calm & Creative Collection focuses on the root cause; the
            subconscious mind. It will raise your level of awareness and
            understanding, which will dramatically transform your life. These
            tools will give you the knowledge and the exact process you need to
            apply it to your life. You’ll finally be able to take control and
            create what you desire. It is for anyone who wants calmness and
            serenity in their life, and it’s perfect for people that crave
            clarity and direction and are ready to uplevel their thinking and
            results.
          </p>
        </div>
        {/* <div className="col-12 section-space"></div> */}
      </div>
    </Container>
  );
}

export default ProgrammRecordingDetail;
