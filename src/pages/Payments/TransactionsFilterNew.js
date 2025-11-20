import React, { useEffect, useState } from "react";
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
  Autocomplete,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { Icon } from "@iconify/react";
import { transactionListFilterPageRequestApi } from "src/DAL/Transaction/transactionApi";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DatePicker } from "@mui/lab";
import MUIAutocomplete from "src/components/GeneralComponents/MUIAutocomplete";
import { useSnackbar } from "notistack";
// import { TRANSACTION_STATUS } from "src/utils/constant";

export default function TransactionsFilterNew({
  setIsAllDates,
  isAllDates,
  handleClearFilter,
  filterData,
  searchSubmitFilter,
  handleChangeOthers,
  setIsSubmit,
}) {
  const [pagesData, setPagesData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  console.log(filterData, "filterDatafilterDatafilterDatafilterData");

  const getPagesRequestForFilter = async () => {
    let result = await transactionListFilterPageRequestApi();
    if (result.code == 200) {
      setPagesData(
        result.sale_page.map((page) => {
          return {
            ...page,
            chip_label: page?.sale_page_title,
            chip_value: page?._id,
          };
        })
      );
      setRequestData(
        result.payment_request.map((item) => {
          return {
            ...item,
            chip_label: item?.request_title,
            chip_value: item?._id,
          };
        })
      );
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
    }
  };

  const handleChangePage = (value) => {
    if (value) {
      setPlansList(
        value.payment_plans.map((item) => {
          return {
            ...item,
            chip_label: item.plan_title,
            chip_value: item._id,
          };
        })
      );
    } else {
      setPlansList([]);
    }
    handleChangeOthers("sale_page", value);
  };
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

  let Filter_By_Plateform_list = Filter_By_Plateform_Array.map((list) => {
    return {
      ...list,
      chip_label: list.label,
      chip_value: list.name,
    };
  });
  const validateAndSubmitFilter = () => {
    if (isAllDates && (!filterData.start_date || !filterData.end_date)) {
      enqueueSnackbar(
        "To Search By Date, both Start Date and End Date are required.",

        { variant: "error" }
      );
      return;
    }
    searchSubmitFilter();
  };

  useEffect(() => {
    getPagesRequestForFilter();
  }, []);

  return (
    <div className="container new-memories px-4 transaction-filter">
      <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-multiple-name-label1">Transaction Type</InputLabel>
        <Select
          labelId="demo-multiple-name-label1"
          id="demo-multiple-name"
          name="transaction_type"
          value={filterData.transaction_type}
          onChange={(e) => {
            handleChangeOthers("transaction_type", e.target.value);
          }}
          input={<OutlinedInput label="Transaction Type" />}
        >
          {/* <MenuItem value="all">All</MenuItem> */}
          <MenuItem value="sale_page">Sale Page</MenuItem>
          <MenuItem value="payment_request">Payment Request</MenuItem>
        </Select>
      </FormControl>
      {filterData.transaction_type == "sale_page" && (
        <div className="col-12 mt-3">
          <Autocomplete
            className="mt-3"
            id="tags-outlined"
            options={pagesData}
            getOptionLabel={(option) => option?.sale_page_title}
            filterSelectedOptions
            value={filterData?.sale_page}
            onChange={(event, newValue) => {
              handleChangeOthers("sale_page", newValue);
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
        </div>
      )}
      {plansList.length > 0 ? (
        <div className="col-12 mt-3">
          <MUIAutocomplete
            inputLabel="Choose Plan"
            selectedOption={filterData.payment_plan}
            setSelectedOption={(e) => {
              handleChangeOthers("payment_plan", e);
            }}
            optionsList={plansList}
            name="plan_title"
          />
        </div>
      ) : (
        ""
      )}
      {filterData.transaction_type == "payment_request" && (
        <div className="col-12 mt-3">
          {requestData && requestData.length > 0 ? (
            <Autocomplete
              className="mt-3"
              multiple
              id="tags-outlined"
              options={requestData}
              getOptionLabel={(option) => option.request_title}
              filterSelectedOptions
              value={filterData?.payment_request}
              onChange={(event, newValue) => {
                handleChangeOthers("payment_request", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Requests"
                  placeholder="Payment Requests"
                />
              )}
            />
          ) : (
            // <MUIAutocomplete
            //   inputLabel="Payment Requests"
            //   selectedOption={filterData.payment_request}
            //   setSelectedOption={(e) =>
            //     handleChangeOthers("payment_request", e)
            //   }
            //   optionsList={requestData}
            //   autoComplete="new-password"
            //   name="request_title"
            //   multiple={true}
            // />
            ""
          )}
        </div>
      )}
      <div className="col-12 mt-3">
        <MUIAutocomplete
          inputLabel="Platform"
          selectedOption={filterData.filter_by_plateform}
          setSelectedOption={(e) => {
            handleChangeOthers("filter_by_plateform", e);
          }}
          optionsList={Filter_By_Plateform_list}
          name="label"
        />
      </div>
      <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-multiple-name-label1">Payment Mode</InputLabel>
        <Select
          labelId="demo-multiple-name-label1"
          id="demo-multiple-name"
          name="transaction_mode"
          value={filterData.transaction_mode}
          onChange={(e) =>
            handleChangeOthers("transaction_mode", e.target.value)
          }
          input={<OutlinedInput label="Payment Mode" />}
        >
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
          value={filterData.transaction_status}
          name="transaction_status"
          label="Transaction Status"
          onChange={(e) =>
            handleChangeOthers("transaction_status", e.target.value)
          }
        >
          {TRANSACTION_STATUS.map((value) => {
            return <MenuItem value={value.value}>{value.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <FormControlLabel
        className="mt-2"
        control={
          <Checkbox
            sx={{
              color: "#9f00ff",
              "&.Mui-checked": {
                color: "#9f00ff",
              },
              "& .MuiSvgIcon-root": {
                borderColor: "#9f00ff",
                borderRadius: "4px",
              },
              "&.Mui-checked .MuiSvgIcon-root": {
                fill: "#9f00ff",
                borderColor: "#9f00ff",
              },
              "& .MuiSvgIcon-root path": {
                fill: "#9f00ff",
              },
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            defaultChecked
            checked={isAllDates}
            onChange={(e) => setIsAllDates(e.target.checked)}
          />
        }
        label="Search By  Date"
      />
      {isAllDates == true && (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {console.log(filterData, "filterData.start_date")}
            <DatePicker
              label="Start Date"
              name="start_date"
              value={filterData.start_date}
              format="YYYY-MM-DD"
              inputFormat="dd-MM-yyyy"
              onChange={(e) => handleChangeOthers("start_date", e)}
              renderInput={(params) => (
                <TextField {...params} className="mt-3 inputs-fields" />
              )}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              name="end_date"
              value={filterData.end_date}
              format="YYYY-MM-DD"
              inputFormat="dd-MM-yyyy"
              onChange={(e) => handleChangeOthers("end_date", e)}
              renderInput={(params) => (
                <TextField {...params} className="mt-3 inputs-fields" />
              )}
            />
          </LocalizationProvider>
        </>
      )}

      <Box sx={{ py: 2 }}>
        <Button
          // sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          onClick={validateAndSubmitFilter}
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
        // sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
        className="mb-3"
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
