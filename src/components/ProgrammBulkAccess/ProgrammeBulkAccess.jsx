import * as React from "react";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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
import { IconButton, CircularProgress } from "@mui/material";
import ProgrammeBulkMembers from "./ProgrammeBulkMembers";
import { add_programme_bulk_access_api } from "src/DAL/Programme/Programme";
import ActiveLastBreadcrumb from "../ActivePaths";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ProgrammeBulkAccess() {
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();

  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState([]);
  const [reload, setReload] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [inputs, setInputs] = React.useState({
    change_for: "all",
    detailed_description: "",
    program_access_type: "",
  });
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },
    {
      title: `${location?.state?.program_slug}`,
      navigation: `/programmes/programmes-detail/${location?.state?.program_slug}`,
      active: false,
    },
    {
      title:
        params?.type == "remove"
          ? "Remove Member Programme Access"
          : "Add Member Programme Access",
      navigation: null,
      active: true,
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let postData = {
      type: inputs.change_for,
      program: params.id,
      program_access_type: params.type,
    };
    if (inputs.change_for == "specific") {
      postData.member = selected;
    }
    setIsLoading(false);
    console.log(selected, "selectedselectedselected");
    const result = await add_programme_bulk_access_api(postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setSelected([]);
      setIsLoading(false);

      setReload(!reload);
      navigate(-1);
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

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12 mb-2">
          {/* <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton> */}
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2>
            {params.type == "add"
              ? "Add Member Programme Access"
              : "Remove Member Programme Access"}
          </h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-5">
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              {
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">
                      Programme Access For
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="change_for"
                      value={inputs.change_for}
                      label="Programme Access For"
                      onChange={handleChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="specific">Specific</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              }
            </div>
          </div>
        </div>
        <div
          className="text-end mt-4"
          id={`${inputs.change_for == "specific" ? "fixedbutton" : ""}`}
        >
          <button
            // className={`${
            //   inputs.change_for == "specific"
            //     ? "small-contained-button-search"
            //     : "small-contained-button"
            // }`}
            className="small-contained-button-access"
          >
            Submit
          </button>
        </div>
      </form>
      {inputs.change_for == "specific" && (
        <ProgrammeBulkMembers
          selected={selected}
          setSelected={setSelected}
          reload={reload}
        />
      )}
    </div>
  );
}
