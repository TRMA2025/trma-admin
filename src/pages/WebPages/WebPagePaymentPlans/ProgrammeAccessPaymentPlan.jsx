import { CircularProgress, IconButton, TextField } from "@mui/material";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useEffect } from "react";
import {
  programme_list_with_plan_api,
  update_porgrams_for_plan_api,
} from "src/DAL/WebsitePages/paymentPlan";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { s3baseUrl } from "src/config/config";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function ProgrammeAccessPaymentPlan() {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [programsList, setProgramsList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [planDetail, setPlanDetail] = useState({});
  const [linkTitle, setLinkTitle] = useState("");
  const [selectedPrograms, setSelectedPrograms] = useState(false);
  const [defaultsetting, setDefaultsetting] = useState({});

  const [link, setLink] = useState("");
  const getProgramsList = async () => {
    const result = await programme_list_with_plan_api(params.plan_id);
    setSelectedPrograms(result.programs);

    if (result.code == 200) {
      setPlanDetail(result?.payment_plan);
      setDefaultsetting(result?.default_setting);
      const hasDefaultProgram = result.programs.some((prog) => prog.is_default);
      const defaultAccessProgram =
        result.default_setting.default_access_program;
      setSelectedPrograms(hasDefaultProgram);
      let selected_programs = [];

      result?.payment_plan?.program.map((prog) => {
        selected_programs.push({
          ...prog,
          _id: prog.program_id,
        });
      });

      defaultAccessProgram?.map((prog) => {
        // ye data api main send ho rha hai default program k liye
        selected_programs.push({
          ...prog,
          _id: prog._id._id,
          title: prog._id.title,
          program_access_type: prog?._id?.program_access_type,
          no_of_start_days: prog._id?.no_of_start_days,
          no_of_limited_days: String(prog._id.no_of_limited_days),
        });
      });

      setSelected(selected_programs);

      var programArray = [];
      result.programs.map((item) => {
        item.table_avatar = {
          src: s3baseUrl + item.program_images.thumbnail_3,
          alt: item.title,
        };
        programArray.push(item);
      });
      setProgramsList(programArray);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoadingForm(true);
    let programme = [];
    selected.map((item) => {
      var program_object = {
        program_id: item._id,
        title: item.title,
        program_access_type: item?.program_access_type,
        no_of_start_days: item?.no_of_start_days,
        no_of_limited_days: item?.no_of_limited_days,
      };
      programme.push(program_object);
    });

    let programObject = {
      program: programme,
    };

    const result = await update_porgrams_for_plan_api(
      params.plan_id,
      programObject
    );
    if (result.code == 200) {
      setIsLoadingForm(false);
      enqueueSnackbar(result.message, { variant: "success" });
      getProgramsList();
    } else {
      setIsLoadingForm(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleChange = (event, name) => {
    const value = event.target.value;
    const program_id = event.target.name;

    setProgramsList((data) =>
      data.map((obj) => {
        if (obj._id === program_id) {
          return { ...obj, [name]: value };
        }
        return obj;
      })
    );

    setSelected((data) =>
      data.map((obj) => {
        if (obj._id === program_id) {
          return { ...obj, [name]: value };
        }
        return obj;
      })
    );
  };

  const TABLE_HEAD = [
    {
      id: "table_avatar",
      label: "Image",
      type: "thumbnail",
      className: "p-0",
    },
    { id: "title", label: "Programme Title", alignRight: false },
    {
      id: "status",
      label: "Status",
      type: "row_status",
    },
    {
      id: "no_of_start_days",
      label: "No Of Start Days",
      renderData: (row) => {
        let is_selected = selected?.find((object) => row._id === object._id);
        let no_of_start_days = is_selected
          ? is_selected?.no_of_start_days
          : row.no_of_start_days;

        if (row.program_access_type == "limited") {
          return (
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              size="small"
              type="number"
              onWheel={(event) => event.target.blur()}
              required
              name={row._id}
              className="default_consultant_commission_input"
              value={no_of_start_days}
              sx={{
                "& fieldset": { border: "none" },
              }}
              onChange={(e) => {
                handleChange(e, "no_of_start_days");
              }}
            />
          );
        }
      },
    },
    {
      id: "no_of_limited_days",
      label: "No Of Limit End Days",
      renderData: (row) => {
        let is_selected = selected.find((object) => row._id === object._id);
        let no_of_limited_days = is_selected
          ? is_selected?.no_of_limited_days
          : row?.no_of_limited_days;

        if (row.program_access_type == "limited") {
          return (
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              size="small"
              type="number"
              onWheel={(event) => event.target.blur()}
              required
              name={row._id}
              className="default_consultant_commission_input"
              value={no_of_limited_days}
              sx={{
                "& fieldset": { border: "none" },
              }}
              onChange={(e) => {
                handleChange(e, "no_of_limited_days");
              }}
            />
          );
        }
      },
    },
  ];
  let breadCrumbMenu = [
    {
      title: linkTitle,
      navigation: link,
      active: false,
    },

    {
      title: "Payment Plans",
      navigation: `${link}/${params.page_id}/payment-plans`,
      active: false,
    },
    {
      title: planDetail.plan_title,
      navigation: null,
      active: true,
    },
  ];

  useEffect(() => {
    if (pathname.match("/website-pages/")) {
      setLinkTitle("Pages");
      setLink("/website-pages");
    } else {
      setLinkTitle("Template Pages");
      setLink("/template-pages");
    }
  }, [pathname]);
  useEffect(() => {
    getProgramsList();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12 mb-3 reply-anchor">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

          {/* <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton>
          <span className="sale-page-title">{planDetail.plan_title}</span> */}
        </div>
        <div className="col-6">
          <h2>Manage Programme Access</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <CustomMUITable
            className="card-with-background"
            TABLE_HEAD={TABLE_HEAD}
            data={programsList}
            selected={selected}
            setSelected={setSelected}
            checkbox_selection={true}
            defaultsetting={defaultsetting}
            pagePagination={true}
          />
        </div>
      </div>
      <div className="ms-auto text-end">
        <button
          className="small-contained-button mt-3 ml-auto"
          onClick={handleSubmit}
        >
          {isLoadingForm ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
