import { CircularProgress, IconButton, TextField } from "@mui/material";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { s3baseUrl } from "src/config/config";
import {
  get_protal_list_for_plan_api,
  update_portals_for_plan_api,
} from "src/DAL/WebsitePages/paymentPlan";
import moment from "moment";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function EventAccessPaymentPlan() {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [planDetail, setPlanDetail] = useState({});
  const [linkTitle, setLinkTitle] = useState("");

  const [link, setLink] = useState("");
  const getting_start_date = (object, plan) => {
    let selected_event = plan.event.find(
      (old_event) => old_event.event_id == object._id
    );
    if (selected_event) {
      return selected_event.start_date;
    }
    return object.start_date;
  };

  const getEventsList = async () => {
    const result = await get_protal_list_for_plan_api(params.plan_id);
    console.log(result, "check api for test");
    if (result.code == 200) {
      setPlanDetail(result.payment_plan);
      let selected_events = [];
      result.payment_plan.event.map((event) => {
        selected_events.push({
          ...event,
          _id: event.event_id,
        });
      });
      setSelected(selected_events);
      var eventsArray = [];
      result.events.map((item) => {
        item.start_date = getting_start_date(item, result.payment_plan);
        item.table_avatar = {
          src: s3baseUrl + item.images.thumbnail_3,
          alt: item.title,
        };
        item.is_show_celendar = true;
        eventsArray.push(item);
      });
      setEventsList(eventsArray);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSubmit = async () => {
    // setIsLoadingForm(true);
    let events_array = [];
    selected.map((item) => {
      var event_object = {
        event_id: item._id,
        title: item.title,
        no_of_days: item.no_of_days,
        start_date: moment(item.start_date).format("YYYY-MM-DD"),
      };
      events_array.push(event_object);
    });
    let eventObject = {
      event: events_array,
    };

    const result = await update_portals_for_plan_api(
      params.plan_id,
      eventObject
    );
    if (result.code == 200) {
      setIsLoadingForm(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      setIsLoadingForm(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleChange = (event, name) => {
    const value = event.target.value;
    const event_id = event.target.name;

    setEventsList((data) =>
      data.map((obj) => {
        if (obj._id === event_id) {
          return { ...obj, [name]: value };
        }
        return obj;
      })
    );

    setSelected((data) =>
      data.map((obj) => {
        if (obj._id === event_id) {
          return { ...obj, [name]: value };
        }
        return obj;
      })
    );
  };

  const find_and_update_start_date = (row, date, list, setList) => {
    let find_index = list.findIndex((prog) => prog._id == row._id);
    let temp_state = [...list];
    let temp_element = { ...temp_state[find_index] };
    temp_element.start_date = date;
    temp_state[find_index] = temp_element;
    setList(temp_state);
  };

  const handleChangeStartDate = (date, index, row) => {
    find_and_update_start_date(row, date, eventsList, setEventsList);
    find_and_update_start_date(row, date, selected, setSelected);
  };

  const TABLE_HEAD = [
    {
      id: "table_avatar",
      label: "Image",
      type: "thumbnail",
      className: "p-0",
    },
    { id: "title", label: "Event Title" },
    {
      id: "status",
      label: "Status",
      type: "row_status",
    },
    {
      id: "start_date",
      label: "Start Date",
      type: "row_calendar",
      handleChangeDate: handleChangeStartDate,
    },
    {
      id: "no_of_days",
      label: "No Of Days",
      renderData: (row) => {
        let is_selected = selected?.find((object) => row._id === object._id);
        let no_of_days =
          is_selected && is_selected.no_of_days
            ? is_selected.no_of_days
            : row.no_of_days;

        return (
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            type="number"
            onWheel={(event) => event.target.blur()}
            required
            name={row._id}
            className="default_consultant_commission_input"
            value={no_of_days}
            sx={{
              "& fieldset": { border: "none" },
            }}
            onChange={(e) => {
              handleChange(e, "no_of_days");
            }}
          />
        );
      },
    },
  ];
  let breadCrumbMenu = [
    {
      title: linkTitle,
      navigation: link,
      active: false,
    },

    {
      title: "Payment Plans",
      navigation: `${link}/${params.page_id}/payment-plans`,
      active: false,
    },
    {
      title: planDetail.plan_title,
      navigation: null,
      active: true,
    },
  ];
  useEffect(() => {
    console.log(window.location.pathname, "dsjlkfsd");
    if (pathname.match("/website-pages/")) {
      setLinkTitle("Pages");
      setLink("/website-pages");
    } else {
      setLinkTitle("Template Pages");
      setLink("/template-pages");
    }
  }, [pathname]);
  useEffect(() => {
    getEventsList();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12 mb-3 reply-anchor">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

          {/* <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton>
          <span className="sale-page-title">{planDetail.plan_title}</span> */}
        </div>
        <div className="col-6">
          <h2>Manage Events Access</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <CustomMUITable
            className="card-with-background"
            TABLE_HEAD={TABLE_HEAD}
            data={eventsList}
            selected={selected}
            setSelected={setSelected}
            checkbox_selection={true}
            pagePagination={true}
          />
        </div>
      </div>
      <div className="ms-auto text-end">
        <button
          className="small-contained-button mt-3 ml-auto"
          onClick={handleSubmit}
        >
          {isLoadingForm ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
