import { filter } from "lodash";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  Pagination,
  Tooltip,
} from "@mui/material";
import SearchNotFound from "src/components/NotFound/SearchNotFound";
import Label from "src/components/Label";
import moment from "moment";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "src/components/_dashboard/user";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { htmlDecode } from "src/utils/convertHtml";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { s3baseUrl } from "src/config/config";
import { DeleteChild, ListChild } from "src/DAL/Child/Child";

//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },

  { id: "number", label: "#", alignRight: false },
  { id: "fulName", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  // { id: "profile", label: "Profile", alignRight: false },
  { id: "program", label: "Programme", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
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
      (_user) => _user.fulName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function MemberChild() {
  const navigate = useNavigate();
  const params = useParams();
  const path = useLocation();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [maxChild, setMaxChild] = useState(1);
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setMember] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [UserId, setUserId] = useState(false);
  console.log(userList, "userListuserListuserListuserList");

  const handleOpen = (e) => {
    setUserId(e);
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const getMemberListing = async () => {
    try {
      setIsLoading(true);
      const result = await ListChild(params?.id);
      console.log(result, "child scnz");
      if (result.code === 200) {
        setMember(result.children);
        setIsLoading(false);

        const data = result.children.map((member) => {
          return {
            ...member,
            id: member._id,
            fulName: member.first_name + " " + member.last_name,
            status: member.status,
            email: member.email,
            profile: member?.profile_image,
            program: member?.program,
          };
        });
        setUserList(data);
        setMaxChild(result.parent.payment_info?.max_child_limit); // Set max child limit
        // setTotalPages(result?.total_pages);

        setIsLoading(false);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    } catch (error) {}
  };

  const handleEdit = (value) => {
    if (path.pathname.includes("pending")) {
      navigate(`/pending-member/${params.id}/edit-member-child/${value.id}`, {
        states: value,
      });
    } else {
      navigate(`/member/${params.id}/edit-member-child/${value.id}`, {
        states: value,
      });
    }
  };
  const handleChangeAccess = (value) => {
    if (path.pathname.includes("pending")) {
      navigate(`/pending-member-child/programme-access/${params.id}`, {
        state: value,
      });
    } else {
      navigate(`/member-child/programme-access/${params.id}`, {
        state: value,
      });
    }
  };
  const handleChangeEventAccess = (value) => {
    if (path.pathname.includes("pending")) {
      navigate(`/pending-member-child/event-access/${params.id}`, {
        state: value,
      });
    } else {
      navigate(`/member-child/event-access/${params.id}`, {
        state: value,
      });
    }
  };
  const handleAdd = (value) => {
    if (path.pathname.includes("pending")) {
      navigate(`/pending-member/add-member-child/${params.id}`);
    } else {
      navigate(`/member/add-member-child/${params.id}`);
    }
  };

  const handleAgreeDelete = (value) => {
    console.log(value, "-======================del");
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteChild(deleteDoc._id);
    if (result.code === 200) {
      getMemberListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  useEffect(() => {
    getMemberListing();
  }, []);
  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    // {
    //   label: "Login as Child",
    //   icon: "akar-icons:edit",
    //   handleClick: handleEdit,
    // },
    {
      label: "Manage Programme Access",
      icon: "akar-icons:edit",
      handleClick: handleChangeAccess,
    },
    {
      label: "Manage Event Access",
      icon: "akar-icons:edit",
      handleClick: handleChangeEventAccess,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];
  const isUserNotFound = filteredUsers.length === 0;
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />

      <div className="container">
        <div className="row">
          <div className="col-12">
            <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon
                className="arrow-back-icon"
                style={{ color: "#fff !important", fill: "#fff !important" }}
              />{" "}
            </IconButton>
          </div>
          <div className="col-lg-8 col-sm-12 ">
            <h2 className="mb-0">Children / Teachers</h2>
            {maxChild && (
              <p
                className="color-text"
                style={{ fontSize: "15px", fontWeight: 500 }}
              >
                The Maximum Number of Allowed Children / Teachers is Limited to{" "}
                {maxChild}.
              </p>
            )}
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button
              className="small-contained-button float-end mt-1"
              onClick={handleAdd}
            >
              Add Child / Teacher
            </button>
          </div>
        </div>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        ></Stack>

        <Card style={{ overflowX: "auto", paddingTop: 0 }}>
          <div className="d-flex justify-content-between ">
            <div className="d-flex flex-column align-items-start">
              <TablePagination
                rowsPerPageOptions={[5, 10, 20, 50]}
                component="div"
                count={userList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <div className="d-flex align-items-center">
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
            </div>
          </div>

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList.length}
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
                      name,
                      status,
                      fulName,
                      end,
                      date,
                      email,
                      profile,
                      program,
                      goal,
                      question,
                      question_statement,
                      programme,
                      object,
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
                      >
                        <TableCell className="action-in-table-width">
                          <CustomPopoverSection
                            menu={MENU_OPTIONS}
                            data={row}
                          />
                        </TableCell>
                        <TableCell
                          align="left"
                          className="action-in-table-width"
                        >
                          {page * rowsPerPage + (i + 1)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Avatar alt={name} src={s3baseUrl + profile} />
                            <Typography variant="subtitle2" noWrap>
                              {fulName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {email}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          className="program-exp"
                        >
                          {program.map((program) => {
                            return (
                              <>
                                <Tooltip
                                  title={
                                    <Typography fontSize={14}>
                                      {program.expiry_date
                                        ? " " +
                                          "Expiry: " +
                                          moment(program.expiry_date).format(
                                            "DD-MM-YYYY"
                                          )
                                        : "No Expiry"}
                                    </Typography>
                                  }
                                  arrow
                                >
                                  <p
                                    className="mb-1 modalIcon"
                                    // onClick={() => handleChangeAccess(row)}
                                  >
                                    {program?._id?.title}
                                  </p>
                                </Tooltip>
                              </>
                            );
                          })}
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={status === false ? "error" : "success"}
                          >
                            {status === false ? "InActive" : "Active"}
                          </Label>
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
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </div>
    </>
  );
}
