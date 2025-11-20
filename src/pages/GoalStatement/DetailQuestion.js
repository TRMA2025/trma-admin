import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MemberList from "./MemberListing";
import GroupList from "./GroupListing";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { getDetailQuestion } from "src/DAL/goalstatement/goalStatement";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import TotalMembers from "./AllMember";

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
export default function DetailQuestion() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const [groups, setGroups] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [goalMembers, setGoalMembers] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questionStatement, setQuestionStatement] = useState("");
  const [totalMembersList, setTotalMembersList] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const DetailQuestion = async () => {
    const result = await getDetailQuestion(params.id);
    if (result.code === 200) {
      console.log(result, "okokok");
      setGroups(result.goal_statement_groups);
      setMembers(result.goal_statement.goal_statement_user);
      setGoalMembers(result.goal_statement.member);
      setQuestionStatement(result.goal_statement.question_statement);

      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    DetailQuestion();
  }, []);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <div className="container">
      <div className="row">
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
        <div className="col-12 text-center">
          <h2>{questionStatement}</h2>
        </div>
      </div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Member List" {...a11yProps(0)} />
            <Tab label="Group List" {...a11yProps(1)} />
            <Tab label="All Members " {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <MemberList members={goalMembers} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <GroupList groups={groups} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TotalMembers members={members} goalMembers={members} />
        </TabPanel>
      </Box>
    </div>
  );
}
