import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { s3baseUrl } from "src/config/config";
import {
  delete_dynamite_event_video_api,
  dynamite_event_category_videos_api,
} from "src/DAL/DynamiteEvents/Categories/EventsCategoryVideos/EventsCategoryVideos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomMUITable from "src/components/CustomMUITable";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "title", label: "Title", alignRight: false },
  { id: "table_avatar", label: "Image", alignRight: false, type: "thumbnail" },
  { id: "order", label: "Order", alignRight: false },
  { id: "is_featured", label: "Is Feature", alignRight: false },
  { id: "is_chat_enabled", label: "Is Chat Enable", alignRight: false },
  {
    id: "video_status",
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

export default function DynamiteEventVideoList() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { category_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [videosData, setVideosData] = useState([]);
  const [eventData, setEventData] = useState({});

  const getVideosListing = async () => {
    const result = await dynamite_event_category_videos_api(category_id);
    if (result.code == 200) {
      const videos = result.dynamite_event_category_video_list.map((video) => {
        return {
          ...video,
          table_avatar: {
            src: s3baseUrl + video.image?.thumbnail_2,
            alt: video.title,
          },
          video_status: video.status,
          is_chat_enabled: video.is_chat_enable ? "Yes" : "No",
          is_featured: video.is_feature ? "Yes" : "No",
        };
      });
      setVideosData(videos);
      setEventData(result.dynamite_event_info);
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
    const result = await delete_dynamite_event_video_api(deleteDoc._id);
    if (result.code === 200) {
      setVideosData((videosData) => {
        return videosData.filter((data) => data._id !== deleteDoc._id);
      });
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleEdit = (value) => {
    navigate(`/dynamite-event-videos/${category_id}/edit-video/${value._id}`, {
      state: value,
    });
  };

  const handleNavigate = () => {
    navigate(`/dynamite-event-videos/${category_id}/add-video`);
  };

  const handleQuestionsList = (row) => {
    navigate(`/dynamite-event-videos/video-questions/${row._id}`);
  };

  const handleQuestionsAnswers = (row) => {
    navigate(`/dynamite-event-videos/video-question/answers/${row._id}`);
  };

  const handleQuestionsConfiguration = (row) => {
    navigate(`/dynamite-event-videos/questions-configuration/${row._id}`);
  };

  let child_menu_options = [
    {
      label: "Questions Setting",
      icon: "akar-icons:edit",
      handleClick: handleQuestionsConfiguration,
    },
    {
      label: "Manage Questions",
      icon: "akar-icons:edit",
      handleClick: handleQuestionsList,
    },
    {
      label: "Questions Answers",
      icon: "akar-icons:edit",
      handleClick: handleQuestionsAnswers,
    },
  ];

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
    {
      label: "Questions Configuration",
      icon: "akar-icons:edit",
      child_options: child_menu_options,
    },
  ];

  useEffect(() => {
    getVideosListing();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this video?"}
        handleAgree={handleDelete}
      />

      <div className="container">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() =>
              navigate(`/dynamite-event-categories/${eventData._id}`)
            }
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
        <div className="row mb-5">
          <div className="col-lg-6 col-sm-12">
            <h2>Event Videos</h2>
          </div>
          <div className="col-lg-6 col-sm-12 text-end ">
            <button onClick={handleNavigate} className="small-contained-button">
              Add Video
            </button>
          </div>
        </div>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={videosData}
          MENU_OPTIONS={MENU_OPTIONS}
          className="card-with-background"
        />
      </div>
    </>
  );
}
