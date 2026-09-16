import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";

import { s3baseUrl } from "src/config/config";

import moment from "moment";
import CustomMUITable from "../CustomMUITable";
import {
  bulkMemberListing,
  programmeMemberListing,
} from "src/DAL/Programme/Programme";

const TABLE_HEAD = [
  {
    id: "number",
    label: "#",
    alignRight: false,
    type: "number",
    className: "action-in-table-width",
  },
  {
    id: "table_avatar",
    label: "Image",
    alignRight: false,
    type: "thumbnail",
  },
  { id: "name", label: " Name", alignRight: false },
  // { id: "start_date", label: "Event Start Date", alignRight: false },
  // { id: "expiry_date", label: "Event Expiry Date", alignRight: false },
  { id: "status", label: "Status", alignRight: false, type: "row_status" },
  // { id: "action", label: "Action", alignRight: false, type: "action" },
];

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ProgrammeBulkMembers({
  selected,
  setSelected,
  reload,
}) {
  const navigate = useNavigate();
  const { type, id } = useParams();
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

  const handleChangePage = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };
  const getMembersList = async () => {
    setIsLoading(true);
    // setTimeout(async () => {

    // }, 9000);
    const result = await bulkMemberListing(page, rowsPerPage, searchText);
    if (result.code == 200) {
      result.members?.map((member) => {
        if (id) {
          let exist = member?.program?.find((prog) => prog?._id === id);
          if (exist) {
            member.disable = true;

            if (
              !selected.some(
                (selectedMember) => selectedMember?._id === member?._id
              )
            ) {
              selected.push(member);
            }
          }
        }
      });
      const members = result.members?.map((member, index) => {
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
          expiry_date: moment(member.event_expiry_date).format("DD-MM-YYYY"),
          start_date: moment(member.event_start_date).format("DD-MM-YYYY"),
        };
      });
      console.log(selected, "selectedselectedselected");

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
  const getSelectedMembersList = async () => {
    setIsLoading(true);
    // setTimeout(async () => {

    // }, 9000); // Delay in milliseconds (4 seconds)
    const result = await programmeMemberListing(
      id,
      page,
      rowsPerPage,
      searchText
    );
    if (result.code === 200) {
      setSelected(result.program_members);
      const members = result.program_members?.map((member, index) => {
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
          expiry_date: moment(member.event_expiry_date).format("DD-MM-YYYY"),
          start_date: moment(member.event_start_date).format("DD-MM-YYYY"),
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
  const searchFunctionMemberList = () => {
    setPage(0);
    setPageCount(1);
    getSelectedMembersList();
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
    if (type == "remove") {
      getSelectedMembersList();
    } else {
      getMembersList();
    }
  }, [reload, rowsPerPage, page]);
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this member?"}
        handleAgree={handleDelete}
      />
      <div className="">
        {/* <div className="row">
          <div className="col-12">
            <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(`/dynamite-events`)}
            >
  <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />            </IconButton>
            <button
              className="small-contained-button float-end mt-1"
              onClick={() =>
                navigate(`/dynamite-events/${event_id}/add-members`)
              }
            >
              Add Member
            </button>
          </div>
          <div className="col-lg-8 col-sm-12 mb-3">
            <h2>Event Members</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end"></div>
        </div> */}
        <div className="row">
          <div className="col-12">
            <CustomMUITable
              TABLE_HEAD={TABLE_HEAD}
              MENU_OPTIONS={MENU_OPTIONS}
              data={membersData}
              type={type}
              selected={selected}
              setSelected={setSelected}
              checkbox_selection={true}
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
                handleSubmit:
                  type == "remove" ? searchFunctionMemberList : searchFunction,
              }}
              pageCount={pageCount}
              totalPages={totalPages}
              handleChangePages={handleChangePages}
              pagePagination={true}
              rows_per_page_count={rowsPerPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
