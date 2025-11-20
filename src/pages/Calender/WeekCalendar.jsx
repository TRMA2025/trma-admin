import moment from "moment";
import React from "react";
import RecordNotFound from "src/components/RecordNotFound";

import { htmlDecode } from "src/utils/convertHtml";

export default function WeekCalendar({ events, handleClick, currentDate }) {
  const getByWeek = (events) => {
    // Define the start and end dates of the range
    const startDate = moment(currentDate.start_date, "YYYY-MM-DD");
    const endDate = moment(currentDate.end_date, "YYYY-MM-DD");

    // Filter events within the date range
    const filteredEvents = events.filter((event) => {
      return (
        moment(event.date).isSameOrAfter(startDate) &&
        moment(event.date).isSameOrBefore(endDate)
      );
    });
    console.log(currentDate, "dsjslkd", filteredEvents);
    let newArray = [];
    filteredEvents.forEach((event, i) => {
      let index = newArray.findIndex(
        (new_event) => new_event.date == event.date
      );
      if (index > -1) {
        newArray[index].events.push(event);
      } else {
        newArray.push({
          date: event.date,
          events: [event],
        });
      }
    });
    return newArray.sort(function (a, b) {
      var dateA = new Date(a.date);
      var dateB = new Date(b.date);
      return dateA - dateB;
    });
  };

  return (
    <>
      <div className="row">
        {getByWeek(events).length > 0 ? (
          getByWeek(events).map((weeks, index) => {
            return (
              <div className="col-12 col-md-6 calendar-week-card">
                <div className="calendar-card">
                  <div className="card-event-day">
                    <h4>{moment(weeks.date).format("ddd")}</h4>
                    <span>{moment(weeks.date).format("MM/DD")}</span>
                  </div>
                  <div>
                    {weeks.events.map((event) => {
                      return (
                        <div
                          className="week-event-title"
                          onClick={() => {
                            handleClick(event);
                          }}
                        >
                          <div
                            className="calendar-dot"
                            style={{ backgroundColor: event.color }}
                          ></div>
                          <div className="card-event-title">
                            <h4>{htmlDecode(event.event_title)}</h4>
                            <span>{`${moment(event.start).format(
                              "hh:mm A"
                            )} - ${moment(event.end).format("hh:mm A")}`}</span>
                          </div>
                        </div>
                      );
                    })}
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
