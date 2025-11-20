import { useFormik } from "formik";
import { useEffect, useState } from "react";
// material
import { CircularProgress, Container, Stack, Typography } from "@mui/material";
// components

//
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Label from "src/components/Label";
import { affirmationListApi } from "src/DAL/affirmation/affirmationApi";
import RecordNotFound from "src/components/RecordNotFound";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function Affirmation() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [program, setProgram] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const programsList = async () => {
    const result = await affirmationListApi();
    if (result.code == 200) {
      setIsLoading(false);
      setProgram(result.general_affirmation);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleNavigateDetail = (value) => {
    navigate(`/affirmation/affirmation-detail/${value._id}`, {
      state: value,
    });
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };
  useEffect(() => {
    programsList();
  }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-7 col-sm-12">
          <h2>Affirmation </h2>
        </div>
        <div className="col-lg-5 col-sm-12 text-end">
          <button
            onClick={() => navigate(`/affirmation/add-affirmation`)}
            className="small-contained-button"
          >
            Add Affirmation
          </button>
        </div>
        {program.length == 0 ? (
          <RecordNotFound title="Affirmations" />
        ) : (
          program.map((value, index) => {
            return (
              <>
                <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
                  <div className="card mt-4 pods-cards-shadow cursor h-100">
                    <img
                      src={s3baseUrl + value.affirmation_image.thumbnail_1}
                      className="card-img-top pods-image"
                      alt="Programme"
                      onClick={() => handleNavigateDetail(value)}
                    />
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <p

                          // onClick={() => handleNavigateDetail(value)}
                          >
                            {htmlDecode(value.description)}
                          </p>
                        </div>
                      </div>
                      <p
                        className="programme-card-desc mb-3"
                        // onClick={() => handleNavigateDetail(value)}
                      >
                        {/* {htmlDecode(value.short_description)} */}
                      </p>
                      {/* <p className="programme-card-desc mb-3 programme-card-desc-muted">
                      <b className="text-muted">Programme:</b>{" "}
                      {value.program.title}
                    </p> */}
                      <div className="row recording-card-date">
                        <div className="col-8 text-end ms-auto">
                          {/* {value.status == true ? "True" : "False"} */}
                          <Label
                            variant="ghost"
                            color={value.status === false ? "error" : "success"}
                          >
                            {value.status === false ? "InActive" : "Active"}
                          </Label>
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
