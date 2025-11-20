import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { htmlDecode } from "src/utils/convertHtml";
import moment from "moment";
// import { TIME_ZONE_CONVERSION } from "src/utils/constants";
import { useContentSetting } from "src/Hooks/ContentSettingState";
import { eventDetailApi } from "src/DAL/Events/events";
import { CircularProgress } from "@mui/material";

export default function EventDetail({ eventDetailData }) {
  const { userInfo, adminTimeZone } = useContentSetting();
  const [isLoadingLoader, setIsLoadingLoader] = useState(false);
  const [evetdate, setEvent] = useState();

  // const get_start_end_time = (date) => {
  //   return TIME_ZONE_CONVERSION(
  //     date,
  //     "DD-MM-YYYY hh:mm A",
  //     adminTimeZone,
  //     userInfo.time_zone
  //   );
  // };
  const getEventinformation = async () => {
    setIsLoadingLoader(true);
    console.log("called");
    const result = await eventDetailApi(eventDetailData.event_slug);
    console.log(result, "resultresultresult");
    if (result.code === 200) {
      console.log(result.event, "resultresultresult");
      setEvent(result.event);
      setIsLoadingLoader(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingLoader(false);
    }
  };

  useEffect(() => {
    getEventinformation();
  }, []);
  if (isLoadingLoader == true) {
    return (
      <CircularProgress
        style={{ marginLeft: "50%", marginTop: "10%" }}
        color="primary"
      />
    );
  }
  return (
    <>
      <div className="event-details">
        <h1>{htmlDecode(eventDetailData.event_title)}</h1>
        <div className="row">
          <div className="col-12 mt-1">
            <div className="d-flex flex-column flex-md-row">
              <div className="d-flex me-4">
                <span style={{ color: "white" }}>Event From : </span>
                <p className="ms-1 date-color">
                  {moment
                    .utc(evetdate?.start_date_time)
                    .format("DD-MM-YYYY hh:mm A")}
                </p>
              </div>
              <div className="d-flex">
                <span style={{ color: "white" }}> Event To : </span>
                <p className="ms-1 date-color">
                  {moment
                    .utc(evetdate?.end_date_time)
                    .format("DD-MM-YYYY hh:mm A")}
                </p>
              </div>
            </div>{" "}
            <div className="d-flex flex-column flex-md-row">
              <div className="d-flex me-4">
                <span style={{ color: "white" }}>Iteration From : </span>
                <p className="ms-1 date-color">
                  {moment
                    .utc(eventDetailData.start_date_time)
                    .format("DD-MM-YYYY hh:mm A")}
                </p>
              </div>
              <div className="d-flex">
                <span style={{ color: "white" }}>Iteration To : </span>
                <p className="ms-1 date-color">
                  {moment
                    .utc(eventDetailData.end_date_time)
                    .format("DD-MM-YYYY hh:mm A")}
                </p>
              </div>
            </div>
            {eventDetailData.description && (
              <>
                <div className="col-12 mb-3">
                  <b style={{ color: "white" }}>Description :</b>&nbsp;
                </div>
                <div className="col-12">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: eventDetailData.description,
                    }}
                    style={{ color: "white" }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
