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
import { AddProgrammeApi, programmeListing } from "src/DAL/Programme/Programme";
import { countries } from "src/utils/country";
import {
  activeMemberListing,
  AddMemberApi,
  addPaymentRequest,
  memberCompleteListing,
  memberListing,
  paymentTemplate,
  paymentTemplateListApi,
  productListApi,
} from "src/DAL/member/member";
import { consultantListing } from "src/DAL/consultant/consultant";
import { paymentTemplateDetailApi } from "src/DAL/PaymentTemplate/paymentTemplateApi";

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


export default function AddPaymentRequests() {
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
  const [member, setMember] = React.useState();

  const [inputs, setInputs] = React.useState({
    title: "",
    currency: "gbp",
    total_amount: "",
    vat_number: "",
    transaction_note: "",
    template_type: "",
    payment_request_type: "onetime",
    product: "",
    status: "true",
    showOnConsultant: "no",
    programme: "",
    member: "",
    initial_amount: "",
    month: "",
    installment_amount: "",
  });

  const getNavItemList = async () => {
    const result = await menuList();
    if (result.code === 200) {
      setMenuList(result.menu);
      //   setVaultName(result.vault_category[0].vault_slug);
    }
  };
  //console.log(params.id, "paramsparamsparams");

  const consultantListData = async () => {
    setIsLoading(true);
    let result = await consultantListing();
    if (result.code == 200) {
      setConsultantValue(result.consultant_list);
      setIsLoading(false);
    } else {
      //console.log(result, "resultresult");
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
    //console.log(result, "okokoko");
  };

  const paymentTemplates = async () => {
    setIsLoading(true);
    let result = await paymentTemplateListApi();
    //console.log(result.payment_template, "paymentTemplate");
    if (result.code == 200) {
      setTemplates(result.payment_template);
      setIsLoading(false);
    } else {
      //console.log(result, "resultresult");
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
    //console.log(templates, "templatestemplatestemplates");
  };
  const productList = async () => {
    setIsLoading(true);
    let result = await productListApi();
    if (result.code == 200) {
      setProducts(result.product);
      setIsLoading(false);
      setInputs({
        ...inputs,
        ["product"]: result.product[0]._id,
      });
    } else {
      //console.log(result, "resultresult");
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
      //console.log(result, "resultresult");
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };
  const memberList = async () => {
    setIsLoading(true);
    let result = await memberCompleteListing();
    if (result.code == 200) {
      //console.log(result, "result for members");
      setMembersList(result.member);
      setPersonName(result.member);
      setIsLoading(false);
    } else {
      //console.log(result, "resultresult");
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };
  //console.log(programmes, "programmesprogrammes");

  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };
  const audioFileChange = (e) => {
    //console.log("clicked");
    setAudio(e.target.files[0]);
  };
  const handleProgramName = (data) => {
    setProgramName(data.program_slug);
  };
  const handleVaultName = (data) => {
    setVaultName(data.vault_slug);
  };
  const handldeDeleteAudio = () => {
    setAudio();
    //console.log("reset State");
  };
  const handleChangeMembers = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const membersName = typeof value === "string" ? value.split(",") : value;
    setInputs((input) => ({
      ...input,
      ["members"]: membersName,
    }));
  };
  const handleChangeGroups = (event) => {
    const {
      target: { value },
    } = event;
    setGroups(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const groupName = typeof value === "string" ? value.split(",") : value;
    setInputs((input) => ({
      ...input,
      ["groups"]: groupName,
    }));
  };
  //console.log(products, "productsproductsproductsproducts");

  const changeHandlerCountry = (value) => {
    setSelectCountry(value.target.value);
  };

  const handleChangeDate = (newValue) => {
    let todayDate = moment(newValue).format("YYYY-MM-DD");
    let dateType = todayDate.toString();
    //console.log(typeof dateType, "dateType");
    setDate(newValue);
  };
  const templateData = async () => {
    setIsLoading(true);
    const result = await paymentTemplateDetailApi(inputs.template_type);
    //console.log(result, "templateDatatemplateData");
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
  const valueSetFunction = () => {
    setIsLoading(true);
    setInputs({
      ...inputs,
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
    });
    //console.log(inputs, "after api");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postData = {};
    if (inputs.payment_request_type === "onetime") {
      postData = {
        request_title: inputs.title,
        request_type: inputs.payment_request_type,
        total_amount: inputs.total_amount,
        currency: inputs.currency,
        vat_number: inputs.vat_number,
        transaction_note: inputs.transaction_note,
        payment_template: inputs.template_type,
        member_id: member?._id,
        program_slug: inputs.programme,
        product: inputs.product,
        status: inputs.status,
        // show_on_consultant: inputs.showOnConsultant,
      };
    } else if (inputs.payment_request_type === "recurring") {
      postData = {
        request_title: inputs.title,
        request_type: inputs.payment_request_type,
        total_amount: inputs.total_amount,
        currency: inputs.currency,
        vat_number: inputs.vat_number,
        transaction_note: inputs.transaction_note,
        payment_template: inputs.template_type,
        member_id: member?._id,
        program_slug: inputs.programme,
        product: inputs.product,
        status: inputs.status,
        initial_amount: inputs.initial_amount,
        month: inputs.month,
        // show_on_consultant: inputs.showOnConsultant,
        // installment_amount: inputs.installment_amount,
      };
    }

    //console form data
    console.log(postData, "postData");

    setIsLoading(true);
    const result = await addPaymentRequest(postData);
    if (result.code === 200) {
      //console.log(result, "result");
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      //console.log(result, "error case");
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  //console.log(inputs, "inputs");
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

  React.useEffect(() => {
    consultantListData();
    paymentTemplates();
    productList();
    programmeList();
    memberList();
  }, []);

  React.useEffect(() => {
    let totalValue = inputs.total_amount - inputs.initial_amount;
    let installment = (totalValue / inputs.month).toFixed(1);
    setInstallmentAmount(installment);
    //console.log(totalValue, "totalValuetotalValue");
    //console.log(installmentAmount, "installmentAmount");
  }, [inputs.total_amount, inputs.month, inputs.initial_amount]);

  //   console.log(typeof audioFile, "values of audio to be send ");

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  // console.log(member._id, "membermembermembermember");

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
            className="small-contained-button-search float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Add Payment Request</h2>
        </div>
      </div>
      <div class="card main-card">
        <div class="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Request Title"
                variant="outlined"
                fullWidth
                required
                name="title"
                value={inputs.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="status"
                  value={inputs.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Consultant Access *
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="showOnConsultant"
              value={inputs.showOnConsultant}
              label="Consultant Access *"
              onChange={handleChange}
            >
              <MenuItem value="no">No Access</MenuItem>
              <MenuItem value="list">Listing Access</MenuItem>
              <MenuItem value="all">All Access</MenuItem>
            </Select>
          </FormControl>
        </div> */}
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Currency *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="currency"
                  value={inputs.currency}
                  label="currency"
                  onChange={handleChange}
                >
                  <MenuItem value="usd">Dollar</MenuItem>
                  <MenuItem value="gbp">UK Pounds</MenuItem>
                  <MenuItem value="eur">Euro</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Payment Template
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="template_type"
                  value={inputs.template_type}
                  label="Payment Template"
                  onChange={handleChangeInputTemplate}
                >
                  {templates.map((template) => {
                    return (
                      <MenuItem value={template._id}>{template.title}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth required>
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
              {/* <FormControl fullWidth>
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
          </FormControl> */}
              <Autocomplete
                id="tags-outlined"
                options={personName}
                getOptionLabel={(option) =>
                  option.first_name +
                  " " +
                  option.last_name +
                  " (" +
                  option.email +
                  ")"
                }
                filterSelectedOptions
                value={member}
                onChange={(event, newValue) => {
                  setMember(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Members"
                    placeholder="Members"
                    required
                  />
                )}
              />
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
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Total Amount"
                variant="outlined"
                fullWidth
                type="number"
                required
                name="total_amount"
                value={inputs.total_amount}
                onWheel={(event) => event.target.blur()}
                onChange={handleChange}
              />
            </div>
            {inputs.payment_request_type === "recurring" && (
              <>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Initial Amount"
                    variant="outlined"
                    fullWidth
                    type="number"
                    required
                    name="initial_amount"
                    value={inputs.initial_amount}
                    onChange={handleChange}
                    onWheel={(event) => event.target.blur()}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Month"
                    variant="outlined"
                    fullWidth
                    type="number"
                    required
                    name="month"
                    value={inputs.month}
                    onChange={handleChange}
                    onWheel={(event) => event.target.blur()}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Installment Amount"
                    variant="outlined"
                    fullWidth
                    type="number"
                    required
                    aria-readonly
                    name="installment_amount"
                    value={installmentAmount}
                    // onChange={handleChange}
                    onWheel={(event) => event.target.blur()}
                  />
                </div>
              </>
            )}
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Vat Number"
                variant="outlined"
                fullWidth
                name="vat_number"
                value={inputs.vat_number}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 mt-5">
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Transaction Note"
                  multiline
                  rows={6}
                  name="transaction_note"
                  value={inputs.transaction_note}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end mt-4">
        <button onClick={handleSubmit} className="small-contained-button">
          Submit
        </button>
      </div>
    </div>
  );
}
