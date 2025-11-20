import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useMemo, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
//import Editor from "../../components/Editor/Editor";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
// import { VaultListing } from "src/DAL/Vault/Vault";
import Autocomplete from "@mui/material/Autocomplete";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import countryList from "react-select-country-list";
import { TimeZones } from "src/utils/constant";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { IconButton, Divider, CircularProgress } from "@mui/material";
// import { AddProgram } from "src/DAL/Programmes/Programmes";
import { object } from "prop-types";
import { menuList } from "src/DAL/Menu/Menu";
import {
  AddProgrammeApi,
  programmeActiveListing,
  programmeListing,
} from "src/DAL/Programme/Programme";
import { countries } from "src/utils/country";
import {
  AddMemberApi,
  addPaymentRequest,
  memberListing,
  paymentTemplate,
  paymentTemplateListApi,
  productListApi,
} from "src/DAL/member/member";
import { consultantListing } from "src/DAL/consultant/consultant";
import { paymentTemplateDetailApi } from "src/DAL/PaymentTemplate/paymentTemplateApi";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import {
  addPaymentPlanApi,
  detailPaymentPlanApi,
  editPaymentPlanApi,
} from "src/DAL/paymentPlan/paymentPlan";
import { dynamiteEventsListApi } from "src/DAL/WebsitePages/DynamiteEvents/DynamiteEvents";
import { s3baseUrl } from "src/config/config";

// import { get_root_value } from "src/utils/domUtils";

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

