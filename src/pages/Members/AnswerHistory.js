import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress, IconButton } from "@mui/material";
import { questionReplyHistory } from "src/DAL/member/member";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import CircleIcon from "@mui/icons-material/Circle";
import moment from "moment";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export const AnswerHistory = () => {
  const id = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const params = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  //console.log(params, "params");
  //console.log(id, params.state._id, "id");
  const [replies, setReplies] = useState([]);

  const historyDetail = async () => {
    setIsLoading(true);
    let postData = {
      question_id: params.state._id,
      member_id: id.id,
    };
    const result = await questionReplyHistory(postData);
    if (result.code == 200) {
      //console.log(result, "resultsetIsLoading");
      setReplies(result.answer_stats);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  React.useEffect(() => {
    historyDetail();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-3">
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
          <h2 className="mb-4">{params.state.question}</h2>
        </div>
        {replies.length < 1 ? (
          <h6>No Replies</h6>
        ) : (
          replies.map((reply) => {
            //console.log(reply);
            return (
              <>
                <div className="col-12 mb-3">
                  <CircleIcon /> {reply.answer}
                </div>

                <div className="col-6 mb-5 text-muted">
                  {moment(reply.createdAt).format("YYYY-MM-DD")}
                </div>
              </>
            );
          })
        )}
      </div>
    </div>
  );
};
