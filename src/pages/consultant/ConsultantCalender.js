import React, { useState, useEffect } from "react";
// import FormsDrewer from "../../components/FormsDrewer/FormsDrewer";

import "@fullcalendar/daygrid/main.css";
import moment from "moment";

import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";

import { new_event_list_api } from "src/DAL/Events/events";

import DashboardCalendersNew from "src/components/_dashboard/DashboardCalenderNew";
import GeneralCalendar from "src/components/GeneralComponents/GeneralCalendar";
import { event_listing_by_consultant } from "src/DAL/consultant/consultant";
import { useLocation, useParams } from "react-router-dom";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
// import CustomDrawer from "src/components/FormsDrewer/CustomDrawer";
// import { _get_content_setting_localStorage } from "src/DAL/localStorage/localStorage";
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
function ConsultantCalenders(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const params = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const [defaultTimeZone, setDefaultTimeZone] = useState("");
  const [selectedTool, setSelectedTool] = useState("month");
  const [currentDate, setCurrentDate] = useState(get_view_dates("month"));

  const getEventListing = async () => {
    if (selectedTool !== "month") {
      setIsLoading(true);
    }
    let postData = {
      start_date: moment(currentDate.start_date).format("YYYY-MM-DD"),
      end_date: moment(currentDate.end_date).format("YYYY-MM-DD"),
      default_calendar_value: selectedTool,
    };
    const result = await event_listing_by_consultant(
      postData.start_date,
      postData.end_date,
      params.id
    );
    if (result.code === 200) {
      let all_events = [];
      setDefaultTimeZone(result?.time_zone);

      setEvents(result.event);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEventListing();
  }, [currentDate]);
  let breadCrumbMenu = [
    {
      title: "Success Ambassador",
      navigation: `/consultant`,
      active: false,
    },
    {
      title: state
        ? state?.fullName + " (" + state?.email + ")"
        : "Consultant Events",
      active: true,
    },
  ];
  const content_setting = "";
  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  console.log(state, "eventeventeventeventeventevent");

  return (
    <>
      <div className="container mb-3">
        <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
      </div>

      <GeneralCalendar
        eventList={events}
        setCurrentDate={setCurrentDate}
        showAddEvent={false}
        time_zone={defaultTimeZone}
        currentDate={currentDate}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        reloadList={getEventListing}
        calendar_title="Consultant Events"
      />
    </>
    // <DashboardCalendersNew
    //   defaultTimeZone={defaultTimeZone}
    //   eventList={events}
    //   isLoading={isLoading}
    //   setIsLoading={setIsLoading}
    //   setCurrentDate={setCurrentDate}
    //   currentDate={currentDate}
    //   selectedTool={selectedTool}
    //   setSelectedTool={setSelectedTool}
    //   getEventListing={getEventListing}
    //   showAddEvent={true}
    // />
  );
}

export default ConsultantCalenders;
