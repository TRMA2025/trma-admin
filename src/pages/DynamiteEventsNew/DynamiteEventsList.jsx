import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { s3baseUrl } from "src/config/config";
import {
  delete_dynamite_event_api,
  dynamite_events_list_api,
} from "src/DAL/DynamiteEvents/DynamiteEvents";
import { Icon } from "@iconify/react";
import arrowCircleDownFill from "@iconify/icons-eva/arrow-circle-down-fill";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";

import MemberImportFromProgram from "./MemberImportFromProgram";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import Skeleton from "react-loading-skeleton";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false, type: "action" },

  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "title", label: "Title", alignRight: false },
  { id: "table_avatar", label: "Image", alignRight: false, type: "thumbnail" },
  { id: "order", label: "Order", alignRight: false },
  {
    id: "event_status",
    label: "Status",
    type: "row_status",
  },
];

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function DynamiteEventsList() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [eventUserSampleFile, setEventUserSampleFile] = useState("");
  const [eventsName, setEventsName] = React.useState(null);
  const [programsSelected, setProgramsSelected] = React.useState(null);
  const [importMemberDrawerState, setImportMemberDrawerState] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const handleOpenImportDrawer = (value) => {
    console.log(value);
    setEventsName(value._id);
    setImportMemberDrawerState(true);
  };
  const handleCloseImportDrawer = () => {
    setImportMemberDrawerState(false);
  };

  const searchFunction = () => {
    setPage(0);
    setPageCount(1);

    getEventsListing();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchFunction();
    }
  };

  const getEventsListing = async () => {
    const result = await dynamite_events_list_api(
      page,
      rowsPerPage,
      searchText
    );
    if (result.code == 200) {
      console.log(result.import_event_user_sample_file);
      const events = result.dynamite_event.map((event) => {
        return {
          ...event,
          table_avatar: {
            src: s3baseUrl + event.images.thumbnail_2,
            alt: event.title,
          },
          event_status: event.status,
        };
      });
      setEventsData(events);
      setEventUserSampleFile(result?.import_event_user_sample_file);
      setTotalCount(result.total_default_events);

      setTotalPages(result.total_pages);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    const result = await delete_dynamite_event_api(deleteDoc.event_slug);
    if (result.code === 200) {
      setEventsData((eventsData) => {
        return eventsData.filter((data) => data._id !== deleteDoc._id);
      });
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleEdit = (value) => {
    navigate(`/dynamite-events/edit-event/${value.event_slug}`, {
      state: value,
    });
  };
  const handleChangeStartDate = (value) => {
    console.log(value, "okokoko value");
    navigate(`/dynamite-events/change-start-date/${value._id}`, {
      state: value,
    });
  };
  const handleChangeExpiryDate = (value) => {
    navigate(`/dynamite-events/change-expiry-date/${value._id}`, {
      state: value,
    });
  };
  const handleChangeLockContent = (value) => {
    navigate(`/dynamite-events/lock-event-content/${value.event_slug}`, {
      state: value,
    });
  };
  const handleChangeEventConfig = (value) => {
    navigate(`/dynamite-events/configuration/${value.event_slug}`, {
      state: value,
    });
  };

  const handleNavigate = () => {
    navigate(`/dynamite-events/add-event`);
  };

  const handleChangCategories = (value) => {
    navigate(`/dynamite-event-categories/${value._id}`);
  };

  const handleEvntMembers = (value) => {
    navigate(`/dynamite-events/${value._id}/members`);
  };

  const handleGeneralEvntMembers = (value) => {
    navigate(`/dynamite-events/${value._id}/general-events`);
  };

  const handleRegisterEvents = () => {
    navigate(`/dynamite-events/register-events`);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };
  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  useEffect(() => {
    getEventsListing();
  }, [page, rowsPerPage]);

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
    {
      label: "Lock Event Content",
      icon: "akar-icons:edit",
      handleClick: handleChangeLockContent,
    },
    // {
    //   label: "Event Timer Configuration",
    //   icon: "akar-icons:edit",
    //   handleClick: handleChangeEventConfig,
    // },
    {
      label: "Import Member From Program",
      icon: "akar-icons:edit",
      handleClick: handleOpenImportDrawer,
    },
    {
      label: "Change Start Date",
      icon: "akar-icons:edit",
      handleClick: handleChangeStartDate,
    },

    {
      label: "Change Expiry Date",
      icon: "akar-icons:edit",
      handleClick: handleChangeExpiryDate,
    },
    // {
    //   label: "Categories",
    //   icon: "iconoir:profile-circled",
    //   handleClick: handleChangCategories,
    // },
    {
      label: "Members",
      icon: "iconoir:profile-circled",
      handleClick: handleEvntMembers,
    },
    // {
    //   label: "Events",
    //   icon: "iconoir:profile-circled",
    //   handleClick: handleGeneralEvntMembers,
    // },
  ];

  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this event?"}
        handleAgree={handleDelete}
      />
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-4 col-sm-12">
            <h2>BeeMe's Events</h2>
          </div>
          <div className="col-lg-8 col-sm-12 text-end ">
            {eventUserSampleFile != "" ? (
              <a href={s3baseUrl + eventUserSampleFile}>
                <button className="small-contained-button me-2 mt-1 mb-4">
                  Event Sample File &nbsp;&nbsp;
                  <Icon icon={arrowCircleDownFill} height={20} />
                </button>
              </a>
            ) : (
              <button className="small-contained-button me-2 mt-1 mb-4">
                Event Sample File &nbsp;&nbsp;
                <Icon icon={arrowCircleDownFill} height={20} />
              </button>
            )}

            <button
              onClick={handleRegisterEvents}
              className="small-contained-button me-2"
            >
              Import Events Users
            </button>
            <button onClick={handleNavigate} className="small-contained-button">
              Add Event
            </button>
          </div>
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
          <CustomMUITable
            TABLE_HEAD={TABLE_HEAD}
            data={eventsData}
            custom_search={{
              searchText: searchText,
              setSearchText: setSearchText,
              handleSubmit: searchFunction,
              onKeyDown: handleKeyDown,
            }}
            MENU_OPTIONS={MENU_OPTIONS}
            className="card-with-background"
            custom_pagination={{
              total_count: totalCount,
              rows_per_page: rowsPerPage,
              page: page,
              handleChangePage: handleChangePage,
              onRowsPerPageChange: handleChangeRowsPerPage,
            }}
            pageCount={pageCount}
            totalPages={totalPages}
            handleChangePages={handleChangePages}
            pagePagination={true}
          />
        )}
      </div>
      <CustomDrawer
        isOpenDrawer={importMemberDrawerState}
        onOpenDrawer={handleOpenImportDrawer}
        onCloseDrawer={handleCloseImportDrawer}
        pageTitle="Import Members"
        componentToPassDown={
          <MemberImportFromProgram
            setSelectedProgram={setProgramsSelected}
            selectedProgram={programsSelected}
            onCloseDrawer={handleCloseImportDrawer}
            dataList={getEventsListing}
            eventsName={eventsName}
            setEventsName={setEventsName}
          />
        }
      />
    </>
  );
}
