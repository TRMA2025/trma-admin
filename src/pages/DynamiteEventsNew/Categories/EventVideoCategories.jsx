import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import {
  delete_dynamite_event_category_api,
  dynamite_events_category_list_api,
} from "src/DAL/DynamiteEvents/Categories/Categories";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomMUITable from "src/components/CustomMUITable";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "title", label: "Title", alignRight: false },
  { id: "order", label: "Order", alignRight: false },
  {
    id: "category_status",
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

export default function EventVideoCategories() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { event_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);

  const getCategoriesListing = async () => {
    const result = await dynamite_events_category_list_api(event_id);
    if (result.code == 200) {
      const categories = result.dynamite_event_category_list.map((category) => {
        return {
          ...category,
          category_status: category.status,
        };
      });
      setCategoriesData(categories);
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
    const result = await delete_dynamite_event_category_api(
      deleteDoc.dynamite_event_category_slug
    );
    if (result.code === 200) {
      setCategoriesData((categoriesData) => {
        return categoriesData.filter((data) => data._id !== deleteDoc._id);
      });
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleEdit = (value) => {
    navigate(
      `/dynamite-event-categories/${event_id}/edit-category/${value.dynamite_event_category_slug}`,
      {
        state: value,
      }
    );
  };

  const handleNavigate = () => {
    navigate(`/dynamite-event-categories/${event_id}/add-category`);
  };

  const handleChangVideo = (value) => {
    navigate(`/dynamite-event-videos/${value._id}`);
  };

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
      label: "Videos",
      icon: "akar-icons:edit",
      handleClick: handleChangVideo,
    },
  ];

  useEffect(() => {
    getCategoriesListing();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this category?"}
        handleAgree={handleDelete}
      />

      <div className="container">
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
        <div className="row mb-5">
          <div className="col-lg-6 col-sm-12">
            <h2>Event Categories</h2>
          </div>
          <div className="col-lg-6 col-sm-12 text-end ">
            <button onClick={handleNavigate} className="small-contained-button">
              Add Category
            </button>
          </div>
        </div>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={categoriesData}
          MENU_OPTIONS={MENU_OPTIONS}
          className="card-with-background"
        />
      </div>
    </>
  );
}
