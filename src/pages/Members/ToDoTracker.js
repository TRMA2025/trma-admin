import * as React from "react";
import { useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {
  DeleteCommentApi,
  memberDetailApi,
  memberGoalStatementListApi,
} from "src/DAL/member/member";
import { useLocation, useParams } from "react-router-dom";
import { s3baseUrl } from "src/config/config";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircleIcon from "@mui/icons-material/Circle";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";

import { project_name } from "../../config/config";
import { getNinetyDayQuestionApi } from "../../DAL/NinetyDayQuestion/NinetyDayQuestion";
import FormControl from "@mui/material/FormControl";
import ChartJs from "src/components/charts/ChartToDo";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const ToDoTracker = () => {
  const params = useParams();
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [gallery, setGallery] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [replies, setReplies] = React.useState([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteDoc, setDeleteDoc] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [days, setDays] = React.useState("");
  const [earningList, setEarningList] = React.useState([]);
  const [startDate, setStartDate] = React.useState("");
  const [chartDynamicData, setChartDynamicData] = useState([]);
  const [TargetToAchieve, setTargetToAchieve] = useState("");
  const [TargetAmount, setTargetAmount] = useState([
    // {
    //   value: 0,
    //   label: `${convertCurrencyToSign(
    //     user_profile.nineteen_day_plan_currency
    //   )}0`,
    // },
  ]);
  const [totalAmount, setTotalAmount] = useState("");

  // console.log(state, "memberDetailmemberDetail");

  const goalDetail = async () => {
    // const result1 = await memberDetailApi(params.id);
    const result = await getNinetyDayQuestionApi();

    if (result.code == 200) {
      console.log(result, "result of goalstatement");
      // console.log(result1, "result of goalstatement");
      setQuestions(result.Questions_array);
    } else {
      console.log("else case");
    }
  };

  const dateDifference = (startDate, lastDate) => {
    const date1 = new Date(startDate);
    const date2 = new Date(lastDate);
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    const NinetyDay = Difference_In_Days;
    return NinetyDay;
  };
  const handleDeleteReply = (value) => {
    //console.log(value, "handleDeleteReply");
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteCommentApi(deleteDoc._id);
    if (result.code === 200) {
      goalDetail();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const dataForGraph = async () => {
    const result1 = await memberDetailApi(params.id);
    if (result1.code == 200) {
      setEarningList(result1.memberEarning);
      setTargetToAchieve(result1.target_amount);
      setTotalAmount(result1.total_earning);
      setStartDate(
        moment(result1.ninteen_day_vision_start_date).format("MM/DD/YYYY")
      );
      const start_date = moment(result1.ninteen_day_vision_start_date).format(
        "MM/DD/YYYY"
      );
      // chart dynamic value
      let counting = 0;
      const array_of_earning = [];
      const ChartPoints = [];
      const array_of_days = [];
      const reverseEarning = [];
      const demoXYValues = [];
      let LastDateObject = "";
      if (result1.memberEarning.length > 0) {
        LastDateObject = result1.memberEarning[0].date;
      }

      if (LastDateObject > startDate) {
        console.log("inside foreach");
        result1.memberEarning.reverse().forEach((earning) => {
          reverseEarning.push(earning.earning); // needs to reverse
          const date = moment(earning.date).format("MM/DD/YYYY");
          counting = counting + earning.earning;
          const dateCheck = dateDifference(start_date, date);

          // array_of_earning.push(earning.earning);
          array_of_days.push(dateDifference(start_date, date));
          array_of_earning.push(counting);
          ChartPoints.push(dateDifference(start_date, date));
          demoXYValues.push({
            x: dateCheck < 0 ? 1 : dateCheck + 1,
            y: counting,
          });
        });
      } else {
      }
      setChartDynamicData(demoXYValues);
      // chart dynamic value end
    }
  };
  const handleReply = (value) => {
    //console.log(value, "handleReply");
    navigate(`/member/goal-statement-question-reply/${params.id}`, {
      state: value,
    });
  };
  const handleAnswerHistory = (value) => {
    //console.log(value, "handleReply");
    navigate(`/member/goal-statement-Question-history/${params.id}`, {
      state: value,
    });
  };
  React.useEffect(() => {
    goalDetail();
    let days = [];
    for (let index = 1; index <= 90; index++) {
      days.push(index);
    }
    setDays(days);
  }, []);
  React.useEffect(() => {
    dataForGraph();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(chartDynamicData, "chartDynamicData");
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-3 reply-anchor">
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
        <div className="mb-5">
          <h2>To Do Tracker</h2>
        </div>
        <div className="col-12 mb-5">
          <ChartJs
            days={days}
            // TargetToAchieve={state?.target_amount}
            // totalAmount={state?.total_earning}
            ChartDataList={earningList}
            chartDynamicData={chartDynamicData}
            TargetToAchieve={TargetToAchieve}
            totalAmount={totalAmount}
          />
        </div>

        <div className="col-12">
          <h2 className="mb-4">90 Day Formula</h2>
        </div>
        {questions.map((question) => {
          return (
            <>
              <div className="col-12 ">
                <h4>
                  <b>{question.question_statement}</b>
                </h4>
              </div>
              <div className="col-12">
                <div
                  dangerouslySetInnerHTML={{
                    __html: question.description,
                  }}
                ></div>
              </div>
              <div className="col-12 mt-1 mb-3">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label={question.answer == "" ? "Did Not Answer" : "Answer"}
                    multiline
                    rows={2}
                    name="Answer"
                    disabled
                    value={question.answer}
                  />
                </FormControl>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ToDoTracker;
