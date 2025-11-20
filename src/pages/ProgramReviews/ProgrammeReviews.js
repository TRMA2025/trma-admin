import React from "react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
// material
import {
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
// components
import Page from "../../components/Page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  ProgrammesSort,
  ProgrammesList,
  ProgrammesCartWidget,
  ProgrammesFilterSidebar,
  ProgrammesCard,
} from "../../components/_dashboard/programmes";
//
import PRODUCTS from "../../_mocks_/products";
import {
  deleteProgrammeReviewApi,
  programmeListing,
  programmeReviewApi,
} from "src/DAL/Programme/Programme";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import CustomPopover from "src/components/MenuOption/CustomPopover";
import { videoImage } from "src/assets";
import RecordNotFound from "../../components/RecordNotFound";
import ReactVideoPlayerReviews from "src/components/ReactVideoPlayer/ReactVideoPlayerReviews";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ProgrammeReviews() {
  const classes = useStyles();
  const params = useLocation();
  const { slug } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [review, setReview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteValue, setDeleteValue] = React.useState("");
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },
    {
      title: `${slug}`,
      navigation: `/programmes/programmes-detail/${slug}`,
      active: false,
    },
    {
      title: "Reviews",
      navigation: null,
      active: true,
    },
  ];
  const formik = useFormik({
    initialValues: {
      gender: "",
      category: "",
      colors: "",
      priceRange: "",
      rating: "",
    },
    onSubmit: () => {
      setOpenFilter(false);
    },
  });

  const { resetForm, handleSubmit } = formik;
  console.log(params.state, "parrrr");
  console.log(slug, "slugslugslug");
  const reviewList = async () => {
    const result = await programmeReviewApi(slug);
    console.log(result, "kkkkkkkkkkk");
    if (result.code == 200) {
      setIsLoading(false);
      setReview(result.program_review);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleAgreeDelete = (value) => {
    setDeleteValue(value);
    setOpenDelete(true);
  };

  const handleNavigateDetail = (value) => {
    console.log(value, "valueeeee");
    navigate(`/programmes/programmes-detail/${value?.program_slugslug}`, {
      state: { detailValues: value },
    });
  };
  const handleDelete = async () => {
    console.log(deleteValue, "delete function run");
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteProgrammeReviewApi(deleteValue._id);
    if (result.code === 200) {
      reviewList();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleEdit = (value) => {
    navigate(`/programmes/${params.state?.program_slug}/edit-review`, {
      state: value,
    });
  };

  useEffect(() => {
    reviewList();
  }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          {/* <IconButton
            className="back-screen-button"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton> */}
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() =>
              navigate(`/programmes/lessons-listing/$?{program_slug}`, {
                state: { name: title, slug:? program_slug },
              })
            }
          >
            View Lessons
          </button> */}
        </div>
        <div className="col-lg-7 col-sm-12">
          <h2>Reviews </h2>
        </div>
        <div className="col-lg-5 col-sm-12 text-end">
          <button
            onClick={() => navigate(`/programmes/${slug}/add-reviews`)}
            className="small-contained-button"
          >
            Add Review
          </button>
        </div>
        {review.length < 1 ? (
          <RecordNotFound title="Reviews" />
        ) : (
          review?.map((value, index) => {
            return (
              <>
                <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
                  <div className="card mt-4 pods-cards-shadow cursor h-100">
                    {value.review_images_url?.thumbnail_1 ? (
                      <img
                        src={
                          value.review_images_url?.thumbnail_1
                            ? s3baseUrl + value.review_images_url?.thumbnail_1
                            : ""
                        }
                        className="card-img-top pods-image"
                        alt="Programme"

                        // onClick={() => handleNavigateDetail(value)}
                      />
                    ) : (
                      <div className="reviews-section">
                        <ReactVideoPlayerReviews url={value.review_file_url} />
                      </div>
                    )}
                    <div className="card-body">
                      <div className="row">
                        <div className="col-10">
                          <h3
                            className="h2-heading"
                            // onClick={() => handleNavigateDetail(value)}
                          >
                            {htmlDecode(value.client_name)}
                          </h3>
                        </div>

                        <div className="col-2 menu-option">
                          <CustomPopover menu={MENU_OPTIONS} data={value} />
                        </div>
                        <CustomConfirmation
                          open={openDelete}
                          setOpen={setOpenDelete}
                          title={"Are you sure you want to delete ?"}
                          handleAgree={handleDelete}
                        />
                      </div>
                      <p
                        className="programme-card-desc mb-3"
                        // onClick={() => handleNavigateDetail(value)}
                      >
                        {htmlDecode(
                          value.short_description.length > 1
                            ? value.short_description.substring(0, 500)
                            : ""
                        )}
                      </p>

                      <div className="row recording-card-date">
                        <div className="col-6 card-button recording-card-date-position">
                          <p className="pods-active-members">
                            {/* <span>Review Type {value.review_type} </span> */}
                          </p>
                        </div>
                        <div className="col-8 text-end ms-auto">
                          {/* {value.total_lesson_duration} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })
        )}
      </div>
    </div>
  );
}
