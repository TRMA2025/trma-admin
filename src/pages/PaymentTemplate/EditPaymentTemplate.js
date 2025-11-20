import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useMemo } from "react";
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
  AddMemberApi,
  addPaymentRequest,
  paymentTemplate,
  paymentTemplateListApi,
  productListApi,
} from "src/DAL/member/member";
import { consultantListing } from "src/DAL/consultant/consultant";
import {
  AddPaymentTemplateApi,
  EditPaymentTemplateApi,
} from "src/DAL/PaymentTemplate/paymentTemplateApi";

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


export default function EditPaymentTemplate() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
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
  const [selectCountry, setSelectCountry] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const options = useMemo(() => countryList().getData(), []);

  const [inputs, setInputs] = React.useState({
    title: "",
    currency: "",
    total_amount: "",
    vat_number: "",
    transaction_note: "",
    template_type: "",
    payment_request_type: "",
    product: "",
    status: "",
    showOnConsultant: "",
    programme: "",
    initial_amount: "",
    month: "",
    installment_amount: "",
    no_of_installments: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postData = {};
    if (inputs.payment_request_type === "onetime") {
      postData = {
        title: inputs.title,
        template_type: inputs.payment_request_type,
        total_amount: inputs.total_amount,
        //   initial_amount: inputs.initial_amount,
        currency: inputs.currency,
        //   no_of_installment: inputs.no_of_installments,
        vat_number: inputs.vat_number,
        short_description: inputs.transaction_note,
        program: inputs.programme,
        product: inputs.product,
        // show_on_consultant: inputs.showOnConsultant,
      };
    } else if (inputs.payment_request_type === "recurring") {
      postData = {
        title: inputs.title,
        template_type: inputs.payment_request_type,
        total_amount: inputs.total_amount,
        initial_amount: inputs.initial_amount,
        currency: inputs.currency,
        no_of_installment: inputs.no_of_installments,
        vat_number: inputs.vat_number,
        short_description: inputs.transaction_note,
        program: inputs.programme,
        product: inputs.product,
        // show_on_consultant: inputs.showOnConsultant,
      };
    }
    console.log(postData, "postDatapostData");
    //console form data
    //console.log(postData, "postData");

    setIsLoading(true);
    const result = await EditPaymentTemplateApi(postData, params.id);
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

  React.useEffect(() => {
    console.log(state, "Data Payment edit case");
    setInstallmentAmount(state.installment_amount);
    setInputs({
      ...inputs,
      ["title"]: state?.name,
      ["currency"]: state?.currency,
      ["vat_number"]: state?.vat_number,
      ["programme"]: state?.program?._id,
      ["product"]: state?.product?._id,
      ["payment_request_type"]: state?.template_type,
      ["total_amount"]: state?.total_amount,
      ["transaction_note"]: state?.description,
      ["initial_amount"]: state?.initial_amount,
      ["no_of_installments"]: state?.no_of_installment,
      // ["showOnConsultant"]: state.show_on_consultant,
    });
  }, [state]);

  React.useEffect(() => {
    consultantListData();
    paymentTemplates();
    productList();
    programmeList();
  }, []);

  React.useEffect(() => {
    console.log(
      inputs.total_amount,
      "total",
      inputs.initial_amount,
      "initial",
      inputs.no_of_installments,
      "no of installments"
    );
    let installment =
      (inputs.total_amount - inputs.initial_amount) / inputs.no_of_installments;
    setInstallmentAmount(installment);
  }, [inputs.total_amount, inputs.no_of_installments, inputs.initial_amount]);

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
          <h2>Edit Payment Template</h2>
        </div>
      </div>
      <div class="card main-card">
        <div class="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Title"
                variant="outlined"
                fullWidth
                required
                name="title"
                value={inputs.title}
                onChange={handleChange}
              />
            </div>
            {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="No Of Installments"
            variant="outlined"
            fullWidth
            required
            name="no_of_installments"
            value={inputs.no_of_installments}
            onChange={handleChange}
          />
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
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">Product</InputLabel>
                <Select
                  required
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
                  Programme *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="programme"
                  value={inputs.programme}
                  label="Programme"
                  onChange={handleChange}
                  required
                >
                  {programmes.map((programme) => {
                    return (
                      <MenuItem value={programme._id}>
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
                onWheel={(event) => event.target.blur()}
                required
                name="total_amount"
                value={inputs.total_amount}
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
                    onWheel={(event) => event.target.blur()}
                    required
                    name="initial_amount"
                    value={inputs.initial_amount}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="No of Installments"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    name="no_of_installments"
                    value={inputs.no_of_installments}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Installment Amount"
                    variant="outlined"
                    fullWidth
                    type="number"
                    onWheel={(event) => event.target.blur()}
                    required
                    aria-readonly
                    name="installment"
                    value={installmentAmount}
                    // onChange={handleChange}
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
                // type="number"
                name="vat_number"
                value={inputs.vat_number}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 mt-5">
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Short Description"
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
