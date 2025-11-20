import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  _add_wheel_of_life,
  _delete_wheel_of_life,
  _get_wheel_of_life,
  _update_wheel_of_life,
} from "src/DAL/QuestionSurvey/QuestionSurvey";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import QuestionsList from "./QuestionsList";
import MUICustomTabs from "src/components/GeneralComponents/MUICustomTabs";
import { get_attitude_accessment_questions_by_type, _add_attitude_accessment_questions, _delete_attitude_accessment_questions, _update_attitude_accessment_questions } from "src/DAL/AttitudeAccessmentQuestions/AttitudeAccessmentQuestions";
import RecordNotFound from "src/components/RecordNotFound";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function AttitudeAccessmentQuestions() {
  const [openDelete, setOpenDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef(null);
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [formAction, setFormAction] = useState("ADD");
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const [inputs, setInputs] = useState({
    question_type: "scaling",
    question_statement: "",
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
  };

  const handleRemoveValues = () => {
    setInputs({
      question_type: inputs.question_type,
      question_statement: "",
    });
    setFormAction("ADD");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = {
      question_statement: inputs.question_statement,
      question_type: inputs.question_type,
    }

    if (formAction === "ADD") {
      formData.assessment_question_for = tabValue == 0 ? "thought" : tabValue == 1 ? "feeling" : "action"
    }

    const result = formAction === "ADD"
      ? await _add_attitude_accessment_questions(formData)
      : await _update_attitude_accessment_questions(selectedQuestion._id, formData);
    if (result.code === 200) {
      if (formAction === "ADD") {
        setQuestionsList(oldList => [result.attitude_assessment, ...oldList]);
      } else {
        const newState = questionsList.map(obj => {
          if (obj._id === selectedQuestion._id) {
            return result.attitude_assesssment
          }
          return obj;
        });
        setQuestionsList(newState);
      }
      handleRemoveValues();
      setIsSubmitting(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsSubmitting(false);
    }
  };

  const getQuestionSurveyList = async () => {
    setIsLoading(true);
    const result = await get_attitude_accessment_questions_by_type(tabValue == 0 ? "thought" : tabValue == 1 ? "feeling" : "action");
    if (result.code === 200) {
      setQuestionsList(result.attitude_assessment);
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
      question_statement: value.question_statement,
    });
  };

  const handleCancel = () => {
    handleRemoveValues();
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    const result = await _delete_attitude_accessment_questions(selectedQuestion._id);
    if (result.code === 200) {
      const data = questionsList.filter((questions) => questions._id !== selectedQuestion._id)
      setQuestionsList(data)
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };


  const handleCloseForm = () => {
    setIsOpenForm(false);
    handleRemoveValues();
  };

  //Changing tab values
  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue);
    handleCloseForm()
  };

  useEffect(() => {
    getQuestionSurveyList();
  }, [tabValue]);


  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  const TABS_OPTIONS = [
    {
      title: "Thoughts",
      component: (
        isLoading ? <CircularProgress className={classes.loading} color="primary" /> :
          questionsList.length > 0 ? <QuestionsList
            questionsList={questionsList}
            MENU_OPTIONS={MENU_OPTIONS}
          /> : <RecordNotFound title="Questions" />
      ),
    },
    {
      title: "Feelings",
      component: (
        isLoading ? <CircularProgress className={classes.loading} color="primary" /> :
          questionsList.length > 0 ? <QuestionsList
            questionsList={questionsList}
            MENU_OPTIONS={MENU_OPTIONS}
          /> : <RecordNotFound title="Questions" />
      ),
    }, {
      title: "Action",
      component: (
        isLoading ? <CircularProgress className={classes.loading} color="primary" /> :
          questionsList.length > 0 ? <QuestionsList
            questionsList={questionsList}
            MENU_OPTIONS={MENU_OPTIONS}
          /> : <RecordNotFound title="Questions" />
      ),
    },
  ];

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12 col-md-8">
          <h1>Attitude Assessment Questions</h1>
        </div>
        <div className="col-12 col-md-4">
          <button
            className="small-contained-button float-end mt-1"
            onClick={handleClick}
          >
            Add Question
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <MUICustomTabs
            data={TABS_OPTIONS}
            value={tabValue}
            handleChange={handleChangeTabs}
          />
        </div>
      </div>
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
                  <MenuItem value="scaling">Scaling</MenuItem>
                </Select>
              </FormControl>
            </div>
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
        title={"Are you sure you want to delete this question?"}
        handleAgree={handleDelete}
      />
    </div>
  )
}
