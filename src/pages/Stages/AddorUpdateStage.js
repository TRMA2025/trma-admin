import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { add_stage, update_stage } from "src/DAL/Stages/Stages";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function AddorUpdateStage({
  editDoc,
  formType,
  handleCloseAddStage,
  getQuestionListing,
}) {
  const classes = useStyles();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    order: "",
    description: "",
    status: true,
  });
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let postData = {
      name: inputs.name,
      status: inputs.status,
      description: inputs.description,
    };
    if (formType == "ADD") {
      postData.programme_slug = params.slug;
    }
    if (formType == "Edit") {
      postData.order = inputs.order;
    }
    console.log(postData, "postData");
    setIsLoading(true);
    const result =
      formType === "ADD"
        ? await add_stage(postData)
        : await update_stage(postData, editDoc.id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      getQuestionListing();
      handleCloseAddStage();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (formType == "Edit") {
      setIsLoading(true);
      setInputs(editDoc);
      setIsLoading(false);
    }
  }, []);
  // if (isLoading == true) {
  //   return (
  //     <CircularProgress
  //       className={`${classes.loading} loading-preview-svg`}
  //       color="primary"
  //     />
  //   );
  // }
  return (
    <form onSubmit={handleSubmit}>
      <div className="row m-2">
        <div className="col-12 mt-3">
          <TextField
            fullWidth
            id="outlined-basic"
            label="Name"
            variant="outlined"
            name="name"
            value={inputs.name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="col-12 mt-3">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status *</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="status"
              value={inputs.status}
              label="Status *"
              onChange={handleChange}>
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>InActive</MenuItem>
            </Select>
          </FormControl>
        </div>
        {formType == "Edit" && (
          <div className="col-12 mt-3">
            <TextField
              id="outlined-basic"
              label="Order"
              variant="outlined"
              type="number"
              placeholder="Order"
              required
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
              name="order"
              value={inputs.order}
              onChange={handleChange}
              onWheel={(event) => event.target.blur()}
            />
          </div>
        )}

        <div className="col-12 mt-3">
          <TextField
            fullWidth
            id="outlined-basic"
            label="Popup Description"
            variant="outlined"
            name="description"
            multiline
            rows={4}
            value={inputs.description}
            required
            onChange={handleChange}
          />
        </div>
        <div className="col-12 mt-3">
          <div className="text-end mt-4">
            <button className="small-contained-button">
              {formType == "ADD"
                ? isLoading
                  ? "Saving..."
                  : "Save"
                : isLoading
                ? "Updating..."
                : "Update"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
