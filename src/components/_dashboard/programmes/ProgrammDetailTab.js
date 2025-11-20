import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography, Card } from "@mui/material";
import Box from "@mui/material/Box";
import ReactPlayer from "react-player";
import RatingCard from "./RatingCard";
import ProgrammRecording from "./ProgrammeRecording";
import LessonsCard from "./LessonsCard";
import ResourcesCard from "./ResourcesCard";
import { useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProgrammDetailTab() {
  const [value, setValue] = React.useState(0);
  let word =
    "https://play-lh.googleusercontent.com/9kABykeGovHPy-dN19lRxxnCp8IZK3Pkl8qLFNxrEe-hhKVZeiyhTBEIRUt6t-vhxQ";
  let pdf =
    "https://play-lh.googleusercontent.com/3tLaTWjP9kz56OwkbnbAnZoNp4HL28zcDMt5DEjt-kfuVhraWJBYC5XQRuMBf084JQ";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Lessons" {...a11yProps(0)} />
          <Tab label="Recordings" {...a11yProps(1)} />
          <Tab label="Resources" {...a11yProps(2)} />
          <Tab label="Reviews" {...a11yProps(3)} />
          <Tab label="Bob Video" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="row">
          <div className="col-12 mt-3">
            <LessonsCard />
          </div>
          <div className="col-12 mt-3">
            <LessonsCard />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="row">
          <div className="col-12 mt-3">
            <ProgrammRecording />
          </div>
          <div className="col-12 mt-3">
            <ProgrammRecording />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
            <ResourcesCard imageLink={pdf} />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
            <ResourcesCard imageLink={word} />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
            <ResourcesCard imageLink={pdf} />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
            <ResourcesCard imageLink={word} />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div className="row mt-3">
          <div className="col-12">
            <h2>WHAT OUR CLIENTS SAY</h2>
            <p className="normal-font">
              It is for anyone who wants calmness and serenity in their life,
              and it’s perfect for people that crave clarity and direction and
              are ready to uplevel their thinking and results.
            </p>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <RatingCard />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <RatingCard />
          </div>
          <div className=" col-lg-4 col-md-6 col-sm-12 mt-4">
            <RatingCard />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <div className="row mt-3">
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
          <div className="col-12 text-left section-space">
            <p className="program-font-size">
              The Calm & Creative Collection focuses on the root cause; the
              subconscious mind. It will raise your level of awareness and
              understanding, which will dramatically transform your life. These
              tools will give you the knowledge and the exact process you need
              to apply it to your life. You’ll finally be able to take control
              and create what you desire. It is for anyone who wants calmness
              and serenity in their life, and it’s perfect for people that crave
              clarity and direction and are ready to uplevel their thinking and
              results.
            </p>
          </div>
        </div>
      </TabPanel>
    </Box>
  );
}
