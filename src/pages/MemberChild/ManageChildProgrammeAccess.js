import { CircularProgress, IconButton } from "@mui/material";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useEffect } from "react";
import {
  childProgrammeListing,
  memberProgrammeListing,
} from "src/DAL/Programme/Programme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { s3baseUrl } from "src/config/config";
import moment from "moment";
import { programmeAccessApiV1 } from "src/DAL/member/member";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ManageChildProgrammeAccess() {
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [programsList, setProgramsList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [memberDetail, setMemberDetail] = useState({});
  let breadCrumbMenu = [
    {
      title: "Members",
      navigation: `/member`,
      active: false,
    },

    {
      title:
        memberDetail?.first_name +
        " " +
        memberDetail?.last_name +
        " (" +
        memberDetail?.email +
        ")",
      navigation: null,
      active: true,
    },
  ];
  const getting_expiry_date = (object, member) => {
    let purchased_program = member?.program.find(
      (old_program) => old_program._id === object._id
    );
    if (purchased_program?.expiry_date) {
      return purchased_program?.expiry_date;
    }

    // let first_payment_date = member?.first_payment_date;
    let result = new Date();
    // if (first_payment_date !== "Invalid date" && first_payment_date !== "") {
    result = new Date(object?.parent_expiry);
    // }
    result.setDate(result.getDate());
    // result.setDate(result.getDate() + object?.no_of_limited_days);

    return result;
  };

  const getting_start_date = (object, member) => {
    let purchased_program = member?.program.find(
      (old_program) => old_program?._id === object?._id
    );
    if (purchased_program?.purchase_date_time) {
      return purchased_program.purchase_date_time;
    }

    // let first_payment_date = member?.first_payment_date;
    let result = new Date();
    // if (first_payment_date !== "Invalid date" && first_payment_date !== "") {
    result = new Date(object?.parent_purchased_date);
    // }
    result.setDate(result.getDate());
    // result.setDate(result.getDate() + object?.no_of_start_days);
    return result;
  };

  const getProgramsList = async () => {
    setIsLoading(true);
    const result = await childProgrammeListing(params?.id, state?._id);
    if (result.code == 200) {
      setMemberDetail(result?.child);
      setSelected(result?.child?.program);
      var programArray = [];
      result.programs.map((item) => {
        item.expiry = getting_expiry_date(item, result?.child);
        item.purchased_date = getting_start_date(item, result?.child);
        item.table_avatar = {
          src: s3baseUrl + item?.program_images?.thumbnail_3,
          alt: item.title,
        };
        item.is_show_celendar =
          item.no_of_limited_days > 0
            ? true
            : item.program_access_type == "limited"
            ? true
            : false;
        programArray.push(item);
      });

      setProgramsList(programArray);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  console.log(selected, "selcteddddddddd");
  const handleSubmit = async () => {
    setIsLoadingForm(true);
    let programme = [];
    selected.map((item) => {
      var program_object = {
        program_id: item._id,
      };
      let find_prog = programsList.find((prog) => prog._id == item._id);
      if (find_prog && find_prog.program_access_type == "limited") {
        const startDate = new Date(
          item.purchase_date_time
            ? item.purchase_date_time
            : find_prog.purchased_date
        );
        // const startDate = new Date(find_prog.purchased_date);
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const day = String(startDate.getDate()).padStart(2, "0");
        const formattedDate = `${year} ${month} ${day}`;
        const expiryDate = new Date(
          item.expiry_date ? item.expiry_date : find_prog.expiry
        );
        // const expiryDate = new Date(find_prog.expiry);
        const yearExpiry = expiryDate.getFullYear();
        const monthExpiry = String(expiryDate.getMonth() + 1).padStart(2, "0");
        const dayExpiry = String(expiryDate.getDate()).padStart(2, "0");
        const formattedExpiryDate = `${yearExpiry} ${monthExpiry} ${dayExpiry}`;

        program_object.expiry_date = formattedExpiryDate;
        // program_object.expiry_date = moment(find_prog.expiry).format(
        //   "YYYY MM DD"
        // );
        program_object.purchase_date_time = formattedDate;
        // program_object.purchase_date_time = moment(
        //   find_prog.purchased_date
        // ).format("YYYY MM DD");
      }
      programme.push(program_object);
    });
    let programObject = {
      program: programme,
    };
    console.log(programObject, "programObject");
    const result = await programmeAccessApiV1(state?._id, programObject);
    if (result.code == 200) {
      getProgramsList();
      setIsLoadingForm(false);

      enqueueSnackbar("Child added against programme successfully", {
        variant: "success",
      });
    } else {
      setIsLoadingForm(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleChangeDate = (date, index, row) => {
    let find_index = programsList.findIndex((prog) => prog._id == row._id);
    let temp_state = [...programsList];
    let temp_element = { ...temp_state[find_index] };
    temp_element.expiry = date;
    temp_state[find_index] = temp_element;
    setProgramsList(temp_state);
  };

  const handleChangeStartDate = (date, index, row) => {
    let find_index = programsList.findIndex((prog) => prog._id == row._id);
    let temp_state = [...programsList];
    let temp_element = { ...temp_state[find_index] };
    temp_element.purchased_date = date;
    temp_state[find_index] = temp_element;
    setProgramsList(temp_state);
  };

  const TABLE_HEAD = [
    {
      id: "table_avatar",
      label: "Image",
      type: "thumbnail",
      className: "p-0",
    },
    { id: "title", label: "Programme Title", alignRight: false },
    {
      id: "status",
      label: "Status",
      type: "row_status",
    },
    // {
    //   id: "purchased_date",
    //   label: "Start Date",
    //   type: "row_calendar",
    //   disabled: true,
    //   handleChangeDate: handleChangeStartDate,
    // },
    // {
    //   id: "expiry",
    //   label: "Expiry Date",
    //   type: "row_calendar",
    //   disabled: true,
    //   handleChangeDate: handleChangeDate,
    // },
  ];

  useEffect(() => {
    getProgramsList();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mb-4">
        {/* <div className="col-12 mb-3 ">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div> */}
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
        <div className="col-12">
          <h2>Manage Child Programme Access</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <CustomMUITable
            className="card-with-background"
            TABLE_HEAD={TABLE_HEAD}
            data={programsList}
            selected={selected}
            setSelected={setSelected}
            checkbox_selection={true}
            pagePagination={true}
          />
        </div>
      </div>
      <div className="ms-auto text-end">
        <button
          className="small-contained-button mt-3 ml-auto"
          onClick={handleSubmit}
        >
          {isLoadingForm ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
