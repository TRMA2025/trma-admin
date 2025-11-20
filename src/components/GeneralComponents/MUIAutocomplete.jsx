import { Autocomplete, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";

export default function MUIAutocomplete({
  inputLabel,
  selectedOption,
  setSelectedOption,
  optionsList,
  multiple,
  required,
  name,
  size,
  setCustomSearch,
}) {
  const [inputValue, setInputValue] = useState("");
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    let date_list = [];
    optionsList.map((item) => {
      if (multiple) {
        let find = selectedOption.find(
          (selected) => selected[name] == item[name]
        );
        if (!find) {
          return date_list.push(item);
        }
      } else if (!selectedOption || selectedOption[name] !== item[name]) {
        return date_list.push(item);
      }
    });

    setDataList(date_list);
  }, [optionsList, selectedOption]);

  const handleChangeInput = (value) => {
    if (setCustomSearch) {
      setCustomSearch(value);
    }
    setInputValue(value);
  };

  return (
    <Autocomplete
      multiple={multiple}
      value={selectedOption}
      onChange={(event, newValue) => {
        setSelectedOption(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        handleChangeInput(newInputValue);
      }}
      className="w-100 mui-select autocomplete-mui"
      PaperComponent={({ children }) => (
        <Paper className="autocomplete-paper">{children}</Paper>
      )}
      size={size ? size : "medium"}
      id="controllable-states-demo"
      options={dataList}
      getOptionLabel={(option) => option[name]}
      renderInput={(params) => {
        const inputProps = params.inputProps;
        inputProps.autoComplete = "off";
        return (
          <TextField
            {...params}
            label={inputLabel}
            placeholder={inputLabel}
            required={required}
          />
        );
      }}
    />
  );
}
