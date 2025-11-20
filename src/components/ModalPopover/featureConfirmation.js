import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

function FeatureConfirmation({
  openDelete,
  setOpenDelete,
  handleAgree,
  title,
  open,
  setOpen,
}) {
  const handleCloseDialog = () => {
    setOpenDelete(false);
  };
  const handleCloseDialog1 = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={openDelete}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: "white",
            color: "black",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle>
          {title ? title : "Are you sure you want to take this action?"}
        </DialogTitle>
        <DialogActions>
          <Button className="model-button-hover" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button className="model-button-hover" onClick={handleAgree}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleCloseDialog1}
        PaperProps={{
          style: {
            backgroundColor: "white",
            color: "black",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle>
          {title ? title : "Are you sure you want to take this action?"}
        </DialogTitle>
        <DialogActions>
          <Button className="model-button-hover" onClick={handleCloseDialog1}>
            Cancel
          </Button>
          <Button className="model-button-hover" onClick={handleAgree}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FeatureConfirmation;
