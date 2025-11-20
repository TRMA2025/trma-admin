import React from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { Icon } from "@iconify/react";
import { consultantListing } from "src/DAL/consultant/consultant";
import MUIAutocomplete from "src/components/GeneralComponents/MUIAutocomplete";
import { useEffect } from "react";

export default function StripeProductFilterNew({
  handleClearFilter,
  filterData,
  handleSelectOther,
  searchFunction,
}) {
  //Adding Department
  const [consultantValue, setConsultantValue] = React.useState([]);

  const consultantListData = async () => {
    let result = await consultantListing();
    console.log(result, "result");
    if (result.code == 200) {
      setConsultantValue(
        result.consultant_list.map((item) => {
          let full_name = item.first_name + " " + item.last_name;
          return {
            ...item,
            full_name,
            chip_label: full_name,
            chip_value: full_name,
          };
        })
      );
    }
  };

  useEffect(() => {
    consultantListData();
  }, []);

  return (
    <div className="container new-memories px-4">
      <FormControl component="fieldset" className="mt-4">
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={filterData.type}
          onChange={(e) => {
            handleSelectOther("type", e.target.value);
          }}
        >
          <FormControlLabel value="all" control={<Radio />} label="All " />
          <FormControlLabel value="admin" control={<Radio />} label="Admin " />
          <FormControlLabel
            value="consultant"
            control={<Radio />}
            label="Consultant"
          />
        </RadioGroup>
      </FormControl>
      {filterData.type == "consultant" && (
        <div className="mt-3">
          <MUIAutocomplete
            inputLabel="Delegate"
            selectedOption={filterData.id}
            setSelectedOption={(value) => {
              handleSelectOther("id", value);
            }}
            optionsList={consultantValue}
            name="full_name"
          />
        </div>
      )}

      <Box sx={{ py: 2 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          onClick={searchFunction}
          startIcon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: 5 }}
            >
              <path
                d="M13.1165 0.25H0.883548C0.321452 0.25 0.0378205 0.932013 0.436097 1.33029L5.3125 6.20743V11.6406C5.3125 11.8471 5.41325 12.0406 5.58242 12.1591L7.69179 13.6351C8.10794 13.9264 8.6875 13.6312 8.6875 13.1167V6.20743L13.564 1.33029C13.9615 0.932804 13.6798 0.25 13.1165 0.25Z"
                fill={get_root_value("--portal-theme-primary")}
              />
            </svg>
          }
        >
          Filter
        </Button>
      </Box>
      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="outlined"
        onClick={handleClearFilter}
        startIcon={<Icon icon={roundClearAll} />}
      >
        Clear All
      </Button>
    </div>
  );
}
