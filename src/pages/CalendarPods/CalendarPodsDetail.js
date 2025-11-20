import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
// import ConsultantMemberList from "./ConsultantMemberList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import MemberGroupsList from "../Members/MembersGroupList";
import CalendarDetailGroupList from "./GroupList";
import CalendarDetailMemberList from "./MemberList";
import CalendarDetailRoomUserList from "./RoomUserList";
import { podsDetailApi } from "src/DAL/Pods/pods";
import ZoomDetail from "./ZoomDetail";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
// import CalendarGroupProgrammeList from "./ProgrammeList";
// import CalendarMemberList from "./MemberList";

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
export default function CalendarPodsDetail() {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const params = useParams();
  const [groupList, setGroupList] = React.useState([]);
  const [memberList, setMemberList] = React.useState([]);
  const [roomUsers, setRoomUsers] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleNavigateAddUser = () => {
    navigate(`/meetings/add-meeting-user/${state.room_slug}`, {
      state: state,
    });
  };

  let breadCrumbMenu = [
    {
      title: "Meetings",
      navigation: `/meetings`,
      active: false,
    },

    {
      title: state?.title,
      navigation: null,
      active: true,
    },
  ];
  const getDetail = async () => {
    setIsLoading(true);
    const result = await podsDetailApi(state?.room_slug);

    setMemberList(result?.room?.member);
    setRoomUsers(result?.room?.room_user);
    setGroupList(result.room_groups);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getDetail();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex">
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
            {/* <IconButton
              className="back-screen-button  me-2"
              onClick={() => navigate(-1)}
            >
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton>
            <div className="col-12">
              <h2>{state?.title}</h2>
            </div> */}
          </div>

          {/* {state?.room_type == "automated" && ( */}
          <button
            className="small-contained-button float-end"
            onClick={handleNavigateAddUser}
          >
            Add Room User
          </button>
          {/* )} */}
        </div>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "#9f98a3" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="Group List"
                {...a11yProps(0)}
                sx={{ color: "#000" }}
              />
              <Tab
                label="Member List"
                {...a11yProps(1)}
                sx={{ color: "#000" }}
              />
              <Tab
                label="Zoom Credentials"
                {...a11yProps(2)}
                sx={{ color: "#000" }}
              />
              <Tab
                label="Room Users"
                {...a11yProps(3)}
                sx={{ color: "#000" }}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <CalendarDetailGroupList groupList={groupList} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CalendarDetailMemberList memberList={memberList} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ZoomDetail zoomObject={state} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <CalendarDetailRoomUserList roomUsers={roomUsers} />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
}
