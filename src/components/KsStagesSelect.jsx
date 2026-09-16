import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

/* Key stage multi-select, shared by the lesson, Getting Started and resource
   forms (16 Sep 2026). The option list is the one the lesson form already
   used, so every content type is tagged with the same vocabulary. The server
   matches these through utils/ks_stage.js, which also maps each ROI class to
   its NI/UK key stage. */
export const KS_STAGE_OPTIONS = [
  "Foundation",
  "KS1",
  "KS2",
  "Year 8",
  "Year 9",
  "Year 10",
  "Junior Infant / Senior Infant",
  "1st Class",
  "2nd Class",
  "3rd Class",
  "4th Class",
  "5th Class",
  "6th Class",
  "1st Year",
  "2nd Year",
  "3rd Year",
];

/* Add the stages to a multipart submission.
 *
 * With nothing ticked a single empty entry is still sent: the server treats a
 * missing field as "leave the tags alone" on edit, so without it an admin
 * could never clear every stage from an existing item. */
export const appendKsStages = (formData, stages) => {
  const list = Array.isArray(stages) ? stages : [];
  if (list.length === 0) {
    formData.append("ks_stages[]", "");
    return;
  }
  list.forEach((stage) => formData.append("ks_stages[]", stage));
};

export default function KsStagesSelect({ value, onChange }) {
  const selected = Array.isArray(value) ? value : [];
  return (
    <FormControl fullWidth>
      <InputLabel id="ks-stages-label">Key Stages</InputLabel>
      <Select
        labelId="ks-stages-label"
        multiple
        value={selected}
        onChange={(e) =>
          onChange(
            typeof e.target.value === "string"
              ? e.target.value.split(",")
              : e.target.value
          )
        }
        input={<OutlinedInput label="Key Stages" />}
        renderValue={(items) => items.join(", ")}
      >
        {KS_STAGE_OPTIONS.map((stage) => (
          <MenuItem key={stage} value={stage}>
            {stage}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        Leave empty to show this to every stage
      </FormHelperText>
    </FormControl>
  );
}
