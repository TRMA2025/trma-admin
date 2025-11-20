import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {
  DeleteCommentApi,
  memberGoalStatementListApi,
} from "src/DAL/member/member";
import { useLocation, useParams } from "react-router-dom";
import { s3baseUrl } from "src/config/config";
import { CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircleIcon from "@mui/icons-material/Circle";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import AddKimsReply from "./AddKimReply";
import { project_name } from "../../config/config";
import TextField from "@mui/material/TextField";
import { htmlDecode } from "src/utils/convertHtml";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const MemberGoalstatementList = () => {
  const params = useParams();
  const classes = useStyles();
  const data = useLocation();
  const titleRef = React.useRef();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [gallery, setGallery] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [replies, setReplies] = React.useState([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteDoc, setDeleteDoc] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const userDetail = data?.state;
  console.log(data.state, "datadata");

  const handleClick = () => {
    titleRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const goalDetail = async () => {
    const result = await memberGoalStatementListApi(params.id);
    if (result.code == 200) {
      console.log(result, "result of goalstatement");
      setGallery(result.goal_statement_gallery);
      setQuestions(result.goal_statement_question);
      setReplies(result.reply);
    } else {
      //console.log("else case");
    }
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
  }, []);
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //console.log(project_name, "project_namereply");
  return (
    <div className="container">
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />
      <div className="row">
        <div className="col-8 mb-3 reply-anchor">
          <IconButton
            className="back-screen-button mb-4 me-3"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          {userDetail &&
            userDetail.member.first_name + " (" + userDetail.member.email + ")"}
        </div>
        <div className="col-4">
          <a
            className="small-contained-button float-end mt-1 anchor-style"
            // onClick={() => navigate(`/programmes/addreview/`)}
            onClick={handleClick}
          >
           
          </a>
        </div>
        <div className="col-12 mb-5 ">
          {
            <>
              <h2>Goal Statement Gallery</h2>
              {gallery.length == 0 ? (
                <div className="goal-gallery p-3">
                  Member has not added any goal statement gallery yet
                </div>
              ) : (
                <ImageList sx={{ height: 300 }} cols={6} rowHeight={164}>
                  {gallery.map((item) => (
                    <ImageListItem key={item.thumbnail_1}>
                      <img
                        src={`${s3baseUrl + item.thumbnail_1}`}
                        height="100px"
                        srcSet={`${s3baseUrl + item.thumbnail_1}`}
                        alt={s3baseUrl + item.thumbnail_2}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </>
          }
        </div>

        {/* <div className="col-12">
          <h2 className="mb-4">Goal Statement Questions</h2>
        </div> */}
        {questions.map((question) => {
          //console.log(question, "Questionsss");
          return (
            <>
              <div className="col-8 mb-3">
                <b>{question.question}</b>
              </div>
              <div className="col-4 mb-5 text-muted text-end">
                <a
                  className=" anchor-style ms-3"
                  onClick={() => {
                    handleAnswerHistory(question);
                  }}
                >
                  Answer History
                </a>
                <a
                  className="anchor-style ms-3"
                  onClick={() => handleReply(question)}
                >
                  Reply
                </a>
              </div>
              {/* <div className="col-12 mb-1">{question.answer}</div> */}
              <div className="col-12 mb-5 text-muted">
                {/* {moment(question.createdAt).format("YYYY-MM-DD")} */}
                <TextField
                  id="outlined-basic"
                  multiline
                  rows={5}
                  label={question.answer == "" ? "Did Not Answer" : "Answer"}
                  variant="outlined"
                  value={question.answer == "" ? "" : question.answer}
                  fullWidth
                />
              </div>
            </>
          );
        })}
      </div>
      <div className="row">
        <div className="col-12">
          <h2 ref={titleRef} className="mb-4">
         
          </h2>
        </div>
        {replies.map((reply) => {
          //console.log(reply);
          return (
            <>
              <div className="col-12 mb-3">
                <div
                  dangerouslySetInnerHTML={{
                    __html: reply.message,
                  }}
                ></div>
                {/* {htmlDecode(reply.message)} */}
              </div>
              <div className="col-12 mb-1">
                {reply?.audio_file && (
                  <audio
                    className="w-100"
                    src={s3baseUrl + reply?.audio_file}
                    controls
                  />
                )}
              </div>
              <div className="col-6 mb-5 text-muted">
                {moment(reply.createdAt).format("YYYY-MM-DD")}
              </div>
              <div className="col-6 text-end">
                <button
                  className="small-contained-button"
                  onClick={() => handleAgreeDelete(reply)}
                >
                  Delete
                </button>
              </div>
            </>
          );
        })}
      </div>
      <div className="row">
        <div className="col-12">
          <AddKimsReply goalDetail={goalDetail} />
        </div>
      </div>
    </div>
  );
};

export default MemberGoalstatementList;
