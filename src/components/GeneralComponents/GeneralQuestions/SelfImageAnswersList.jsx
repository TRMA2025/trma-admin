import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import React, { useEffect, useState } from "react";
import GeneralQuestionStarRating from "./GeneralQuestionStarRating";
import { htmlDecode } from "src/utils/convertHtml";
import { s3baseUrl } from "src/config/config";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import {
  memberSelfImageRepliesListApi,
  selfImageRepliesShowApi,
} from "src/DAL/member/member";
import { SelfImageQuestionsReply } from "src/pages/Members/SelfImageQuestionsReply";
import { useSnackbar } from "notistack";
import goal_statement_yes_icons_new1 from "../../../assets/images/goal_statement_yes_icons_new1.png";
import goal_statement_no_new_icons from "../../../assets/images/goal_statement_no_new_icons.png";

export default function SelfImageAnswersList({ questions, reload }) {
  const { enqueueSnackbar } = useSnackbar();
  const [questionsList, setQuestionsList] = useState([]);
  const [replyData, setReplyData] = useState();
  const [openReply, setOpenReply] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const titleRef = React.useRef();
  const [replies, setReplies] = React.useState([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteDoc, setDeleteDoc] = React.useState("");
  const member_id = new URLSearchParams(location.search).get("member_id");

  const handleChange = async (event, val) => {
    let postData = {
      member_id: member_id,
      created_for: "self_image",
      question_id: val._id,
      show_replies: event.target.checked,
    };
    let question_Array = [...questionsList];
    const updatedData = question_Array.map((item) => {
      if (item._id === val._id) {
        return {
          ...item,
          answer: {
            ...item.answer,
            show_replies: event.target.checked,
          },
        };
      }
      return item;
    });

    const result = await selfImageRepliesShowApi(postData);
    if (result.code == 200) {
      enqueueSnackbar(result.message, { variant: "success" });
    }
    setQuestionsList(updatedData);
  };

  const handleOpenReplyDrawer = (value) => {
    setReplyData(value);
    setOpenReply(true);
  };
  const handleCloseReplyDrawer = () => {
    setOpenReply(false);
  };

  const detailQuestionHistory = async () => {
    setIsLoading(true);
    const result = await memberSelfImageRepliesListApi(params.id);
    if (result.code == 200) {
      setReplies(result.reply);

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const expandArea = (index) => {
    let temp_state = [...questionsList];
    let temp_element = { ...temp_state[index] };
    if (temp_element.isExpanded === false) {
      temp_element.isExpanded = true;
    } else {
      temp_element.isExpanded = false;
    }
    temp_state[index] = temp_element;
    setQuestionsList(temp_state);
  };

  useEffect(() => {
    const updatedData = questions.map((item) => ({
      ...item,
      show_replies: item?.show_replies ? item?.show_replies : false,
    }));
    setQuestionsList(questions);
  }, [questions]);

  return (
    <div className="row justify-content-center pb-5">
      <div className="col-12 right-part mt-2">
        <div className="col-12 mt-4">
          {questionsList?.length > 0
            ? questionsList.map((question, i) => {
                let find_answer = questionsList.find(
                  (answer) => answer._id == question._id
                );

                return (
                  <div className="card mb-2" key={question._id}>
                    <Accordion
                      expanded={question.isExpanded}
                      className="qustion-section-accordion"
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        onClick={() => expandArea(i)}
                        aria-controls="panel1a-content"
                        className="accordion-summary qustion-section-summary"
                      >
                        <div className="d-flex goal_statement_yes_icons justify-content-between w-100">
                          <div>
                            <h3>Question Statement</h3>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: question.question_statement,
                              }}
                              className="question-answer"
                            ></div>
                          </div>
                          <img
                            src={
                              find_answer?.answer?.answer_statement
                                ? goal_statement_yes_icons_new1
                                : goal_statement_no_new_icons
                            }
                            className="float-end"
                            alt=""
                          />
                        </div>
                      </AccordionSummary>

                      <AccordionDetails>
                        {question.question_type == "mcq" ? (
                          <FormControl style={{ width: "100%" }}>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue=""
                              name="radio-buttons-group"
                              value={question.answer?.answer_statement}
                            >
                              {question?.options.map((option, index) => (
                                <div
                                  className={`question-answer  ${
                                    question.answer?.answer_statement
                                      ? option ===
                                        question.answer?.answer_statement
                                        ? "selectedAnswer"
                                        : ""
                                      : ""
                                  }`}
                                  key={option.id}
                                >
                                  <FormControlLabel
                                    value={option}
                                    id={`capsule${index}`}
                                    className="answer"
                                    control={<Radio />}
                                    label={option}
                                  />
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        ) : question.question_type == "checkbox" ? (
                          <FormControl style={{ width: "100%" }}>
                            <FormGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue=""
                              name="radio-buttons-group"
                              value={question?.answer}
                            >
                              {question?.options.map((option, index) => {
                                let checkbox_answer =
                                  question.answer?.answer_statement?.find(
                                    (old_answer) => old_answer == option
                                  );
                                return (
                                  <div
                                    className={`question-answer`}
                                    key={option.id}
                                  >
                                    <FormControlLabel
                                      value={option}
                                      id={`capsule${index}`}
                                      className="answer"
                                      control={
                                        <Checkbox
                                          checked={
                                            checkbox_answer ? true : false
                                          }
                                        />
                                      }
                                      label={option}
                                    />
                                  </div>
                                );
                              })}
                            </FormGroup>
                          </FormControl>
                        ) : question.question_type == "scaling" ? (
                          <FormControl>
                            <ul className="list-unstyled pt-1 mb-0">
                              <li className="row">
                                <div className="col-12">
                                  <GeneralQuestionStarRating
                                    question={question}
                                    find_answer={question.answer}
                                  />
                                </div>
                              </li>
                            </ul>
                          </FormControl>
                        ) : (
                          <FormControl style={{ width: "100%" }}>
                            <TextField
                              id="outlined-multiline-static"
                              multiline
                              rows={4}
                              className="mb-3"
                              value={question.answer?.answer_statement}
                              variant="outlined"
                              disabled
                            />
                          </FormControl>
                        )}
                        {
                          <div className="col-12 d-flex pt-2  justify-content-between">
                            <div>
                              <button
                                className="small-contained-button mt-2"
                                onClick={() => handleOpenReplyDrawer(question)}
                              >
                                Replies
                                {!!question?.answer?.comments
                                  ? " (" +
                                    question?.answer?.comments?.length +
                                    ")"
                                  : "(0)"}
                              </button>
                              <Tooltip title="Show Replies to Client">
                                <Switch
                                  checked={question?.answer.show_replies}
                                  onChange={(e) => handleChange(e, question)}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </Tooltip>
                            </div>

                            {question.answer?.document_url && (
                              <a
                                href={s3baseUrl + question.answer.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button-link"
                              >
                                <button className="small-contained-button mt-2">
                                  View Document
                                </button>
                              </a>
                            )}
                          </div>
                        }
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      <CustomDrawer
        isOpenDrawer={openReply}
        onOpenDrawer={handleOpenReplyDrawer}
        onCloseDrawer={handleCloseReplyDrawer}
        pageTitle={`Replies`}
        name={"Jhon"}
        componentToPassDown={
          <SelfImageQuestionsReply
            data={replyData}
            detailQuestionHistory={detailQuestionHistory}
            onCloseDrawer={handleCloseReplyDrawer}
            reload={reload}
          />
        }
      />
    </div>
  );
}
