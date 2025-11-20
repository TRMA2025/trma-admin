import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { s3baseUrl } from "../../config/config";
import {
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { add_member_from_csv_for_event } from "src/DAL/member/member";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { useEffect } from "react";
import { dynamiteEventsListApi } from "src/DAL/WebsitePagesold/DynamiteEvents/DynamiteEvents";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function RegisterEvents() {
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [selectionModel, setSelectionModel] = useState([]);
  const [update, setUpdate] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [csvFile, setCsvFile] = useState();
  const navigate = useNavigate();

  const addDays = (object) => {
    var result = new Date(object.createdAt);
    result.setDate(result.getDate() + object.no_of_limited_days);
    return result;
  };

  const fileChangedHandler = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const getEventsList = async () => {
    const result = await dynamiteEventsListApi();
    if (result.code === 200) {
      setEventList(result.dynamite_event);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    let events = [];
    let eventVal = {};
    selectionModel.forEach((event) => {
      eventVal = {
        event_id: event,
      };
      events.push(eventVal);
    });

    if (!csvFile) {
      enqueueSnackbar("Please upload csv file", { variant: "error" });
      setIsLoading(false);
    } else if (events.length < 1) {
      enqueueSnackbar("Please select events to assign to members", {
        variant: "error",
      });
      setIsLoading(false);
    } else {
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
    }
  };

  const getFormattedData = () => {
    const list = eventList.map((event, i) => {
      return {
        id: event._id,
        image: event.images.thumbnail_1,
        status: event.status,
        name: event.title,
        no_of_limited_days: event.no_of_days,
        object: event,
        index: i + 1,
      };
    });
    return list;
  };

  // Data grid values
  const columns = [
    { field: "index", headerName: "No", width: 170 },

    { field: "name", headerName: "Name", width: 550 },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => {
        //Adding image
        return (
          <>
            <Avatar
              className="top-avatar me-3"
              src={s3baseUrl + params.getValue(params.id, "image")}
              alt="photoURL"
            />
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          // Making A chip with status
          <Chip
            width="140px"
            label={
              params.getValue(params.id, "status") === true
                ? "Active"
                : "Inactive"
            }
            variant="contained"
            className={
              params.getValue(params.id, "status") === true
                ? "manage-program-chip-success"
                : ""
            }
            color={
              params.getValue(params.id, "status") === true
                ? "success"
                : "error"
            }
            size="small"
          />
        );
      },
    },
  ];

  useEffect(() => {
    getEventsList();
    getFormattedData();
  }, []);

  useEffect(() => {
    getFormattedData();
  }, [update]);

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
        {/* <h3 className="mb-4 mt-4">SELECT PROGRAMS MEMBER HAS ACCESS</h3> */}
        <label className="mb-3 mt-4">SELECT EVENTS MEMBER HAS ACCESS</label>
        <DataGrid
          autoHeight
          disableColumnFilter={true}
          rows={getFormattedData()}
          columns={columns}
          pageSize={50}
          // rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          disableSelectionOnClick={true}
          selectionModel={selectionModel}
          ColumnSortedAscendingIcon={null}
          ColumnUnsortedIcon={null}
          ColumnSortedDescendingIcon={null}
          sortIcon={null}
          disableColumnMenu={true}
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
