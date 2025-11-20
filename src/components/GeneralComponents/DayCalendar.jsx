import moment from "moment";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { htmlDecode } from "src/utils/convertHtml";
import RecordNotFound from "../RecordNotFound";
import { CircularProgress } from "@mui/material";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function DayCalendar({
  events,
  handleClick,
  currentDate,
  isLoading,
}) {
  const [loading, setloading] = useState(true);
  const classes = useStyles();
  const handleSortDate = (events) => {
    // Define the start and end dates of the range
    const startDate = moment(currentDate.start_date).format("YYYY-MM-DD");
    const endDate = moment(currentDate.end_date).format("YYYY-MM-DD");

    // Filter events within the date range
    const filteredEvents = events.filter((event) => {
      return (
        moment(event.date).isSameOrAfter(startDate) &&
        moment(event.date).isSameOrBefore(endDate)
      );
    });
    return filteredEvents;
  };
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <>
      <div className="row">
        {handleSortDate(events).length > 0 ? (
          !!handleSortDate(events) &&
          handleSortDate(events).map((event) => {
            return (
              <div className="col-12 col-md-6 mb-3 d-flex">
                <div
                  className="calendar-card cursor-pointer w-100"
                  onClick={() => {
                    handleClick(event);
                  }}
                >
                  <div className="card-event-day">
                    <h4>{moment(event.date).format("ddd")}</h4>
                    <span>{moment(event.date).format("MM/DD")}</span>
                  </div>
                  <div
                    className="calendar-dot"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className="card-event-title">
                    <h4>{htmlDecode(event.event_title)}</h4>
                    <span>{`${moment(event.start).format("hh:mm A")} - ${moment(
                      event.end
                    ).format("hh:mm A")}`}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <RecordNotFound title="Events" />
        )}
      </div>
    </>
  );
}
