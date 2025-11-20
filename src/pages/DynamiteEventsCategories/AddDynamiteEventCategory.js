import React, { useEffect, useState } from "react";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Select from "@mui/material/Select";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import { addDynamiteEventCategory } from "src/DAL/WebsitePagesold/DynamiteEventsCategories/DynamiteEventsCategories";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const AddDynamiteEventCategory = () => {
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [detailDescriptionCk, setDetailDescriptionCk] = useState("");
  const [inputs, setInputs] = useState({
    title: "",
    short_description: "",
    status: true,
    dynamite_event: "",
    image: {},
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
      setIsLoading(false);
    } else {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("short_description", inputs.short_description);
      formData.append("dynamite_event", params.event_id);
      formData.append("detail_description", detailDescriptionCk);
      formData.append("status", inputs.status);
      const result = await addDynamiteEventCategory(formData);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(`/dynamite-event-categories/${params.event_id}`);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() =>
              navigate(`/dynamite-event-categories/${params.event_id}`)
            }
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
        <div className="col-6">
          <h2>Add Category</h2>
        </div>
      </div>
      <form method="post" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Title"
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
                value={inputs.status}
                label="Status"
                required
                onChange={handleChange}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-12 mt-5">
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
              {/* <FormHelperText>Maximum limit 500 characters</FormHelperText> */}
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <h4>Detailed Description </h4>
            <TinyEditor
              setDetailDescription={setDetailDescriptionCk}
              detailDescriptionCk={detailDescriptionCk}
            />
          </div>
          <div className="text-end mt-4">
            <button onClick={handleSubmit} className="small-contained-button">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDynamiteEventCategory;
