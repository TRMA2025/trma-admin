import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import CustomPopover from "src/components/MenuOption/CustomPopoverSection";
// import { DeleteEvent, eventsDetailApi } from "src/DAL/Calendar/Calendar";
import EditEvent from "./EditEvents";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { Chip } from "@mui/material";
import { IconButton, Divider, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { htmlDecode } from "src/utils/convertHtml";
import { deleteEventApi, eventDetailApi } from "src/DAL/Events/events";
// import { get_date_with_user_time_zone } from "src/utils/constants";
// import { useContentSetting } from "src/Hooks/ContentSettingState";

// import { get_date_with_user_time_zone } from "src/utils/constants";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function EventDetail({
  eventDetailData,
  onCloseDrawer,
  dataList,
  setEditDrawerState,
}) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [openDelete, setOpenDelete] = useState(false);
  const [eventSlug, setEventSlug] = useState("");
  const [editValues, setEditValues] = useState({});
  const [showEditComponent, setShowEditComponent] = useState(false);
  const [eventDetail, setEventDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const { userInfo, adminTimeZone } = useContentSetting();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const handleEdit = (value) => {
    setShowEditComponent(true);
  };
  const handleAgreeDelete = (value) => {
    setEventSlug(value);
    setOpenDelete(true);
  };
  let eventStartTime = "";
  let eventEndTime = "";
  const getEventinformation = async () => {
    // const result = await eventsDetailApi(eventDetailData.event_slug);
    const result = await eventDetailApi(eventDetailData.event_slug);
    if (result.code === 200) {
      setEditValues(result.event);
      setIsLoading(false);

      (eventStartTime =
        result.event.start_date + " " + result.event.start_time),
        (eventEndTime = result.event.end_date_time),
        // eventEndTime = get_date_with_user_time_zone(
        //   result.event.end_date_time,
        //   "hh:mm A",
        //   userInfo.time_zone,
        //   adminTimeZone
        // );
        setStartTime(moment(result.event.start_date_time).format("LT"));
      setEndTime(moment(eventEndTime).format("LT"));
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  //Deleting event
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteEventApi(eventSlug);
    if (result.code === 200) {
      setIsLoading(false);
      dataList();
      enqueueSnackbar(result.message, { variant: "success" });
      // navigate("/calendarEvents");
      onCloseDrawer();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },

    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  useEffect(() => {
    // setEditValues(eventDetailData);
  }, [eventDetailData]);
  useEffect(() => {
    getEventinformation();
  }, []);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <>
      {showEditComponent ? (
        <EditEvent
          editValues={editValues}
          dataList={dataList}
          setEditValues={setEditValues}
          getEventinformation={getEventinformation}
          setShowEditComponent={setShowEditComponent}
          setEditDrawerState={setEditDrawerState}
        />
      ) : (
        <div className="container event-details">
          <h1>{htmlDecode(editValues.title)}</h1>
          <div className="row media-margin">
            <div className="col-12 section-space">
              <div className="row">
                <div className="col-4">
                  <b>Start Date :</b>&nbsp;
                </div>
                <div className="col-8">
                  <p>{moment(editValues?.start_date).format("DD/MM/YYYY")}</p>
                  {/* <p>{editValues?.start_date}</p> */}
                </div>
                <div className="col-4">
                  <b>Start Time :</b>&nbsp;
                </div>
                <div className="col-8">
                  <p>
                    {moment(editValues?.start_time, "hh:mm").format("hh:mm A")}
                    {/* {editValues.event_type == "individual"
                      ? moment(editValues.start_time, "hh:mm").format("hh:mm A")
                      : get_date_with_user_time_zone(
                          editValues.start_date_time,
                          "hh:mm A"
                        )} */}
                  </p>
                </div>
                <div className="col-4">
                  <b>End Time :</b>&nbsp;
                </div>
                <div className="col-8">
                  <p>
                    {/* {moment(editValues?.end_time, "hh:mm").format("hh:mm A")} */}
                    {moment(editValues?.end_time, "hh:mm").format("hh:mm A")}
                    {/* {editValues.event_type == "individual"
                      ? moment(editValues.end_time, "hh:mm").format("hh:mm A")
                      : get_date_with_user_time_zone(
                          editValues.end_date_time,
                          "hh:mm A"
                        )} */}
                  </p>
                </div>
              </div>
              <p>
                {
                  <div
                    dangerouslySetInnerHTML={{
                      __html: htmlDecode(editValues.description),
                    }}
                  ></div>
                }
              </p>
            </div>
            <div className="text-end">
              {editValues.status === true ? (
                <button className="small-contained-chip-success">Active</button>
              ) : (
                <button className="small-contained-chip-error">Inctive</button>
              )}
            </div>
          </div>

          <div className="affirmation-dots">
            <CustomPopover
              menu={MENU_OPTIONS}
              data={eventDetailData.event_slug}
            />
          </div>

          <CustomConfirmation
            open={openDelete}
            setOpen={setOpenDelete}
            title={"Are you sure you want to delete this Event?"}
            handleAgree={handleDelete}
          />
        </div>
      )}
    </>
  );
}
