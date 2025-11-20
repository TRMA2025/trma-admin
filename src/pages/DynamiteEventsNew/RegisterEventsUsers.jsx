import * as React from "react";
import { s3baseUrl } from "../../config/config";
import { CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { add_member_from_csv_for_event } from "src/DAL/member/member";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { useEffect } from "react";
import { dynamite_events_list_api } from "src/DAL/DynamiteEvents/DynamiteEvents";
import CustomMUITable from "src/components/CustomMUITable";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function RegisterEventsUsers() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [csvFile, setCsvFile] = useState();
  const navigate = useNavigate();

  const fileChangedHandler = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const getEventsList = async () => {
    const result = await dynamite_events_list_api();
    if (result.code === 200) {
      let events = result.dynamite_event.map((event) => {
        return {
          ...event,
          table_avatar: {
            src: s3baseUrl + event.images.thumbnail_2,
            alt: event.title,
          },
        };
      });
      setEventList(events);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!csvFile) {
      enqueueSnackbar("Please upload csv file", { variant: "error" });
      return;
    }
    if (selected.length < 1) {
      enqueueSnackbar("Please select events to assign to members", {
        variant: "error",
      });
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    let events = [];
    let eventVal = {};
    selected.map((event) => {
      eventVal = {
        event_id: event._id,
      };
      events.push(eventVal);
    });
    formData.append("csv", csvFile);
    formData.append("event", JSON.stringify(events));
    const result = await add_member_from_csv_for_event(formData);
    if (result.code == 200) {
      setIsLoading(false);
      navigate(`/dynamite-events`);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  useEffect(() => {
    getEventsList();
  }, []);

  const TABLE_HEAD = [
    { id: "number", label: "#", alignRight: false, type: "number" },
    { id: "title", label: "Name", alignRight: false },
    {
      id: "table_avatar",
      label: "Image",
      alignRight: false,
      type: "thumbnail",
      className: "p-0",
    },
    {
      id: "status",
      label: "Status",
      type: "row_status",
      alignRight: false,
    },
  ];

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <div style={{ width: "100%" }}>
        <div className="row mobile-margin display-flex">
          <div className="col-12">
            <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(`/dynamite-events`)}
            >
              <ArrowBackIcon
                className="arrow-back-icon"
                style={{ color: "#fff !important", fill: "#fff !important" }}
              />{" "}
            </IconButton>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h2>Register Events</h2>
          </div>
        </div>
        <div className="col-12">
          <form method="post" action="#" id="#">
            <div className="form-group files">
              <input
                onChange={fileChangedHandler}
                type="file"
                className="form-control"
                multiple
                accept=".csv"
              />
            </div>
          </form>
        </div>
        <label className="mb-3 mt-4">SELECT EVENTS MEMBER HAS ACCESS</label>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={eventList}
          selected={selected}
          setSelected={setSelected}
          checkbox_selection={true}
        />
      </div>
      <div className="ms-auto text-end">
        <button
          className="small-contained-button mt-3 ml-auto"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
}
