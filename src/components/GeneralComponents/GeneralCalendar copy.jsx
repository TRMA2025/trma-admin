import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Tooltip from "@mui/material/Tooltip";
import "@fullcalendar/daygrid/main.css";
import moment from "moment";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import {
  get_date_with_admin_time_zone,
  get_view_dates,
} from "src/utils/constant";
import EventDetailNew from "src/pages/Calender/EventDetailNew";
import AddCalendarEvents from "src/pages/Calender/AddCalendarEvents";

function GeneralCalendar({
  eventList,
  setCurrentDate,
  showAddEvent,
  time_zone,
  currentDate,
}) {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [eventDetailData, setEventDetailData] = useState([]);
  const [editDrawerState, setEditDrawerState] = useState(false);
  const [drawerState, setDrawerState] = useState(false);
  const [selectedTool, setSelectedTool] = useState("month");

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

  const handleNavigateListEvent = () => {
    navigate("/calendar-events/event-list");
  };

  const eventDetail = (event) => {
    setEventDetailData(event);
    setEditDrawerState(true);
  };

  const get_start_date_end_time = (date) => {
    return get_date_with_admin_time_zone(date, "YYYY-MM-DD HH:mm", time_zone);
  };

  const get_start_end_time = (date) => {
    return get_date_with_admin_time_zone(date, "HH:mm", time_zone);
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
          <div className="calender-title">
            <p>
              {eventInfo.event.title.length > 15
                ? `${eventInfo.event.title.substring(0, 15)}...`
                : eventInfo.event.title}
            </p>
          </div>
        </div>
      </Tooltip>
    );
  };

  const getEventListing = async (event, time_zone) => {
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
          date: moment(event.start_date_time).format("YYYY-MM-DD"),
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
      classToClick: "fc-dayGridMonth-button",
    },
    {
      text: "week",
      classToClick: "fc-timeGridWeek-button",
    },
    {
      text: "day",
      classToClick: "fc-timeGridDay-button",
    },
  ];

  const handleChangeTools = (tool, classToClick) => {
    let click_element = document.getElementsByClassName(classToClick)[0];
    click_element.click();
    let dates = get_dates(tool);
    setCurrentDate(dates);
    setSelectedTool(tool);
  };

  const getCenteredText = () => {
    let text = "";
    if (selectedTool == "month") {
      text = moment(currentDate.start_date).add(1, "month").format("MMM YYYY");
    } else if (selectedTool == "week") {
      let month = moment(currentDate.start_date).format("MMM");
      let start_date = moment(currentDate.start_date).format("DD");
      let end_date = moment(currentDate.end_date).format("DD");
      let year = moment(currentDate.start_date).format("YYYYY");
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
    let classToClick = "fc-next-button";
    if (value == "prev") {
      classToClick = "fc-prev-button";
    }
    let click_element = document.getElementsByClassName(classToClick)[0];
    click_element.click();
    hanldeChangeDates(value);
  };

  useEffect(() => {
    getEventListing(eventList, time_zone);
  }, [eventList]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-4 col-md-6">
          <h2>Calendar</h2>
        </div>
        <div className="col-8 col-md-6">
          {showAddEvent && (
            <>
              <button
                className="small-contained-button float-end mt-1"
                onClick={handleOpenDrawer}
              >
                Add Event
              </button>
              <button
                className="small-contained-button float-end mt-1 me-2"
                onClick={handleNavigateListEvent}
              >
                List Even
              </button>
            </>
          )}
        </div>
        <div className="col-lg-4 col-sm-12 text-center text-lg-start full-calendar-toolbar mt-4">
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
        <div className="col-lg-4 col-sm-12 text-center full-calendar-toolbar mt-4">
          <h2>{getCenteredText()}</h2>
        </div>
        <div className="col-lg-4 col-sm-12 text-center text-lg-end mt-4">
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
                    handleChangeTools(button.text, button.classToClick);
                  }}
                >
                  {button.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-md-12 full-calendar full-calendar-new-flow mt-3">
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
            weekends={true}
            fixedWeekCount={false}
          />
        </div>
      </div>

      <CustomDrawer
        isOpenDrawer={editDrawerState}
        onOpenDrawer={handleOpenEditDrawer}
        onCloseDrawer={handleCloseEditDrawer}
        pageTitle="Event Detail"
        componentToPassDown={
          <EventDetailNew
            setEditDrawerState={setEditDrawerState}
            eventDetailData={eventDetailData}
            setEventDetailData={setEventDetailData}
            dataList={getEventListing}
            onCloseDrawer={handleCloseEditDrawer}
            defaultTimeZone={time_zone}
          />
        }
      />

      <CustomDrawer
        isOpenDrawer={drawerState}
        onOpenDrawer={handleOpenDrawer}
        onCloseDrawer={handleCloseDrawer}
        pageTitle="New Event"
        componentToPassDown={
          <AddCalendarEvents
            dataList={getEventListing}
            onCloseDrawer={handleCloseDrawer}
          />
        }
      />
    </div>
  );
}

export default GeneralCalendar;
