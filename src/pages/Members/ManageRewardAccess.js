import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { programmeListing, rewardListing } from "src/DAL/Programme/Programme";
import { s3baseUrl } from "../../config/config";
import {
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import { programmeAccessApi, rewardAccessApi } from "src/DAL/member/member";
import { useLocation, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function ManageRewardAccess() {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [program, setProgram] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [update, setUpdate] = React.useState(false);
  const { state } = useLocation();
  const [reward, setReward] = React.useState();
  //console.log(state, "statestatestatestate");

  const addDays = (object) => {
    var result = new Date(object.createdAt);
    result.setDate(result.getDate() + object.no_of_limited_days);
    return result;
  };

  const programsList = async () => {
    setIsLoading(true);
    const result = await rewardListing();
    if (result.code == 200) {
      setProgram(result.reward);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  //console.log(selectionModel, "selectionModel");
  const handleSubmit = async () => {
    setIsLoading(true);
    let rewards = [];
    let rewardList = {};
    selectionModel.map((reward) => {
      rewardList = {
        _id: reward,
      };
      rewards.push(rewardList);
    });
    let rewardObject = {
      reward: rewards,
    };
    //console.log(rewardObject, "rewardObject");
    const result = await rewardAccessApi(params.id, rewardObject);

    if (result.code == 200) {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const getFormattedData = () => {
    const list = program.map((item, i) => {
      return {
        id: item._id,
        image: item.icon_with_border.thumbnail_1,
        status: item.status,
        name: item.title,
        object: item,
        index: i,
      };
    });
    return list;
  };

  // Data grid values
  const columns = [
    { field: "id", headerName: "ID", width: 70 },

    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        //Adding image
        return (
          <>
            <Avatar
              className="top-avatar me-3"
              src={s3baseUrl + params.getValue(params.id, "image")}
              alt="photoURL"
            />
          </>
        );
      },
    },

    { field: "name", headerName: "Name", width: 350 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        return (
          // Making A chip with status
          <Chip
            width="140px"
            label={
              params.getValue(params.id, "status") === true
                ? "Active"
                : "Inactive"
            }
            variant="contained"
            className={
              params.getValue(params.id, "status") === true
                ? "manage-program-chip-success"
                : ""
            }
            color={
              params.getValue(params.id, "status") === true
                ? "success"
                : "error"
            }
            size="small"
          />
        );
      },
    },
  ];

  const handleChangeDate = (date, index) => {
    setUpdate(!update);
    let target_index = program[index];
    target_index.expiry = date;
    setProgram(program);
    getFormattedData();
  };

  React.useEffect(() => {
    programsList();
    getFormattedData();
  }, []);
  React.useEffect(() => {
    getFormattedData();
  }, [update]);
  React.useEffect(() => {
    //console.log(state.object.reward, "rewards");
    let rewardsArray = [];
    state?.object?.reward?.map((reward) => {
      rewardsArray.push(reward._id);
    });
    //console.log(rewardsArray, "rewardsArray");
    setSelectionModel(rewardsArray);
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //console.log(program, "resultresultresult");

  return (
    <>
      <div className="col-12 mb-3 reply-anchor">
        <IconButton
          className="back-screen-button mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>
      </div>
      <div style={{ width: "100%" }}>
        <h2 className="mb-4">Manage Rewards Access</h2>
        <DataGrid
          autoHeight
          disableColumnFilter={true}
          rows={getFormattedData()}
          columns={columns}
          pageSize={50}
          // rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          disableSelectionOnClick={true}
          selectionModel={selectionModel}
          ColumnSortedAscendingIcon={null}
          ColumnUnsortedIcon={null}
          ColumnSortedDescendingIcon={null}
          sortIcon={null}
          disableColumnMenu={true}
        />
      </div>
      <div className="ms-auto text-end">
        <button
          className="small-contained-button mt-3 ml-auto"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
}
