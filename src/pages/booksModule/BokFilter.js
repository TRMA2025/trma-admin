import React from "react";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { Icon } from "@iconify/react";
import { useTheme } from "@emotion/react";

export default function BookFilter({
  searchSubmitFilter,
  handleClearFilter,
  groupsName,
  tagsList,
  setGroupsName,
}) {
  const ITEM_HEIGHT = 70;
  const ITEM_PADDING_TOP = 8;
  const theme = useTheme();

  const getStyles = (name, personName) => ({
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  });

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChangeGroup = (event) => {
    const {
      target: { value },
    } = event;
    const selectedNames = typeof value === "string" ? value.split(",") : value;
    setGroupsName(selectedNames);
  };

  return (
    <div className="container new-memories px-4">
      <FormControl className="mt-3" fullWidth>
        <InputLabel id="demo-multiple-name-label">Tags</InputLabel>

        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={groupsName}
          onChange={handleChangeGroup}
          input={<OutlinedInput label="Tags" />}
          MenuProps={MenuProps}
        >
          {tagsList.map((tag) => (
            <MenuItem
              key={tag.chip_value}
              value={tag.chip_value}
              style={getStyles(tag.chip_label, groupsName)}
            >
              {tag.chip_label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ py: 2 }}>
        <Button
          sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          onClick={searchSubmitFilter}
        >
          Filter
        </Button>
      </Box>
      <Button
        sx={{ color: "#9f00ff", backgroundColor: "#fff" }}
        fullWidth
        size="large"
        color="inherit"
        variant="outlined"
        className="mb-3"
        onClick={handleClearFilter}
        startIcon={<Icon icon={roundClearAll} />}
      >
        Clear All
      </Button>
    </div>
  );
}
