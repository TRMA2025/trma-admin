import React, { useState, useEffect } from "react";
// import FormsDrewer from "../../components/FormsDrewer/FormsDrewer";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Tooltip from "@mui/material/Tooltip";
import "@fullcalendar/daygrid/main.css";
import moment from "moment";
// import AddEvent from "./AddEvents";
// import EventDetail from "./EventDetail";
// import { eventsListing } from "src/DAL/Calendar/Calendar";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import { eventListApi } from "src/DAL/Events/events";
import {
  get_date_with_admin_time_zone,
  get_date_with_user_time_zone,
} from "src/utils/constant";
import { defaultSettingApi } from "src/DAL/SiteSetting/siteSetting";
import { dashboardApi } from "src/DAL/Login/Login";
import EventDetail from "src/pages/Calender/EventDetail";
// import CustomDrawer from "src/components/FormsDrewer/CustomDrawer";
// import { _get_content_setting_localStorage } from "src/DAL/localStorage/localStorage";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

function DashboardCalenders({ eventsList, defaultTimeValue }) {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [eventDetailData, setEventDetailData] = useState([]);
  const [imgUrl, setimgUrl] = useState("");
  const [isOpenImage, setisOpenImage] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [editDrawerState, setEditDrawerState] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerState, setDrawerState] = useState(false);
  const classes = useStyles();
  const [defaultTimeZone, setDefaultTimeZone] = useState("");

  const handleOpenDrawer = () => {
    setDrawerState(true);
  };
  const handleOpenEditDrawer = () => {
    setEditDrawerState(true);
  };

  const handleCloseDrawer = () => {
    setDrawerState(false);
  };
  const handleCloseEditDrawer = () => {
    setEditDrawerState(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowImageDialog = (url) => {
    setisOpenImage(!isOpenImage);
    setisOpen(!isOpen);
    //console.log("url", url);
    setimgUrl(url);
  };
  const handleShowDialog = () => {
    setisOpen(!isOpen);
  };

  const handleCloseDialog = () => {
    setisOpen(false);
    setisOpenImage(false);
  };
  const handleNavigateListEvent = () => {
    navigate("/calender/event-list");
  };

  const eventDetail = (event) => {
    setEventDetailData(event);
    setEditDrawerState(true);
  };
  const renderEventContent = (eventInfo) => {
    return (
      <Tooltip title={eventInfo.event?.title}>
        <div
          className="calender-events-box"
          onClick={() => eventDetail(eventInfo.event._def.extendedProps)}
        >
          <b
            className="calender-events-text"
            style={{
              backgroundColor: eventInfo.event._def.extendedProps.event_color,
            }}
          >
            {eventInfo.event.title.length > 15
              ? `${eventInfo.event.title.substring(0, 15)}...`
              : eventInfo.event.title}
          </b>
        </div>
      </Tooltip>
    );
  };
  const getDefaultSetting = async () => {
    // const result = await defaultSettingApi();
    // if (result.code === 200) {
    //   moment.tz.setDefault(result?.default_setting?.time_zone);
    //   setDefaultTimeZone(result?.default_setting?.time_zone);
    //   setIsLoading(false);
    // }
  };
  // const getDashboard = async () => {
  //   const result = await dashboardApi();
  //   if (result.code == 200) {
  //     console.log(result, "resultDashboard");
  //     setIsLoading(false);
  //   } else {
  //     enqueueSnackbar(result.message, { variant: "error" });
  //     setIsLoading(false);
  //   }
  // };

  const getEventsList = (event) => {
    const { start_date, recurring_type, recurring_iteration } = event;
    let datesArray = [];
    let all_events = [];
    let datesArrayNew = datesArray.push(start_date);
    if (recurring_type === "daily") {
      for (let i = 0; i < Number(recurring_iteration); i++) {
        var new_date = moment(
          moment(start_date).add(i, "d").format("YYYY-MM-DD")
        );
        all_events.push({
          ...event,
          date: new_date._i,
          event_color: event.color,
          event_title: event.title,
        });
      }
      return all_events;
    } else if (recurring_type === "weekly") {
      for (let i = 0; i < Number(recurring_iteration); i++) {
        var new_date = moment(
          moment(start_date).add(i, "week").format("YYYY-MM-DD")
        );
        all_events.push({
          ...event,
          date: new_date._i,
          event_color: event.color,
          event_title: event.title,
        });
      }
      return all_events;
    } else if (recurring_type === "monthly") {
      for (let i = 0; i < Number(recurring_iteration); i++) {
        var new_date = moment(
          moment(start_date).add(i, "month").format("YYYY-MM-DD")
        );
        all_events.push({
          ...event,
          date: new_date._i,
          event_color: event.color,
          event_title: event.title,
        });
      }
      return all_events;
    }

    return [];
  };
  const getEventListing = async () => {
    const result = await eventListApi();
    if (result.code === 200) {
      let all_events = [];
      result.event.map((event, index) => {
        let resp_event = getEventsList(event);
        all_events = [...all_events, ...resp_event];
      });
      all_events = all_events.map((event) => {
        return {
          ...event,
          title: event.title,
          color: event.color,
          start: get_date_with_admin_time_zone(
            event.date + " " + event.start_time,
            "YYYY-MM-DD HH:mm",
            defaultTimeZone
          ),
          end: get_date_with_admin_time_zone(
            event.date + " " + event.end_time,
            "YYYY-MM-DD HH:mm",
            defaultTimeZone
          ),
        };
      });

      setEvents(all_events);

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  // const getEventListing = async () => {
  //   let all_events = [];
  //   eventsList.map((event, index) => {
  //     let resp_event = getEventsList(event);
  //     all_events = [...all_events, ...resp_event];
  //   });
  //   all_events = all_events.map((event) => {
  //     return {
  //       ...event,
  //       title: event.title,
  //       color: event.color,
  //       start: get_date_with_admin_time_zone(
  //         event.date + " " + event.start_time,
  //         "YYYY-MM-DD hh:mm",
  //         defaultTimeZone
  //       ),
  //       end: get_date_with_admin_time_zone(
  //         event.date + " " + event.start_time,
  //         "YYYY-MM-DD hh:mm",
  //         defaultTimeZone
  //       ),
  //     };
  //   });
  //   setEvents(all_events);
  // };
  useEffect(() => {
    setDefaultTimeZone(defaultTimeValue?.default_setting?.time_zone);
    // moment.tz.setDefault(defaultTimeValue?.default_setting?.time_zone);
  }, [defaultTimeValue]);
  useEffect(() => {
    getDefaultSetting();
  }, []);
  useEffect(() => {
    getEventListing();
  }, []);

  //console.log(defaultTimeZone, "defaultTimeZone");
  const content_setting = "";
  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          {content_setting && content_setting.calender_description ? (
            <div
              className="dashboard_description"
              dangerouslySetInnerHTML={{
                __html: content_setting.calender_description,
              }}
            ></div>
          ) : (
            <h2 className="quotes-heading"></h2>
          )}
        </div>

        <div className="col-md-12 full-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "today prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            className="fc-day-sun fc-toolbar-chunk fc eventimage fc-col-header-cell-cushion fc-today-button fc-right fc-prev-button fc-right fc-next-button fc-dayGridMonth-button fc-timeGridWeek-button fc-timeGridDay-button fc-daygrid-day-number fc-daygrid-day-top"
            eventContent={renderEventContent}
            events={events}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={2}
            weekends={weekendsVisible}
          />
        </div>
      </div>

      <CustomDrawer
        isOpenDrawer={editDrawerState}
        onOpenDrawer={handleOpenEditDrawer}
        onCloseDrawer={handleCloseEditDrawer}
        pageTitle="Event Detail"
        componentToPassDown={
          <EventDetail
            setEditDrawerState={setEditDrawerState}
            setIsLoading={setIsLoading}
            eventDetailData={eventDetailData}
            dataList={getEventListing}
            onCloseDrawer={handleCloseEditDrawer}
          />
        }
      />

      {/* <CustomDrawer
        isOpenDrawer={drawerState}
        onOpenDrawer={handleOpenDrawer}
        onCloseDrawer={handleCloseDrawer}
        pageTitle="New Event"
        componentToPassDown={
          <AddEvent
            dataList={getEventListing}
            onCloseDrawer={handleCloseDrawer}
          />
        }
      /> */}
    </div>
  );
}

export default DashboardCalenders;
