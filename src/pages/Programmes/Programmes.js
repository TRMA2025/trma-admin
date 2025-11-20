import { useFormik } from "formik";
import { useEffect, useState } from "react";
// material
import {
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { programmeListing } from "src/DAL/Programme/Programme";
import { filter } from "lodash";
import { makeStyles } from "@mui/styles";
import { htmlDecode } from "src/utils/convertHtml";
import { s3baseUrl } from "src/config/config";
import { Placeholder } from "react-bootstrap";
import CardSkeleton from "src/components/cardSkeletons/CardSkeleton";
import Card from "src/theme/overrides/Card";
import RecordNotFound from "src/components/RecordNotFound";

// ----------------------------------------------------------------------

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
  notchedOutline: {
    borderColor: "#fff !important",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Programmes() {
  const style = {
    marginRight: 2,
    width: 240,

    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
      "& .MuiInputLabel-root": { color: "white" },

      "& .mUI& .MuiOutlinedInput-root": {
        color: "white",

        "&.Mui-focused fieldset": {
          borderColor: "white",
        },
      },
    },
  };
  const classes = useStyles();
  console.log(classes, "classesclassesclassesclassesclasses");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [orderBy, setOrderBy] = useState("number");
  const [order, setOrder] = useState("asc");
  const [program, setProgram] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterName, setFilterName] = useState("");
  const [len, setLen] = useState(0);

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
    const result = await programmeListing();
    console.log(result, "resultresultresult");
    if (result.code === 200) {
      setIsLoading(false);
      setProgram(result.program);
      setLen(result?.program?.length);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  console.log(len, "scnz lelelelelel");

  const handleNavigateDetail = (value) => {
    navigate(`/programmes/programmes-detail/${value.program_slug}`, {
      state: { detailValues: value },
    });
  };

  const filteredPrograme = applySortFilter(
    program,
    getComparator(order, orderBy),
    filterName
  );

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
  // useEffect(() => {
  //   console.log("Program length updated scnz:", program.length);
  //   setLen(program.length);
  // }, [program]);

  // if (isLoading) {
  //   return <CardSkeleton />;
  // }

  const isRecordNotFound = filteredPrograme.length === 0;

  return (
    <div className="container mt-2">
      <div className="row">
        <div className="col-lg-6 col-sm-12">
          <h2>Programmes</h2>
        </div>
        <div className="col-lg-6 col-sm-12 d-flex justify-content-end">
          <TextField
            fullWidth
            label="Search"
            InputProps={{
              classes: {
                notchedOutline: classes.notchedOutline,
              },
            }}
            sx={{ marginRight: 2, width: 240 }}
            className="custom-search-field"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />

          {/* <TextField
            fullWidth
            label="Search"
            InputProps={{
              classes: {
                notchedOutline: classes.notchedOutline,
              },
            }}
            sx={{
              marginRight: 2,
              width: 240,
              "& .MuiInputLabel-root": { color: "white" }, // For label color
            }}
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          /> */}

          <button
            onClick={() => navigate(`/programmes/add-programme`)}
            className="small-contained-button"
          >
            Add Programme
          </button>
        </div>
        {isLoading && <CardSkeleton />}

        {filteredPrograme.map((value, index) => (
          <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
            <div className="card mt-1 pods-cards-shadow cursor h-100">
              {!value.status && (
                <div
                  className="inactive-badge"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: "red",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "16px 0 10px 0",
                    zIndex: 1,
                  }}
                >
                  Inactive
                </div>
              )}
              <img
                src={s3baseUrl + value.program_images.thumbnail_1}
                className="card-img-top pods-image"
                alt="Programme"
                onClick={() => handleNavigateDetail(value)}
              />
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3
                      className="h2-heading"
                      onClick={() => handleNavigateDetail(value)}
                    >
                      {htmlDecode(value.title)}
                    </h3>
                  </div>
                </div>
                <p className="programme-card-desc">
                  {htmlDecode(value.short_description)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isRecordNotFound && (
          <RecordNotFound title="Programmes" />
          // <Typography
          //   variant="h5"
          //   align="center"
          //   style={{ marginTop: 90 }}
          //   justifyContent="center"
          // >
          //   No results found
          // </Typography>
        )}
      </div>
    </div>
  );
}
