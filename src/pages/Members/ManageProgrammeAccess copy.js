import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { programmeListing } from "src/DAL/Programme/Programme";
import { s3baseUrl } from "../../config/config";
import { Avatar, Chip, CircularProgress, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import { programmeAccessApi } from "src/DAL/member/member";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function ManageProgrammeAccess() {
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [program, setProgram] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [expiryDate, setExpiryDate] = React.useState([]);
  const [date, setDate] = React.useState("");

  const programsList = async () => {
    setIsLoading(true);
    const result = await programmeListing();
    // console.log(result, "kkkkkkkkkkk");
    if (result.code == 200) {
      setIsLoading(false);
      setProgram(result.program);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let programme = [];
    let programVal = {};
    selectionModel.forEach((program) => {
      programVal = {
        program_id: program,
      };
      programme.push(programVal);
    });
    let programObject = {
      program: programme,
    };
    var newArray = programme.concat(expiryDate);
    expiryDate.map((value, i) => {
      //console.log(value, "vallllll");
    });

    //console.log(newArray, "newArray");

    const result = await programmeAccessApi(params.id, programObject);
    if (result.code == 200) {
      setIsLoading(false);
      enqueueSnackbar("Member added against programme successfully", {
        variant: "success",
      });
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleChangeDate = (date, id) => {
    // setDate(date);
    let programVal = {
      program_id: id._id,
      expiry_date: moment(date).format("MM DD YYYY"),
    };
    expiryDate.push(programVal);
  };

  const addDays = (days) => {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  const getFormattedData = () => {
    const list = program.map((item, i) => {
      return {
        id: item._id,
        image: item.program_images.thumbnail_1,
        status: item.status,
        name: item.title,
        expiry: addDays(item.no_of_limited_days),
        no_of_limited_days: item.no_of_limited_days,
        object: item,
      };
    });
    return list;
  };

  React.useEffect(() => {
    programsList();
    getFormattedData();
  }, []);

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
    {
      field: "expiry",
      headerName: "Expire",
      width: 200,
      renderCell: (params) => {
        //Adding image
        return (
          <>
            {params.getValue(params.id, "no_of_limited_days") > 0 && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  // label="Expire"
                  inputFormat="dd/MM/yyyy"
                  className="mt-3 mb-3"
                  value={date ? date : params.getValue(params.id, "expiry")}
                  onChange={(v) =>
                    handleChangeDate(v, params.getValue(params.id, "object"))
                  }
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              </LocalizationProvider>
            )}

            {/* {params.getValue(params.id, image)} */}
          </>
        );
      },
    },
  ];
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  // console.log(selectionModel, "selectionModel");
  // console.log(expiryDate, "expiryDateexpiryDate");

  return (
    <>
      <div style={{ width: "100%" }}>
        <h2 className="mb-4">Manage Programme Access</h2>
        <DataGrid
          autoHeight
          disableColumnFilter={true}
          rows={getFormattedData()}
          columns={columns}
          pageSize={50}
          // rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            //console.log(newSelectionModel);
            setSelectionModel(newSelectionModel);
          }}
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
