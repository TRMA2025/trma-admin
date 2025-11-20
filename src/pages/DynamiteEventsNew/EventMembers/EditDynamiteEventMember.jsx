import React, { useState, useEffect } from "react";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  dynamite_events_member_detail_api,
  edit_dynamite_event_member,
} from "src/DAL/DynamiteEvents/EventMembers/EventMembers";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const EditDynamiteEventMember = () => {
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [memberData, setMemberData] = useState({});
  const [endDate, setEndDate] = useState("");
  const [date, setDate] = useState("");
  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setDate(dateType);
  };

  const handleChangeEndDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    setEndDate(dateType);
  };

  const getEventDetailData = async () => {
    const formData = new FormData();
    formData.append("dynamite_event", params.event_id);
    formData.append("member", params.member_id);
    const result = await dynamite_events_member_detail_api(formData);
    if (result.code === 200) {
      handleFormat(result.member);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      navigate(`/dynamite-events`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("expiry_date", endDate);
    formData.append("start_date", date);
    formData.append("dynamite_event", params.event_id);
    formData.append("member", params.member_id);

    const result = await edit_dynamite_event_member(formData);
    if (result.code === 200) {
      navigate(`/dynamite-events/${params.event_id}/members`);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleFormat = (data) => {
    setDate(data.event_start_date);
    setEndDate(data.event_expiry_date);
    setMemberData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (state) {
      handleFormat(state);
    } else {
      getEventDetailData();
    }
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12 mb-4">
          <IconButton
            className="back-screen-button"
            onClick={() =>
              navigate(`/dynamite-events/${params.event_id}/members`)
            }
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          <span className="sale-page-title">
            {memberData.first_name + " " + memberData.last_name}{" "}
            {"(" + memberData.email + ")"}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-6 mt-2">
          <h2>Update Event Info</h2>
        </div>
      </div>
      <form method="post" onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      label="Event Start Date *"
                      inputFormat="dd/MM/yyyy"
                      value={date}
                      onChange={handleChangeDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      label="Event End Date *"
                      inputFormat="dd/MM/yyyy"
                      value={endDate}
                      onChange={handleChangeEndDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button className="small-contained-button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default EditDynamiteEventMember;