export default function EditPaymentPlan() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [oldImage, setOldImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [country, setCountry] = React.useState("");
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [consultantValue, setConsultantValue] = React.useState([]);
  const [templates, setTemplates] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [programmes, setProgrammes] = React.useState([]);
  const [membersList, setMembersList] = React.useState([]);
  const [selectCountry, setSelectCountry] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const options = useMemo(() => countryList().getData(), []);
  const [templateDetail, setTemplateDetail] = useState("");
  const [templateWork, setTemplateWork] = useState(false);
  const [programmeListings, setProgramListing] = React.useState([]);
  const [groupsName, setGroupsName] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [eventsListing, setEventsListing] = React.useState([]);
  const [eventsName, setEventsName] = React.useState([]);
  const [emailBodyCk, setEmailBodyCk] = useState("");

  const [inputs, setInputs] = React.useState({
    planTitle: "",
    planType: "",
    planPackage: "",
    planButtonText: "",
    campaignId: "",
    campaignListId: "",
    planStatus: "true",
    showOnWebsite: "true",
    shortDescription: "",
    currency: "",
    planPrice: "",
    planPayment: "onetime",
    showPrice: "true",
    priceReplaceMent: "",
    planPaymentType: "week",
    recursionTimePeriod: "0",
    recursionPeriodDays: "0",
    product: "",
    status: "true",
    is_basic_membership: false,
    programme: "",
    member: "",
    image: {},
    order: "",
    page_id: "",
    planOrder: "",
    bestValueBadge: "",
    email_body_heading: "",
    email_subject: "",
    is_event_popup: "",
    payment_url: "",
  });

  const handleChangeGroup = (event) => {
    const {
      target: { value },
    } = event;
    setGroupsName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const getEvents = async () => {
    // const result = await websiteEventListApi();
    const result = await dynamiteEventsListApi();
    console.log(result, "api events");
    setEventsListing(result.dynamite_event);
  };
  const handleChangeEvents = (event) => {
    const {
      target: { value },
    } = event;
    setEventsName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const consultantListData = async () => {
    setIsLoading(true);
    let result = await consultantListing();
    if (result.code == 200) {
      setConsultantValue(result.consultant_list);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  const paymentTemplates = async () => {
    setIsLoading(true);
    let result = await paymentTemplateListApi();
    if (result.code == 200) {
      setTemplates(result.payment_template);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };
  const productList = async () => {
    setIsLoading(true);
    let result = await productListApi();
    if (result.code == 200) {
      setProducts(result.product);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };
  const programmeList = async () => {
    setIsLoading(true);
    let result = await programmeListing();
    if (result.code == 200) {
      setProgrammes(result.program);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };
  const memberList = async () => {
    setIsLoading(true);
    let result = await memberListing();
    if (result.code == 200) {
      setMembersList(result.member);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  const getProgrammes = async () => {
    setIsLoading(true);
    const result = await programmeActiveListing();
    if (result.code === 200) {
      setProgramListing(result.program);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const getDetail = async () => {
    const result = await detailPaymentPlanApi(params.id);
    if (result.code == 200) {
      console.log(result, "detailPaymentPlanApi");
      let data = result.payment_plan;

      setInputs({
        ...inputs,
        ["planTitle"]: data.plan_title,
        ["planType"]: data.is_plan_free,
        ["planPackage"]: data.plan_package,
        ["planButtonText"]: data.plan_button_text,
        ["campaignId"]: data.active_campaign_list_id,
        ["campaignListId"]: data.active_campaign_tag_id,
        ["planStatus"]: data.plan_status,
        ["showOnWebsite"]: "true",
        ["shortDescription"]: data.short_description,
        ["currency"]: data.plan_currency,
        ["planPrice"]: data.plan_price,
        ["planPayment"]: data.payment_access,
        ["showPrice"]: "true",
        ["priceReplaceMent"]: "",
        ["planPaymentType"]: data.plan_type,
        ["recursionTimePeriod"]: data.time_period_interval,
        ["recursionPeriodDays"]: data.trial_period_days,
        ["is_basic_membership"]: data.is_basic_membership,
        ["product"]: data.product ? data.product : "",
        ["status"]: "",
        ["planOrder"]: data.plan_order,
        ["bestValueBadge"]: data.best_value_badge,
        ["is_event_popup"]: data.is_plan_popup,
        ["email_body_heading"]: data.email_body_heading,
        ["email_subject"]: data.email_subject,
        ["payment_url"]: data.payment_url,
        // ["programme"]: "",
        // ["member"]: "",
      });
      setDetailDescriptionCk(data.detailed_description);
      setEmailBodyCk(data.email_body);
      setOldImage(data.badge_image?.thumbnail_1);
      let groups_slug = data.program;
      let selected_group = [];
      groups_slug.map((group) => {
        selected_group.push(group.program_id);
      });
      //event data manipulate
      let event_slug = data?.event;
      let events_array = [];
      event_slug?.map((event) => {
        // console.log(event?.event_id, "to set event");
        events_array.push(event?.event_id);
      });
      console.log(events_array, "events_arrayevents_array");
      setEventsName(events_array);
      setGroupsName(selected_group);
      //console.log(selected_group, "selected_groupselected_group");
    }
    //console.log(inputs.planType, "planTypeplanTypeplanTypeplanType");
  };

  const templateData = async () => {
    setIsLoading(true);
    const result = await paymentTemplateDetailApi(inputs.template_type);
    if (result.code == 200) {
      setTemplateDetail(result.payment_template);
      valueSetFunction();
      setIsLoading(false);
      setTemplateWork(true);
    } else {
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  console.log(inputs.planPaymentType, "inputs.planPaymentType)");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   let programme_array = [];
  //   let group_object = {};
  //   groupsName.map((group) => {
  //     group_object = {
  //       program_id: group,
  //     };
  //     programme_array.push(group_object);
  //   });
  //   let selected_event_array = [];
  //   let selected_event_object = {};
  //   eventsName.map((event) => {
  //     selected_event_object = {
  //       event_id: event,
  //     };
  //     selected_event_array.push(selected_event_object);
  //   });

  //   const formData = new FormData();
  //   if (inputs.planType == "true" || inputs.planType == true) {
  //     formData.append("plan_title", inputs.planTitle);
  //     // formData.append("plan_package", inputs.planPackage);
  //     formData.append("plan_button_text", inputs.planButtonText);
  //     formData.append(
  //       "tag_id",
  //       inputs.campaignId == null ? "" : inputs.campaignId
  //     );
  //     formData.append(
  //       "list_id",
  //       inputs.campaignListId == null ? "" : inputs.campaignListId
  //     );
  //     formData.append("plan_status", inputs.planStatus);
  //     formData.append("is_plan_free", inputs.planType);
  //     formData.append("program", JSON.stringify(programme_array));
  //     formData.append("short_description", inputs.shortDescription);
  //     formData.append("detailed_description", detailDescriptionCk);
  //     formData.append("time_period_interval", inputs.recursionTimePeriod);
  //     formData.append("plan_order", inputs.order);
  //     formData.append("page_id", inputs.page_id);
  //     formData.append("created_for", "sale_page");
  //     formData.append("best_value_badge", inputs.bestValueBadge);
  //     formData.append("is_plan_popup", inputs.is_event_popup);
  //     if (inputs.is_event_popup == "true" || inputs.is_event_popup == true) {
  //       formData.append("email_body_heading", inputs.email_body_heading);
  //       formData.append("email_subject", inputs.email_subject);
  //       formData.append("email_body", emailBodyCk);
  //     }
  //     if (file) {
  //       formData.append("badge_image", inputs.image);
  //     }
  //   }
  //   if (inputs.planType == "false" || inputs.planType == false) {
  //     formData.append("best_value_badge", inputs.bestValueBadge);
  //     formData.append("plan_title", inputs.planTitle);
  //     formData.append("plan_type", inputs.planPaymentType);
  //     formData.append("plan_button_text", inputs.planButtonText);
  //     formData.append("tag_id", inputs.campaignId);
  //     formData.append("list_id", inputs.campaignListId);
  //     formData.append("plan_status", inputs.planStatus);
  //     formData.append("is_plan_free", inputs.planType);
  //     formData.append("plan_order", inputs.order);
  //     formData.append("page_id", inputs.page_id);
  //     formData.append("created_for", "sale_page");
  //     //paid
  //     formData.append("program", JSON.stringify(programme_array));
  //     formData.append("short_description", inputs.shortDescription);
  //     formData.append("detailed_description", detailDescriptionCk);
  //     formData.append("plan_price", inputs.planPrice);
  //     formData.append("payment_access", inputs.planPayment);
  //     formData.append("product", inputs.product);
  //     formData.append("plan_currency", inputs.currency);
  //     formData.append("time_period_interval", inputs.recursionTimePeriod);
  //     formData.append("trial_period_days", inputs.recursionPeriodDays);
  //     formData.append("is_plan_popup", inputs.is_event_popup);
  //     if (inputs.is_event_popup == "true" || inputs.is_event_popup == true) {
  //       formData.append("email_body_heading", inputs.email_body_heading);
  //       formData.append("email_subject", inputs.email_subject);
  //       formData.append("email_body", emailBodyCk);
  //     }
  //     if (file) {
  //       formData.append("badge_image", inputs.image);
  //     }
  //   }

  //   console.log(...formData, "formData");
  //   const result = await editPaymentPlanApi(formData, params.id);
  //   if (result.code === 200) {
  //     enqueueSnackbar(result.message, { variant: "success" });
  //     navigate(-1);
  //   } else {
  //     enqueueSnackbar(result.message, { variant: "error" });
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let programme_array = [];
    let group_object = {};
    groupsName.map((group) => {
      group_object = {
        program_id: group,
      };
      programme_array.push(group_object);
    });

    let selected_event_array = [];
    let selected_event_object = {};
    eventsName.map((event) => {
      selected_event_object = {
        event_id: event,
      };
      selected_event_array.push(selected_event_object);
    });

    const formData = new FormData();
    formData.append("plan_title", inputs.planTitle);
    // formData.append("plan_package", inputs.planPackage);
    formData.append("program", JSON.stringify(programme_array));
    // formData.append("event", JSON.stringify(selected_event_array));
    formData.append("short_description", inputs.shortDescription);
    formData.append("detailed_description", detailDescriptionCk);
    formData.append(
      "plan_type",
      inputs.planPaymentType == undefined ? "" : inputs.planPaymentType
    );
    formData.append("plan_status", inputs.planStatus);
    formData.append("plan_button_text", inputs.planButtonText);
    formData.append("is_plan_free", inputs.planType);
    formData.append("plan_image", inputs.image);
    formData.append("payment_url", inputs.payment_url);
    formData.append("best_value_badge", inputs.bestValueBadge);
    formData.append("page_id", inputs.page_id);
    formData.append("created_for", "sale_page");
    formData.append(
      "tag_id",
      inputs.campaignId == null || inputs.campaignId == ""
        ? ""
        : inputs.campaignId
    );
    formData.append(
      "list_id",
      inputs.campaignListId == null || inputs.campaignListId == ""
        ? ""
        : inputs.campaignListId
    );

    formData.append("plan_price", inputs.planPrice ? inputs.planPrice : 1);
    formData.append("payment_access", inputs.planPayment);
    formData.append("product", inputs.product);
    formData.append("plan_currency", inputs.currency);
    if (file) {
      formData.append("badge_image", inputs.image);
    }

    formData.append("time_period_interval", inputs.recursionTimePeriod);
    formData.append("is_plan_popup", inputs.is_event_popup);
    if (inputs.is_event_popup == "true" || inputs.is_event_popup == true) {
      formData.append("email_body_heading", inputs.email_body_heading);
      formData.append("email_subject", inputs.email_subject);
      formData.append("email_body", emailBodyCk);
    }

    // if (inputs.recursionPeriodDays) {
    //   formData.append("trial_period_days", inputs.recursionPeriodDays);
    // }
    // formData.append("is_basic_membership", inputs.is_basic_membership);
    formData.append("plan_order", inputs.planOrder);

    // if (inputs.planType == false) {
    //   formData.append("plan_price", inputs.planPrice);
    //   formData.append("payment_access", inputs.planPayment);
    //   formData.append("product", inputs.product);
    //   formData.append("plan_currency", inputs.currency);
    // }
    // if (inputs.planType == false && inputs.planPayment == "recurring") {
    //   formData.append("time_period_interval", inputs.recursionTimePeriod);
    //   formData.append("trial_period_days", inputs.recursionPeriodDays);
    // }
    //console form data
    console.log(...formData, "data");

    setIsLoading(true);
    const result = await editPaymentPlanApi(formData, params.id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleChangeProgram = (e) => {
    setProgramName(e.target.value);
  };
  const handleChangeVault = (event) => {
    setVaultName(event.target.value);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleChangeInputTemplate = async (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs({ ...inputs, ["template_type"]: value });
    const result = await paymentTemplateDetailApi(event.target.value);
    if (result.code == 200) {
      //console.log(result.payment_template, "ikikikiki");
      let templateDetail = result.payment_template;
      setInputs((prevState) => ({
        ...prevState,
        ["title"]: templateDetail.title,
        ["currency"]: templateDetail.currency,
        ["total_amount"]: templateDetail.total_amount,
        ["vat_number"]: templateDetail.vat_number,
        ["transaction_note"]: templateDetail.short_description,
        ["payment_request_type"]: templateDetail.template_type,
        ["product"]: templateDetail.product?._id,
        ["programme"]: templateDetail.program?.program_slug,
        ["month"]: templateDetail.no_of_installment,
        ["initial_amount"]: templateDetail.initial_amount,
        ["installment_amount"]: templateDetail.installment_amount,
      }));
    }

    //console.log(event.target.value, "template type");
  };
  //console.log(state, "statestatestatestate");

  React.useEffect(() => {
    consultantListData();
    paymentTemplates();
    productList();
    programmeList();
    // memberList();
    getProgrammes();
    getDetail();
    // getEvents();
  }, []);

  React.useEffect(() => {
    let installment =
      inputs.total_amount - inputs.initial_amount / inputs.month;
    setInstallmentAmount(installment);
  }, [inputs.total_amount, inputs.month, inputs.initial_amount]);
  //   console.log(typeof audioFile, "values of audio to be send ");

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
        <div className="col-6">
          <h2>Edit Payment Plan</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Plan Title"
            variant="outlined"
            fullWidth
            required
            name="planTitle"
            value={inputs.planTitle}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Payment Url"
            variant="outlined"
            fullWidth
            required
            name="payment_url"
            value={inputs.payment_url}
            onChange={handleChange}
          />
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Plan Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="planType"
              value={inputs.planType}
              label="Plan Type"
              onChange={handleChange}
            >
              <MenuItem value="true">Free</MenuItem>
              <MenuItem value="false">Paid</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Plan Package"
            variant="outlined"
            fullWidth
            name="planPackage"
            value={inputs.planPackage}
            onChange={handleChange}
          />
        </div> */}
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Plan Button Text"
            variant="outlined"
            fullWidth
            required
            name="planButtonText"
            value={inputs.planButtonText}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Campaign Tag ID"
            variant="outlined"
            fullWidth
            name="campaignId"
            value={inputs.campaignId}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Campaign List ID"
            variant="outlined"
            fullWidth
            name="campaignListId"
            value={inputs.campaignListId}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Order"
            variant="outlined"
            fullWidth
            required
            type="number"
            onWheel={(event) => event.target.blur()}
            name="planOrder"
            value={inputs.planOrder}
            onChange={handleChange}
          />
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Plan Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="planStatus"
              value={inputs.planStatus}
              label="Plan Status"
              onChange={handleChange}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Show Popup On Plan*
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="is_event_popup"
              value={inputs.is_event_popup}
              label="Show PopUp On Plan*"
              required
              onChange={handleChange}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">
              Use Best Value Badge
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="bestValueBadge"
              value={inputs.bestValueBadge}
              label="Use Best Value Badge"
              onChange={handleChange}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Show On Website
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="showOnWebsite"
              value={inputs.showOnWebsite}
              label="Show On Website"
              onChange={handleChange}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </div> */}
        {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth required>
            <InputLabel id="is_basic_membership">
              Is Basic Membership
            </InputLabel>
            <Select
              labelId="is_basic_membership"
              id="demo-simple-select"
              name="is_basic_membership"
              value={inputs.is_basic_membership}
              label="Is Basic Membership"
              onChange={handleChange}
            >
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
            </Select>
          </FormControl>
        </div> */}
        {/* <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <FormControl className="mt-3" fullWidth>
            <InputLabel id="demo-multiple-name-label">Events</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={eventsName}
              onChange={handleChangeEvents}
              input={<OutlinedInput label="Events" />}
              MenuProps={MenuProps}
            >
              {eventsListing?.map((name) => (
                <MenuItem
                  key={name}
                  value={name._id}
                  style={getStyles(name, eventsName, theme)}
                >
                  {name.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div> */}
        {(inputs.is_event_popup == true || inputs.is_event_popup == "true") && (
          <>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Email Body Heading"
                variant="outlined"
                fullWidth
                required
                name="email_body_heading"
                value={inputs.email_body_heading}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Email Subject"
                variant="outlined"
                fullWidth
                required
                name="email_subject"
                value={inputs.email_subject}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {(inputs.bestValueBadge == "true" || inputs.bestValueBadge == true) && (
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Image *</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {file ? (
                  <img className="image-border" src={file} height="50" />
                ) : (
                  oldImage && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldImage}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="image"
                    onChange={fileChangedHandler}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs.image.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs.image.name}</p>
            )}
          </div>
        )}

        {/* {inputs.planType == false || inputs.planType == "false" ? (
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Plan Payment Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="planPaymentType"
                value={inputs.planPaymentType}
                label="Plan Payment Type"
                onChange={handleChange}
              >
                <MenuItem value="week">Weekly</MenuItem>
                <MenuItem value="month">Monthly</MenuItem>
                <MenuItem value="year">Yearly</MenuItem>
              </Select>
            </FormControl>
          </div>
        ) : (
          ""
        )} */}

        {(inputs.planType == false || inputs.planType == "false") && (
          <>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Plan Price"
                variant="outlined"
                fullWidth
                name="planPrice"
                value={inputs.planPrice}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">
                  Plan Payment
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="planPayment"
                  value={inputs.planPayment}
                  label="Plan Payment"
                  onChange={handleChange}
                >
                  <MenuItem value="onetime">OneTime</MenuItem>
                  <MenuItem value="recurring">Recurring</MenuItem>
                </Select>
              </FormControl>
            </div>
            {inputs.planPayment == "recurring" && (
              <>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Recurring Time Period "
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    name="recursionTimePeriod"
                    value={inputs.recursionTimePeriod}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Trial Period Days"
                    variant="outlined"
                    fullWidth
                    required
                    name="recursionPeriodDays"
                    value={inputs.recursionPeriodDays}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">
                      Plan Payment Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="planPaymentType"
                      value={inputs.planPaymentType}
                      label="Plan Payment Type"
                      onChange={handleChange}
                    >
                      <MenuItem value="week">Weekly</MenuItem>
                      <MenuItem value="month">Monthly</MenuItem>
                      <MenuItem value="year">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </>
            )}
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Product</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="product"
                  value={inputs.product}
                  label="product"
                  onChange={handleChange}
                >
                  {products.map((product) => {
                    return (
                      <MenuItem value={product._id}>{product.name}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Plan Currency *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="currency"
                  value={inputs.currency}
                  label="Plan currency"
                  onChange={handleChange}
                >
                  <MenuItem value="usd">Dollar</MenuItem>
                  <MenuItem value="gbp">UK Pounds</MenuItem>
                  <MenuItem value="eur">Euro</MenuItem>
                </Select>
              </FormControl>
            </div>
          </>
        )}

        {/* 
        
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Members</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="member"
              value={inputs.member}
              label="Member"
              onChange={handleChange}
            >
              {membersList.map((member) => {
                return (
                  <MenuItem value={member._id}>
                    {member.first_name +
                      " " +
                      member.last_name +
                      " " +
                      "(" +
                      member.email +
                      ")"}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Programme</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="programme"
              value={inputs.programme}
              label="Programme"
              onChange={handleChange}
            >
              {programmes.map((programme) => {
                return (
                  <MenuItem value={programme.program_slug}>
                    {programme.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Payment request Type*
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="payment_request_type"
              value={inputs.payment_request_type}
              label="Payment Request Type"
              onChange={handleChange}
            >
              <MenuItem value="onetime">One Time</MenuItem>
              <MenuItem value="recurring">Recurring</MenuItem>
            </Select>
          </FormControl>
        </div> */}

        <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
          <FormControl className="mt-3" fullWidth>
            <InputLabel id="demo-multiple-name-label">Programmes</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={groupsName}
              onChange={handleChangeGroup}
              input={<OutlinedInput label="Programmes" />}
              MenuProps={MenuProps}
            >
              {programmeListings.map((name) => (
                <MenuItem
                  key={name}
                  value={name._id}
                  style={getStyles(name, groupsName, theme)}
                >
                  {name.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="col-12 mt-5">
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-flexible"
              label="Short Description"
              multiline
              rows={6}
              name="shortDescription"
              value={inputs.shortDescription}
              onChange={handleChange}
            />
          </FormControl>
        </div>
        {(inputs.is_event_popup == "true" || inputs.is_event_popup == true) && (
          <div className="col-12 mt-4">
            <h4>Email Body *</h4>
            <TinyEditor
              setDetailDescription={setEmailBodyCk}
              detailDescriptionCk={emailBodyCk}
            />
          </div>
        )}
        <div className="col-12 mt-5">
          <h4>Detail Description</h4>
          <TinyEditor
            setDetailDescription={setDetailDescriptionCk}
            detailDescriptionCk={detailDescriptionCk}
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
