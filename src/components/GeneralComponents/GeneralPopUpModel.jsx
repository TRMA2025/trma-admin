import { Dialog } from "@mui/material";
import React from "react";

export default function GeneralPopUpModel({
  open,
  title,
  setOpen,
  componentToPassDown,
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "white",
            color: "black",
            boxShadow: "none",
            width: "35%",
          },
          className: "p-3 general-popup-model",
        }}
      >
        <div class="cross-icon" onClick={() => setOpen(false)}>
          x
        </div>
        <div className="popup-title">
          <h2>{title}</h2>
        </div>
        <hr />
        <div className="responce-messages">{componentToPassDown}</div>
      </Dialog>
    </>
  );
}
