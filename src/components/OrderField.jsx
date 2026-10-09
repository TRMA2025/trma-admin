import React from "react";
import TextField from "@mui/material/TextField";

/* Order input shared by the lesson, Getting Started, resource and stage edit
   forms (9 Oct 2026). Whole numbers from 1 up. The value never changes by
   accident: the mouse wheel blurs the field instead of stepping it, and the
   ArrowUp / ArrowDown keys are blocked. */
export default function OrderField({ inputProps, onKeyDown, ...props }) {
  return (
    <TextField
      type="number"
      {...props}
      inputProps={{ min: 1, step: 1, ...inputProps }}
      onWheel={(event) => event.target.blur()}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
        }
        if (onKeyDown) onKeyDown(event);
      }}
    />
  );
}
