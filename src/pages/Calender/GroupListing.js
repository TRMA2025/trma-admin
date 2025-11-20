import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
} from "@mui/material";
// components
import Page from "src/components/Page";
import Label from "src/components/Label";
import Scrollbar from "src/components/Scrollbar";
import SearchNotFound from "src/components/SearchNotFound";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "src/components/_dashboard/user";
//
// import USERLIST from "../_mocks_/user";
import DeletedModal from "src/components/ModalPopover/DeleteModal";
import { s3baseUrl } from "src/config/config";
import { get_root_value } from "src/utils/domUtils";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "programs", label: "Programme", alignRight: false },
  { id: "members", label: "Members", alignRight: false },
];

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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
      // _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
const USERLIST = [
  {
    id: 1,
    name: "Jn smith",
    email: "jhn@gmail.com",
    status: "active",
    programs: "Thinking into result",
    avatarUrl: "/static/mock-images/avatars/avatar_2.jpg",
    order: 1,
    goal: "unlock",
  },
  {
    id: 2,
    name: "hon smith",
    email: "jhon@gmail.com",
    status: "active",

    programs: "Thinking into result",
    avatarUrl: "/static/mock-images/avatars/avatar_4.jpg",
    order: 1,
    goal: "lock",
  },
  {
    id: 3,
    name: "Jhon smith",
    email: "jhon@gmail.com",
    status: "active",

    programs: "Thinking into result",
    avatarUrl: "/static/mock-images/avatars/avatar_5.jpg",
    order: 1,
    goal: "lock",
  },
  {
    id: 4,
    name: "Jhon smith",
    email: "j@gmail.com",
    status: "active",

    programs: "Thinking into result",
    avatarUrl: "/static/mock-images/avatars/avatar_6.jpg",
    order: 1,
    goal: "lock",
  },
  {
    id: 5,
    name: "jackie",
    email: "jh@gmail.com",
    status: "active",

    programs: "Thinking into result",
    avatarUrl: "/static/mock-images/avatars/avatar_7.jpg",
    order: 1,
    goal: "unlock",
  },
];

export default function GroupListing({ groups }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [UserId, setUserId] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = groupsList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const MemberValue = () => {
    let member_list_array = [];
    groups.map((member) => {
      member_list_array.push(member);
    });
    setMembersList(member_list_array);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const handleNavigate = () => {
    navigate(`/addroom`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - membersList.length) : 0;

  const filteredUsers = applySortFilter(
    membersList,
    getComparator(order, orderBy),
    filterName
  );
  useEffect(() => {
    MemberValue();
  }, [groups]);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <>
      <DeletedModal title="member" id={UserId} open={open} setOpen={setOpen} />

      <Container>
        {/* <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton> */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}>
          {/* <Typography variant="h4" gutterBottom>
              Members
            </Typography> */}
          {/* <Button
            onClick={handleNavigate}
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
          >
            Add Room
          </Button> */}
        </Stack>
        <Card style={{ overflowX: "auto" }}>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={membersList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                // onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => {
                    const {
                      id,
                      title,
                      email,
                      program,
                      status,
                      avatarUrl,
                      order,
                      goal,
                      profile_image,
                    } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        sx={{
                          " td, th, tr": {
                            borderBottom: `1px solid ${get_root_value(
                              "--text-secondary-color"
                            )}`,
                          },
                        }}>
                        {/* <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name)}
                              />
                            </TableCell> */}
                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={3}>
                            {page * rowsPerPage + (i + 1)}
                          </Stack>
                        </TableCell>
                        {/* <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={3}
                          >
                            <Avatar
                              alt={name}
                              src={s3baseUrl + profile_image}
                            />
                          </Stack>
                        </TableCell> */}
                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={3}>
                            <Typography variant="subtitle2" noWrap>
                              {title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        {/* <TableCell align="left">{company}</TableCell> */}

                        {/* <TableCell align="left">
                            {isVerified ? "Yes" : "No"}
                          </TableCell> */}
                        {/* <TableCell align="left">{email}</TableCell> */}
                        <TableCell
                          sx={{
                            display: "revert",
                          }}
                          align="left">
                          {program.length > 0
                            ? program.map((program) => {
                                return (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: program._id.title,
                                    }}></div>
                                );
                              })
                            : "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            display: "revert",
                          }}
                          align="left">
                          {groups.map((group) => {
                            return group.member.length;
                          })}
                        </TableCell>
                        {/* <TableCell align="left">
                              <Label
                                variant="ghost"
                                color={
                                  (status === "inactive" && "error") ||
                                  "success"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell> */}
                        {/* <TableCell align="left">
                              <Label
                                variant="ghost"
                                color={
                                  (goal === "lock" && "error") || "success"
                                }
                              >
                                {sentenceCase(goal)}
                              </Label>
                            </TableCell> */}

                        {/* <TableCell align="left">{password}</TableCell>
                          <TableCell align="left">{order}</TableCell> */}

                        <TableCell align="right">
                          {/* <UserMoreMenu
                                path={`/members/edit-members/${id}`}
                                id={id}
                                OnDelete={() => handleOpen(id)}
                              /> */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[50, 100, 150]}
            component="div"
            count={membersList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
