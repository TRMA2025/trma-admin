import React, { useEffect, useState } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { Icon } from "@iconify/react";
import { departmentListingApi } from "src/DAL/Department/Department";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function SupportTicketFilterDepartment({
  onCloseDrawer,
  dataList,
  value,
  handleChange,
  setSelectedValue,
}) {
  //Adding Department
  const [department, setDepartment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  const depList = async () => {
    const result = await departmentListingApi();
    if (result.code === 200) {
      console.log(result.department, "resultDep");
      setDepartment(result.department);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (new_value) => {
    console.log(new_value, value, "new_valuenew_value");
    if (new_value === "department") {
      dataList(new_value, value);
    } else {
      setSelectedValue();
      dataList();
    }
    onCloseDrawer();
  };
  useEffect(() => {
    depList();
  }, []);
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <div className="container new-memories px-4">
      <FormControl component="fieldset" className="mt-4">
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}>
          {department.map((dep) => {
            return (
              <FormControlLabel
                value={dep._id}
                control={<Radio />}
                label={dep.title}
              />
            );
          })}
        </RadioGroup>
      </FormControl>

      <Box sx={{ py: 2 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          onClick={() => {
            handleSubmit("department");
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
