import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

function CustomConfirmation({
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
        <DialogTitle sx={{ color: "#9f00ff", fontWeight: 500 }}>
          {title ? title : "Are you sure you want to take this action?"}
        </DialogTitle>
        <DialogActions>
          <Button
            sx={{ fontWeight: 600, fontSize: "16px" }}
            // sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <Button
            sx={{ fontWeight: 600, fontSize: "16px" }}
            className="model-button-hover"
            onClick={handleAgree}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {/* New to solve delete issue  */}
      <Dialog
        open={open}
        onClose={handleCloseDialog1}
        PaperProps={{
          style: {
            backgroundColor: "white",
            color: "black",
            boxShadow: "none",
            maxWidth: "615px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#9f00ff", fontWeight: 600 }}>
          {title ? title : "Are you sure you want to take this action?"}
        </DialogTitle>
        <DialogActions>
          <Button
            className="model-button-hover"
            onClick={handleCloseDialog1}
            sx={{ fontWeight: 600, fontSize: "16px" }}
          >
            Cancel
          </Button>
          <Button
            className="model-button-hover"
            onClick={handleAgree}
            sx={{ fontWeight: 600, fontSize: "16px" }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CustomConfirmation;
