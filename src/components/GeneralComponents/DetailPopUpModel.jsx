import { Dialog, Tooltip } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventIcon from "@mui/icons-material/Event";
export default function DetailPopUpModel({
  open,
  title,
  setOpen,
  componentToPassDown,
  eventDetailData,
  handleAgreeDelete,
  handleOpenDrawerItration,
  handleEdit,
  user_type,
}) {
  console.log(user_type, "user_typeuser_type");

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
          },
          className: "p-3 general-popup-model",
        }}
      >
        <div class="icon-event-detail d-flex" onClick={() => setOpen(false)}>
          <>
            {user_type == "delegate" ? (
              <>
                <div className="other-detail-icon" onClick={handleAgreeDelete}>
                  <DeleteOutlineIcon />
                </div>
              </>
            ) : (
              <>
                {" "}
                <Tooltip title="Edit Iteration">
                  <div
                    className="other-detail-icon"
                    onClick={handleOpenDrawerItration}
                  >
                    <EventIcon />
                  </div>
                </Tooltip>
                <div className="other-detail-icon" onClick={handleEdit}>
                  <Tooltip title="Edit Event">
                    <EditIcon />
                  </Tooltip>
                </div>
                <div className="other-detail-icon" onClick={handleAgreeDelete}>
                  <Tooltip title="Delete Event">
                    <DeleteOutlineIcon />
                  </Tooltip>
                </div>
              </>
            )}
          </>

          <div className="close-detail-icon" onClick={() => setOpen(false)}>
            <CloseIcon />
          </div>
        </div>
        {/* <div className="popup-title">
          <h2 className="mb-0">{title}</h2>
        </div> */}
        {/* <hr /> */}
        <div className="responce-messages">{componentToPassDown}</div>
      </Dialog>
    </>
  );
}
