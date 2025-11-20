import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { s3baseUrl } from "src/config/config";
import Label from "src/components/Label";
import ProgrammeListMemberProfile from "./ProgrammeListMemberProfile";
import { memberDetailApi, memberPodsListing } from "src/DAL/member/member";
import PodsListMemberProfile from "./PodsListMemberProfile";
import { useSnackbar } from "notistack";
import { CircularProgress, Container, Stack, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import RecordNotFound from "src/components/RecordNotFound";
import MemberCalenders from "./MemberEventCalendar";
import { dummyImage } from "src/assets";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import GeneralCalendar from "src/components/GeneralComponents/GeneralCalendar";
import moment from "moment/moment";
import { difference_between_two_dates } from "src/utils/constant";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
const get_view_dates = (calendarValue) => {
  let tool = calendarValue;
  // if(calendarValue=="month")

  const startOfMonth = moment().startOf(tool);
  // console.log(startOfMonth, "asfjlks");
  const daysToSubtract = startOfMonth.day() - 0; // 0 represents Sunday
  const previousSunday = startOfMonth.subtract(daysToSubtract, "days");
  let previousSundayDate = previousSunday.toDate();
  let add_days = 42;
  if (tool == "week") {
    add_days = 6;
  } else if (tool == "day") {
    add_days = 0;
  }
  let nextSaturday = startOfMonth.add(add_days, "days");
  let nextSaturdayDate = nextSaturday.toDate();
  if (tool == "day") {
    previousSundayDate = new Date();
    nextSaturdayDate = new Date();
  }

  return {
    start_date: previousSundayDate,
    end_date: nextSaturdayDate,
  };
};
const MemberProfile = () => {
  const member_id = useParams();
  const param = useLocation();
  const { pathname } = useLocation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  //console.log(params, "params for Data");
  const navigate = useNavigate();
  const [pods, setPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventsList, setEventList] = useState([]);
  const [memberNote, setMemberNote] = useState();
  const [memberDetail, setMemberDetail] = useState();
  const [currentDate, setCurrentDate] = useState(get_view_dates("month"));
  const [isCalenderLoading, setIsCalenderLoading] = useState(true);
  const [defaultTimeValue, setDefaultTimeValue] = useState("Asia/Karachi");
  const [breadCrumbMenu, setBreadCrumbMenu] = useState([
    {
      title: "Members",
      navigation: -1,
      active: false,
    },

    {
      title: "Member Profile",
      navigation: null,
      active: true,
    },
  ]);
  // let breadCrumbMenu = [
  //   {
  //     title: "Members",
  //     navigation: `/member`,
  //     active: false,
  //   },

  //   {
  //     title: "Member Profile",
  //     navigation: null,
  //     active: true,
  //   },
  // ];
  const podsList = async () => {
    const result = await memberPodsListing(member_id.id);
    if (result.code == 200) {
      setIsLoading(false);
      setPods(result.rooms);
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const memberDetailInfo = async () => {
    let apiData = {
      start_date: moment(currentDate.start_date).format("YYYY-MM-DD"),
      end_date: moment(currentDate.end_date).format("YYYY-MM-DD"),
    };
    const difference = difference_between_two_dates(
      apiData.start_date,
      apiData.end_date,
      "days"
    );

    if (difference < 10) {
      setIsCalenderLoading(true);
    }

    const result = await memberDetailApi(member_id.id, apiData);
    if (result.code == 200) {
      console.log(result, "membermember");
      setDefaultTimeValue(result.time_zone);
      setEventList(result.event);
      setMemberNote(result.member);
      setMemberDetail(result);
      setIsCalenderLoading(false);
    }
  };

  const handleGroupNavigate = () => {
    //console.log(member_id, "handleGroupNavigate");
    if (pathname.includes("pending")) {
      navigate(`/pending-member/member-groups/${member_id.id}`);
    } else {
      navigate(`/member/member-groups/${member_id.id}`);
    }
  };
  const handleNotesNavigate = () => {
    //console.log(member_id, "handleGroupNavigate");
    if (pathname.includes("pending")) {
      navigate(`/pending-member/member-personal-notes/${member_id.id}`, {
        state: memberNote,
      });
    } else {
      navigate(`/member/member-personal-notes/${member_id.id}`, {
        state: memberNote,
      });
    }
  };
  const handleGoalStatementNavigate = () => {
    //console.log(member_id, "handleGroupNavigate");
    navigate(`/member/member-goal-statement/${member_id.id}`, {
      state: memberDetail,
    });
  };
  const handleToDo = () => {
    //console.log(member_id, "handleGroupNavigate");
    navigate(`/member/to-do-tracker/${member_id.id}`, {
      state: memberDetail,
    });
  };

  useEffect(() => {
    podsList();
  }, []);
  useEffect(() => {
    memberDetailInfo();
  }, [currentDate, defaultTimeValue]);
  useEffect(() => {
    if (pathname.match("/consultant/")) {
      setBreadCrumbMenu([
        {
          title: "Success Ambassador",
          navigation: `/consultant`,
          active: false,
        },
        {
          title: "Members",
          navigation: `/consultant/member-list/${member_id?.consultantId}`,
          active: false,
        },
        {
          title: "Edit Member",
          navigation: null,
          active: true,
        },
      ]);
    }
  }, [pathname]);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  //console.log(s3baseUrl + profile_image, "s3baseUrl + profile_image");
  return (
    <div className="container">
      <div className="col-12">
        {/* <IconButton
          className="back-screen-button mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton> */}
        <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
      </div>
      <div className="row member-profile mt-3">
        <div className="col-12 mb-4 ">
          <h2>Member Profile</h2>
        </div>
        <div className="col-sm-12 col-md-4 col-lg-3 member-profile-image text-center mb-5">
          <img
            className="rounded-circle ms-auto me-auto"
            height="200px"
            width="200px"
            src={
              memberNote?.profile_image === undefined ||
              memberNote?.profile_image === ""
                ? dummyImage
                : s3baseUrl + memberNote?.profile_image
            }
          />
        </div>
        <div className="col-sm-12 col-md-4 col-lg-3 text-start d-flex mb-5">
          <div className="ms-auto me-auto text-left">
            {/* <h2>{name}</h2> */}
            <Button
              variant="contained"
              className="mt-2 small-contained-button"
              onClick={() => handleGroupNavigate()}>
              View Groups
            </Button>
            <br />
            <Button
              variant="contained"
              className="mt-2 small-contained-button"
              onClick={() => handleNotesNavigate()}>
              View Client Notes
            </Button>
            <br />
            {/* <Button
              variant="contained"
              className="mt-2 small-contained-button"
              onClick={() => handleGoalStatementNavigate()}
            >
              View GoalStatement
            </Button> */}
            <br />
            {/* <Button
              variant="contained"
              className="mt-2 text-dark"
              onClick={() => handleToDo()}
            >
              To Do Tracker
            </Button> */}
            {/* <br /> */}
          </div>
        </div>
        <div className="col-sm-12 col-md-4 col-lg-5">
          <div className="row d-flex">
            <div className="col-6 text-center">
              <h6 className="mb-3">
                <b>Name:</b>
              </h6>
              <h6 className="mb-3">
                <b>Status:</b>
              </h6>
              <h6 className="mb-3">
                <b>Email:</b>
              </h6>
              <h6 className="mb-3">
                <b>Address:</b>
              </h6>
            </div>
            <div className="col-6">
              <h6 className="mb-3">
                {memberNote?.first_name + " " + memberNote?.last_name}
              </h6>
              <h6 className="mb-3">
                <Label
                  variant="ghost"
                  sx={{ backgroundColor: "#fff !important" }}
                  color={memberNote?.status === false ? "error" : "success"}>
                  {memberNote?.status === false ? "InActive" : "Active"}
                </Label>
              </h6>
              {/* <h6 className="mb-3">{contact_number}</h6> */}
              <h6 className="mb-3">
                <div
                  dangerouslySetInnerHTML={{
                    __html: memberNote?.email,
                  }}></div>
              </h6>
              <h6 className="mb-3">{memberNote?.street}</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-5">
          <div>
            <GeneralCalendar
              eventList={eventsList}
              setCurrentDate={setCurrentDate}
              showAddEvent={false}
              time_zone={defaultTimeValue}
              currentDate={currentDate}
              isLoading={isCalenderLoading}
              setIsLoading={setIsCalenderLoading}
              reloadList={memberDetailInfo}
              calendar_title="Calendar"
              // hideArrowsAndButtons={true}
            />
          </div>

          {/* <MemberCalenders memberId={member_id.id} /> */}
        </div>
        <div className="col-12 mt-5">
          {memberNote?.program.length < 1 ? (
            <>
              <h2>Programmes</h2>
              <RecordNotFound title="Programmes" />
            </>
          ) : (
            <ProgrammeListMemberProfile programmes={memberNote?.program} />
          )}
        </div>
        <div className="col-12">
          {pods.length < 1 ? (
            <>
              <h2>Meetings</h2>
              <RecordNotFound title="Meetings" />
            </>
          ) : (
            <PodsListMemberProfile pods={pods} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
