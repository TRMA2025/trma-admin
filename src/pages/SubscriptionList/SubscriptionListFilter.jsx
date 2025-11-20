import React, { useState } from "react";
import {
  FormControl,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { Icon } from "@iconify/react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { useEffect } from "react";
import MUIAutocomplete from "src/components/GeneralComponents/MUIAutocomplete";
import { sale_page_list_with_plans_api } from "src/DAL/WebsitePages/websitepages";
// import { sale_page_list_with_plans_api } from "src/DAL/WebsitePages/WebsitePages";

export default function SubscriptionListFilter({
  filterState,
  handleChangeOther,
  searchSubmitFilter,
  handleClearFilter,
}) {
  const [pagesList, setPagesList] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [requestData, setRequestData] = useState([]);

  const getPagesList = async () => {
    const result = await sale_page_list_with_plans_api();
    if (result.code === 200) {
      // console.log(result, "fdsjkfkasdjflk");
      let page_list = result.sale_pages.map((page) => {
        let page_title = page.sale_page_title;
        if (page.type == "template") {
          page_title = page.sale_page_title + " (Template)";
        }
        return {
          ...page,
          page_title: page_title,
          chip_label: page_title,
          chip_value: page._id,
        };
      });

      setPagesList(page_list);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSetPlans = (payment_plans) => {
    setPlansList(
      payment_plans.map((item) => {
        // console.log(item, "fsdfkhaskdjfa");
        return {
          ...item,
          chip_label: item.plan_title,
          chip_value: item._id,
        };
      })
    );
  };

  const handleChangePage = (value) => {
    // console.log(value, "dafslkjsd");
    if (value) {
      handleSetPlans(value.payment_plans);
    } else {
      setPlansList([]);
    }
    handleChangeOther("sale_page", value);
  };

  useEffect(() => {
    getPagesList();
    if (filterState.sale_page) {
      handleSetPlans(filterState.sale_page.payment_plans);
    }
  }, []);

  return (
    <>
      <div className="container new-memories px-4">
        <div className="row">
          <div className="col-12 mt-3">
            <MUIAutocomplete
              inputLabel="Sale Page"
              selectedOption={filterState.sale_page}
              setSelectedOption={handleChangePage}
              optionsList={pagesList}
              name="page_title"
            />
          </div>
          {plansList.length > 0 ? (
            <div className="col-12 mt-3">
              <MUIAutocomplete
                inputLabel="Choose Plan"
                selectedOption={filterState.payment_plan}
                setSelectedOption={(e) => handleChangeOther("payment_plan", e)}
                optionsList={plansList}
                name="plan_title"
              />
            </div>
          ) : (
            ""
          )}
          <div className="col-12 mt-3">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="expired"
                required
                value={filterState.expired}
                label="Status"
                onChange={(e) => handleChangeOther("expired", e.target.value)}
              >
                {/* <MenuItem value="all">All</MenuItem> */}
                <MenuItem value={"expired"}>Expired</MenuItem>
                <MenuItem value={"active"}>Active</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* {filterState.expired === false && (
            <div className="col-12 mt-3">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Expiry In</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="expiry_in"
                  required
                  value={filterState.expiry_in}
                  label="Expiry In"
                  onChange={(e) =>
                    handleChangeOther("expiry_in", e.target.value)
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value={3}>3 Days</MenuItem>
                  <MenuItem value={7}>7 Days</MenuItem>
                  <MenuItem value={15}>15 Days</MenuItem>
                  <MenuItem value={30}>30 Days</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </div>
          )} */}
          <div className="col-12 mt-3">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Subscription Mode
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subscription_mode"
                required
                value={filterState.filter}
                label="Subscription Mode"
                onChange={(e) => handleChangeOther("filter", e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="sandBox">SandBox</MenuItem>
                <MenuItem value="live">Live</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* {filterState.expired === false && filterState.expiry_in === "custom" && (
            <>
              <div className="col-12 mt-3">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    name="start_date"
                    value={filterState.start_date}
                    format="YYYY-MM-DD"
                    inputFormat="dd-MM-yyyy"
                    onChange={(e) => handleChangeOther("start_date", e)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="inputs-fields w-100"
                        required={true}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div className="col-12 mt-3">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    name="end_date"
                    value={filterState.end_date}
                    format="YYYY-MM-DD"
                    inputFormat="dd-MM-yyyy"
                    onChange={(e) => handleChangeOther("end_date", e)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="inputs-fields w-100"
                        required={true}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </>
          )} */}
        </div>
        <Box sx={{ py: 2 }}>
          <Button
            sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
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
          sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
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
