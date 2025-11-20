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
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import React, { useEffect, useState } from "react";
import GeneralQuestionStarRating from "./GeneralQuestionStarRating";
import { s3baseUrl } from "src/config/config";
import goal_statement_yes_icons_new1 from "../../../assets/images/goal_statement_yes_icons_new1.png";
import goal_statement_no_new_icons from "../../../assets/images/goal_statement_no_new_icons.png";

export default function AnswersList({ questions }) {
  const [questionsList, setQuestionsList] = useState([]);

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
    setQuestionsList(questions);
  }, [questions]);

  return (
    <div className="row justify-content-center pb-5">
      <div className="col-12 right-part mt-2">
        <div className="col-12 mt-4">
          {questionsList.length > 0
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
                        {question.answer?.document_url && (
                          <div className="col-12 text-end pt-2 button-link">
                            <a
                              href={s3baseUrl + question.answer.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button className="small-contained-button mt-2">
                                View Document
                              </button>
                            </a>
                          </div>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
}
