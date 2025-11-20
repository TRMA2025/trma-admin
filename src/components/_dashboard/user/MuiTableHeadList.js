import PropTypes from "prop-types";
// material
import { visuallyHidden } from "@mui/utils";
import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

MuiTableHeadList.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

export default function MuiTableHeadList({
  order,
  orderBy,
  headLabel,
  onRequestSort,
  checkbox_selection,
  handleSelectAllClick,
  data,
  rowCount,
  numSelected,
}) {
  const [tableHead, setTableHead] = useState([]);
  console.log(data, "datadatadata in user");
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  useEffect(() => {
    if (checkbox_selection) {
      const select_all = {
        id: "is_checkbox_selected",
        label: (
          <Tooltip title="Select Or Unselect All">
            <Checkbox
              checked={rowCount === numSelected ? true : false}
              onClick={(e) => handleSelectAllClick(e)}
            />
          </Tooltip>
        ),
        alignRight: false,
      };
      const new_array = [select_all].concat(headLabel);
      setTableHead(new_array);
    } else {
      setTableHead(headLabel);
    }
  }, [headLabel, rowCount, numSelected]);

  return (
    <TableHead>
      <TableRow>
        {tableHead.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            className="text-nowrap"
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
