import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, Divider, CircularProgress } from "@mui/material";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  addNinetyDayQuestionApi,
  getNinetyDayQuestionApi,
} from "src/DAL/NinetyDayQuestion/NinetyDayQuestion";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const ITEM_HEIGHT = 70;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const Input = styled("input")({
  display: "none",
});

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function NinetyDayQuestion() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState({});
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [personName, setPersonName] = React.useState([]);
  const [member, setMember] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [groupListing, setGroupListing] = React.useState([]);
  const [questions, setQuestions] = React.useState();
  const [inputs, setInputs] = React.useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
    question9: "",
    question10: "",
  });
  const [question1_description, setQuestion1_description] = React.useState("");
  const [question2_description, setQuestion2_description] = React.useState("");
  const [question3_description, setQuestion3_description] = React.useState("");
  const [question4_description, setQuestion4_description] = React.useState("");
  const [question5_description, setQuestion5_description] = React.useState("");
  const [question6_description, setQuestion6_description] = React.useState("");
  const [question7_description, setQuestion7_description] = React.useState("");
  const [question8_description, setQuestion8_description] = React.useState("");
  const [question9_description, setQuestion9_description] = React.useState("");
  const [question10_description, setQuestion10_description] =
    React.useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const getQuestion = async () => {
    setIsLoading(true);
    const result = await getNinetyDayQuestionApi();
    if (result.code == 200) {
      setIsLoading(false);
      setQuestions(result.Questions);
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    let postData = {
      rinse_and_repeat_question_description: question1_description,
      rinse_and_repeat_question: inputs.question1,
      create_winning_formula_question: inputs.question2,
      create_winning_formula_question_description: question2_description,
      take_action_question_description: question3_description,
      take_action_question: inputs.question3,
      analyse_your_activities_question_description: question4_description,
      analyse_your_activities_question: inputs.question4,
      self_image_attainment_question_description: question5_description,
      self_image_attainment_question: inputs.question5,
      bullet_proof_attitide_question_description: question6_description,
      bullet_proof_attitide_question: inputs.question6,
      list_habit_or_belife_question_description: question7_description,
      list_habit_or_belife_question: inputs.question7,
      list_achive_goal_question_description: question8_description,
      list_achive_goal_question: inputs.question8,
      achive_goal_question_description: question9_description,
      achive_goal_question: inputs.question9,
      aim_question_description: question10_description,
      aim_question: inputs.question10,
    };
    const result = await addNinetyDayQuestionApi(postData);
    if (result.code == 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
      getQuestion();
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  React.useEffect(() => {
    getQuestion();
  }, []);
  React.useEffect(() => {
    setQuestion1_description(questions?.rinse_and_repeat_question_description);
    setQuestion2_description(
      questions?.create_winning_formula_question_description
    );
    setQuestion3_description(questions?.take_action_question_description);
    setQuestion4_description(
      questions?.analyse_your_activities_question_description
    );
    setQuestion5_description(
      questions?.self_image_attainment_question_description
    );
    setQuestion6_description(
      questions?.bullet_proof_attitide_question_description
    );
    setQuestion7_description(
      questions?.list_habit_or_belife_question_description
    );
    setQuestion8_description(questions?.list_achive_goal_question_description);
    setQuestion9_description(questions?.achive_goal_question_description);
    setQuestion10_description(questions?.aim_question_description);
    setInputs((prevState) => ({
      ...prevState,
      question1: questions?.rinse_and_repeat_question,
      question2: questions?.create_winning_formula_question,
      question3: questions?.take_action_question,
      question4: questions?.analyse_your_activities_question,
      question5: questions?.self_image_attainment_question,
      question6: questions?.bullet_proof_attitide_question,
      question7: questions?.list_habit_or_belife_question,
      question8: questions?.list_achive_goal_question,
      question9: questions?.achive_goal_question,
      question10: questions?.aim_question,
    }));
  }, [questions]);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
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
          {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2>90 day Vision Add Questions</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Rinse And Repeat Question Statement"
            variant="outlined"
            required
            fullWidth
            name="question1"
            value={inputs.question1}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Create Winning Formula Question Statement"
            variant="outlined"
            required
            fullWidth
            name="question2"
            value={inputs.question2}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Take Action Question Statement"
            variant="outlined"
            required
            fullWidth
            name="question3"
            value={inputs.question3}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Analyze Your Activities Question Statement "
            variant="outlined"
            required
            fullWidth
            name="question4"
            value={inputs.question4}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Self Image Attainment Question Statement "
            variant="outlined"
            required
            fullWidth
            name="question5"
            value={inputs.question5}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Bullet Proof Attitude Question Statement"
            variant="outlined"
            required
            fullWidth
            name="question6"
            value={inputs.question6}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="List Habit or Belief Question Statement"
            variant="outlined"
            required
            fullWidth
            name="question7"
            value={inputs.question7}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="List Achieve Goal Question Statement"
            variant="outlined"
            required
            fullWidth
            name="question8"
            value={inputs.question8}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="List Achieve Goal Question Statement"
            variant="outlined"
            required
            fullWidth
            name="question9"
            value={inputs.question9}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Aim Question Statement"
            variant="outlined"
            required
            fullWidth
            name="question10"
            value={inputs.question10}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">Rinse and Repeat Question Description *</h4>
          <TinyEditor
            setDetailDescription={setQuestion1_description}
            detailDescriptionCk={question1_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">
            Create a Winning Formula Question Description *
          </h4>

          <TinyEditor
            setDetailDescription={setQuestion2_description}
            detailDescriptionCk={question2_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">Take action Question Description *</h4>

          <TinyEditor
            setDetailDescription={setQuestion3_description}
            detailDescriptionCk={question3_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">
            Analyse your activities Question Description *
          </h4>

          <TinyEditor
            setDetailDescription={setQuestion4_description}
            detailDescriptionCk={question4_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">
            Describe the self image of this attainment Question Description *
          </h4>

          <TinyEditor
            setDetailDescription={setQuestion5_description}
            detailDescriptionCk={question5_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">
            Create a bullet proof attitude Question Description *
          </h4>

          <TinyEditor
            setDetailDescription={setQuestion6_description}
            detailDescriptionCk={question6_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">List Habit or Belief Question Description *</h4>

          <TinyEditor
            setDetailDescription={setQuestion7_description}
            detailDescriptionCk={question7_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">List Achieve Goal Question Description *</h4>

          <TinyEditor
            setDetailDescription={setQuestion8_description}
            detailDescriptionCk={question8_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">Achieve Goal Question Description *</h4>

          <TinyEditor
            setDetailDescription={setQuestion9_description}
            detailDescriptionCk={question9_description}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <h4 className="mb-4">Aim Question Description *</h4>

          <TinyEditor
            setDetailDescription={setQuestion10_description}
            detailDescriptionCk={question10_description}
          />
        </div>

        <div className="text-end mt-4">
          <button onClick={handleSubmit} className="small-contained-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
