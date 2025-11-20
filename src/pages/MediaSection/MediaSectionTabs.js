import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MediaBrandsList from "./MediaBrandsList";
import MediaPodcastList from "./MediaPodcastList";
import MediaArticlesList from "./MediaArticlesList";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { mediaListingApi } from "src/DAL/MediaSection/mediaSection";

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
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function MediaSections() {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const navigate = useNavigate();
  const [brandsList, setBrandsList] = React.useState([]);
  const [podcastList, setPodcastList] = React.useState([]);
  const [articleList, setArticleList] = React.useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleNavigate = () => {
    navigate(`/media-section/add-media`);
  };
  const getMediaSection = async () => {
    setIsLoading(true);

    try {
      const result = await mediaListingApi();
      if (result.code === 200) {
        // result.media_section.map((media) => {
        //   if (media.media_type == "brand") {
        //     brandsList.push(media);
        //   } else if (media.media_type == "newsletter") {
        //     articleList.push(media);
        //   } else if (media.media_type == "podcast") {
        //     podcastList.push(media);
        //   }
        // });
        const data = result.media_section.map((media) => {
          return {
            id: media._id,
            name: media.title,
            profile: media.image,
            order: media.order,
            status: media.status,
            object: media,
          };
        });
        setUserList(data);
        setIsLoading(false);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    // getMediaSection();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(podcastList, brandsList, articleList, "listss");
  return (
    <div className="container mt-2">
      <div className="row">
        <div className="col-lg-8 col-sm-12">
          <h2>Media Section</h2>
        </div>
        <div className="col-lg-4 col-sm-12 text-end">
          <button onClick={handleNavigate} className="small-contained-button">
            Add Media Section
          </button>
        </div>
      </div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Brands" {...a11yProps(0)} />
            <Tab label="Podcasts" {...a11yProps(1)} />
            <Tab label="New Articles" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <MediaBrandsList type="brand" />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MediaPodcastList type="podcast" />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <MediaArticlesList type="newsletter" />
        </TabPanel>
      </Box>
    </div>
  );
}
