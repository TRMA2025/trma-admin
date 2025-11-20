import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { updateConsultantGeneralSettingApi } from "src/DAL/ClientSetting/ClientSetting";
import { addTagApi, updateTagsApi } from "src/DAL/book";
// import { addSchool, updateSchool } from "../../DAL/school";

const INITIAL_VALUES = {
  title: "",
  description: "",
  status: true,
  order: 1,
};

export default function AddorUpdateSchools(props) {
  const { selectedObject, onCloseDrawer, refreshList } = props;
  console.log(
    selectedObject,
    "selectedObjectselectedObjectselectedObjectselectedObject"
  );
  const [inputs, setInputs] = useState(INITIAL_VALUES);
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((old) => ({ ...old, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.title.length > 50) {
      enqueueSnackbar("Title must be 50 characters or less.", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }
    setSubmitting(true);
    const postData = {
      name: inputs.title,
      status: inputs.status,
      order: 1,
    };
    const data = {
      name: inputs.title,
      status: inputs.status,
    };

    let response;
    if (selectedObject) {
      response = await updateTagsApi(selectedObject._id, postData);
    } else {
      response = await addTagApi(data);
      console.log(response, " result of the api add tags");
    }

    if (response.code === 200) {
      enqueueSnackbar(response.message, { variant: "success" });
      refreshList();
      onCloseDrawer();
    } else {
      enqueueSnackbar(response.message, { variant: "error" });
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (selectedObject) {
      const data = selectedObject;
      setInputs({
        title: data.name,
        status: data.status,
      });
    }
  }, [selectedObject]);

  return (
    <form onSubmit={handleSubmit} className="drawer-form">
      <TextField
        required
        label="Title"
        variant="outlined"
        value={inputs.title}
        name="title"
        onChange={handleChange}
        fullWidth
      />

      <FormControl fullWidth variant="outlined">
        <InputLabel id="status-label">Status *</InputLabel>
        <Select
          required
          labelId="status-label"
          label="Status"
          value={inputs.status}
          name="status"
          onChange={handleChange}
        >
          <MenuItem value={true}>Active</MenuItem>
          <MenuItem value={false}>Inactive</MenuItem>
        </Select>
      </FormControl>
      <div className="d-flex justify-content-end">
        <button
          className="theme-button-contained"
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <CircularProgress size={15} />
          ) : selectedObject ? (
            "Update"
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}
