import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  get_wheel_of_life_by_type,
  _add_wheel_of_life,
  _delete_wheel_of_life,
  _get_wheel_of_life,
  _update_wheel_of_life,
} from "src/DAL/QuestionSurvey/QuestionSurvey";
import { useSnackbar } from "notistack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import RecordNotFound from "src/components/RecordNotFound";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export const AssessmentQuestions = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [openDelete, setOpenDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef(null);
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [formAction, setFormAction] = useState("ADD");
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moduleData, setModuleData] = useState({});
  const [pageData, setPageData] = useState({});
  const [inputList, setInputList] = useState([{ option: "", checked: false }]);
  const classes = useStyles();
  const module_actual_name = "wheel_of_life";
  const [inputs, setInputs] = useState({
    question_type: "mcq",
    scaling_min: "",
    scaling_max: "",
    question_statement: "",
    scaling_color: "#000",
  });

  const handleClick = () => {
    setIsOpenForm(true);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (inputList.length < 1) {
      setInputList([{ option: "", checked: false }]);
    }
  };
  // handle click event of the Add button
  const handleAddClick = (index) => {
    let newIndex = inputList.length + 1;
    setInputList([
      ...inputList.slice(0, index),
      {
        option: "",
        checked: false,
      },
      ...inputList.slice(index),
    ]);
  };
  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
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
  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleChecked = (e, i) => {
    const { name, checked } = e.target;
    const list = [...inputList];
    if (list[i][name] === true) {
      list[i][name] = false;
    } else {
      list[i][name] = true;
    }
    setInputList(list);
  };

  const handleRemoveValues = () => {
    setInputs({
      question_type: inputs.question_type,
      scaling_min: "",
      scaling_max: "",
      scaling_main_heading: "",
      question_statement: "",
      scaling_color: "#000",
    });
    setInputList([{ option: "", checked: false }]);
    setFormAction("ADD");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let error = "";
    const formData = new FormData();
    formData.append("question_statement", inputs.question_statement);
    formData.append("question_type", inputs.question_type);
    formData.append("section_for", "assessment");

    if (params && params.page_id) {
      formData.append("created_for", "sale_page");
      formData.append("page_id", params.page_id);
    } else {
      formData.append("created_for", "general");
    }

    if (formAction === "EDIT") {
      formData.append("order", selectedQuestion.order);
    }

    if (inputs.question_type == "scaling") {
      formData.append("scaling_max", inputs.scaling_max);
      formData.append("scaling_min", inputs.scaling_min);
      formData.append("scaling_color", inputs.scaling_color);
      formData.append("scaling_main_heading", inputs.scaling_main_heading);
    } else {
      let options = [];
      inputList.map((item, index) => {
        if (item.option === "") {
          error = `Option ${index + 1} is required`;
          return;
        }
        options.push(item.option);
      });
      formData.append("options", JSON.stringify(options));
    }
    console.log(...formData, "formData");
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      setIsSubmitting(false);
    } else {
      const result =
        formAction === "ADD"
          ? await _add_wheel_of_life(formData)
          : await _update_wheel_of_life(selectedQuestion._id, formData);
      if (result.code === 200) {
        getQuestionSurveyList(params?.page_id);
        handleRemoveValues();
        setIsSubmitting(false);
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsSubmitting(false);
      }
    }
  };

  const getQuestionSurveyList = async (page_id) => {
    const result = await get_wheel_of_life_by_type("assessment");

    if (result.code === 200) {
      let questionsArray = [];
      result.wheel_of_life.map((value, index) => {
        if (index === 0) {
          questionsArray.push({
            ...value,
            isExpanded: true,
          });
        } else {
          questionsArray.push({
            ...value,
            isExpanded: false,
          });
        }
      });
      setQuestionsList(questionsArray);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleAgreeDelete = (value) => {
    setSelectedQuestion(value);
    setOpenDelete(true);
  };

  const handleEdit = (value) => {
    setSelectedQuestion(value);
    handleClick();
    setFormAction("EDIT");
    setInputs({
      question_type: value.question_type,
      scaling_min: value.scaling_min,
      scaling_max: value.scaling_max,
      question_statement: value.question_statement,
      scaling_color: value.scaling_color,
      scaling_main_heading: value.scaling_main_heading,
    });
    setInputList(() => {
      return value.options.map((option) => {
        return {
          option: option,
          checked: false,
        };
      });
    });
  };

  const handleCancel = () => {
    handleRemoveValues();
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    const result = await _delete_wheel_of_life(selectedQuestion._id);
    if (result.code === 200) {
      getQuestionSurveyList(params?.page_id);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await page_detail_by_id(params.page_id);
    if (result.code == 200) {
      handlePageDetail(result.sale_page);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setIsOpenForm(false);
    handleRemoveValues();
  };

  const handlePageDetail = (data) => {
    setPageData(data);
    const get_module_info = data.module_info.filter(
      (item) => item.module_actual_name == module_actual_name
    )[0];
    setModuleData(get_module_info.module_replica_info);
  };

  useEffect(() => {
    getQuestionSurveyList(params?.page_id);
    if (params.page_id) {
      if (state) {
        handlePageDetail(state);
      } else {
        getPageDetail();
      }
    }
  }, [params.page_id]);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      {params.page_id && (
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
            <span className="sale-page-title">{pageData.sale_page_title}</span>
          </div>
        </div>
      )}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <h1>
            {moduleData?.list_page_heading
              ? moduleData.list_page_heading
              : "Assessment"}
          </h1>
        </div>
        <div className="col-12 col-md-6">
          <button
            className="small-contained-button float-end mt-1"
            onClick={handleClick}
          >
            {moduleData?.add_button_text
              ? moduleData.add_button_text
              : "Add Question"}
          </button>
        </div>
      </div>

      {questionsList.length < 1 ? (
        <RecordNotFound title="Assessment" />
      ) : (
        questionsList.map((questions, index) => {
          return (
            <div className="row mb-2" key={index}>
              <Accordion
                expanded={questions.isExpanded}
                className="question-background"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={() => expandArea(index)}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="svg-color"
                >
                  <div className="col-lg-8 col-md-9 col-sm-12 mt-4 mb-3 me-3">
                    <TextField
                      label="Question Statement"
                      variant="outlined"
                      fullWidth
                      value={questions.question_statement}
                      disabled
                      className="question_statement_text"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-12 mt-4">
                    <TextField
                      label="Question Type"
                      variant="outlined"
                      fullWidth
                      value={
                        questions.question_type === "mcq"
                          ? "Multiple Choice"
                          : "Scaling"
                      }
                      disabled
                    />
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <>
                    {questions.question_type == "mcq" ? (
                      <>
                        {questions.options.map((option, i) => {
                          return (
                            <div
                              className="col-lg-12 col-md-12 col-sm-12 mb-3 d-flex"
                              key={i}
                            >
                              <div className="col-1">
                                <Radio
                                  checked={true}
                                  className="mt-2"
                                  name="checked"
                                />
                              </div>
                              <div className="col-11">
                                <TextField
                                  id="outlined-basic"
                                  label="Enter an answer choice"
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                  value={option}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <h3 className="scale-limit-heading">Scale Limit</h3>
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              fullWidth
                              label="Scaling Main Heading"
                              disabled
                              value={questions.scaling_main_heading}
                            />
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                            <TextField
                              id="outlined-basic"
                              label="Scaling Color"
                              variant="outlined"
                              fullWidth
                              type="color"
                              disabled
                              value={questions.scaling_color}
                            />
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              fullWidth
                              label="Min"
                              disabled
                              value={questions.scaling_min}
                            />
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                            <TextField
                              id="outlined-basic"
                              label="Max"
                              variant="outlined"
                              fullWidth
                              disabled
                              value={questions.scaling_max}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-12 mt-4 text-end mb-4">
                      <button
                        className="small-contained-button"
                        onClick={() => {
                          handleEdit(questions);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="small-contained-button ms-2"
                        onClick={() => {
                          handleAgreeDelete(questions);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })
      )}
      {isOpenForm && (
        <form ref={ref} onSubmit={handleSubmit}>
          <div className="row question-background mt-5">
            <div className="col-lg-9 col-md-9 col-sm-12 mt-5 ">
              <TextField
                id="outlined-basic"
                label="Question Statement"
                variant="outlined"
                fullWidth
                required
                name="question_statement"
                value={inputs.question_statement}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-3 col-md-3 col-sm-12 mt-5">
              <FormControl fullWidth disabled>
                <InputLabel id="demo-simple-select-label">
                  Question Type *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="question_type"
                  value={inputs.question_type}
                  label="Question Type *"
                  onChange={handleChange}
                >
                  <MenuItem value="mcq">Multiple Choice</MenuItem>
                  <MenuItem value="scaling">Scaling</MenuItem>
                </Select>
              </FormControl>
            </div>

            {inputs.question_type == "mcq" && (
              <>
                {inputList.map((x, i) => {
                  return (
                    <div className="col-lg-12 col-md-12 col-sm-12 mt-3 d-flex">
                      <div className="col-1">
                        <Radio
                          checked={x.checked}
                          onClick={(e) => handleChecked(e, i)}
                          className="mt-2"
                          name="checked"
                          value={x.checked}
                        />
                      </div>
                      <div className="col-9">
                        <TextField
                          id="outlined-basic"
                          label="Enter an answer choice"
                          variant="outlined"
                          fullWidth
                          required
                          name="option"
                          value={x.option}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </div>
                      <div className="col-2">
                        <AddCircleOutlineIcon
                          className="question-survey"
                          onClick={() => handleAddClick(i + 1)}
                        />
                        {inputList.length !== 1 && (
                          <RemoveCircleOutlineIcon
                            className="question-survey"
                            onClick={() => handleRemoveClick(i)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {inputs.question_type == "scaling" && (
              <>
                <h3 className="mt-4">Scale Limit</h3>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                  <TextField
                    id="outlined-basic"
                    label="Scaling Main Heading"
                    variant="outlined"
                    fullWidth
                    type="text"
                    required
                    name="scaling_main_heading"
                    value={inputs.scaling_main_heading}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                  <TextField
                    id="outlined-basic"
                    label="Scaling Color"
                    variant="outlined"
                    fullWidth
                    type="color"
                    required
                    name="scaling_color"
                    value={inputs.scaling_color}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Min"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="scaling_min"
                    value={inputs.scaling_min}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Max"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="scaling_max"
                    value={inputs.scaling_max}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <div className="col-12 mt-4 text-end mb-4">
              <button className="small-contained-button">
                {formAction === "ADD"
                  ? isSubmitting
                    ? "Submitting"
                    : "Submit"
                  : isSubmitting
                  ? "Updating"
                  : "Update"}
              </button>
              {formAction === "EDIT" && (
                <button
                  className="small-contained-button ms-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
              <button
                className="small-contained-button ms-2"
                onClick={handleCloseForm}
              >
                Close
              </button>
            </div>
          </div>
        </form>
      )}
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />
    </div>
  );
};
