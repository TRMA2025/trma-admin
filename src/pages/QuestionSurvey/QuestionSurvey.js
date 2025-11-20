import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export const QuestionSurvey = () => {
  const [inputList, setInputList] = useState([{ option: "", checked: false }]);

  const [inputs, setInputs] = useState({
    questionType: "multiple",
    minScale: "",
    maxScale: "",
  });
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
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
  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputs.questionType == "scaling") {
      //console.log(inputs, "scaling case");
    } else {
      //console.log(inputList, "multiple choice");
    }
  };
  const handleChecked = (e, i) => {
    const { name, checked } = e.target;
    const list = [...inputList];
    //console.log(list[i][name], "listlistlist");
    if (list[i][name] === true) {
      list[i][name] = false;
    } else {
      list[i][name] = true;
    }
    setInputList(list);
  };
  //console.log(inputList, "inputList1");
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center mb-4">
          <h1>Wheel Of Life</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row question-background ">
          <div className="col-lg-9 col-md-9 col-sm-12 mt-4 ">
            <TextField
              id="outlined-basic"
              label="Question Statement"
              variant="outlined"
              fullWidth
              required
              name="question"
              value={inputs.question}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-3 col-md-3 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Question Type *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="questionType"
                value={inputs.questionType}
                label="Question Type *"
                onChange={handleChange}>
                <MenuItem value="multiple">Multiple Choice</MenuItem>
                <MenuItem value="scaling">Scaling</MenuItem>
              </Select>
            </FormControl>
          </div>

          {inputs.questionType == "multiple" && (
            <>
              {inputList.map((x, i) => {
                return (
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-5 d-flex">
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
          {inputs.questionType == "scaling" && (
            <>
              <h3 className="mt-4">Scale Limit</h3>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4 ">
                <TextField
                  id="outlined-basic"
                  label="Min"
                  variant="outlined"
                  fullWidth
                  type="number"
                  required
                  name="minScale"
                  value={inputs.minScale}
                  onChange={handleChange}
                  onWheel={(event) => event.target.blur()}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4 ">
                <TextField
                  id="outlined-basic"
                  label="Max"
                  variant="outlined"
                  fullWidth
                  type="number"
                  required
                  name="maxScale"
                  value={inputs.maxScale}
                  onChange={handleChange}
                  onWheel={(event) => event.target.blur()}
                />
              </div>
            </>
          )}
          <div className="col-12 mt-4 text-end mb-4">
            <button className="small-contained-button">Add Question</button>
            <button className="small-contained-button ms-2">Close</button>
          </div>
        </div>
      </form>
    </div>
  );
};
