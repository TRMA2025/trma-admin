import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { s3baseUrl } from "src/config/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  delete_general_event_api,
  general_events_list_api,
} from "src/DAL/DynamiteEvents/GeneralEvents/GeneralEvents";
import CustomMUITable from "src/components/CustomMUITable";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "title", label: "Title", alignRight: false },
  { id: "table_avatar", label: "Image", alignRight: false, type: "thumbnail" },
  {
    id: "event_type",
    label: "Event Type",
    alignRight: false,
    className: "text-capitalize",
  },
  { id: "order", label: "Order", alignRight: false },
  {
    id: "event_status",
    label: "Status",
    type: "row_status",
  },
  { id: "action", label: "Action", alignRight: false, type: "action" },
];

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function GeneralEvents() {
  const navigate = useNavigate();
  const { dynamite_event_id } = useParams();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [eventsData, setEventsData] = useState([]);

  const getEventsListing = async () => {
    const result = await general_events_list_api(dynamite_event_id);
    if (result.code == 200) {
      const events = result.home_event.map((event) => {
        return {
          ...event,
          table_avatar: {
            src: s3baseUrl + event.images.thumbnail_2,
            alt: event.title,
          },
          event_status: event.status,
        };
      });
      setEventsData(events);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    const result = await delete_general_event_api(deleteDoc.event_slug);
    if (result.code === 200) {
      setEventsData((eventsData) => {
        return eventsData.filter((data) => data._id !== deleteDoc._id);
      });
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleEdit = (value) => {
    navigate(`/dynamite-events/general-events/edit-event/${value.event_slug}`, {
      state: value,
    });
  };

  const handleNavigate = () => {
    navigate(`/dynamite-events/${dynamite_event_id}/general-events/add-event`);
  };

  useEffect(() => {
    getEventsListing();
  }, []);

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this event?"}
        handleAgree={handleDelete}
      />

      <div className="container">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(`/dynamite-events/`)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
        <div className="row mb-5">
          <div className="col-lg-6 col-sm-12">
            <h2>Events</h2>
          </div>
          <div className="col-lg-6 col-sm-12 text-end ">
            <button onClick={handleNavigate} className="small-contained-button">
              Add Event
            </button>
          </div>
        </div>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={eventsData}
          MENU_OPTIONS={MENU_OPTIONS}
          className="card-with-background"
        />
      </div>
    </>
  );
}
