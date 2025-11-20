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
  Checkbox,
  TextField,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { get_root_value } from "src/utils/domUtils";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import { consultantListing } from "src/DAL/consultant/consultant";
import { programmeListing } from "src/DAL/Programme/Programme";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import moment from "moment";
import { dynamite_events_list_api } from "src/DAL/DynamiteEvents/DynamiteEvents";

import { useSnackbar } from "notistack";
import { add_member_from_proggram_event_Api } from "src/DAL/memberNew/member";

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

export default function MemberImportFromProgram({
  onCloseDrawer,
  dataList,
  setSelectedProgram,
  selectedProgram,
  eventsName,
  setEventsName,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [programValue, setProgramValue] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [eventsListing, setEventsListing] = React.useState([]);

  const theme = useTheme();

  function getStyles(name, programsName, theme) {
    return {
      fontWeight:
        programsName?.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const handleChangeProgram = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedProgram(value);
  };
  const handleChangeEvents = (event) => {
    const {
      target: { value },
    } = event;
    setEventsName(value);
    // if wee need multiple selection
    // setEventsName(
    //   // On autofill we get a stringified value.
    //   typeof value === "string" ? value.split(",") : value
    // );
  };

  const programmeListData = async () => {
    let result = await programmeListing();
    if (result.code == 200) {
      setProgramValue(result.program);
    }
  };
  const getEvents = async () => {
    // const result = await websiteEventListApi();
    const result = await dynamite_events_list_api();
    console.log(result, "api events");
    setEventsListing(result.dynamite_event);
  };

  const handleSubmit = async (new_value) => {
    setLoading(true);
    let postData = {
      program_id: selectedProgram == undefined ? "" : selectedProgram,
      event_id: eventsName ? eventsName : "",
    };
    let result = await add_member_from_proggram_event_Api(postData);
    if (result.code == 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setLoading(false);
      onCloseDrawer();
    } else {
      setLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  React.useEffect(() => {
    programmeListData();
    getEvents();
  }, []);

  return (
    <>
      <div className="container new-memories px-4">
        {/* program filter area */}
        <FormControl fullWidth className="mt-3">
          <InputLabel id="demo-multiple-name-label1">Programme *</InputLabel>
          <Select
            labelId="demo-multiple-name-label1"
            id="demo-multiple-name"
            // multiple
            value={selectedProgram}
            onChange={handleChangeProgram}
            input={<OutlinedInput label="Programme *" />}
            MenuProps={MenuProps}>
            {programValue?.map((name) => (
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
        {/* <FormControl className="mt-3" fullWidth>
          <InputLabel id="demo-multiple-name-label">Events *</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            // multiple
            value={eventsName}
            onChange={handleChangeEvents}
            input={<OutlinedInput label="Events *" />}
            MenuProps={MenuProps}
          >
            {eventsListing.map((name) => (
              <MenuItem
                key={name}
                value={name._id}
                // style={getStyles(name, eventsName, theme)}
              >
                {name.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        <Box sx={{ py: 2 }}>
          <Button
            sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
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
                  fill="#9f00ff"
                />
              </svg>
            }>
            {loading ? "Importing..." : "Import"}
          </Button>
        </Box>
        {/* <Button
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
        </Button> */}
      </div>
    </>
  );
}
