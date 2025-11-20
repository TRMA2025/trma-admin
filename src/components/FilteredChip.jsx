import React from "react";
import Chip from "@mui/material/Chip";
import moment from "moment";
import { get_root_value } from "src/utils/domUtils";
import { show_proper_words } from "src/utils/constant";

const FilteredChip = ({
  data,
  tempState,
  EMPTY_FILTER,
  ALTER_FILTER,
  onDeleteChip,
  countFilter,
  onClear,
}) => {
  const hanlde_delete = (item) => {
    let value = item.value;
    let key = item.key;
    let item_type = typeof data[key];

    let temp_state = { ...tempState };
    if (item_type === "object" && Array.isArray(data[key])) {
      let new_array = data[key].filter((array) =>
        array.chip_value ? array.chip_value !== value : array !== value
      );
      temp_state[key] = new_array;
    } else {
      if (ALTER_FILTER) {
        let alter_value = ALTER_FILTER[key];
        if (alter_value !== undefined) {
          temp_state[key] = ALTER_FILTER[key];
        } else {
          temp_state[key] = EMPTY_FILTER[key];
        }
      } else {
        temp_state[key] = EMPTY_FILTER[key];
      }
    }
    onDeleteChip(temp_state);
  };

  let STATUS = {
    true: "Active",
    false: "Inactive",
  };

  let chips_array = [];

  // Check for date range (start_date and end_date)
  if (data.start_date && data.end_date) {
    chips_array.push({
      key: "date_range",
      value: `${data.start_date}-${data.end_date}`,
      label: `Date Range: ${moment(data.start_date).format(
        "DD-MM-YYYY"
      )} to ${moment(data.end_date).format("DD-MM-YYYY")}`,
    });
  }

  Object.keys(data).map((keyName) => {
    let key_value = data[keyName];
    let key_type = typeof key_value;

    // Skip individual start_date and end_date chips since we're combining them
    if (
      (keyName === "start_date" || keyName === "end_date") &&
      data.start_date &&
      data.end_date
    ) {
      return;
    }

    const push_date = () => {
      chips_array.push({
        value: key_value,
        key: keyName,
        label:
          show_proper_words(keyName) +
          " " +
          moment(key_value).format("DD-MM-YYYY"),
      });
    };

    if (keyName === "status" && key_value !== "") {
      chips_array.push({
        key: keyName,
        value: key_value,
        label: STATUS[key_value],
      });
    } else if (key_value && key_value !== "0") {
      switch (key_type) {
        case "string":
          if (moment(key_value).isValid()) {
            push_date();
          } else {
            chips_array.push({
              key: keyName,
              value: key_value,
              label: show_proper_words(key_value),
            });
          }
          break;
        case "boolean":
          chips_array.push({
            key: keyName,
            value: key_value,
            label: show_proper_words(keyName),
          });
          break;
        case "object":
          if (key_value) {
            if (Array.isArray(key_value)) {
              key_value.map((item) => {
                let item_type = typeof item;
                if (item_type === "string") {
                  chips_array.push({
                    key: keyName,
                    value: item,
                    label: show_proper_words(item),
                  });
                } else {
                  chips_array.push({
                    key: keyName,
                    value: item.chip_value,
                    label: item.chip_label,
                  });
                }
              });
            } else if (moment(key_value).isValid()) {
              if (key_value.chip_value) {
                chips_array.push({
                  key: keyName,
                  value: key_value.chip_value,
                  label: key_value.chip_label,
                });
              } else {
                push_date();
              }
            } else {
              chips_array.push({
                key: keyName,
                value: key_value.chip_value,
                label: key_value.chip_label,
              });
            }
          }
          break;
        default:
      }
    }
  });

  return (
    <>
      {chips_array.length > 0 && (
        <div className="col-lg-12 col-sm-12 mb-2">
          <b
            className="me-3 pt-1 ms-2 color-data-grid"
            style={{ fontSize: "17px" }}
          >
            Filtered By:
          </b>
          {chips_array.map((item, index) => (
            <Chip
              key={index}
              label={item.label}
              className="mb-2 mt-1 me-1 filter-chip"
              onDelete={() => hanlde_delete(item)}
              sx={{
                color: "white",
                fontSize: "17px",
                fill: "white !important",
              }}
            />
          ))}
          <span
            className="anchor-style ms-2 pt-1"
            onClick={onClear}
            style={{
              color: get_root_value("--portal-theme-primary"),
              fontSize: "17px",
            }}
          >
            Clear All
          </span>
        </div>
      )}
    </>
  );
};

export default FilteredChip;
