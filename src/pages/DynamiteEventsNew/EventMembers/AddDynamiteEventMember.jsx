import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress, Autocomplete } from "@mui/material";
import moment from "moment";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import {
  add_dynamite_event_member,
  get_live_dynamite_event_another_member,
} from "src/DAL/DynamiteEvents/EventMembers/EventMembers";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function AddDynamiteEventMember() {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [personName, setPersonName] = useState([]);
  const [member, setMember] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [serchText, setSerchText] = useState("all");
  const [endDate, setEndDate] = useState("");
  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    is_member_create: false,
    email: "",
  });

  const getStartEndDate = () => {
    var new_date = moment(date, "YYYY-MM-DD").add(30, "days");
    setEndDate(new_date);
  };

  const getMember = async () => {
    const result = await get_live_dynamite_event_another_member(
      params.event_id,
      serchText
    );
    if (result.code === 200) {
      setPersonName(result.member);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChangeDate = (newValue) => {
    setDate(newValue);
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const value = event.target.value;
    setSerchText(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    let selected_member_array = [];
    let selected_member_object = {};
    member.map((member) => {
      selected_member_object = {
        member_id: member._id,
      };
      selected_member_array.push(selected_member_object);
    });

    formData.append("start_date", moment(date).format("YYYY-MM-DD"));
    formData.append("expiry_date", moment(endDate).format("YYYY-MM-DD"));
    formData.append("is_member_create", inputs.is_member_create);
    formData.append("dynamite_event", params.event_id);

    if (inputs.is_member_create) {
      formData.append("first_name", inputs.name);
      formData.append("last_name", inputs.last_name);
      formData.append("email", inputs.email);
    } else {
      formData.append("member", JSON.stringify(selected_member_array));
    }

    const result = await add_dynamite_event_member(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/dynamite-events/${params.event_id}/members`);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMember();
  }, [serchText]);

  useEffect(() => {
    getStartEndDate();
  }, [date]);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() =>
              navigate(`/dynamite-events/${params.event_id}/members`)
            }
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
          <h2>Add Members to Event</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">Member </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_member_create"
                    value={inputs.is_member_create}
                    label="Member"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value={false}>Add Existing Member</MenuItem>
                    <MenuItem value={true}>Add New Member</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      label="Start Date"
                      inputFormat="dd-MM-yyyy"
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
                      label="Expiry Date"
                      inputFormat="dd-MM-yyyy"
                      value={endDate}
                      onChange={handleChangeEndDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>

              {inputs.is_member_create ? (
                <>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      required
                      name="first_name"
                      value={inputs.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      required
                      name="last_name"
                      value={inputs.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      required
                      name="email"
                      value={inputs.email}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={personName}
                    getOptionLabel={(option) =>
                      option.first_name + " (" + option.email + ")"
                    }
                    filterSelectedOptions
                    value={member}
                    onChange={(event, newValue) => {
                      setMember(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Members"
                        placeholder="Members"
                        onChange={handleSearch}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button className="small-contained-button">Submit</button>
        </div>
      </form>
    </div>
  );
}
