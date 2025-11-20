import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { eventDetailApi } from "src/DAL/Events/events";
import { htmlDecode } from "src/utils/convertHtml";
// import { useContentSetting } from "src/Hooks/ContentContext/ContentSettingState";
// import { get_date_with_user_time_zone } from "src/utils/constants";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "10%",
    marginBottom: "10%",
    color: "#9f00ff !important",
  },
}));
export default function EventDetailNew({ eventDetailData }) {
  const [eventDetail, setEventDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const getEventinformation = async () => {
    const result = await eventDetailApi(eventDetailData.event_slug);
    if (result.code === 200) {
      setEventDetail(result.event);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  useEffect(() => {
    getEventinformation();
  }, []);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <div className="event-details">
        <h1 className="main-color">
          {htmlDecode(eventDetailData.event_title)}
        </h1>
        <div className="row">
          <>
            <div className="col-12 mt-1">
              <div className="d-flex flex-column flex-md-row">
                <div className="d-flex me-4 event-description-title">
                  <span>Event From : </span>
                  <p className="ms-1 date-color">
                    {moment
                      .utc(eventDetail.start_date_time)
                      .format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
                <div className="d-flex event-description-title">
                  <span>Event To : </span>
                  <p className="ms-1 date-color">
                    {moment
                      .utc(eventDetail.end_date_time)
                      .format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row">
                <div className="d-flex me-4 event-description-title">
                  <span>Iteration From : </span>
                  <p className="ms-1 date-color">
                    {moment
                      .utc(eventDetailData.start_date_time)
                      .format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
                <div className="d-flex event-description-title">
                  <span>Iteration To : </span>
                  <p className="ms-1 date-color">
                    {moment
                      .utc(eventDetailData.end_date_time)
                      .format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
              </div>
              {/* <div className="d-flex flex-column flex-md-row">
                <div className="d-flex me-4 event-description-title">
                  <span>Status : </span>
                  <p className="ms-1 ">
                    {eventDetailData.status === false ? (
                      <button className="small-contained-chip-error">
                        Inctive
                      </button>
                    ) : (
                      <button className="small-contained-chip-success">
                        Active
                      </button>
                    )}
                  </p>
                </div>
              </div> */}

              {eventDetailData.description && (
                <>
                  <div className="col-12 mb-3 event-description-title">
                    <b>Description :</b>&nbsp;
                  </div>
                  <div className="col-12 event-description-details">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: eventDetailData.description,
                      }}
                    ></div>
                  </div>
                </>
              )}
            </div>
            {/* <div className="col-12">
              <div className="row">
                <div className="col-5">
                  <b>Event From :</b>&nbsp;
                </div>
                <div className="col-7">
                  <p>
                    {moment
                      .utc(eventDetail.start_date_time)
                      .format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
                <div className="col-5">
                  <b>Event To :</b>&nbsp;
                </div>
                <div className="col-7">
                  <p>
                    {moment
                      .utc(eventDetail.end_date_time)
                      .format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
                <div className="col-5">
                  <b>Iteration From :</b>&nbsp;
                </div>
                <div className="col-7">
                  <p>
                    {moment
                      .utc(eventDetailData.start_date_time)
                      .format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
                <div className="col-5">
                  <b>Iteration To :</b>&nbsp;
                </div>
                <div className="col-7">
                  <p>
                    {moment
                      .utc(eventDetailData.end_date_time)
                      .format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
                <div className="col-5">
                  <b>Status :</b>&nbsp;
                </div>
                <div className="col-7">
                  {eventDetailData.status === false ? (
                    <button className="small-contained-chip-error">
                      Inctive
                    </button>
                  ) : (
                    <button className="small-contained-chip-success">
                      Active
                    </button>
                  )}
                </div>
                {eventDetail.description && (
                  <>
                    <div className="col-5 mt-3">
                      <b>Description :</b>&nbsp;
                    </div>
                    <div className="col-12">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: eventDetail.description,
                        }}
                        className="mt-2"
                      ></div>
                    </div>
                  </>
                )}
              </div>
            </div> */}
          </>
        </div>
        {/* old */}
        {/* <div className="row">
          <div className="col-12 mt-1">
            <div className="d-flex flex-column flex-md-row">
              <div className="d-flex me-4 event-description-title">
                <span>Event From : </span>
                <p className="ms-1 date-color">
         
                  {get_start_end_time(eventDetailData.start_date_time)}
                </p>
              </div>
              <div className="d-flex event-description-title">
                <span>Event To : </span>
                <p className="ms-1 date-color">
            
                  {get_start_end_time(eventDetailData.end_date_time)}
                </p>
              </div>
            </div>
            {eventDetailData.description && (
              <>
                <div className="col-12 mb-3 event-description-title">
                  <b>Description :</b>&nbsp;
                </div>
                <div className="col-12 event-description-details">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: eventDetailData.description,
                    }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div> */}
      </div>
    </>
  );
}
