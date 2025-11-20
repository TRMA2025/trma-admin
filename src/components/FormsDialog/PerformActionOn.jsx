import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { get_root_value } from "src/utils/domUtils";

function PerformActionOn({ handleAgree, open, setOpen, title }) {
  const [value, setValue] = useState("current");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  useEffect(() => {
    setValue("current");
  }, []);
  return (
    <>
      <Dialog
        open={open}
        disableScrollLock={true}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: "#9f00ff",
            color: "#fff",
            boxShadow: "none",
          },
          className: "perform-action-on",
        }}>
        <DialogTitle style={{ paddingBottom: 0, color: "#9f00ff" }}>
          {title ? title : "Perform this action On?"}
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={value}
            name="radio-buttons-group"
            onChange={handleChange}
            style={{ marginTop: "10px" }}>
            <FormControlLabel
              value="current"
              control={<Radio />}
              label="This Event"
            />
            <FormControlLabel
              value="current_and_after"
              control={<Radio />}
              label="This and following Events"
            />
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="All Events"
            />
          </RadioGroup>
        </DialogTitle>
        <DialogActions>
          <Button
            sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
            className="model-cancel-hover"
            onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
            // className="model-button-hover"
            onClick={() => {
              handleAgree(value);
            }}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PerformActionOn;
