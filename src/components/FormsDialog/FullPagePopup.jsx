import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function FullPagePopup({ open, setOpen, componentToPassDown }) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="show-dialog-on-full"
      >
        <div className="pt-3 ps-3">
          <IconButton
            className="back-screen-button"
            sx={{ color: "#9f00ff" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="responce-messages">{componentToPassDown}</div>
      </Dialog>
    </div>
  );
}
