import React from "react";
import {
  Box,
  Checkbox,
  Chip,
  ListItemText,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

/* Key stage multi-select, shared by the lesson, Getting Started and resource
   forms (16 Sep 2026). The option list is the one the lesson form already
   used, so every content type is tagged with the same vocabulary. Pills match
   these tags exactly (13 Oct 2026): no ROI -> NI equivalents. */
export const KS_STAGE_OPTIONS = [
  // NI (BeeMe)
  "Foundation",
  "KS1",
  "KS2",
  "KS3",
  // NI (MindMe)
  "Year 8",
  "Year 9",
  "Year 10",
  // ROI (BeeMe)
  "Junior Infants",
  "Senior Infants",
  "1st Class",
  "2nd Class",
  "3rd Class",
  "4th Class",
  "5th Class",
  "6th Class",
  // ROI (MindMe)
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

/* Tags on an item that are not picker options (13 Oct 2026), e.g. the old
   ROI "Infant", "Junior", "Senior" from the April tagging script. They used
   to sit in the field invisibly - no menu entry to untick - so every save
   sent them back. Now they show in red with a cross to remove them, and the
   form saves exactly the tags shown in the field, nothing else. */
export const unknownStages = (value) =>
  (Array.isArray(value) ? value : []).filter((s) => !KS_STAGE_OPTIONS.includes(s));

export default function KsStagesSelect({ value, onChange }) {
  const selected = Array.isArray(value) ? value : [];
  const unknown = unknownStages(selected);
  const remove = (stage) => onChange(selected.filter((s) => s !== stage));
  return (
    <FormControl fullWidth error={unknown.length > 0}>
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
        renderValue={(items) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {items.map((stage) =>
              unknown.includes(stage) ? (
                <Chip
                  key={stage}
                  label={stage}
                  size="small"
                  color="error"
                  title="Not a picker option: remove it"
                  // Keep the cross from opening the menu.
                  onMouseDown={(e) => e.stopPropagation()}
                  onDelete={() => remove(stage)}
                />
              ) : (
                <Chip key={stage} label={stage} size="small" />
              )
            )}
          </Box>
        )}
      >
        {KS_STAGE_OPTIONS.map((stage) => (
          <MenuItem key={stage} value={stage} dense>
            <Checkbox size="small" checked={selected.includes(stage)} />
            <ListItemText primary={stage} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {unknown.length > 0
          ? `Not a picker option: ${unknown.join(", ")}. Remove with the cross; it will be saved again if left.`
          : "Leave empty to show this to every stage"}
      </FormHelperText>
    </FormControl>
  );
}
