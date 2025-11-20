import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import {
  add_dynamite_event_category_api,
  dynamite_event_category_detail_api,
  update_dynamite_event_category_api,
} from "src/DAL/DynamiteEvents/Categories/Categories";
import GeneralCkeditor from "src/components/GeneralCkeditor";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function AddOrUpdateEventCategory() {
  const navigate = useNavigate();
  const { event_id, category_slug } = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("ADD");
  const [inputs, setInputs] = useState({
    title: "",
    order: 0,
    status: true,
    image: {},
    short_description: "",
    detail_description: "",
  });

  const getCategoryData = async () => {
    setIsLoading(true);
    let result = await dynamite_event_category_detail_api(category_slug);
    if (result.code == 200) {
      setFormType("EDIT");
      setInputs(result.dynamite_event_category);
      setIsLoading(false);
    } else {
      handleNavigate();
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("status", inputs.status);
    formData.append("short_description", inputs.short_description);
    formData.append("dynamite_event", event_id);
    if (formType === "EDIT") {
      formData.append("order", inputs.order);
    }
    formData.append("detail_description", inputs.detail_description);
    const result =
      formType === "ADD"
        ? await add_dynamite_event_category_api(formData)
        : await update_dynamite_event_category_api(formData, category_slug);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      handleNavigate();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    if (category_slug) {
      if (state) {
        setFormType("EDIT");
        setInputs(state);
      } else {
        getCategoryData();
      }
    }
  }, []);

  const handleNavigate = () => {
    navigate(`/dynamite-event-categories/${event_id}`);
  };

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={handleNavigate}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>{`${formType === "ADD" ? "Add" : "Edit"} Category`}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Category Title"
              variant="outlined"
              fullWidth
              required
              name="title"
              value={inputs.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                required
                value={inputs.status}
                label="Status *"
                onChange={handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
          {formType == "EDIT" && (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Order"
                variant="outlined"
                fullWidth
                required
                name="order"
                value={inputs.order}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="col-12 mt-4">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Short Description"
                multiline
                rows={6}
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
              <FormHelperText>Maximum limit 500 characters</FormHelperText>
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <h4>Detail Description</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="detail_description"
              editorHeight={320}
            />
          </div>
          <div className="text-end mt-4">
            <button className="small-contained-button">
              {formType == "ADD" ? "Submit" : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
