import React, { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  TextField,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { Icon } from "@iconify/react";
import { programmeListing } from "src/DAL/Programme/Programme";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { useEffect } from "react";
import MUIAutocomplete from "src/components/GeneralComponents/MUIAutocomplete";

export default function MemberFilter({
  filterData,
  handleChange,
  handleIsDateRange,
  handleChangeOthers,
  searchSubmitFilter,
  handleClearFilter,
  setFilterData,
}) {
  const [programsList, setProgramsList] = useState([]);
  const getProgrammesList = async () => {
    let result = await programmeListing();
    if (result.code == 200) {
      let programs = result.program.map((program) => {
        return {
          ...program,
          chip_label: program.title,
          chip_value: program._id,
        };
      });
      setProgramsList(programs);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  // const handleChangeCommunity = (value) => {
  //   setFilterData((values) => ({ ...values, community: value }));
  // };

  const goalsLevel = [
    {
      name: "None",
      value: "",
    },
    {
      name: "Complete",
      value: "complete",
    },
    {
      name: "Incomplete",
      value: "incomplete",
    },
    {
      name: "Responded",
      value: "responded",
    },
  ];



  useEffect(() => {
    getProgrammesList();
  }, []);

  return (
    <>
      <div className="container new-memories px-4">
        <div className="mt-3">
          <MUIAutocomplete
            inputLabel="Programme"
            selectedOption={filterData.program}
            setSelectedOption={(e) => {
              handleChangeOthers(e, "program");
            }}
            optionsList={programsList}
            autoComplete="new-password"
            name="title"
            multiple
          />
        </div>
        {/* <div className="mt-3">
          <MUIAutocomplete
            inputLabel="Levels"
            selectedOption={filterData.community}
            setSelectedOption={handleChangeCommunity}
            optionsList={community_array}
            multiple
            name="title"
          />
        </div>
        <FormControl fullWidth className="mt-3">
          <InputLabel id="demo-simple-select-label">Goal Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterData.goal_statement}
            name="goal_statement"
            label="Goal Status"
            onChange={handleChange}
          >
            {goalsLevel?.map((goal) => {
              return (
                <MenuItem value={goal.value} key={goal.value}>
                  {goal.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl> */}
        <FormControl fullWidth className="mt-3">
          <InputLabel id="demo-simple-select-label">Member Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterData.statuss}
            name="statuss"
            label="Member Status"
            onChange={(e) => handleChangeOthers(e.target.value, "statuss")}
          >
            <MenuItem value="all">ALL</MenuItem>;
            <MenuItem value="active">Active</MenuItem>;
            <MenuItem value={"inactive"}>Inactive</MenuItem>;
          </Select>
        </FormControl>
        {/* <FormControlLabel
          className="mt-2"
          control={
            <Checkbox
              defaultChecked
              checked={filterData.is_date_range}
              onChange={handleIsDateRange}
            />
          }
          label="Search By Date Range"
        />
        {filterData.is_date_range && (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                name="from_date"
                value={filterData.from_date}
                format="YYYY-MM-DD"
                inputFormat="dd-MM-yyyy"
                onChange={(e) => handleChangeOthers(e, "from_date")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="mt-3 inputs-fields"
                    required={true}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                name="to_date"
                value={filterData.to_date}
                format="YYYY-MM-DD"
                inputFormat="dd-MM-yyyy"
                onChange={(e) => handleChangeOthers(e, "to_date")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="mt-3 inputs-fields"
                    required={true}
                  />
                )}
              />
            </LocalizationProvider>
          </>
        )} */}
        <Box sx={{ py: 2 }}>
          <Button
            // sx={{ color: "#fff", backgroundColor: "#9f00ff" }}
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={searchSubmitFilter}
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
                  fill="#9f00ff"
                />
              </svg>
            }
          >
            Filter
          </Button>
        </Box>
        <Button
          // sx={{ color: "#fff", backgroundColor: "#9f00ff" }}
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          className="mb-3"
          onClick={handleClearFilter}
          startIcon={<Icon icon={roundClearAll} />}
        >
          Clear All
        </Button>
      </div>
    </>
  );
}
