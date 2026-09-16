import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { feedSettingApi, updateSettingApi } from "src/DAL/feeds/feeds";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function FeedSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [
    dynamiteCoinsCountNextLevelDescriptionCk,
    setDynamiteCoinsCountNextLevelDescriptionCk,
  ] = React.useState("");
  const [
    eliteCoinsCountNextLevelDescriptionCk,
    setEliteCoinsCountNextLevelDescriptionCk,
  ] = React.useState("");
  const [
    masteryCoinsCountNextLevelDescriptionCk,
    setMasteryCoinsCountNextLevelDescriptionCk,
  ] = React.useState("");
  const [
    executiveCoinsCountNextLevelDescriptionCk,
    setExecutiveCoinsCountNextLevelDescriptionCk,
  ] = React.useState("");

  const [inputs, setInputs] = React.useState({
    dynamiteLikePoints: "",
    dynamiteTipPoints: "",
    dynamiteCoinsCountNextLevel: 0,
    dynamiteStickPoints: "",
    dynamiteCountCoins: "",

    eliteLikePoints: "",
    eliteTipPoints: "",
    eliteStickPoints: "",
    eliteCoinsCountNextLevel: 0,
    eliteCountCoins: "",

    masteryLikePoints: "",
    masteryTipPoints: "",
    masteryStickPoints: "",
    masteryCoinsCountNextLevel: 0,
    masteryCountCoins: "",

    executiveLikePoints: "",
    executiveTipPoints: "",
    executiveStickPoints: "",
    executiveCoinsCountNextLevel: 0,
    executiveCountCoins: "",

    generalMaxLikeCount: "",
    generalBonusCoin: "",
    generalCoinDescription: "",
    generalLikeDescription: "",
    generalStickDescription: "",
    generalGratitudeDescription: 0,
  });

  const getSetting = async () => {
    setIsLoading(true);
    const result = await feedSettingApi();
    if (result.code == 200) {
      result.feed_setting.map((setting) => {
        setDynamiteCoinsCountNextLevelDescriptionCk(
          setting.dynamite_level.coins_count_for_next_level_description
        );
        setEliteCoinsCountNextLevelDescriptionCk(
          setting.elite_level.coins_count_for_next_level_description
        );
        setMasteryCoinsCountNextLevelDescriptionCk(
          setting.mastery_level.coins_count_for_next_level_description
        );
        setExecutiveCoinsCountNextLevelDescriptionCk(
          setting.executive_level.coins_count_for_next_level_description
        );
        setInputs({
          ...inputs,
          ["dynamiteLikePoints"]: setting.dynamite_level.like_point,
          ["dynamiteTipPoints"]: setting.dynamite_level.tip_point,
          ["dynamiteStickPoints"]: setting.dynamite_level.stick_point,
          ["dynamiteCountCoins"]: setting.dynamite_level.coins_count,
          ["dynamiteCoinsCountNextLevel"]:
            setting.dynamite_level.coins_count_for_next_level,

          ["eliteLikePoints"]: setting.elite_level.like_point,
          ["eliteTipPoints"]: setting.elite_level.tip_point,
          ["eliteStickPoints"]: setting.elite_level.stick_point,
          ["eliteCountCoins"]: setting.elite_level.coins_count,
          ["eliteCoinsCountNextLevel"]:
            setting.elite_level.coins_count_for_next_level,

          ["masteryLikePoints"]: setting.mastery_level.like_point,
          ["masteryTipPoints"]: setting.mastery_level.tip_point,
          ["masteryStickPoints"]: setting.mastery_level.stick_point,
          ["masteryCountCoins"]: setting.mastery_level.coins_count,
          ["masteryCoinsCountNextLevel"]:
            setting.mastery_level.coins_count_for_next_level,

          ["executiveLikePoints"]: setting.executive_level.like_point,
          ["executiveTipPoints"]: setting.executive_level.tip_point,
          ["executiveStickPoints"]: setting.executive_level.stick_point,
          ["executiveCountCoins"]: setting.executive_level.coins_count,
          ["executiveCoinsCountNextLevel"]:
            setting.executive_level.coins_count_for_next_level,

          ["generalMaxLikeCount"]: setting.maximum_like_count,
          ["generalBonusCoin"]: setting.bonus_count,
          ["generalCoinDescription"]: setting.coin_description,
          ["generalLikeDescription"]: setting.like_description,
          ["generalStickDescription"]: setting.stick_description,
          ["generalGratitudeDescription"]: setting.gratitude_description,
        });
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let feedSettingData = {
      dynamite_level: {
        like_point: inputs.dynamiteLikePoints,
        tip_point: inputs.dynamiteTipPoints,
        stick_point: inputs.dynamiteStickPoints,
        coins_count: inputs.dynamiteCountCoins,
        coins_count_for_next_level: inputs.dynamiteCoinsCountNextLevel,
        coins_count_for_next_level_description:
          dynamiteCoinsCountNextLevelDescriptionCk,
      },
      elite_level: {
        like_point: inputs.eliteLikePoints,
        tip_point: inputs.eliteTipPoints,
        stick_point: inputs.eliteStickPoints,
        coins_count: inputs.eliteCountCoins,
        coins_count_for_next_level: inputs.eliteCoinsCountNextLevel,
        coins_count_for_next_level_description:
          eliteCoinsCountNextLevelDescriptionCk,
      },
      mastery_level: {
        like_point: inputs.masteryLikePoints,
        tip_point: inputs.masteryTipPoints,
        stick_point: inputs.masteryStickPoints,
        coins_count: inputs.masteryCountCoins,
        coins_count_for_next_level: inputs.masteryCoinsCountNextLevel,
        coins_count_for_next_level_description:
          masteryCoinsCountNextLevelDescriptionCk,
      },
      executive_level: {
        like_point: inputs.executiveLikePoints,
        tip_point: inputs.executiveTipPoints,
        stick_point: inputs.executiveStickPoints,
        coins_count: inputs.executiveCountCoins,
        coins_count_for_next_level: inputs.executiveCoinsCountNextLevel,
        coins_count_for_next_level_description:
          executiveCoinsCountNextLevelDescriptionCk,
      },
      bonus_count: inputs.generalBonusCoin,
      maximum_like_count: inputs.generalMaxLikeCount,
      coin_description: inputs.generalCoinDescription,
      like_description: inputs.generalLikeDescription,
      stick_description: inputs.generalStickDescription,
      gratitude_description: inputs.generalGratitudeDescription,
    };

    const result = await updateSettingApi(feedSettingData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(true);
      getSetting();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    getSetting();
  }, []);

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
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Feed Setting</h2>
        </div>
      </div>
      <div className="row">
        <h4 className="mt-3">BeeMe Level</h4>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Like Coins"
            variant="outlined"
            fullWidth
            required
            name="dynamiteLikePoints"
            value={inputs.dynamiteLikePoints}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Gratitude Coins"
            variant="outlined"
            fullWidth
            required
            name="dynamiteTipPoints"
            value={inputs.dynamiteTipPoints}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coins Count"
            variant="outlined"
            fullWidth
            required
            name="dynamiteCountCoins"
            value={inputs.dynamiteCountCoins}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coins Count For Next Level"
            variant="outlined"
            type="number"
            fullWidth
            name="dynamiteCoinsCountNextLevel"
            value={inputs.dynamiteCoinsCountNextLevel}
            onChange={handleChange}
            onWheel={(event) => event.target.blur()}
          />
        </div>
        <div className="col-12 mt-4">
          <h4>Coins Count For Next Level Description</h4>
          <TinyEditor
            setDetailDescription={setDynamiteCoinsCountNextLevelDescriptionCk}
            detailDescriptionCk={dynamiteCoinsCountNextLevelDescriptionCk}
          />
        </div>
        <h4 className="mt-3">Elite Level</h4>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Like Coins"
            variant="outlined"
            fullWidth
            required
            name="eliteLikePoints"
            value={inputs.eliteLikePoints}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Gratitude Coins"
            variant="outlined"
            fullWidth
            required
            name="eliteTipPoints"
            value={inputs.eliteTipPoints}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coins Count"
            variant="outlined"
            fullWidth
            required
            name="eliteCountCoins"
            value={inputs.eliteCountCoins}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coins Count For Next Level"
            variant="outlined"
            fullWidth
            type="number"
            name="eliteCoinsCountNextLevel"
            value={inputs.eliteCoinsCountNextLevel}
            onChange={handleChange}
            onWheel={(event) => event.target.blur()}
          />
        </div>
        <div className="col-12 mt-4">
          <h4>Coins Count For Next Level Description</h4>
          <TinyEditor
            setDetailDescription={setEliteCoinsCountNextLevelDescriptionCk}
            detailDescriptionCk={eliteCoinsCountNextLevelDescriptionCk}
          />
        </div>
        <h4 className="mt-3">Mastery Level</h4>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Like Coins"
            variant="outlined"
            fullWidth
            required
            name="masteryLikePoints"
            value={inputs.masteryLikePoints}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Gratitude Coins"
            variant="outlined"
            fullWidth
            required
            name="masteryTipPoints"
            value={inputs.masteryTipPoints}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coins Count"
            variant="outlined"
            fullWidth
            required
            name="masteryCountCoins"
            value={inputs.masteryCountCoins}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coins Count For Next Level"
            variant="outlined"
            fullWidth
            type="number"
            name="masteryCoinsCountNextLevel"
            value={inputs.masteryCoinsCountNextLevel}
            onChange={handleChange}
            onWheel={(event) => event.target.blur()}
          />
        </div>
        <div className="col-12 mt-4">
          <h4>Coins Count For Next Level Description</h4>
          <TinyEditor
            setDetailDescription={setMasteryCoinsCountNextLevelDescriptionCk}
            detailDescriptionCk={masteryCoinsCountNextLevelDescriptionCk}
          />
        </div>

        <h4 className="mt-3">Executive Level</h4>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Like Coins"
            variant="outlined"
            fullWidth
            required
            name="executiveLikePoints"
            value={inputs.executiveLikePoints}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Gratitude Coins"
            variant="outlined"
            fullWidth
            required
            name="executiveTipPoints"
            value={inputs.executiveTipPoints}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coins Count"
            variant="outlined"
            fullWidth
            required
            name="executiveCountCoins"
            value={inputs.executiveCountCoins}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coins Count For Next Level"
            variant="outlined"
            fullWidth
            type="number"
            name="executiveCoinsCountNextLevel"
            value={inputs.executiveCoinsCountNextLevel}
            onChange={handleChange}
            onWheel={(event) => event.target.blur()}
          />
        </div>
        <div className="col-12 mt-4">
          <h4>Coins Count For Next Level Description</h4>
          <TinyEditor
            setDetailDescription={setExecutiveCoinsCountNextLevelDescriptionCk}
            detailDescriptionCk={executiveCoinsCountNextLevelDescriptionCk}
          />
        </div>
        <h4 className="mt-3">General Settings</h4>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Maximum Like Count"
            variant="outlined"
            fullWidth
            required
            name="generalMaxLikeCount"
            value={inputs.generalMaxLikeCount}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Bonus Coins"
            variant="outlined"
            fullWidth
            required
            name="generalBonusCoin"
            value={inputs.generalBonusCoin}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Coin Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            name="generalCoinDescription"
            value={inputs.generalCoinDescription}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Like Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            name="generalLikeDescription"
            value={inputs.generalLikeDescription}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Stick Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            name="generalStickDescription"
            value={inputs.generalStickDescription}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Gratitude Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            name="generalGratitudeDescription"
            value={inputs.generalGratitudeDescription}
            onChange={handleChange}
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
