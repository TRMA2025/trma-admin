import React, { useState, useEffect, useRef } from "react";
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
import CustomDrawer from "../DrawerForm/CustomDrawer";
import EventDetail from "src/pages/Calender/EventDetail";
import Skeleton from "react-loading-skeleton";
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
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

function GeneralCalendar({
  eventList,
  setCurrentDate,
  showAddEvent,
  time_zone,
  currentDate,
  setIsLoading,
  isLoading,
  user_type,
  reloadList,
  calendar_title,
  hideArrowsAndButtons,
}) {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const classes = useStyles();
  const [eventDetailData, setEventDetailData] = useState({});
  const [editDrawerState, setEditDrawerState] = useState(false);
  const [popupState, setPopupState] = useState(false);
  const [drawerState, setDrawerState] = useState(false);
  const [drawerStateUpdate, setDrawerStateUpdate] = useState(false);
  const [openItration, setopenItration] = useState(false);
  const [selectedTool, setSelectedTool] = useState("month");
  const [openDelete, setOpenDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [editItrationDrawerState, setEditItrationDrawerState] = useState();
  const calendarRef = useRef(null);

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
  const handleOpenDrawerItration = () => {
    setopenItration(true);
  };
  const handlecloseDrawerItration = () => {
    setopenItration(false);
  };
  const handleOpenDrawerUpdate = () => {
    setDrawerStateUpdate(true);
  };

  const handleOpenEditDrawer = () => {
    setEditDrawerState(true);
  };
  const handleCloseDrawer = () => {
    setDrawerState(false);
  };
  const handleCloseDrawerUpdate = () => {
    setDrawerStateUpdate(false);
  };
  const handleCloseEditDrawer = () => {
    setEditDrawerState(false);
  };

  const handleNavigateListEvent = () => {
    navigate("/calendarEvents/event-list");
  };

  const eventDetail = (event) => {
    console.log(event, "eventeventevent");
    setEventDetailData(event);
    setPopupState(true);
  };
  const handleAgreeDelete = () => {
    setPopupState(false);
    setOpenDelete(true);
  };
  const handleUpdate = () => {
    handleOpenEditDrawer();
  };
  const handleOpenEditIterationDrawer = () => {
    setEditItrationDrawerState(true);
  };
  const handleUpdateIteration = () => {
    handleOpenEditIterationDrawer();
  };
  const handleDelete = async (value) => {
    setOpenDelete(false);
    setIsLoading(true);
    let postData = {
      event_slug: eventDetailData.event_slug,
      iteration_id: eventDetailData._id,
      update_type: value,
    };
    const result = await delete_event_api(postData);
    if (result.code === 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
      reloadList();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const get_start_date_end_time = (date) => {
    return TIME_ZONE_CONVERSION(date, "YYYY-MM-DD HH:mm", time_zone, time_zone);
    return get_date_with_admin_time_zone(date, "YYYY-MM-DD HH:mm", time_zone);
  };
  const get_event_date = (date) => {
    return TIME_ZONE_CONVERSION(date, "YYYY-MM-DD", time_zone, time_zone);
    return get_date_with_admin_time_zone(date, "YYYY-MM-DD", time_zone);
  };

  const get_start_end_time = (date) => {
    return TIME_ZONE_CONVERSION(date, "HH:mm", time_zone, time_zone);
    return get_date_with_admin_time_zone(date, "HH:mm", time_zone);
  };
  // const get_start_date_end_time = (date) => {
  //   return get_date_with_admin_time_zone(date, "YYYY-MM-DD HH:mm", time_zone);
  // };
  // const get_event_date = (date) => {
  //   return get_date_with_admin_time_zone(date, "YYYY-MM-DD", time_zone);
  // };

  // const get_start_end_time = (date) => {
  //   return get_date_with_admin_time_zone(date, "HH:mm", time_zone);
  // };

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

  const handleChangeTools = (tool) => {
    let dates = get_dates(tool);
    setCurrentDate(dates);
    setSelectedTool(tool);
  };
  const handleCloseEditIterationDrawer = () => {
    setEditItrationDrawerState(false);
  };
  const getCenteredText = () => {
    let text = moment(new Date()).format("MMM YYYY");
    if (selectedTool == "month") {
      // text = moment(currentDate.start_date).add(1, "month").format("MMM YYYY");

      if (calendarRef?.current) {
        const calendarApi = calendarRef?.current.getApi();
        const currentMonth = calendarApi.getDate().getMonth(); // Get the current month (0-based index)
        const currentYear = calendarApi.getDate().getFullYear(); // Get the current year

        text = moment().month(currentMonth).format("MMM") + " " + currentYear;
      }
      if (
        moment(new Date()).isBetween(
          currentDate.start_date,
          currentDate.end_date,
          null,
          "[)"
        )
      ) {
        console.log(
          moment(new Date()).isBetween(
            currentDate.start_date,
            currentDate.end_date,
            null,
            "[)"
          ),
          "dsfjldsjfkasdjfka"
        );
      }
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

  const handleClickDate = (event) => {
    console.log(event.date, "sdfhkjsdhfja");
    setSelectedTool("day");
    setCurrentDate({
      start_date: event.dateStr,
      end_date: event.dateStr,
    });
  };

  useEffect(() => {
    getEventListing(eventList, time_zone);
  }, [eventList]);

  // if (isLoading === true) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-sm-12">
          <h2>{calendar_title}</h2>
        </div>
        <div className="col-lg-6 col-sm-12">
          {showAddEvent && (
            <>
              {user_type !== "delegate" && (
                <button
                  className="small-contained-button float-end mt-1"
                  onClick={handleOpenDrawer}
                >
                  Add Event
                </button>
              )}
              <button
                className="small-contained-button float-end mt-1 me-2"
                onClick={handleNavigateListEvent}
              >
                List Event
              </button>
            </>
          )}
        </div>
        <div className="col-lg-4 col-sm-12 text-center text-lg-start full-calendar-toolbar mt-4">
          {!hideArrowsAndButtons && (
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
          )}
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
                    handleChangeTools(button.text);
                  }}
                >
                  {button.text}
                </button>
              );
            })}
          </div>
        </div>
        {isLoading ? (
          <div className="row mt-2 ">
            <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
              <Skeleton
                baseColor="#fff"
                highlightColor="#ddd"
                width="100%"
                height={500}
              />
            </div>
          </div>
        ) : (
          <div className="col-md-12 full-calendar full-calendar-new-flow mt-3 order-4">
            {selectedTool == "month" ? (
              <FullCalendar
                ref={calendarRef}
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
                moreLinkClick={function (args) {
                  handleClickDate(args);
                }}
              />
            ) : selectedTool == "week" ? (
              <WeekCalendar
                events={events}
                handleClick={eventDetail}
                currentDate={currentDate}
                isLoading={isLoading}
              />
            ) : (
              <DayCalendar
                events={events}
                handleClick={eventDetail}
                currentDate={currentDate}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </div>
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
            dataList={reloadList}
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
            dataList={reloadList}
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
            dataList={reloadList}
            defaultTimeZone={time_zone}
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
            dataList={reloadList}
            defaultTimeZone={time_zone}
            handleCloseDrawer={handleCloseEditIterationDrawer}
          />
        }
      />
      <FullPagePopup
        open={drawerState}
        setOpen={setDrawerState}
        componentToPassDown={
          <AddEvent dataList={reloadList} onCloseDrawer={handleCloseDrawer} />
        }
      />
      {/* <CustomDrawer
        isOpenDrawer={drawerState}
        onOpenDrawer={handleOpenDrawer}
        onCloseDrawer={handleCloseDrawer}
        pageTitle="New Event"
        componentToPassDown={
          <AddEvent
            dataList={reloadList}
            onCloseDrawer={handleCloseDrawer}
          />
        }
      /> */}
      {/* <CustomDrawer
        isOpenDrawer={editDrawerState}
        onOpenDrawer={handleOpenEditDrawer}
        onCloseDrawer={handleCloseEditDrawer}
        pageTitle="Event Detail"
        componentToPassDown={
          <EventDetailNew
            setEditDrawerState={setEditDrawerState}
            eventDetailData={eventDetailData}
            setEventDetailData={setEventDetailData}
            dataList={reloadList}
            onCloseDrawer={handleCloseEditDrawer}
            defaultTimeZone={time_zone}
            user_type={user_type}
          />
        }
      />
      <DetailPopUpModel
        open={popupState}
        setOpen={setPopupState}
        handleAgreeDelete={handleAgreeDelete}
        handleEdit={handleUpdate}
        handleOpenDrawerItration={handleOpenDrawerItration}
        title={"Event Detail"}
        eventDetailData={eventDetailData}
        user_type={user_type}
        componentToPassDown={<EventDetail eventDetailData={eventDetailData} />}
      />
      <FullPagePopup
        open={drawerState}
        setOpen={setDrawerState}
        componentToPassDown={
          <AddEvent dataList={reloadList} onCloseDrawer={handleCloseDrawer} />
        }
      />
      <FullPagePopup
        open={drawerStateUpdate}
        setOpen={setDrawerStateUpdate}
        componentToPassDown={
          <EditEvent
            dataList={reloadList}
            editValues={eventDetailData}
            onCloseDrawer={handleCloseDrawerUpdate}
            defaultTimeZone={time_zone}
          />
        }
      />
      <FullPagePopup
        open={openItration}
        setOpen={setopenItration}
        componentToPassDown={
          <UpdateCalendarItrationNew
            dataList={reloadList}
            editValues={eventDetailData}
            onCloseDrawer={handlecloseDrawerItration}
            defaultTimeZone={time_zone}
          />
        }
      />
      <PerformActionOn
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Delete recurring event?"}
        handleAgree={handleDelete}
      /> */}
      {/* <CustomDrawer
        isOpenDrawer={drawerState}
        onOpenDrawer={handleOpenDrawer}
        onCloseDrawer={handleCloseDrawer}
        pageTitle="New Event"
        componentToPassDown={
          <AddCalendarEvents
            dataList={reloadList}
            onCloseDrawer={handleCloseDrawer}
          />
        }
      /> */}
    </div>
  );
}

export default GeneralCalendar;
