import React, { useState, useEffect } from "react";
// import FormsDrewer from "../../components/FormsDrewer/FormsDrewer";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Tooltip from "@mui/material/Tooltip";
import "@fullcalendar/daygrid/main.css";
import moment from "moment";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { eventsListing } from "src/DAL/Calendar/Calendar";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import { delete_event_api, new_event_list_api } from "src/DAL/Events/events";
import {
  TIME_ZONE_CONVERSION,
  get_date_with_admin_time_zone,
  get_date_with_user_time_zone,
} from "src/utils/constant";
import { defaultSettingApi } from "src/DAL/SiteSetting/siteSetting";

import FullPagePopup from "src/components/FormsDialog/FullPagePopup";
import DetailPopUpModel from "src/components/Calender/DetailPopUpModel";
import EventDetailNew from "src/components/FormsDialog/EventDetailNew";
import PerformActionOn from "src/components/FormsDialog/PerformActionOn";

import EditEventItration from "src/pages/Calender/EditEventItration";
import EditEvent from "src/pages/Calender/EditEventNew";
import DayCalendar from "src/pages/Calender/DayCalendar";
import WeekCalendar from "src/pages/Calender/WeekCalendar";
import AddEvent from "src/pages/Calender/AddEvents";

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
function DashboardCalendersNew({
  eventList,
  defaultTimeZone,
  isLoading,
  setIsLoading,
  currentDate,
  setCurrentDate,
  selectedTool,
  setSelectedTool,
  getEventListing,
  showAddEvent,
}) {
  // const [isLoading, setIsLoading] = useState(true);
  // const [events, setEvents] = useState([]);
  // console.log(eventList, "asdklfjalk");
  const { enqueueSnackbar } = useSnackbar();
  const [eventDetailData, setEventDetailData] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const [editDrawerState, setEditDrawerState] = useState(false);
  const [editItrationDrawerState, setEditItrationDrawerState] = useState();

  const [drawerState, setDrawerState] = useState(false);
  const classes = useStyles();
  // const [defaultTimeZone, setDefaultTimeZone] = useState("");
  // const [selectedTool, setSelectedTool] = useState("month");

  const [openDelete, setOpenDelete] = useState(false);
  const [popupState, setPopupState] = useState(false);

  const get_dates = (tool) => {
    if (tool == "month") {
      return get_view_dates(tool);
    } else {
      return {
        start_date: moment().startOf(tool).toDate(),
        end_date: moment().endOf(tool).toDate(),
      };
    }
  };
  const handleDelete = async (value) => {
    setOpenDelete(false);
    if (selectedTool !== "month") {
      setIsLoading(true);
    }
    let postData = {
      event_slug: eventDetailData.event_slug,
      iteration_id: eventDetailData._id,
      update_type: value,
    };
    const result = await delete_event_api(postData);
    if (result.code === 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
      // reloadList();
      getEventListing();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
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
  const handleOpenEditIterationDrawer = () => {
    setEditItrationDrawerState(true);
  };
  const handleCloseEditIterationDrawer = () => {
    setEditItrationDrawerState(false);
  };
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
  const getEventList = async (event, time_zone) => {
    let all_events = [];
    moment.tz.setDefault(time_zone);
    if (event.length > 0) {
      all_events = event.map((event) => {
        return {
          ...event,
          title: event.title,
          color: event.color,
          event_color: event.color,
          event_title: event.title,
          status: event.status,
          date: get_event_date(event.start_date_time),
          start_date: moment(event.start_date_time).format("YYYY-MM-DD"),
          end_date: moment(event.end_date_time).format("YYYY-MM-DD"),
          start: get_start_date_end_time(event.start_date_time),
          end: get_start_date_end_time(event.end_date_time),
          start_time: get_start_end_time(event.start_date_time),
          end_time: get_start_end_time(event.end_date_time),
        };
      });
    }
    setEvents(all_events);
  };
  const TOOL_BUTTONS = [
    {
      text: "month",
    },
    {
      text: "week",
    },
    {
      text: "day",
    },
  ];
  const handleNavigateListEvent = () => {
    navigate("/calendarEvents/event-list");
  };
  const handleOpenDrawer = () => {
    setDrawerState(true);
  };
  const getCenteredText = () => {
    let text = "";
    if (selectedTool == "month") {
      // text = moment(currentDate.start_date).add(1, "month").format("MMM YYYY");
      text = moment(currentDate.start_date).format("MMM YYYY");

      // console.log(currentDate.start_date, "dfkjsdla");
    } else if (selectedTool == "week") {
      let month = moment(currentDate.start_date).format("MMM");
      let start_date = moment(currentDate.start_date).format("DD");
      let end_date = moment(currentDate.end_date).format("DD");
      let year = moment(currentDate.start_date).format("YYYY");
      text = `${month} ${start_date} - ${end_date} ${year}`;
    } else {
      text = moment(currentDate.start_date).format("MMM DD, YYYY");
    }
    return text;
  };
  const hanldeChangeDates = (value) => {
    let start_date = currentDate.start_date;
    let end_date = currentDate.end_date;
    let new_object = {};
    if (value == "next") {
      new_object = {
        start_date: moment(start_date)
          .add(1, selectedTool)
          .startOf(selectedTool)
          .toDate(),
        end_date: moment(end_date)
          .add(1, selectedTool)
          .endOf(selectedTool)
          .toDate(),
      };
    } else {
      new_object = {
        start_date: moment(start_date)
          .subtract(1, selectedTool)
          .startOf(selectedTool)
          .toDate(),
        end_date: moment(end_date)
          .subtract(1, selectedTool)
          .endOf(selectedTool)
          .toDate(),
      };
    }

    setCurrentDate(new_object);
  };
  const handleChangeNextPrev = (value) => {
    if (selectedTool == "month") {
      let classToClick = "fc-next-button";
      if (value == "prev") {
        classToClick = "fc-prev-button";
      }
      let click_element = document.getElementsByClassName(classToClick)[0];
      click_element.click();
    }

    hanldeChangeDates(value);
  };
  const handleChangeTools = (tool) => {
    let dates = get_dates(tool);
    setCurrentDate(dates);
    setSelectedTool(tool);
  };
  const handleClickDate = (event) => {
    setSelectedTool("day");

    setCurrentDate({
      start_date: event.dateStr,
      end_date: event.dateStr,
    });
  };
  // const eventDetail = (event) => {
  //   setEventDetailData(event);
  //   setEditDrawerState(true);
  // };
  const eventDetail = (event) => {
    setEventDetailData(event);
    setPopupState(true);
  };
  const handleUpdate = () => {
    handleOpenEditDrawer();
  };
  const handleUpdateIteration = () => {
    handleOpenEditIterationDrawer();
  };
  const handleAgreeDelete = () => {
    setPopupState(false);
    setOpenDelete(true);
  };
  const renderEventContent = (eventInfo) => {
    return (
      <Tooltip title={eventInfo.event.title}>
        <div
          className="d-flex"
          onClick={() => eventDetail(eventInfo.event._def.extendedProps)}
        >
          <div
            className="event-title-dot"
            style={{
              backgroundColor: eventInfo.event._def.extendedProps.event_color,
            }}
          ></div>
        </div>
      </Tooltip>
    );
  };

  useEffect(() => {
    getEventList(eventList, defaultTimeZone);
  }, [eventList]);
  const content_setting = "";
  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
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
            <h2 className="quotes-heading">Calendar</h2>
          )}
        </div>
        {showAddEvent && (
          <div className="col-12">
            <button
              className="small-contained-button float-end mt-1 mb-4"
              onClick={handleOpenDrawer}
            >
              Add Event
            </button>
            <button
              className="small-contained-button float-end mt-1 mb-4 me-2"
              onClick={handleNavigateListEvent}
            >
              List Event
            </button>
          </div>
        )}
        <div className="col-6 order-2 col-md-4 full-calendar-toolbar">
          <div class="btn-group toollbar-group-buttons">
            <button
              className={`small-contained-button`}
              onClick={() => {
                handleChangeNextPrev("prev");
              }}
            >
              <ArrowBackIosIcon />
            </button>
            <button
              className={`small-contained-button`}
              onClick={() => {
                handleChangeNextPrev("next");
              }}
            >
              <ArrowForwardIosIcon />
            </button>
          </div>
        </div>
        <div className="col-12 col-md-4 order-1 order-md-2 mb-4 mb-md-0 text-center full-calendar-toolbar">
          <h2>{getCenteredText()}</h2>
        </div>
        <div className="col-6 col-md-4 order-3 text-center text-md-end">
          <div class="btn-group toollbar-group-buttons">
            {TOOL_BUTTONS.map((button) => {
              return (
                <button
                  className={`small-contained-button ${
                    button.text == selectedTool
                      ? "selected-button"
                      : "not-selected-button"
                  }`}
                  onClick={() => {
                    handleChangeTools(button.text);
                  }}
                >
                  {button.text}
                </button>
              );
            })}
          </div>
        </div>
        <div className="col-md-12 full-calendar full-calendar-new-flow mt-3 order-4">
          {selectedTool == "month" ? (
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
              dayMaxEvents={
                window.screen.width > 768
                  ? 3
                  : window.screen.width > 575
                  ? 2
                  : 1
              }
              weekends={true}
              fixedWeekCount={false}
              moreLinkContent={function (args) {
                return "+" + args.num;
              }}
              dateClick={function (args) {
                handleClickDate(args);
              }}
              dayPopoverFormat={{
                month: "long",
                year: "numeric",
                day: "numeric",
                weekday: "long",
              }}
              moreLinkClick={function (args) {
                handleClickDate(args);
              }}
            />
          ) : selectedTool == "week" ? (
            <WeekCalendar
              events={events}
              handleClick={eventDetail}
              currentDate={currentDate}
            />
          ) : (
            <DayCalendar
              events={events}
              handleClick={eventDetail}
              currentDate={currentDate}
            />
          )}
        </div>
      </div>
      {/* old code */}
      {/* <div className="row">
        <div>
          <h2>Calendar</h2>
        </div>
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
        <div className="col-12">
          <button
            className="small-contained-button float-end mt-1 mb-4"
            onClick={handleOpenDrawer}
          >
            Add Event
          </button>
          <button
            className="small-contained-button float-end mt-1 mb-4 me-2"
            onClick={handleNavigateListEvent}
          >
            List Event
          </button>
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
      </div> */}
      <DetailPopUpModel
        open={popupState}
        setOpen={setPopupState}
        handleAgreeDelete={handleAgreeDelete}
        handleEdit={handleUpdate}
        handleEditIteration={handleUpdateIteration}
        title={"Event Detail"}
        eventDetailData={eventDetailData}
        componentToPassDown={
          <EventDetailNew
            setPopupState={setPopupState}
            setIsLoading={setIsLoading}
            eventDetailData={eventDetailData}
            setEventDetailData={setEventDetailData}
            dataList={getEventListing}
            onCloseDrawer={handleCloseEditDrawer}
            setEditDrawerState={setEditDrawerState}
          />
        }
      />
      {/* <CustomDrawer
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
      /> */}
      <PerformActionOn
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Delete recurring event?"}
        handleAgree={handleDelete}
      />
      <FullPagePopup
        open={editDrawerState}
        setOpen={setEditDrawerState}
        componentToPassDown={
          <EditEvent
            editValues={eventDetailData}
            dataList={getEventListing}
            defaultTimeZone={defaultTimeZone}
            handleCloseDrawer={handleCloseEditDrawer}
          />
        }
      />
      <FullPagePopup
        open={editItrationDrawerState}
        setOpen={setEditItrationDrawerState}
        componentToPassDown={
          <EditEventItration
            editValues={eventDetailData}
            dataList={getEventListing}
            defaultTimeZone={defaultTimeZone}
            handleCloseDrawer={handleCloseEditIterationDrawer}
          />
        }
      />
      <FullPagePopup
        open={drawerState}
        setOpen={setDrawerState}
        componentToPassDown={
          <AddEvent
            dataList={getEventListing}
            onCloseDrawer={handleCloseDrawer}
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

export default DashboardCalendersNew;
