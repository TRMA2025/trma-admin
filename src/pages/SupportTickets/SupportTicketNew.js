import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
import Label from "src/components/Label";
import { CircularProgress, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import {
  deleteSupportTicketApi,
  get_list_support_ticket_with_pagination,
} from "src/DAL/supportTicket/supportTicket";
import moment from "moment";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import { defaultSettingApi } from "src/DAL/SiteSetting/siteSetting";
import SupportTicketFilterDepartment from "./SupportTicketFilterDepartment";
import { member_login_api } from "src/DAL/member/member";
import { clientPortalUrl } from "src/config/config";
import { dynamite, elite, mastery } from "src/assets";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import FilteredChip from "src/components/FilteredChip";
import { show_proper_words } from "src/utils/constant";

require("moment-timezone");

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function SupportTicket11({ trash }) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [ticketList, setTicketList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [editDrawerState, setEditDrawerState] = useState(false);
  const [editDrawerStateDep, setEditDrawerStateDep] = useState(false);
  const [defaultTimeZone, setDefaultTimeZone] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const is_trash_path = window.location.pathname.includes(
    "trash-support-ticket"
  );

  const EMPTY_FILTER = {
    filter_by: is_trash_path ? "trash" : "waiting",
    department: null,
  };
  const ALTER_FILTER = {
    filter_by: "all",
  };

  const [inputs, setInputs] = useState(EMPTY_FILTER);
  const [filterUpdated, setFilterUpdated] = useState(EMPTY_FILTER);

  const searchFunction = () => {
    setPage(0);
    setPageCount(1);
    inputs.search_text = filterName;
    getConsultantListing(inputs);
    localStorage.setItem("support_tickets_data", JSON.stringify(inputs));
  };

  const handleDeleteChip = (data) => {
    setPage(0);
    setPageCount(1);
    data.search_text = filterName;
    getConsultantListing(data);
    setInputs(data);
    localStorage.setItem("support_tickets_data", JSON.stringify(data));
  };

  const handleClearFilter = () => {
    let clear_data = {
      ...EMPTY_FILTER,
      filter_by: "all",
    };
    setPage(0);
    setPageCount(1);
    getConsultantListing(clear_data);
    setInputs(clear_data);
    localStorage.removeItem("support_tickets_data");
  };

  const handleOpenEditDrawer = () => {
    setEditDrawerState(true);
  };
  const handleCloseEditDrawer = () => {
    setEditDrawerState(false);
  };
  const handleOpenEditDrawerDep = () => {
    setEditDrawerStateDep(true);
  };
  const handleCloseEditDrawerDep = () => {
    setEditDrawerStateDep(false);
  };

  const getDefaultSetting = async () => {
    setIsLoading(true);
    const result = await defaultSettingApi();
    if (result.code === 200) {
      moment.tz.setDefault(result?.default_setting?.time_zone);
      setDefaultTimeZone(result?.default_setting?.time_zone);
    }
  };

  const getConsultantListing = async (ticket_data) => {
    setIsLoading(true);
    handleCloseEditDrawerDep();
    const formData = { ...ticket_data };
    if (formData.department) {
      formData.department = formData.department._id;
    }
    const result = await get_list_support_ticket_with_pagination(
      formData,
      page,
      rowsPerPage,
      filterName
    );

    console.log(result, "resultresultresultresultresult");
    if (result.code === 200) {
      setIsLoading(false);
      setTotalCount(result.total_support_ticket_count);
      let chipData = { ...ticket_data };
      if (chipData.search_text) {
        delete chipData.search_text;
      }
      if (chipData.filter_by == "all") {
        delete chipData.filter_by;
      }
      setFilterUpdated(chipData);
      const data = result.support_ticket.map((ticket, index) => {
        let created_at = moment(ticket.createdAt, "YYYY-MM-DD HH:mm").fromNow();
        let activity_date = moment(
          ticket.last_action_date,
          "YYYY-MM-DD HH:mm"
        ).fromNow();
       
        let department_name = "N/A";
        if (ticket.department) {
          department_name = ticket.department?.title;
        }

        return {
          id: ticket._id,
          userName: ticket.member,
          action_by: ticket.action_by,
          // title_with_img: title_with_img,
          subject_name: ticket.subject,
          department_name: department_name,
          created_at: created_at,
          activity_date: activity_date,
          response_status: ticket.response_status,
          ticket_status: ticket.ticket_status,
          community_level: ticket?.member?.community_level,
          object: ticket,
          count: index + 1 + rowsPerPage * page,
        };
      });
      setTicketList(data);
      setTotalPages(result.total_pages);
      setTotalCount(result?.total_support_ticket_count);
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

  const handleEdit = (value) => {
    navigate(`/support-ticket/detail/${value.id}`, { state: value });
  };

  const LoginAsMember = async (value) => {
    setIsLoading(true);
    const data = {
      email: value.object.member.email,
      user_type: "client",
    };
    const result = await member_login_api(data);
    if (result.code === 200) {
      window.open(`${clientPortalUrl}login-by-admin/${result.token}`);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangeValues = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteSupportTicketApi(deleteDoc.id);
    if (result.code === 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
    setFilterName("");
    getDefaultSetting();
  }, [is_trash_path]);

  useEffect(() => {
    let filter_data = EMPTY_FILTER;
    let find_filter = localStorage.getItem("support_tickets_data");
    if (find_filter) {
      filter_data = JSON.parse(find_filter);
      if (filter_data.search_text) {
        setFilterName(filter_data.search_text);
      }
    }
    setInputs(filter_data);
    setFilterUpdated(filter_data);
    getConsultantListing(filter_data);
  }, [rowsPerPage, page]);

  const MENU_OPTIONS = [
    {
      label: "Detail",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Login As Member",
      icon: "ant-design:lock",
      handleClick: LoginAsMember,
    },
  ];

  const TABLE_HEAD = [
    { id: "action", label: "Action", type: "action", alignRight: false },
    { id: "number", label: "#", type: "number", alignRight: false },
    // { id: "title_with_img", label: "User Name", type: "title_with_img" },
    {
      id: "userName",
      label: "User Name",

      renderData: (row) => {
        const userName = row.userName?.first_name
          ? row.userName.first_name + " " + row.userName.last_name
          : "N/A";
        return (
          <div className="d-flex">
            <>{userName}</>
            {row.community_level == "elite" ? (
              <Tooltip title="Elite">
                <img src={elite} width="30px" className="bagde-image" />
              </Tooltip>
            ) : row.community_level == "dynamite" ? (
              <Tooltip title="Dynamite">
                <img src={dynamite} width="30px" className="bagde-image" />
              </Tooltip>
            ) : row.community_level == "mastery" ? (
              <Tooltip title="Mastery">
                <img src={mastery} width="30px" className="bagde-image" />
              </Tooltip>
            ) : row.community_level == "pta" ? (
              <Tooltip title="PTA">
                <img src={mastery} width="30px" className="bagde-image" />
              </Tooltip>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    { id: "subject_name", label: "Subject", type: "name", alignRight: false },
    {
      id: "department_name",
      label: "Department",
      type: "name",
    },
    { id: "created_at", label: "Created", type: "name", alignRight: false },
    {
      id: "activity_date",
      label: "Responded",
      type: "name",
    },
    is_trash_path && {
      id: "action_by",
      label: "Member / Delegate",
      type: "name",
      renderData: (row) => {
        return show_proper_words(row.action_by);
      },
    },
    {
      id: "status",
      label: "Status",
      renderData: (row) => {
        let ticket_status = row?.ticket_status;
        let response_status = row?.response_status;
        return (
          <>
            <Label
              variant="ghost"
              className={
                ticket_status === 0 && response_status == 1
                  ? "answer-ticket"
                  : ticket_status == 1
                  ? "solved-ticket"
                  : ticket_status == 2
                  ? "trash-ticket"
                  : "pending-ticket"
              }
            >
              {ticket_status === 0 && response_status == 1
                ? "Answer"
                : ticket_status == 1
                ? " Solved"
                : ticket_status == 2
                ? "Trash"
                : "waiting"}
            </Label>
          </>
        );
      },
    },
  ];

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
          <div className="col-lg-8 col-sm-12">
            <h2>
              {!is_trash_path
                ? "Member Support Tickets"
                : "Trash Support Tickets"}
            </h2>
          </div>
          {!is_trash_path && (
            <div className="col-12 text-end">
              <button
                className="small-contained-button me-2 mb-3"
                onClick={handleOpenEditDrawerDep}
              >
                Filters &nbsp;&nbsp; <Icon icon={roundFilterList} />
              </button>
            </div>
          )}
        </div>
        {!is_trash_path && (
          <FilteredChip
            data={filterUpdated}
            tempState={inputs}
            EMPTY_FILTER={EMPTY_FILTER}
            ALTER_FILTER={ALTER_FILTER}
            onDeleteChip={handleDeleteChip}
            onClear={handleClearFilter}
          />
        )}
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={ticketList}
          MENU_OPTIONS={MENU_OPTIONS}
          className="card-with-background"
          custom_pagination={{
            total_count: totalCount,
            rows_per_page: rowsPerPage,
            page: page,
            handleChangePage: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
          }}
          custom_search={{
            searchText: filterName,
            setSearchText: setFilterName,
            handleSubmit: searchFunction,
          }}
          pageCount={pageCount}
          totalPages={totalPages}
          handleChangePages={handleChangePages}
          pagePagination={true}
        />
      </div>
      <CustomDrawer
        isOpenDrawer={editDrawerState}
        onOpenDrawer={handleOpenEditDrawer}
        onCloseDrawer={handleCloseEditDrawer}
        pageTitle="Filters"
      />
      <CustomDrawer
        isOpenDrawer={editDrawerStateDep}
        onOpenDrawer={handleOpenEditDrawerDep}
        onCloseDrawer={handleCloseEditDrawerDep}
        pageTitle="Filters"
        componentToPassDown={
          <SupportTicketFilterDepartment
            handleChange={handleChangeValues}
            inputs={inputs}
            setInputs={setInputs}
            searchSubmitFilter={searchFunction}
            handleClearFilter={handleClearFilter}
          />
        }
      />
    </>
  );
}
