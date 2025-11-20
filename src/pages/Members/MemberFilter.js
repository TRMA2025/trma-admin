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
  OutlinedInput,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import { consultantListing } from "src/DAL/consultant/consultant";
import { programmeListing } from "src/DAL/Programme/Programme";

const ITEM_HEIGHT = 70;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MemberFilter({
  onCloseDrawer,
  dataList,
  value,
  handleChange,
  setSelectedValue,
  setSelectedProgram,
  setSelectedLevels,
  selectedProgram,
  selectedLevels,
  setSelectedGoalStatus,
  selectedGoalStatus,
  selectedStatus,
  setSelectedStatus,
  inputs,
  setInputs,
}) {
  //Adding Department
  const [programValue, setProgramValue] = React.useState([]);
  const [consultantId, setConsultantId] = React.useState("");
  const [programsName, setProgramsName] = React.useState([]);
  const [levelsName, setLevelsName] = React.useState([]);
  const [goalStatus, setGoalStatus] = React.useState("");
  const [clearStatus, setClearStatus] = React.useState(false);
  const theme = useTheme();

  const handleChangeConsultant = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(event.target.value);
    setGoalStatus(event.target.value);
    setSelectedGoalStatus(event.target.value);
    // setSelectedConsultant(event.target.value);
    // setInputs((values) => ({ ...values, [name]: value }));
  };

  function getStyles(name, programsName, theme) {
    return {
      fontWeight:
        programsName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const handleChangeProgram = (event) => {
    const {
      target: { value, name },
    } = event;

    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleChangeLevel = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedLevels(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleChangeGoal = (event) => {
    const {
      target: { value },
    } = event;
    setGoalStatus(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const consultantListData = async () => {
    // setIsLoading(true);
    let result = await programmeListing();
    if (result.code == 200) {
      setProgramValue(result.program);
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
      dataList();
    } else {
      const clearFilterStatus = true;
      setInputs({
        search_text: "",
        program: [],
        status: "all",
      });
      // dataList(
      //   (inputs = {
      //     search: "",
      //     transaction_type: "all",
      //     transaction_status: "succeeded",
      //     transaction_mode:
      //       project_type == "dev"
      //         ? "sandBox"
      //         : project_type == "dev"
      //         ? live
      //         : "all",
      //     start_date: null,
      //     end_date: null,
      //     platform: "all",
      //     sale_page: null,
      //     payment_request: [],
      //   })
      // );
      dataList(
        (inputs = {
          search_text: "",
          program: [],
          status: "all",
        })
      );
    }
    onCloseDrawer();
  };
  React.useEffect(() => {
    consultantListData();
  }, []);
  
  const statusOptions = [
    {
      name: "All",
      value: "all",
    },
    {
      name: "Active",
      value: "active",
    },
    {
      name: "Inactive",
      value: "inactive",
    },
  ];
  return (
    <div className="container new-memories px-4">
      <FormControl component="fieldset" className="mt-4">
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
        >
          {/* <FormControlLabel value="all" control={<Radio />} label="All " /> */}
          {/* <FormControlLabel value="admin" control={<Radio />} label="Admin " />
          <FormControlLabel
            value="consultant"
            control={<Radio />}
            label="Consultant "
          /> */}
        </RadioGroup>
      </FormControl>

      {/* program filter area */}
      <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-multiple-name-label1">Programme</InputLabel>
        <Select
          labelId="demo-multiple-name-label1"
          id="demo-multiple-name"
          multiple
          name="program"
          value={inputs?.program}
          onChange={handleChangeProgram}
          input={<OutlinedInput label="Programme" />}
          MenuProps={MenuProps}
        >
          {programValue.map((name) => (
            <MenuItem
              key={name}
              value={name._id}
              // style={getStyles(name, selectedProgram, theme)}
            >
              {name.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* program filter area end */}
      {/* level */}
      {/* <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-multiple-name-label2">Levels</InputLabel>
        <Select
          labelId="demo-multiple-name-label2"
          id="demo-multiple-name"
          multiple
          value={selectedLevels}
          onChange={handleChangeLevel}
          input={<OutlinedInput label="Levels" />}
          MenuProps={MenuProps}
        >
          {levels.map((name) => (
            <MenuItem
              key={name}
              value={name.value}
              style={getStyles(name, selectedLevels, theme)}
            >
              {name.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      {/* level end */}
      {/* goal status */}
      {/* <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-multiple-name-label3">Goal Status</InputLabel>
        <Select
          labelId="demo-multiple-name-label3"
          id="demo-multiple-name"
          multiple
          value={goalStatus}
          onChange={handleChangeGoal}
          input={<OutlinedInput label="Goal Status" />}
          MenuProps={MenuProps}
        >
          {goalsLevel.map((name) => (
            <MenuItem
              key={name}
              value={name.value}
              style={getStyles(name, goalStatus, theme)}
            >
              {name.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      {/* <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-simple-select-label">Goal Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedGoalStatus}
          name="goalStatus"
          label="Goal Status"
          onChange={handleChangeConsultant}
        >
          {goalsLevel.map((goal) => {
            return <MenuItem value={goal.value}>{goal.name}</MenuItem>;
          })}
        </Select>
      </FormControl> */}
      {/* goal status end */}
      <FormControl fullWidth className="mt-3">
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={inputs?.status}
          name="status"
          label="Status"
          onChange={(e) =>
            setInputs((values) => ({ ...values, ["status"]: e.target.value }))
          }
        >
          {statusOptions.map((status) => {
            // console.log(status, "fskaljsd");
            return <MenuItem value={status?.value}>{status.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
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
