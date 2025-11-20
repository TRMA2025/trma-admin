import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-fill";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button,
} from "@mui/material";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
  "& legend": {
    display: "none",
  },
}));

// ----------------------------------------------------------------------

UserListToolbars.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onKeyDown: PropTypes.func, // Add onKeyDown to prop types
};

export default function UserListToolbars({
  numSelected,
  filterName,
  onFilterName,
  onSearch,
  handleMultipleDelete,
  onKeyDown,
}) {
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <>
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
          <Button
            variant="outlined"
            onClick={handleMultipleDelete}
            className="ms-5"
          >
            Delete
          </Button>
        </>
      ) : (
        ""
      )}

      <>
        <SearchStyle
          className="ms-auto"
          value={filterName}
          onChange={onFilterName}
          onKeyDown={onKeyDown} // Attach the onKeyDown handler here
          placeholder="Search..."
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: "text.disabled" }}
              />
            </InputAdornment>
          }
        />
        <button
          className="small-contained-button-search ms-3"
          onClick={() => onSearch()}
        >
          Search
        </button>
      </>
    </RootStyle>
  );
}
