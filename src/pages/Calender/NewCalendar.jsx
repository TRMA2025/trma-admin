import moment from "moment";
import React, { useEffect, useState } from "react";
import { new_event_list_api } from "src/DAL/Events/events";
import GeneralCalendar from "src/components/GeneralComponents/GeneralCalendar";
import {
  difference_between_two_dates,
  get_view_dates,
} from "src/utils/constant";
import { useSnackbar } from "notistack";

export default function NewCalendar() {
  const { enqueueSnackbar } = useSnackbar();
  const [currentDate, setCurrentDate] = useState(get_view_dates("month"));
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [defaultTimeZone, setDefaultTimeZone] = useState("");

  const getEventListing = async () => {
    let apiData = {
      start_date: moment(currentDate.start_date).format("YYYY-MM-DD"),
      end_date: moment(currentDate.end_date).format("YYYY-MM-DD"),
    };
    const difference = difference_between_two_dates(
      apiData.start_date,
      apiData.end_date,
      "days"
    );

    if (difference < 10) {
      setIsLoading(true);
    }

    const result = await new_event_list_api(apiData);
    if (result.code === 200) {
      setEvents(result.event);
      setDefaultTimeZone(result.time_zone);
      console.log(result, "sdfsjdlkfja");
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEventListing();
  }, [currentDate]);

  return (
    <>
      <GeneralCalendar
        eventList={events}
        setCurrentDate={setCurrentDate}
        showAddEvent={true}
        time_zone={defaultTimeZone}
        currentDate={currentDate}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        reloadList={getEventListing}
        calendar_title="Calendar"
      />
    </>
  );
}
