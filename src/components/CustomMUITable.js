import { filter } from "lodash";
import { useState } from "react";

import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Avatar,
  Checkbox,
  Chip,
  TextField,
  Pagination,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchNotFound from "src/components/NotFound/SearchNotFound";
import { UserListToolbar } from "src/components/_dashboard/user";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import TableFooter from "@mui/material/TableFooter";

import MuiTableHeadList from "./MuiTableHeadList";
import UserListToolbarsForSearch from "./UserListToolbarsForSearch";
import Label from "./Label";
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function CustomMUITable({
  TABLE_HEAD,
  data,
  MENU_OPTIONS,
  checkbox_selection,
  type,
  selected,
  setSelected,
  selected_by,
  className,
  custom_pagination,
  sortBy,
  custom_search,
  pageCount,
  totalPages,
  handleChangePages,
  pagePagination,
  rows_per_page_count,
}) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(sortBy ? sortBy : "number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(
    custom_pagination?.rows_per_page
      ? custom_pagination?.rows_per_page
      : rows_per_page_count
      ? rows_per_page_count
      : 50
  );
  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  if (checkbox_selection && !selected) {
    console.log(
      "Error : selected paramter is required as select array AND setSelected paramter is required as setter function for select array"
    );
    selected = [];
  }

  const handleClick = (name) => {
    console.log(name, "nameeeeeeeeeeeeeeeeeeeeee");
    if (name.disable) {
    } else {
      const selectedIndex = selected?.some((obj) => {
        if (selected_by && selected_by !== "") {
          return obj[selected_by] === name[selected_by];
        } else {
          return obj._id === name._id;
        }
      });

      if (selectedIndex === true) {
        let new_array = selected.filter((item) => {
          if (selected_by && selected_by !== "") {
            return item[selected_by] !== name[selected_by];
          } else {
            return item._id !== name._id;
          }
        });
        setSelected(new_array);
      } else {
        setSelected((selected) => [...selected, name]);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function applySortFilter(array, comparator, query) {
    if (!custom_pagination?.rows_per_page) {
      // if not using custom_pagination from database then use this line for pagination
      array = array.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => {
        let searched_object = TABLE_HEAD.some((item) => {
          if (
            item.type !== "link" &&
            item.type !== "row_status" &&
            item.type !== "checkbox" &&
            item.type !== "row_calendar" &&
            item.type !== "thumbnail" &&
            item.type !== "action" &&
            item.type !== "category" &&
            !item.renderData &&
            item.type !== "number"
          ) {
            return (
              _user[item.id]
                ?.toString()
                .toLowerCase()
                .indexOf(query.toLowerCase()) !== -1
            );
          }
        });
        return searched_object;
      });
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearchText = (event) => {
    custom_search.setSearchText(event.target.value);
  };

  const filteredUsers = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterName
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data);
      return;
    }
    const nonDisabledItems = data.filter((item) => item.disable);
    setSelected(nonDisabledItems);
  };

  const isUserNotFound = filteredUsers.length === 0;
  return (
    <Card
      style={{ overflowX: "auto" }}
      className={`mui-without-bg-custom-table ${className}`}
    >
      {custom_search ? (
        <>
          <div className="d-flex justify-content-between">
            {pagePagination && (
              <div className="d-flex flex-column align-items-start">
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100, 200, 500]}
                  onRowsPerPageChange={
                    custom_pagination
                      ? custom_pagination.onRowsPerPageChange
                      : handleChangeRowsPerPage
                  }
                  component="div"
                  className="pt-3"
                  count={
                    custom_pagination
                      ? custom_pagination.total_count
                      : data.length
                  }
                  rowsPerPage={
                    custom_pagination
                      ? custom_pagination?.rows_per_page
                      : rowsPerPage
                  }
                  page={custom_pagination ? custom_pagination.page : page}
                  onPageChange={
                    custom_pagination
                      ? custom_pagination.handleChangePage
                      : handleChangePage
                  }
                />
                <Pagination
                  count={totalPages + 1}
                  page={pageCount}
                  defaultPage={0}
                  onChange={handleChangePages}
                  className="pagination-style"
                />
              </div>
            )}
            <UserListToolbarsForSearch
              filterName={custom_search.searchText}
              onFilterName={handleSearchText}
              handleSubmit={custom_search.handleSubmit}
            />
          </div>
        </>
      ) : (
        <>
          <div
            className={`${
              pagePagination ? "d-flex justify-content-between" : "text-end"
            }`}
          >
            {pagePagination && (
              <div className="d-flex flex-column align-items-start">
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100, 200, 500]}
                  onRowsPerPageChange={
                    custom_pagination
                      ? custom_pagination.onRowsPerPageChange
                      : handleChangeRowsPerPage
                  }
                  component="div"
                  count={
                    custom_pagination
                      ? custom_pagination.total_count
                      : data.length
                  }
                  rowsPerPage={
                    custom_pagination
                      ? custom_pagination?.rows_per_page
                      : rowsPerPage
                  }
                  page={custom_pagination ? custom_pagination.page : page}
                  onPageChange={
                    custom_pagination
                      ? custom_pagination.handleChangePage
                      : handleChangePage
                  }
                />
                {pageCount && (
                  <Pagination
                    count={totalPages + 1}
                    page={pageCount}
                    defaultPage={0}
                    onChange={handleChangePages}
                    className="pagination-style"
                  />
                )}
              </div>
            )}
            <UserListToolbar
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
          </div>
          {/* <div className={`${"text-end"}`}>
            <UserListToolbar
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
          </div> */}
        </>
      )}

      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <MuiTableHeadList
            order={order}
            orderBy={orderBy}
            headLabel={TABLE_HEAD}
            rowCount={data.length}
            numSelected={checkbox_selection && selected.length}
            onRequestSort={handleRequestSort}
            checkbox_selection={checkbox_selection}
            handleSelectAllClick={handleSelectAllClick}
          />
          <TableBody>
            {filteredUsers.map((row, index) => {
              const isItemSelected =
                selected?.length < 1
                  ? false
                  : selected?.some((obj) => {
                      if (selected_by && selected_by !== "") {
                        return obj[selected_by] === row[selected_by];
                      } else {
                        return obj._id === row._id;
                      }
                    });
              let enableDisable =
                selected?.length < 1
                  ? false
                  : selected?.some((obj) => {
                      return obj.disable;

                      {
                        /* if () {
                        return obj[selected_by] === row[selected_by];
                      } else {
                        return obj._id === row._id;
                      } */
                      }
                    });
              console.log(enableDisable, "enableDisable");
              return (
                <TableRow
                  hover
                  key={index}
                  tabIndex={-1}
                  role="checkbox"
                  selected={isItemSelected}
                  aria-checked={isItemSelected}
                >
                  {checkbox_selection && (
                    <TableCell align="left" width={50}>
                      {type == "add" ? (
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleClick(row)}
                        />
                      ) : (
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleClick(row)}
                        />
                      )}
                    </TableCell>
                  )}
                  {TABLE_HEAD.map((head, i) => {
                    if (head.type === "action") {
                      return (
                        <TableCell
                          align="left"
                          className={
                            head.className
                              ? head.className
                              : "action-in-table-width"
                          }
                          key={i}
                        >
                          {(row[head.MENU_OPTIONS]?.length > 0 ||
                            MENU_OPTIONS?.length > 0) && (
                            <CustomPopoverSection
                              menu={
                                row[head.MENU_OPTIONS]
                                  ? row[head.MENU_OPTIONS]
                                  : MENU_OPTIONS
                              }
                              data={row}
                            />
                          )}
                        </TableCell>
                      );
                    } else if (head.type === "checkbox") {
                      return (
                        <TableCell
                          className={head.className}
                          align="left"
                          key={i}
                        >
                          <Checkbox
                            checked={row[head.id]}
                            onChange={(e) => head.handleClick(e, row, index)}
                          />
                        </TableCell>
                      );
                    } else if (head.type === "row_calendar") {
                      if (row.is_show_celendar === true) {
                        return (
                          <TableCell
                            className={head.className}
                            align="left"
                            key={i}
                          >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DesktopDatePicker
                                inputFormat="dd-MM-yyyy"
                                onChange={(date) =>
                                  head.handleChangeDate(date, index, row)
                                }
                                value={row[head.id]}
                                renderInput={(params) => (
                                  <TextField {...params} size="small" />
                                )}
                              />
                            </LocalizationProvider>
                          </TableCell>
                        );
                      } else {
                        return <TableCell align="left" key={i}></TableCell>;
                      }
                    } else if (head.type === "number") {
                      return (
                        <TableCell
                          className={
                            head.className
                              ? head.className
                              : "action-in-table-width"
                          }
                          align="left"
                          key={i}
                        >
                          <span
                            className={row.className}
                            onClick={() => {
                              head.handleClick
                                ? head.handleClick(row, index)
                                : undefined;
                            }}
                          >
                            {index +
                              1 +
                              (custom_pagination
                                ? custom_pagination?.rows_per_page *
                                  custom_pagination?.page
                                : rowsPerPage * page)}
                          </span>
                        </TableCell>
                      );
                    } else if (head.type === "row_status") {
                      return (
                        <TableCell
                          className={head.className}
                          align="left"
                          key={i}
                        >
                          <Chip
                            width="140px"
                            label={
                              row[head.id] === true ? "Active" : "Inactive"
                            }
                            variant="ghost"
                            className={
                              row[head.id] === true
                                ? `manage-program-chip-success ${row.className}`
                                : ""
                            }
                            color={row[head.id] === true ? "success" : "error"}
                            size="small"
                            onClick={() => {
                              head.handleClick
                                ? head.handleClick(row, index)
                                : undefined;
                            }}
                          />
                        </TableCell>
                      );
                    } else if (head.type === "thumbnail") {
                      return (
                        <TableCell
                          className={head.className}
                          align="left"
                          key={i}
                        >
                          <Avatar
                            alt={row[head.id]?.alt}
                            src={row[head.id]?.src}
                          />
                        </TableCell>
                      );
                    } else if (head.type === "link") {
                      return (
                        <TableCell className={head.className} key={i}>
                          {row[head.id].show_text ? (
                            <a
                              href={row[head.id].to}
                              className={row[head.id].className}
                              target={row[head.id].target}
                            >
                              {row[head.id].show_text}
                            </a>
                          ) : row[head.id].show_alternate_text ? (
                            row[head.id].show_alternate_text
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    } else if (head.type === "html") {
                      return (
                        <TableCell
                          align="left"
                          component="th"
                          scope="row"
                          className={head.className}
                          key={i}
                        >
                          <div
                            className={row.className}
                            dangerouslySetInnerHTML={{
                              __html: row[head.id],
                            }}
                          ></div>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell
                          align="left"
                          className={head.className}
                          key={i}
                        >
                          {head.renderData ? (
                            head.renderData(row)
                          ) : (
                            <span
                              className={row.className}
                              onClick={() => {
                                head.handleClick
                                  ? head.handleClick(row, index)
                                  : undefined;
                              }}
                            >
                              {row[head.id]}
                            </span>
                          )}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          {isUserNotFound && (
            <TableBody>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={
                    checkbox_selection
                      ? TABLE_HEAD.length + 1
                      : TABLE_HEAD.length
                  }
                  sx={{ py: 3 }}
                >
                  <SearchNotFound searchQuery={filterName} />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TableFooter className="mui-table-footer mt-2">
        <div className="mt-2"></div>
        {/* <div className="rows_selected_text">
          {checkbox_selection && selected.length > 0
            ? `${selected.length} ${
                selected.length > 1 ? "rows" : "row"
              } selected`
            : ""}
        </div> */}
        <TablePagination
          rowsPerPageOptions={[10, 50, 100, 200, 500]}
          onRowsPerPageChange={
            custom_pagination
              ? custom_pagination.onRowsPerPageChange
              : handleChangeRowsPerPage
          }
          component="div"
          count={
            custom_pagination ? custom_pagination.total_count : data.length
          }
          rowsPerPage={
            custom_pagination ? custom_pagination?.rows_per_page : rowsPerPage
          }
          page={custom_pagination ? custom_pagination.page : page}
          onPageChange={
            custom_pagination
              ? custom_pagination.handleChangePage
              : handleChangePage
          }
        />
      </TableFooter>
      {pagePagination && pageCount ? (
        <Pagination
          count={totalPages + 1}
          page={pageCount}
          defaultPage={0}
          onChange={handleChangePages}
          className="pagination-style"
        />
      ) : (
        ""
      )}
    </Card>
  );
}
