import React, { useEffect, useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import { s3baseUrl } from "src/config/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { member_listing_by_consultant } from "src/DAL/consultant/consultant";
import { member_listing_by_page_plan } from "src/DAL/WebsitePages/paymentPlan";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function PlanSubsribers() {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const classes = useStyles();
  const [membersList, setMembersList] = useState([]);
  const [consultantData, setConsultantData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(1);

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
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setPageCount(1);
  };
  console.log(params, "paramsparams");
  const getMemberListing = async (pageNumber) => {
    setIsLoading(true);
    let postData = {
      page_id: params.page_id,
      plan_id: params.plan_id,
    };
    const result = await member_listing_by_page_plan(
      page,
      rowsPerPage,
      searchText,
      postData
    );

    if (result.code == 200) {
      console.log(result, "plan page ");
      setTotalPages(result?.total_pages);
      const members = result?.event_subscriber?.map((member, index) => {
        return {
          ...member,
          id: member.member._id,
          name: member.member.first_name + " " + member?.member?.last_name,
          status: member.member.status,
          email: member.member.email,
          contact_number: member.member.contact_number,
          table_avatar: {
            src: s3baseUrl + member.member.profile_image,
            alt: member.member.first_name,
          },
        };
      });

      setMembersList(members);
      setTotalCount(result.total_count);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };
  const getMemberListingSearch = async () => {
    setIsLoading(true);
    const result = await member_listing_by_consultant(
      0,
      rowsPerPage,
      searchText,
      params.id
    );

    if (result.code == 200) {
      setConsultantData(result.consultant);
      setTotalPages(result.total_pages);
      const members = result.members?.map((member, index) => {
        return {
          ...member,
          id: member._id,
          name: member.first_name + " " + member.last_name,
          status: member.status,
          email: member.email,
          contact_number: member.contact_number,
          table_avatar: {
            src: s3baseUrl + member.profile_image,
            alt: member.first_name,
          },
        };
      });

      setMembersList(members);
      setTotalCount(result.total_count);
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
    getMemberListingSearch();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getMemberListing();
  }, [rowsPerPage, page]);

  const TABLE_HEAD = [
    { id: "number", label: "#", alignRight: false, type: "number" },
    {
      id: "table_avatar",
      label: "Profile",
      alignRight: false,
      type: "thumbnail",
    },
    { id: "name", label: "Name", alignRight: false },
    { id: "email", label: "Email", alignRight: false },
    { id: "contact_number", label: "Phone", alignRight: false },
    {
      id: "status",
      label: "Status",
      type: "row_status",
    },
  ];

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 display-flex mb-4">
            <IconButton
              className="back-screen-button"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon
                className="arrow-back-icon"
                style={{ color: "#fff !important", fill: "#fff !important" }}
              />{" "}
            </IconButton>
            <span className="sale-page-title">
              {`${
                consultantData.first_name + " " + consultantData.last_name
              } (${consultantData.email})`}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 col-sm-8 mb-3">
            <h2>Members List</h2>
          </div>
        </div>
        <CustomMUITable
          TABLE_HEAD={TABLE_HEAD}
          data={membersList}
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
          }}
          pageCount={pageCount}
          totalPages={totalPages}
          handleChangePages={handleChangePages}
          pagePagination={true}
        />
      </div>
    </>
  );
}
