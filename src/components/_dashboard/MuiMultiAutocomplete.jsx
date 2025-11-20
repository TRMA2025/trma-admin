// MuiMultiAutocomplete
import { Autocomplete, Chip, TextField } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
const MuiMultiAutocomplete = ({
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  // ---------------------------------------------------------
  const handleChange = (newValue) => {
    if (newValue) {
      onChange(newValue);
    }
  };
  // ---------------------------------------------------------
  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={options}
      value={value}
      disabled={disabled}
      filterSelectedOptions={true}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      onChange={(event, value) => handleChange(value)}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={`${option.label}`}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label={label} />
      )}
    />
  );
};

export default MuiMultiAutocomplete;

MuiMultiAutocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
