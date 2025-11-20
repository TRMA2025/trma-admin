import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect } from "react";
import GeneralCkeditor from "src/components/GeneralComponents/GeneralCkeditor";
import {
  _get_attitude_accessment_setting,
  _update_attitude_accessment_setting,
} from "src/DAL/AttitudeAccessmentQuestions/AttitudeAccessmentSetting";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function AssessmentSetting() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [generalInfo, setGeneralInfo] = useState({
    slot_1_percentage: 0,
    slot_2_percentage: 0,
    slot_3_percentage: 0,
    slot_1_percentage_color: "#000",
    slot_2_percentage_color: "#000",
    slot_3_percentage_color: "#000",
    slot_1_coins: 0,
    slot_2_coins: 0,
    slot_3_coins: 0,
    activity_day: "Monday",
    activity_time: 0,
    already_completed_description: 0,
  });
  const [thoughtInfo, setThoughtInfo] = useState({
    video_url: "",
    description: "",
    button_title: "",
    statement: "",
  });
  const [feelingInfo, setFeelingInfo] = useState({
    button_title: "",
    statement: "",
  });
  const [actionInfo, setActionInfo] = useState({
    button_title: "",
    statement: "",
  });
  const [slot1Info, setSlot1Info] = useState({
    button_title: "",
    button_link: "",
    result_box_1: "",
    result_box_2: "",
    result_box_3: "",
    result_box_4: "",
    result_box_5: "",
  });
  const [slot2Info, setSlot2Info] = useState({
    button_title: "",
    button_link: "",
    result_box_1: "",
    result_box_2: "",
    result_box_3: "",
    result_box_4: "",
    result_box_5: "",
  });
  const [slot3Info, setSlot3Info] = useState({
    button_title: "",
    button_link: "",
    result_box_1: "",
    result_box_2: "",
    result_box_3: "",
    result_box_4: "",
    result_box_5: "",
  });

  const get_accessment_setting = async () => {
    const result = await _get_attitude_accessment_setting();
    console.log(result, "resultt");
    if (result.code == 200) {
      if (result.assessment_setting.action_info) {
        setActionInfo(result.assessment_setting.action_info);
      }
      if (result.assessment_setting.feeling_info) {
        setFeelingInfo(result.assessment_setting.feeling_info);
      }
      if (result.assessment_setting.thought_info) {
        setThoughtInfo(result.assessment_setting.thought_info);
      }
      if (result.assessment_setting.general_info) {
        setGeneralInfo(result.assessment_setting.general_info);
      }
      if (result.assessment_setting.slot_1_info) {
        setSlot1Info(result.assessment_setting.slot_1_info);
      }
      if (result.assessment_setting.slot_2_info) {
        setSlot2Info(result.assessment_setting.slot_2_info);
      }
      if (result.assessment_setting.slot_3_info) {
        setSlot3Info(result.assessment_setting.slot_3_info);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    let error = "";
    if (!generalInfo.already_completed_description) {
      error = "Please add Attitude Assessment Completed Description.";
    } else if (!thoughtInfo.description) {
      error = "Assessment Description is required";
    } else if (!thoughtInfo.statement) {
      error = "Thought Statement is required";
    } else if (!feelingInfo.statement) {
      error = "Feeling Statement is required";
    } else if (!actionInfo.statement) {
      error = "Action Statement is required";
    } else if (!slot1Info.result_box_1) {
      error = "Slot 1 Result Box 1 is required";
    } else if (!slot1Info.result_box_2) {
      error = "Slot 1 Result Box 2 is required";
    } else if (!slot2Info.result_box_1) {
      error = "Slot 2 Result Box 1 is required";
    } else if (!slot2Info.result_box_2) {
      error = "Slot 2 Result Box 2 is required";
    } else if (!slot3Info.result_box_1) {
      error = "Slot 3 Result Box 1 is required";
    } else if (!slot3Info.result_box_2) {
      error = "Slot 3 Result Box 2 is required";
    }
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      setIsLoadingForm(false);
    } else {
      const formData = {
        thought_info: thoughtInfo,
        feeling_info: feelingInfo,
        action_info: actionInfo,
        general_info: generalInfo,
        slot_1_info: slot1Info,
        slot_2_info: slot2Info,
        slot_3_info: slot3Info,
      };

      const result = await _update_attitude_accessment_setting(formData);
      if (result.code === 200) {
        setIsLoadingForm(false);
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoadingForm(false);
      }
    }
  };

  const handleChangeGeneralInfo = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setGeneralInfo((values) => ({ ...values, [name]: value }));
  };
  const handleChangeThoughtInfo = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setThoughtInfo((values) => ({ ...values, [name]: value }));
  };
  const handleChangeFeelingInfo = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFeelingInfo((values) => ({ ...values, [name]: value }));
  };
  const handleChangeActionInfo = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setActionInfo((values) => ({ ...values, [name]: value }));
  };

  const handleChangeSlot1Info = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSlot1Info((values) => ({ ...values, [name]: value }));
  };

  const handleChangeSlot2Info = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSlot2Info((values) => ({ ...values, [name]: value }));
  };
  const handleChangeSlot3Info = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSlot3Info((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    get_accessment_setting();
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin">
        <div className="col-6">
          <h2>Assessment Setting</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 wheel-of-life-setting-section-heading">
            <h2 className="mt-4">General Setting</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Activity Day *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="activity_day"
                required
                value={generalInfo.activity_day}
                label="Activity Day *"
                onChange={handleChangeGeneralInfo}>
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Activity Time"
              variant="outlined"
              fullWidth
              name="activity_time"
              value={generalInfo?.activity_time}
              onChange={handleChangeGeneralInfo}
              required
              type="number"
              onWheel={(event) => event.target.blur()}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 1 Percentage"
              variant="outlined"
              fullWidth
              name="slot_1_percentage"
              value={generalInfo?.slot_1_percentage}
              onChange={handleChangeGeneralInfo}
              type="number"
              onWheel={(event) => event.target.blur()}
              required
              InputProps={{
                endAdornment: <span className="slot-percentage-sign">%</span>,
                inputProps: { min: 0, max: 100 },
              }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 1 Percentage Color"
              variant="outlined"
              fullWidth
              type="color"
              required
              name="slot_1_percentage_color"
              value={generalInfo.slot_1_percentage_color}
              onChange={handleChangeGeneralInfo}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 2 Percentage"
              variant="outlined"
              fullWidth
              name="slot_2_percentage"
              value={generalInfo?.slot_2_percentage}
              onChange={handleChangeGeneralInfo}
              type="number"
              onWheel={(event) => event.target.blur()}
              required
              InputProps={{
                endAdornment: <span className="slot-percentage-sign">%</span>,
                inputProps: { min: 0, max: 100 },
              }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 2 Percentage Color"
              variant="outlined"
              fullWidth
              type="color"
              required
              name="slot_2_percentage_color"
              value={generalInfo.slot_2_percentage_color}
              onChange={handleChangeGeneralInfo}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 3 Percentage"
              variant="outlined"
              fullWidth
              name="slot_3_percentage"
              value={generalInfo?.slot_3_percentage}
              onChange={handleChangeGeneralInfo}
              type="number"
              onWheel={(event) => event.target.blur()}
              required
              InputProps={{
                endAdornment: <span className="slot-percentage-sign">%</span>,
                inputProps: { min: 0, max: 100 },
              }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 3 Percentage Color"
              variant="outlined"
              fullWidth
              type="color"
              required
              name="slot_3_percentage_color"
              value={generalInfo.slot_3_percentage_color}
              onChange={handleChangeGeneralInfo}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 1 Coins"
              variant="outlined"
              fullWidth
              type="number"
              onWheel={(event) => event.target.blur()}
              required
              name="slot_1_coins"
              value={generalInfo.slot_1_coins}
              onChange={handleChangeGeneralInfo}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 2 Coins"
              variant="outlined"
              fullWidth
              type="number"
              onWheel={(event) => event.target.blur()}
              required
              name="slot_2_coins"
              value={generalInfo.slot_2_coins}
              onChange={handleChangeGeneralInfo}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Slot 3 Coins"
              variant="outlined"
              fullWidth
              type="number"
              onWheel={(event) => event.target.blur()}
              required
              name="slot_3_coins"
              value={generalInfo.slot_3_coins}
              onChange={handleChangeGeneralInfo}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Attitude Assessment Completed Description. *</h4>
            <GeneralCkeditor
              setInputs={setGeneralInfo}
              inputs={generalInfo}
              name="already_completed_description"
              editorHeight={320}
            />
          </div>
          <div className="col-12 wheel-of-life-setting-section-heading">
            <h2 className="mt-4">Thoughts Setting</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Assessment Video Url"
              variant="outlined"
              fullWidth
              type="url"
              name="video_url"
              value={thoughtInfo?.video_url}
              onChange={handleChangeThoughtInfo}
              required
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Thought Title"
              variant="outlined"
              fullWidth
              name="button_title"
              value={thoughtInfo?.button_title}
              onChange={handleChangeThoughtInfo}
              required
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Assessment Description *</h4>
            <GeneralCkeditor
              setInputs={setThoughtInfo}
              inputs={thoughtInfo}
              name="description"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Thought Statement *</h4>
            <GeneralCkeditor
              setInputs={setThoughtInfo}
              inputs={thoughtInfo}
              name="statement"
              editorHeight={320}
            />
          </div>

          <div className="col-12 wheel-of-life-setting-section-heading">
            <h2 className="mt-4">Feeling Setting</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Feeling Title"
              variant="outlined"
              fullWidth
              name="button_title"
              value={feelingInfo?.button_title}
              onChange={handleChangeFeelingInfo}
              required
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Feeling Statement *</h4>
            <GeneralCkeditor
              setInputs={setFeelingInfo}
              inputs={feelingInfo}
              name="statement"
              editorHeight={320}
            />
          </div>
          <div className="col-12 wheel-of-life-setting-section-heading">
            <h2 className="mt-4">Action Setting</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Action Title"
              variant="outlined"
              fullWidth
              name="button_title"
              value={actionInfo?.button_title}
              onChange={handleChangeActionInfo}
              required
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Action Statement *</h4>
            <GeneralCkeditor
              setInputs={setActionInfo}
              inputs={actionInfo}
              name="statement"
              editorHeight={320}
            />
          </div>
          <div className="col-12 wheel-of-life-setting-section-heading">
            <h2 className="mt-4">Slot 1 Assessment Result Setting</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Title"
              variant="outlined"
              fullWidth
              name="button_title"
              value={slot1Info?.button_title}
              onChange={handleChangeSlot1Info}
              required
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Link"
              variant="outlined"
              fullWidth
              name="button_link"
              value={slot1Info?.button_link}
              onChange={handleChangeSlot1Info}
              required
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 1 *</h4>
            <GeneralCkeditor
              setInputs={setSlot1Info}
              inputs={slot1Info}
              name="result_box_1"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 2 *</h4>
            <GeneralCkeditor
              setInputs={setSlot1Info}
              inputs={slot1Info}
              name="result_box_2"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 3 </h4>
            <GeneralCkeditor
              setInputs={setSlot1Info}
              inputs={slot1Info}
              name="result_box_3"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 4 </h4>
            <GeneralCkeditor
              setInputs={setSlot1Info}
              inputs={slot1Info}
              name="result_box_4"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 5 </h4>
            <GeneralCkeditor
              setInputs={setSlot1Info}
              inputs={slot1Info}
              name="result_box_5"
              editorHeight={320}
            />
          </div>
          <div className="col-12 wheel-of-life-setting-section-heading">
            <h2 className="mt-4">Slot 2 Assessment Result Setting</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Title"
              variant="outlined"
              fullWidth
              name="button_title"
              value={slot2Info?.button_title}
              onChange={handleChangeSlot2Info}
              required
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Link"
              variant="outlined"
              fullWidth
              name="button_link"
              value={slot2Info?.button_link}
              onChange={handleChangeSlot2Info}
              required
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 1 *</h4>
            <GeneralCkeditor
              setInputs={setSlot2Info}
              inputs={slot2Info}
              name="result_box_1"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 2 *</h4>
            <GeneralCkeditor
              setInputs={setSlot2Info}
              inputs={slot2Info}
              name="result_box_2"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 3 </h4>
            <GeneralCkeditor
              setInputs={setSlot2Info}
              inputs={slot2Info}
              name="result_box_3"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 4 </h4>
            <GeneralCkeditor
              setInputs={setSlot2Info}
              inputs={slot2Info}
              name="result_box_4"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 5 </h4>
            <GeneralCkeditor
              setInputs={setSlot2Info}
              inputs={slot2Info}
              name="result_box_5"
              editorHeight={320}
            />
          </div>
          <div className="col-12 wheel-of-life-setting-section-heading">
            <h2 className="mt-4"> Slot 3 Assessment Result Setting</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Title"
              variant="outlined"
              fullWidth
              name="button_title"
              value={slot3Info?.button_title}
              onChange={handleChangeSlot3Info}
              required
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Button Link"
              variant="outlined"
              fullWidth
              name="button_link"
              value={slot3Info?.button_link}
              onChange={handleChangeSlot3Info}
              required
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 1 *</h4>
            <GeneralCkeditor
              setInputs={setSlot3Info}
              inputs={slot3Info}
              name="result_box_1"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 2 *</h4>
            <GeneralCkeditor
              setInputs={setSlot3Info}
              inputs={slot3Info}
              name="result_box_2"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 3 </h4>
            <GeneralCkeditor
              setInputs={setSlot3Info}
              inputs={slot3Info}
              name="result_box_3"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 4 </h4>
            <GeneralCkeditor
              setInputs={setSlot3Info}
              inputs={slot3Info}
              name="result_box_4"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h4>Result Box 5</h4>
            <GeneralCkeditor
              setInputs={setSlot3Info}
              inputs={slot3Info}
              name="result_box_5"
              editorHeight={320}
            />
          </div>
          <div className="text-end mt-4" id="fixedbutton">
            <button className="small-contained-button">
              {isLoadingForm ? "Updating" : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
