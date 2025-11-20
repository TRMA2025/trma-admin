import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GroupListSection from "./ProgrammeList";
import ConsultantProgrammeList from "./ProgrammeList";
import { consultantGroupDetail } from "src/DAL/consultant/consultant";
import { useParams } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { stubTrue } from "lodash";
import ConsultantMemberList from "./ConsultantMemberList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import ConsultantAllMemberList from "./ConsultantAllMemberList";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

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
export default function ConsultantGroupDetail() {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const params = useParams();
  const [group, setGroup] = React.useState();
  const [groupPrograms, setGroupPrograms] = React.useState([]);
  const [groupMembers, setGroupMembers] = React.useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  let breadCrumbMenu = [
    {
      title: "Groups",
      navigation: `/calendar-groups`,
      active: false,
    },

    {
      title: group?.title,
      navigation: null,
      active: true,
    },
  ];
  const groupDetail = async () => {
    setIsLoading(true);
    const result = await consultantGroupDetail(params.id);
    if (result.code == 200) {
      console.log(result, "dfksdjlkfjklasdfl");
      setGroup(result?.group);
      setGroupPrograms(result.group_programs);
      setGroupMembers(result.group_members);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    groupDetail();
  }, []);
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex mb-2">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

          {/* <IconButton
            className="back-screen-button me-2 mb-4"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton>
          <div className="mt-1">
            <h2>{group?.title}</h2>
          </div> */}
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label=" Program List"
                {...a11yProps(0)}
                sx={{ color: "#000" }}
              />
              <Tab
                label="Member List"
                {...a11yProps(1)}
                sx={{ color: "#000" }}
              />
              <Tab
                label="All Member List"
                {...a11yProps(2)}
                sx={{ color: "#000" }}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ConsultantProgrammeList groupPrograms={groupPrograms} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ConsultantMemberList groupMembers={groupMembers} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ConsultantAllMemberList groupMembers={groupMembers} />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
}
