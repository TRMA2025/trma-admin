import React from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { Icon } from "@iconify/react";
import { consultantListing } from "src/DAL/consultant/consultant";

export default function PaymentTemplateFilter({
  onCloseDrawer,
  dataList,
  value,
  handleChange,
  setSelectedValue,
  setSelectedConsultant,
  selectedConsultant,
}) {
  //Adding Department
  const [consultantValue, setConsultantValue] = React.useState([]);
  const [consultantId, setConsultantId] = React.useState("");
  const handleChangeConsultant = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setConsultantId(event.target.value);
    setSelectedConsultant(event.target.value);
    // setInputs((values) => ({ ...values, [name]: value }));
  };

  const consultantListData = async () => {
    // setIsLoading(true);
    let result = await consultantListing();
    if (result.code == 200) {
      setConsultantValue(result.consultant_list);
      // setIsLoading(false);
    } else {
      // enqueueSnackbar(result.message, { variant: "success" });
      // setIsLoading(false);
    }
    //console.log(result, "okokoko");
  };
  const handleSubmit = async (new_value) => {
    console.log(new_value, value, "new_valuenew_value");
    if (new_value === "filter") {
      dataList(value);
    } else {
      setSelectedValue("all");
      dataList("all");
    }
    onCloseDrawer();
  };
  React.useEffect(() => {
    consultantListData();
  }, []);

  return (
    <div className="container new-memories px-4">
      <FormControl component="fieldset" className="mt-4">
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel value="all" control={<Radio />} label="All " />
          <FormControlLabel value="admin" control={<Radio />} label="Admin " />
          <FormControlLabel
            value="consultant"
            control={<Radio />}
            label="Consultant "
          />
        </RadioGroup>
      </FormControl>
      {value == "consultant" && (
        <FormControl fullWidth className="mt-3">
          <InputLabel id="demo-simple-select-label">Consultant</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedConsultant}
            name="consultant_id"
            label="Consultant"
            onChange={handleChangeConsultant}
          >
            {consultantValue.map((consultant) => {
              return (
                <MenuItem value={consultant.data._id}>
                  {consultant.data.first_name + " " + consultant.data.last_name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}

      <Box sx={{ py: 2 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          onClick={() => {
            handleSubmit("filter");
          }}
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
        onClick={() => {
          handleSubmit("clear");
        }}
        startIcon={<Icon icon={roundClearAll} />}
      >
        Clear All
      </Button>
    </div>
  );
}
