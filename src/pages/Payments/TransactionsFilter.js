import React, { useState } from "react";
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
  OutlinedInput,
  Autocomplete,
  TextField,
  Checkbox,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { Icon } from "@iconify/react";
import { consultantListing } from "src/DAL/consultant/consultant";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";
import moment from "moment";
import { transactionListFilterPageRequestApi } from "src/DAL/Transaction/transactionApi";
import { project_type } from "src/config/config";

export default function TransactionsFilter({
  onCloseDrawer,
  dataList,
  value,
  inputs,
  setInputs,
  isAllDates,
  setIsAllDates,
}) {
  //Adding Department
  const [pagesData, setPagesData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const Filter_By_Plateform_Array = [
    {
      name: "all",
      label: "All",
    },

    {
      name: "client",
      label: "Client Portal",
    },
    {
      name: "website",
      label: "Website",
    },
  ];
  const TRANSACTION_STATUS = [
    {
      name: "Succeeded",
      value: "succeeded",
    },
    {
      name: "Failed",
      value: "payment_failed",
    },
    {
      name: "Cancelled",
      value: "canceled",
    },
    {
      name: "Requires Action",
      value: "requires_action",
    },
  ];
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };
  const getPagesRequestForFilter = async () => {
    let result = await transactionListFilterPageRequestApi();
    if (result.code == 200) {
      setPagesData(result.sale_page);
      setRequestData(result.payment_request);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
    }
  };
  const handleSubmit = async (new_value) => {
    // console.log(new_value, value, "new_valuenew_value");
    if (new_value === "filter") {
      dataList(inputs);
    } else {
      setInputs({
        search: "",
        transaction_type: "all",
        transaction_status: "succeeded",
        transaction_mode: "all",
        start_date: null,
        end_date: null,
        platform: "all",
        sale_page: null,
        payment_request: [],
      });
      setIsAllDates(false);
      dataList(
        (inputs = {
          search: "",
          transaction_type: "all",
          transaction_status: "succeeded",
          transaction_mode:
            project_type == "dev"
              ? "sandBox"
              : project_type == "dev"
              ? live
              : "all",
          start_date: null,
          end_date: null,
          platform: "all",
          sale_page: null,
          payment_request: [],
        })
      );
    }
    onCloseDrawer();
  };
  React.useEffect(() => {
    getPagesRequestForFilter();
  }, []);

  return (
    <div className="container new-memories px-4">
      <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-multiple-name-label1">Transaction Type</InputLabel>
        <Select
          labelId="demo-multiple-name-label1"
          id="demo-multiple-name"
          name="transaction_type"
          value={inputs?.transaction_type}
          onChange={handleChange}
          input={<OutlinedInput label="Transaction Type" />}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="sale_page">Sale Page</MenuItem>
          <MenuItem value="payment_request">Payment Request</MenuItem>
        </Select>
      </FormControl>
      {inputs.transaction_type == "sale_page" && pagesData && (
        <Autocomplete
          className="mt-3"
          id="tags-outlined"
          options={pagesData}
          getOptionLabel={(option) => option?.sale_page_title}
          filterSelectedOptions
          value={inputs?.sale_page}
          onChange={(event, newValue) => {
            setInputs((values) => ({
              ...values,
              ["sale_page"]: newValue,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sale Page"
              placeholder="Sale Page"
              // onChange={handleSearch}
            />
          )}
          getOptionSelected={
            (option, value) => console.log(option, value)
            //  option.name === value
          }
        />
      )}
      {inputs.transaction_type == "payment_request" && requestData && (
        <div className="col-12 mt-3">
          {/* {requestData && requestData.length > 0 ? ( */}
          <Autocomplete
            className="mt-3"
            multiple
            id="tags-outlined"
            options={requestData}
            getOptionLabel={(option) => option.request_title}
            filterSelectedOptions
            value={inputs.payment_request}
            onChange={(event, newValue) => {
              setInputs((values) => ({
                ...values,
                payment_request: newValue,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Payment Requests"
                placeholder="Payment Requests"
              />
            )}
          />

          {/* ) : (
            ""
          )} */}
        </div>
      )}
      <Autocomplete
        className="mt-3"
        id="tags-outlined"
        options={Filter_By_Plateform_Array}
        getOptionLabel={(option) => option?.label}
        filterSelectedOptions
        value={
          inputs?.platform
            ? Filter_By_Plateform_Array.find(
                (option) => option.name == inputs?.platform
              )
            : null
        }
        onChange={(event, newValue) => {
          setInputs((values) => ({ ...values, ["platform"]: newValue?.name }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Platform"
            placeholder="Platform"
            // onChange={handleSearch}
          />
        )}
        getOptionSelected={
          (option, value) => console.log(option, value)
          //  option.name === value
        }
      />
      <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-multiple-name-label1">Payment Mode</InputLabel>
        <Select
          labelId="demo-multiple-name-label1"
          id="demo-multiple-name"
          name="transaction_mode"
          value={inputs?.transaction_mode}
          onChange={handleChange}
          input={<OutlinedInput label="Payment Mode" />}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="sandBox">SandBox</MenuItem>
          <MenuItem value="live">Live</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-simple-select-label">
          Transaction Status
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={inputs?.transaction_status}
          name="transaction_status"
          label="Transaction Status"
          onChange={handleChange}>
          {TRANSACTION_STATUS.map((value) => {
            return <MenuItem value={value.value}>{value.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <FormControlLabel
        className="mt-2"
        control={
          <Checkbox
            defaultChecked
            checked={isAllDates}
            onChange={(e) => {
              setIsAllDates(e.target.checked);
              e.target.checked
                ? setInputs((values) => ({
                    ...values,
                    ["start_date"]: moment().format("YYYY-MM-DD"),
                    ["end_date"]: moment(e).format("YYYY-MM-DD"),
                  }))
                : setInputs((values) => ({
                    ...values,
                    ["start_date"]: null,
                    ["end_date"]: null,
                  }));
            }}
          />
        }
        label="Search By All Date"
      />
      {isAllDates == true && (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              name="start_date"
              value={inputs.start_date}
              format="YYYY-MM-DD"
              inputFormat="dd/MM/yyyy"
              onChange={(e) =>
                setInputs((values) => ({
                  ...values,
                  ["start_date"]: moment(e).format("YYYY-MM-DD"),
                }))
              }
              renderInput={(params) => (
                <TextField {...params} className="mt-3 inputs-fields" />
              )}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              name="end_date"
              value={inputs.end_date}
              format="YYYY-MM-DD"
              inputFormat="dd/MM/yyyy"
              onChange={(e) =>
                setInputs((values) => ({
                  ...values,
                  ["end_date"]: moment(e).format("YYYY-MM-DD"),
                }))
              }
              renderInput={(params) => (
                <TextField {...params} className="mt-3 inputs-fields" />
              )}
            />
          </LocalizationProvider>
        </>
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
              style={{ marginRight: 5 }}>
              <path
                d="M13.1165 0.25H0.883548C0.321452 0.25 0.0378205 0.932013 0.436097 1.33029L5.3125 6.20743V11.6406C5.3125 11.8471 5.41325 12.0406 5.58242 12.1591L7.69179 13.6351C8.10794 13.9264 8.6875 13.6312 8.6875 13.1167V6.20743L13.564 1.33029C13.9615 0.932804 13.6798 0.25 13.1165 0.25Z"
                fill={get_root_value("--portal-theme-primary")}
              />
            </svg>
          }>
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
        startIcon={<Icon icon={roundClearAll} />}>
        Clear All
      </Button>
    </div>
  );
}
