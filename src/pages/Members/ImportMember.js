import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { programmeListing } from "src/DAL/Programme/Programme";
import { s3baseUrl } from "../../config/config";
import { Avatar, Chip, CircularProgress, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import { importMemberApi, programmeAccessApi } from "src/DAL/member/member";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function ImportMembers() {
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [program, setProgram] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [update, setUpdate] = React.useState(false);
  const [csvFile, setCsvFile] = React.useState();
  const navigate = useNavigate();

  const addDays = (object) => {
    var result = new Date(object.createdAt);
    result.setDate(result.getDate() + object.no_of_limited_days);
    return result;
  };
  const fileChangedHandler = (e) => {
    //console.log(e.target.files[0], "fileUpload");
    setCsvFile(e.target.files[0]);
  };

  const programsList = async () => {
    setIsLoading(true);
    const result = await programmeListing();
    if (result.code == 200) {
      var programArray = [];
      result.program.map((item) => {
        item.expiry = addDays(item);
        programArray.push(item);
      });
      setIsLoading(false);
      setProgram(programArray);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  //console.log(selectionModel, "selectionModel");

  const handleSubmit = async () => {
    setIsLoading(true);

    const formData = new FormData();
    let programme = [];
    let programVal = {};
    selectionModel.forEach((program) => {
      programVal = {
        program_id: program,
      };
      programme.push(programVal);
    });
    //console.log(programme, "programmeOk");
    // selectionModel.forEach((item) => {
    //   var program_object = {};
    //   var result = program.filter((program_item) => program_item._id == item);
    //   if (result[0].program_access_type === "limited") {
    //     program_object.program_id = item;
    //     program_object.expiry_date = moment(result[0].expiry).format(
    //       "YYYY MM DD"
    //     );
    //   } else {
    //     program_object.program_id = item;
    //   }
    //   programme.push(program_object);
    // });

    // let programObject = {
    //   program: programme,
    // };
    formData.append("csv", csvFile);
    formData.append("program", JSON.stringify(programme));
    console.log(...formData, "formData values");
    // console.log(programObject, "programObject");
    const result = await importMemberApi(formData);

    if (result.code == 200) {
      setIsLoading(false);
      navigate("/member");
      enqueueSnackbar(result.message, {
        variant: "success",
      });
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const getFormattedData = () => {
    const list = program.map((item, i) => {
      return {
        id: item._id,
        image: item.program_images.thumbnail_1,
        status: item.status,
        name: item.title,
        // expiry: item.expiry,
        no_of_limited_days: item.no_of_limited_days,
        object: item,
        index: i + 1,
      };
    });
    return list;
  };

  // Data grid values
  const columns = [
    { field: "index", headerName: "No", width: 170 },

    {
      field: "image",
      headerName: "Image",
      width: 150,
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

    { field: "name", headerName: "Name", width: 550 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
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

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  //console.log(csvFile, "csvFilecsvFile");

  return (
    <>
      <div style={{ width: "100%" }}>
        <h2 className="mb-4 mt-4">Import Members</h2>

        <div className="col-12">
          <form method="post" action="#" id="#">
            <div className="form-group files">
              <input
                onChange={fileChangedHandler}
                type="file"
                className="form-control"
                multiple
                accept=".csv"
              />
            </div>
          </form>
        </div>
        {/* <h3 className="mb-4 mt-4">SELECT PROGRAMS MEMBER HAS ACCESS</h3> */}
        <label className="mb-3 mt-4">SELECT PROGRAMS MEMBER HAS ACCESS</label>
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
