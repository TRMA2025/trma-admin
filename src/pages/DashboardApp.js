// material
import {
  Box,
  Grid,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { dashboardApi } from "src/DAL/Login/Login";
// components
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppWeeklySales,
} from "../components/_dashboard/app";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import DashboardTable from "src/components/_dashboard/DashboardTable";
import RecentMembersTable from "src/components/_dashboard/RecentMembers";
import DashboardCalenders from "src/components/_dashboard/DashboardCalender";
import { defaultSettingApi } from "src/DAL/SiteSetting/siteSetting";
import Page from "src/components/Page";
import AppTotalSales from "src/components/_dashboard/app/AppTotalSale";
import AppTotalTodaySale from "src/components/_dashboard/app/AppTotalTodaySale";
import DashboardCalendersNew from "src/components/_dashboard/DashboardCalenderNew";
import moment from "moment";
import {
  TIME_ZONE_CONVERSION,
  difference_between_two_dates,
  get_date_with_admin_time_zone,
} from "src/utils/constant";
import GeneralCalendar from "src/components/GeneralComponents/GeneralCalendar";
import Skeleton from "react-loading-skeleton";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
const get_view_dates = (calendarValue) => {
  let tool = calendarValue;
  // if(calendarValue=="month")

  const startOfMonth = moment().startOf(tool);
  // console.log(startOfMonth, "asfjlks");
  const daysToSubtract = startOfMonth.day() - 0; // 0 represents Sunday
  const previousSunday = startOfMonth.subtract(daysToSubtract, "days");
  let previousSundayDate = previousSunday.toDate();
  let add_days = 42;
  if (tool == "week") {
    add_days = 6;
  } else if (tool == "day") {
    add_days = 0;
  }
  let nextSaturday = startOfMonth.add(add_days, "days");
  let nextSaturdayDate = nextSaturday.toDate();
  if (tool == "day") {
    previousSundayDate = new Date();
    nextSaturdayDate = new Date();
  }

  return {
    start_date: previousSundayDate,
    end_date: nextSaturdayDate,
  };
};
export default function DashboardApp() {
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [currentDate, setCurrentDate] = useState(get_view_dates("month"));

  const [lessonCount, setLessonCount] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [programCount, setProgramCount] = useState("");
  const [programRecordingCount, setProgramRecordingCount] = useState("");
  const [recentLesson, setRecentLesson] = useState([]);
  const [generalInfo, setGeneralInfo] = useState();
  const [defaultTimeZone, setDefaultTimeValue] = useState();
  const [isCalenderLoading, setIsCalenderLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState("month");
  const [events, setEvents] = useState([]);

  const [inputs, setInputs] = useState({
    member_count: "",
    program_count: "",
    lesson_count: "",
    program_recording_count: "",
    recent_lesson: [],
    recent_member: [],
    events: [],
    total_transaction_amount: "",
  });
  const get_start_date_end_time = (date) => {
    return TIME_ZONE_CONVERSION(
      date,
      "YYYY-MM-DD HH:mm",
      defaultTimeZone,
      defaultTimeZone
    );
    return get_date_with_admin_time_zone(
      date,
      "YYYY-MM-DD HH:mm",
      defaultTimeZone
    );
  };
  const get_event_date = (date) => {
    return TIME_ZONE_CONVERSION(
      date,
      "YYYY-MM-DD",
      defaultTimeZone,
      defaultTimeZone
    );
    return get_date_with_admin_time_zone(date, "YYYY-MM-DD", defaultTimeZone);
  };

  const get_start_end_time = (date) => {
    return TIME_ZONE_CONVERSION(
      date,
      "HH:mm",
      defaultTimeZone,
      defaultTimeZone
    );
    return get_date_with_admin_time_zone(date, "HH:mm", defaultTimeZone);
  };
  const getSetting = async () => {
    const result = await defaultSettingApi();
    console.log(result, "result");
    if (result.code == 200) {
      setGeneralInfo(result?.default_setting);
    }
  };
  const getDashboard = async () => {
    let apiData = {
      start_date: moment(currentDate.start_date).format("YYYY-MM-DD"),
      end_date: moment(currentDate.end_date).format("YYYY-MM-DD"),
    };
    const difference = difference_between_two_dates(
      apiData.start_date,
      apiData.end_date,
      "days"
    );

    if (difference < 10) {
      setIsCalenderLoading(true);
    }
    const result = await dashboardApi(apiData);
    if (result.code == 200) {
      setInputs(result);
      let all_events = [];

      setDefaultTimeValue(result?.time_zone);
      setEvents(result?.events);
      setIsLoading(false);
      setIsCalenderLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
      setIsCalenderLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, [currentDate, defaultTimeZone]);
  useEffect(() => {
    getSetting();
  }, []);

  // if (isLoading === true) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }
  return (
    <Page title={generalInfo?.meta_title}>
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography className="welcome-back" variant="h4">
            Hi, Welcome back
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            {isLoading ? (
              <div
                className="card "
                style={{ borderRadius: "10px", width: "auto" }}
              >
                <Skeleton
                  height={250}
                  width={210}
                  highlightColor="#ddd"
                  baseColor="#fff"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            ) : (
              <AppTotalSales total={inputs?.total_transaction_amount} />
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {isLoading ? (
              <div className="card" style={{ borderRadius: "10px" }}>
                <Skeleton
                  height={250}
                  width={210}
                  highlightColor="#ddd"
                  baseColor="#fff"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            ) : (
              <AppWeeklySales total={inputs.program_recording_count} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {isLoading ? (
              <div className="card" style={{ borderRadius: "10px" }}>
                <Skeleton
                  height={250}
                  width={210}
                  highlightColor="#ddd"
                  baseColor="#fff"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            ) : (
              <AppNewUsers members={inputs.member_count} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {isLoading ? (
              <div className="card" style={{ borderRadius: "10px" }}>
                <Skeleton
                  height={250}
                  width={210}
                  highlightColor="#ddd"
                  baseColor="#fff"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            ) : (
              <AppItemOrders programs={inputs.program_count} />
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {isLoading ? (
              <div className="card" style={{ borderRadius: "10px" }}>
                <Skeleton
                  height={250}
                  width={210}
                  highlightColor="#ddd"
                  baseColor="#fff"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            ) : (
              <AppBugReports lesson={inputs.lesson_count} />
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            {isLoading ? (
              <div className="mt-4">
                <Skeleton
                  baseColor="#fff"
                  highlightColor="#ddd"
                  height={250}
                  width={450}
                  style={{ borderRadius: "10px" }}
                />
              </div>
            ) : (
              <RecentMembersTable recentMember={inputs.recent_member} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            {isLoading ? (
              <div className="mt-4">
                <Skeleton
                  baseColor="#fff"
                  highlightColor="#ddd"
                  height={250}
                  width={450}
                  style={{ borderRadius: "10px" }}
                />
              </div>
            ) : (
              <DashboardTable recentLesson={inputs.recent_lesson} />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={12}></Grid>
          <Grid item xs={12} sm={12} md={12}>
            <GeneralCalendar
              eventList={inputs.events}
              setCurrentDate={setCurrentDate}
              showAddEvent={false}
              time_zone={defaultTimeZone}
              currentDate={currentDate}
              isLoading={isCalenderLoading}
              setIsLoading={setIsCalenderLoading}
              reloadList={getDashboard}
              calendar_title="Calendar"
              hideArrowsAndButtons={true}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
