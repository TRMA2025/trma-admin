import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  IconButton,
  CircularProgress,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import { s3baseUrl } from "src/config/config";
import {
  delete_dynamite_event_member,
  dynamite_events_members_api,
} from "src/DAL/DynamiteEvents/EventMembers/EventMembers";
import moment from "moment";
import {
  programmeMemberListing,
  programme_detail_api,
} from "src/DAL/Programme/Programme";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import Skeleton from "react-loading-skeleton";

const TABLE_HEAD = [
  { id: "number", label: "#", alignRight: false, type: "number" },
  {
    id: "table_avatar",
    label: "Image",
    alignRight: false,
    type: "thumbnail",
  },
  { id: "name", label: " Name", alignRight: false },
  { id: "start_date", label: "Start Date", alignRight: false },
  { id: "expiry_date", label: "Expiry Date", alignRight: false },
  { id: "status", label: "Status", alignRight: false, type: "row_status" },
  // { id: "action", label: "Action", alignRight: false, type: "action" },
];
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function ProgrammeMembers() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const [openDelete, setOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [membersData, setMembersData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const classes = useStyles();
  const [pageCount, setPageCount] = useState(1);
  const [deleteDoc, setDeleteDoc] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [programName, setProgramName] = useState("");
  const { state } = useLocation();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };

  const getMembersList = async () => {
    setIsLoading(true);
    const result = await programmeMemberListing(
      id,
      page,
      rowsPerPage,
      searchText
    );
    if (result.code == 200) {
      console.log(result?.program?.program_access_type, "resultresult");
      let program_access = result?.program?.program_access_type;
      const members = result?.program_members?.map((member, index) => {
        let program_expiry_date = "";
        member?.program.map((item, index) => {
          if (id == item._id) {
            if (item?.expiry_date) {
              program_expiry_date = moment(item.expiry_date).format(
                "DD-MM-YYYY"
              );
            } else {
              program_expiry_date = "Unlimited";
            }
          }
        });
        let program_start_date = "";
        member?.program.map((item, index) => {
          if (id == item._id) {
            if (item?.purchase_date_time) {
              program_start_date = moment(item.purchase_date_time).format(
                "DD-MM-YYYY"
              );
            } else {
              program_start_date = "Unlimited";
            }
          }
        });
        return {
          ...member,
          name:
            member.first_name +
            " " +
            member.last_name +
            " (" +
            member.email +
            ")",
          table_avatar: {
            src: s3baseUrl + member.profile_image,
            alt: member.first_name,
          },
          expiry_date: member.program.length > 0 ? program_expiry_date : "",
          start_date: member.program.length > 0 ? program_start_date : "",
        };
      });

      setMembersData(members);
      setTotalCount(result.total_count);
      setTotalPages(result.total_pages);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const searchFunction = () => {
    setPage(0);
    setPageCount(1);
    getMembersList();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchFunction();
    }
  };

  const getProgrammeDetail = async () => {
    setIsLoading(true);
    const result = await programme_detail_api(programme_slug);
    if (result.code === 200) {
      setProgramName(result?.program?.title);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (value) => {
    navigate(`/dynamite-events/${event_id}/edit-member/${value._id}`, {
      state: value,
    });
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    const formData = new FormData();
    formData.append("member", deleteDoc._id);
    formData.append("dynamite_event", event_id);

    const result = await delete_dynamite_event_member(formData);
    if (result.code === 200) {
      setMembersData((prev) => {
        return prev.filter((data) => data._id !== deleteDoc._id);
      });
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  let program_title = localStorage.getItem("program_title");
  let program_slug_local = localStorage.getItem("program_slug")
    ? localStorage.getItem("program_slug")
    : state
    ? state?.program_slug
    : "";
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },

    {
      title: state ? state?.title : program_title ? program_title : "",
      navigation: `/programmes/programmes-detail/${program_slug_local}`,
      active: false,
    },
    {
      title: "Programme Members",
      navigation: null,
      active: true,
    },
  ];
  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
    localStorage.setItem("member_page_number", newPage);
  };

  useEffect(() => {
    getMembersList();
  }, [rowsPerPage, page]);
  // useEffect(() => {
  //   getProgrammeDetail();
  // }, []);

  // if (isLoading == true) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }

  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this member?"}
        handleAgree={handleDelete}
      />
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <span className="">
              <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
            </span>

            
          </div>
          <div className="col-lg-8 col-sm-12 mb-3">
            <h2>Programme Members</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end"></div>
        </div>
        {isLoading ? (
          <div>
            <Card style={{ overflowX: "auto" }}>
              <div className="mt-2 d-flex justify-content-between">
                {" "}
                <div style={{ marginLeft: "5px" }}>
                  <Skeleton width={200} height={20} />
                </div>
                <div className="d-flex" style={{ marginRight: "15px" }}>
                  <Skeleton width={200} height={60} />
                  <div style={{ margin: "10px" }}>
                    <Skeleton
                      baseColor="#dddde8"
                      highlightColor="#9F00FF"
                      width={70}
                      height={40}
                    />
                  </div>
                </div>
              </div>

              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/* Skeleton for Table Header */}
                      <TableCell>
                        <Skeleton width={150} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={50} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={200} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} height={20} />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Skeleton Loading for Rows */}
                    {Array.from({ length: 6 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton width={50} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={50} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={200} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={20} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div
                style={{
                  margin: "20px",
                  justifyContent: "end",
                  display: "flex",
                }}
              >
                <Skeleton width={200} height={20} />
              </div>
            </Card>
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <CustomMUITable
                TABLE_HEAD={TABLE_HEAD}
                MENU_OPTIONS={MENU_OPTIONS}
                data={membersData}
                className="card-with-background"
                custom_pagination={{
                  total_count: totalCount,
                  rows_per_page: rowsPerPage,
                  page: page,
                  handleChangePage: handleChangePage,
                  onRowsPerPageChange: handleChangeRowsPerPage,
                }}
                custom_search={{
                  searchText: searchText,
                  setSearchText: setSearchText,
                  handleSubmit: searchFunction,
                  onKeyDown: handleKeyDown,
                }}
                pageCount={pageCount}
                totalPages={totalPages}
                handleChangePages={handleChangePages}
                pagePagination={true}
                rows_per_page_count={rowsPerPage}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
