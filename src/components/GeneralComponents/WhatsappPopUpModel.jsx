import { Dialog } from "@mui/material";
import React from "react";

export default function WhatsappPopUpModel({
  open,
  title,
  setOpen,
  componentToPassDown,
  show_date_and_income,
}) {
  return (
    <>
      <Dialog
        className="hide-index"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          className: `p-3 general-popup-model ${
            show_date_and_income ? "general-popup-model-max-width" : ""
          }`,
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
