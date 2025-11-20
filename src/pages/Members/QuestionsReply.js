import {
  CircularProgress,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { s3baseUrl } from "src/config/config";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { AddCommentOnQuestion } from "src/DAL/goalstatement/goalStatement";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { DeleteQuestionCommentApi } from "src/DAL/member/member";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import { htmlDecode } from "src/utils/convertHtml";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export const QuestionsReply = () => {
  const params = useLocation();
  const id = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteDoc, setDeleteDoc] = React.useState("");
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");

  //console.log(params.state._id, "paramsok");
  //console.log(id, "id");
  const handleSubmit = async () => {
    setIsLoading(true);
    //console.log(message, "handleSubmit");
    let postData = {
      question_id: params.state._id,
      member_id: id.id,
      comment: detailDescriptionCk,
    };
    //console.log(postData, "postData");
    const result = await AddCommentOnQuestion(postData);
    if (result.code == 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteQuestionCommentApi(deleteDoc._id);
    if (result.code === 200) {
      setIsLoading(false);
      navigate(-1);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />
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
          <div className="row">
            <div className="col-12 mb-3">
              {<h2>{params.state.question}</h2>}
              <Divider />
            </div>
            {params?.state?.comment?.length < 1 ? (
              <h6>No answer yet</h6>
            ) : (
              params.state.comment?.map((reply) => {
                //console.log(reply);
                return (
                  <>
                    <div className="col-12 mb-3">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: reply.comment,
                        }}
                      ></div>
                    </div>

                    <div className="col-6 mb-5 text-muted">{}</div>
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
              })
            )}
            <div className="col-12">
              <div className="col-12 mt-5 mb-2">
                {/* <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Comment"
                    multiline
                    rows={2}
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </FormControl> */}

                <h4>Reply</h4>
                <TinyEditor
                  setDetailDescription={setDetailDescriptionCk}
                  detailDescriptionCk={detailDescriptionCk}
                />
              </div>
              <div className="col-12 text-end">
                <button
                  onClick={handleSubmit}
                  className="small-contained-button"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
