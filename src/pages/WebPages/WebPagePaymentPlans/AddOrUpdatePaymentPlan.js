import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IconButton, CircularProgress, Button } from "@mui/material";
import {
  dynamite_events_list_api,
  memberProgrammeListing,
  memberProgrammeListings,
  programmeActiveListing,
} from "src/DAL/Programme/Programme";
import { productListApi } from "src/DAL/member/member";
import {
  addPaymentPlanApi,
  detailPaymentPlanApi,
  editPaymentPlanApi,
} from "src/DAL/WebsitePages/paymentPlan";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import { s3baseUrl } from "src/config/config";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import GeneralCkeditor from "src/components/GeneralCkeditor";

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const Input = styled("input")({
  display: "none",
});
export default function AddOrUpdatePaymentPlan() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [programmeListings, setProgramListing] = useState([]);
  const [groupsName, setGroupsName] = useState([]);
  const [file, setProfileImage] = React.useState();
  const [formType, setFormType] = useState("ADD");
  const [eventsListing, setEventsListing] = useState([]);
  const [eventsName, setEventsName] = useState([]);
  const [moduleData, setModuleData] = useState({});
  const [oldImage, setOldImage] = useState();
  const [pageData, setPageData] = useState({});
  const module_actual_name = "payment_plans";

  const fileChangedHandler = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "823");
    formData.append("height", "363");
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      console.log(imageUpload, "imageUploadimageUpload");
      setInputs({
        ...inputs,
        ["plan_image"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(imageUpload.message, { variant: "error" });
    }
  };
  const [inputs, setInputs] = useState({
    plan_title: "",
    is_plan_free: true,
    plan_package: "",
    number_of_days: "",
    plan_button_text: "",
    // commission_pay_to: "referral",
    active_campaign_tag_id: "",
    max_child_limit: 1,
    active_campaign_list_id: "",
    plan_status: true,
    short_description: "",
    detailed_description: "",
    benefit_description: "",
    plan_currency: "gbp",
    plan_price: 0,
    is_dont_show_full_amount: true,
    stripe_product_name: "",
    payment_access: "onetime",
    plan_type: "week",
    time_period_interval: 0,
    trial_period_days: 0,
    initial_amount: 0,
    plan_order: 0,
    installment_amount: 0,
    product: "",
    // is_basic_membership: false,
    plan_for: " ",
    programme: "",
    member: "",
    extra_coins: 0,
    is_new_user_created_for: true,
    // first_and_next_recurring_days_diffrence: false,
    days_difference: 0,
    subscriber_count: "",
    plan_image: {},
   
  });

  // let commission_info_json = inputs.commission_info;
  // console.log(inputs.plan_image, "plan images");
  const ChangeCommissonAmount = () => {
    if (inputs.payment_access === "onetime") {
      console.log("if case");
      setInputs((values) => ({
        ...values,
       
      }));
    } else {
      console.log("else case");
      setInputs((values) => ({
        ...values,
      }));
    }
    return true;
  };

  const renderCurrency = () => {
    return (
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Plan Currency *</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name="plan_currency"
          value={inputs.plan_currency}
          label="Plan currency"
          onChange={handleChange}
        >
          <MenuItem value="usd">Dollar</MenuItem>
          <MenuItem value="gbp">UK Pounds</MenuItem>
          <MenuItem value="eur">Euro</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const handleChangeGroup = (event) => {
    const {
      target: { value },
    } = event;
    setGroupsName(typeof value === "string" ? value.split(",") : value);
  };

  const productList = async () => {
    let result = await productListApi();
    if (result.code == 200) {
      console.log(
        result.product,
        "result.productresult.productresult.productresult.productresult.product"
      );
      setProducts(result.product);
      // if (formType === "ADD") {
      //   setInputs((inputs) => ({
      //     ...inputs,
      //     ["product"]: result?.product[0]?._id,
      //   }));
      // }
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const getEvents = async () => {
    console.log("in events");
    const result = await dynamite_events_list_api();
    if (result.code === 200) {
      console.log(result, "resultresultresult");
      let val = result.dynamite_event;

      if (state.data && state?.data?.event) {
        state.data.event.map((value) => {
          let object = {
            title: value.title,
            _id: value.event_id,
          };
          let find = result.dynamite_event.find(
            (event) => event._id == value.event_id
          );
          if (!find) {
            val.push(object);
          }
        });
      } else {
      }

      setEventsListing(val);
      productList();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
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

  const getProgrammes = async () => {
    // memberProgrammeListing
    const result = await memberProgrammeListings();
    console.log(result, "resultresult");
    console.log(state.data, "state.data");
    if (result.code === 200) {
      setProgramListing(result.program);

      let program_array = [];
      const resultProgramIds = result.program.map((item) => item._id);

      // Loop through the available array and push program_id to program_array if there is a match
      state.data?.program.forEach((item) => {
        if (resultProgramIds.includes(item.program_id)) {
          program_array.push(item.program_id);
        }
      });
      console.log(program_array, "programm_arrayyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
      setGroupsName(program_array);

      getEvents();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.detailed_description == "") {
      enqueueSnackbar("detail description is required", {
        variant: "error",
      });
      return;
    }
    if (inputs.plan_price == 0 && inputs.is_plan_free == false) {
      enqueueSnackbar("Plan price must be greater than 0.", {
        variant: "error",
      });
      return;
    }
    if (inputs.max_child_limit == 0) {
      enqueueSnackbar("Max child limit must be greater than 0.", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    if (inputs.is_plan_free == false && inputs.payment_access == "recursion") {
     
    }

    if (inputs.is_plan_free == false && inputs.payment_access == "onetime") {
      console.log("onetime entered");
   
    }

    let programme_array = [];

    let group_object = {};
    groupsName.map((group) => {
      console.log(group, "groupgroup");
      group_object = {
        program_id: group,
      };
      programme_array.push(group_object);
    });
    // let program_array_json = JSON.stringify(programme_array);
    // event manipulation
    let selected_event_array = [];

    let selected_event_object = {};
    eventsName.map((event) => {
      selected_event_object = {
        event_id: event,
      };
      selected_event_array.push(selected_event_object);
    });
    console.log(
      selected_event_array,
      "selected_event_arrayselected_event_array"
    );
    console.log(params.plan_id, "params.plan_id");
    // let selected_event_array_json = JSON.stringify(selected_event_array);
    const set_commisson = await ChangeCommissonAmount();
    console.log(set_commisson, "set_commissonset_commisson");
    if (set_commisson) {
      let formDatas = {
        plan_title: inputs.plan_title,
        max_child_limit: inputs.max_child_limit,
        extra_coins: inputs.extra_coins,
        subscriber_count: inputs.subscriber_count,
        // commission_pay_to: inputs.commission_pay_to,
        is_new_user_created_for: inputs.is_new_user_created_for,
        plan_package: inputs.plan_package,
        plan_button_text: inputs.plan_button_text,
        // active_campaign_tag_id:
        //   inputs.active_campaign_tag_id >= 0
        //     ? inputs.active_campaign_tag_id?.toString()
        //     : "",
        active_campaign_list_id: inputs.active_campaign_list_id,
        // active_campaign_tag_id: inputs.active_campaign_tag_id?.toString(),

        // active_campaign_list_id:
        //   inputs.active_campaign_list_id >= 0
        //     ? inputs.active_campaign_list_id?.toString()
        //     : "",
        plan_status: inputs.plan_status,
        is_plan_free: inputs.is_plan_free,
        short_description: inputs.short_description,
        detailed_description: inputs.detailed_description,
        benefit_description: inputs.benefit_description,
        // is_basic_membership: inputs.is_basic_membership,
        plan_for: inputs.plan_for,
        // program: programme_array,
        // event: selected_event_array,
        // commission_info: inputs.commission_info,
      };
      if (file) {
        formDatas.plan_image = file ? inputs.plan_image : oldImage;
      } else {
        formDatas.plan_image = oldImage;
      }
      if (params && params.page_id) {
        formDatas.created_for = "sale_page";
        formDatas.page_id = params.page_id;
      } else {
        formDatas.created_for = "general";
      }
      if (formType == "EDIT") {
        formDatas.plan_order = inputs.plan_order;
      }

      if (inputs.is_plan_free == false) {
        formDatas.plan_price = inputs.plan_price;
        formDatas.stripe_product_name = inputs.stripe_product_name;
        formDatas.plan_currency = inputs.plan_currency;
        formDatas.payment_access = inputs.payment_access;
        if (inputs.payment_access == "recursion") {
          formDatas.product = inputs.product;
          // formDatas.days_difference = inputs.days_difference;
          // formDatas.first_and_next_recurring_days_diffrence =
          //   inputs.first_and_next_recurring_days_diffrence;
          formDatas.time_period_interval = inputs.time_period_interval;
          formDatas.trial_period_days = inputs.trial_period_days;
          formDatas.plan_type =
            inputs.plan_type == undefined ? "week" : inputs.plan_type;
          formDatas.initial_amount = inputs.initial_amount;
          formDatas.is_dont_show_full_amount = inputs.is_dont_show_full_amount;
          if (inputs.plan_type == "custom") {
            formDatas.number_of_days =
              inputs.number_of_days == undefined ? 0 : inputs.number_of_days;
          }
        }
      }
      console.log(formDatas, "formDatasformDatasformDatas");
      const formObject = formDatas;
      const result =
        formType == "ADD"
          ? await addPaymentPlanApi(formObject)
          : await editPaymentPlanApi(formObject, params.plan_id);
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChangeCommission = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({
      ...values,
      commission_info: { ...values.commission_info, [name]: value },
    }));
  };

  const getPageDetail = async () => {
    const result = await page_detail_by_id(params.page_id);
    if (result.code == 200) {
      handlePageDetail(result.sale_page);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const getPlanDetail = async () => {
    const result = await detailPaymentPlanApi(params.plan_id);
    if (result.code == 200) {
      handleFormatdata(result.payment_plan);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleFormatdata = (data) => {
    setFormType("EDIT");
    console.log(data, "kokoko data fort page");
    setInputs({
      ...data,
      product: data?.product ? data.product._id : data.product,
 
    });
    let event_array = [];
    data.event.map((item) => {
      event_array.push(item.event_id);
    });
    setEventsName(event_array);
   
    setIsLoading(false);
  };

  const handlePageDetail = (data) => {
    setPageData(data);
    const get_module_info = data.module_info.filter(
      (item) => item.module_actual_name == module_actual_name
    )[0];
    setModuleData(get_module_info.module_replica_info);
  };

  useEffect(() => {
    getProgrammes();
    if (params && params.plan_id) {
      if (state) {
        if (params.page_id) {
          handlePageDetail(state.page_info);
        }
        handleFormatdata(state.data);
      } else {
        getPlanDetail();
        if (params.page_id) {
          getPageDetail();
        }
      }
    } else {
      setIsLoading(false);
      if (params.page_id) {
        if (state) {
          handlePageDetail(state);
        } else {
          getPageDetail();
        }
      }
    }
  }, []);

  useEffect(() => {
    setOldImage(state?.data?.plan_image);
    let totalValue = inputs.plan_price - inputs.initial_amount;
    let installment = (totalValue / inputs.time_period_interval).toFixed(1);
    setInputs((values) => ({
      ...values,
      ["installment_amount"]:
        !isNaN(installment) && installment !== "Infinity" ? installment : 0,
    }));
  }, [inputs.plan_price, inputs.time_period_interval, inputs.initial_amount]);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(state, "statestatestate");
  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12 display-flex mb-4">
          <IconButton
            className="back-screen-button"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          <span className="sale-page-title">{pageData.sale_page_title}</span>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          {moduleData?.add_page_heading ? (
            <h2>
              {formType === "ADD"
                ? moduleData.add_page_heading
                : moduleData.edit_page_heading}
            </h2>
          ) : (
            <h2>{`${formType === "ADD" ? "Add" : "Edit"} Plan`}</h2>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Plan Title"
                  variant="outlined"
                  fullWidth
                  required
                  name="plan_title"
                  value={inputs.plan_title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Plan Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_plan_free"
                    value={inputs.is_plan_free}
                    label="Plan Type"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Free</MenuItem>
                    <MenuItem value={false}>Paid</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    New User Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_new_user_created_for"
                    value={inputs.is_new_user_created_for}
                    label="New User Status"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Maximum Child Count"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  name="max_child_limit"
                  value={inputs.max_child_limit}
                  onChange={handleChange}
                  onWheel={(event) => event.target.blur()}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Plan Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="plan_status"
                    value={inputs.plan_status}
                    label="Plan Status"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {inputs.is_plan_free == false && (
                <>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">
                        Plan Payment
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="payment_access"
                        value={inputs.payment_access}
                        label="Plan Payment"
                        onChange={handleChange}
                      >
                        <MenuItem value="onetime">OneTime</MenuItem>
                        <MenuItem value="recursion">Recurring</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div
                    className={`col-lg-6 col-md-6 col-sm-12 mt-4 ${
                      inputs.payment_access == "recursion"
                        ? "d-none"
                        : "d-block"
                    }`}
                  >
                    {renderCurrency()}
                  </div>

                  <div
                    className={`col-lg-6 col-md-6 col-sm-12 mt-4 ${
                      inputs.payment_access == "recursion"
                        ? "d-block"
                        : "d-none"
                    }`}
                  >
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label1">
                        Plan Payment Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label1"
                        id="demo-simple-select"
                        name="plan_type"
                        value={inputs.plan_type ? inputs.plan_type : "week"}
                        label="Plan Payment Type"
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="week">Weekly</MenuItem>
                        <MenuItem value="month">Monthly</MenuItem>
                        <MenuItem value="year">Yearly</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {inputs.plan_type == "custom" && (
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                      <TextField
                        id="outlined-basic"
                        label="No of days"
                        variant="outlined"
                        fullWidth
                        required
                        type="number"
                        onWheel={(event) => event.target.blur()}
                        name="number_of_days"
                        value={inputs.number_of_days}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Total Plan Price"
                      variant="outlined"
                      fullWidth
                      required
                      type="number"
                      onWheel={(event) => event.target.blur()}
                      name="plan_price"
                      value={inputs.plan_price}
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <FormControl fullWidth required>
                      <InputLabel id="plan_for">Plan For</InputLabel>
                      <Select
                        labelId="plan_for"
                        id="demo-simple-select"
                        name="plan_for"
                        value={inputs.plan_for}
                        label="Plan For"
                        onChange={handleChange}
                      >
                        <MenuItem value="Basic">Basic</MenuItem>
                        <MenuItem value="Premium">Premium</MenuItem>
                      </Select>
                    </FormControl>
                  </div> */}
                  {inputs.payment_access == "recursion" ? (
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
                          label="Recurring Time Period "
                          variant="outlined"
                          fullWidth
                          required
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          name="time_period_interval"
                          value={inputs.time_period_interval}
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
                          name="installment_amount"
                          value={inputs.installment_amount}
                          // onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                        <TextField
                          id="outlined-basic"
                          label="Trial Period Days"
                          variant="outlined"
                          fullWidth
                          name="trial_period_days"
                          value={inputs.trial_period_days}
                          type="number"
                          onWheel={(event) => event.target.blur()}
                          onChange={handleChange}
                        />
                      </div>
                    


                      <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                        {renderCurrency()}
                      </div>

                   
                     
                    </>
                  ) : (
                    <>
                    
                    </>
                  )}
                
                </>
              )}

              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Campaign Tag Name"
                  variant="outlined"
                  fullWidth
                  // type="number"
                  // onWheel={(event) => event.target.blur()}
                  name="active_campaign_list_id"
                  value={inputs.active_campaign_list_id}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Extra Coins"
              variant="outlined"
              fullWidth
              type="number"
              name="extra_coins"
              value={inputs.extra_coins}
              onChange={handleChange}
            />
          </div> */}
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Maximum Subscriber Count"
                  variant="outlined"
                  fullWidth
                  type="number"
                  onWheel={(event) => event.target.blur()}
                  name="subscriber_count"
                  value={inputs.subscriber_count}
                  onChange={handleChange}
                />
              </div> */}
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4"> */}
              {/* <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Don't Show Full Amount ?
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_dont_show_full_amount"
                    value={inputs.is_dont_show_full_amount}
                    label="Don't Show Full Amount ? "
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl> */}
              {/* <FormControl fullWidth required>
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
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                  </Select>
                </FormControl>
              </div> */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  required
                  id="outlined-basic"
                  label="Plan Button Text"
                  variant="outlined"
                  fullWidth
                  name="plan_button_text"
                  value={inputs.plan_button_text}
                  onChange={handleChange}
                />
              </div>

              {inputs.is_plan_free === false &&
                inputs.payment_access !== "recursion" && (
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Stripe Product Name"
                      variant="outlined"
                      fullWidth
                      required
                      name="stripe_product_name"
                      value={inputs.stripe_product_name}
                      onChange={handleChange}
                    />
                  </div>
                )}

              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4"></div> */}
              {formType === "EDIT" && (
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Plan Order"
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    name="plan_order"
                    value={inputs.plan_order}
                    onChange={handleChange}
                    onWheel={(event) => event.target.blur()}
                  />
                </div>
              )}

              {/* {inputs.is_plan_free == false && (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth required>
                <InputLabel id="is_basic_membership-1">
                  Commission Pay To
                </InputLabel>
                <Select
                  labelId="is_basic_membership"
                  id="demo-simple-select-1"
                  name="commission_pay_to"
                  value={inputs.commission_pay_to}
                  label="Commission Pay To"
                  onChange={handleChange}
                >
                  <MenuItem value="referral">Referral</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
            </div>
          )} */}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Plan Image </p>
                    <FormHelperText className="pt-0">
                      Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-3">
                    <div className="col-3">
                      {file ? (
                        <img className="image-border" src={file} height="70" />
                      ) : (
                        oldImage && (
                          <img
                            className="image-border"
                            src={s3baseUrl + oldImage}
                            height="70"
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="col-4 text-end pt-2">
                    <label htmlFor="contained-button-file">
                      <Input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        name="plan_image"
                        onChange={fileChangedHandler}
                      />

                      <Button
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
                {/* {inputs?.plan_image == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.plan_image}</p>
            )} */}
              </div>
              {inputs.is_plan_free == false &&
                inputs.payment_access == "recursion" && (
                  <div className="col-12 mt-4">
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">
                        Stripe Product
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="product"
                        value={inputs.product}
                        label="Stripe product"
                        onChange={handleChange}
                      >
                        {products.map((product) => {
                          return (
                            <MenuItem value={product._id}>
                              {product.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                )}
              {/* <div className="col-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-name-label">Portals</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={eventsName}
                onChange={handleChangeEvents}
                input={<OutlinedInput label="Portals" />}
                MenuProps={MenuProps}>
                {eventsListing.map((name) => (
                  <MenuItem
                    key={name}
                    value={name._id}
                    style={getStyles(name, eventsName, theme)}>
                    {name.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-name-label">Programmes</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={groupsName}
                onChange={handleChangeGroup}
                input={<OutlinedInput label="Programmes" />}
                MenuProps={MenuProps}>
                {programmeListings.map((name) => (
                  <MenuItem
                    key={name}
                    value={name._id}
                    style={getStyles(name, groupsName, theme)}>
                    {name.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div> */}
              <div className="col-12 mt-4">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Short Description"
                    multiline
                    required
                    rows={6}
                    name="short_description"
                    value={inputs.short_description}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
              {/* <div className="col-12 mt-4">
            <h4>Short Description *</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="short_description"
              editorHeight={320}
            />
          </div> */}
              <div className="col-12 mt-4">
                <h4>Detail Description *</h4>
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="detailed_description"
                  editorHeight={320}
                />
              </div>
              <div className="col-12 mt-4">
                <h4>Benefit Description</h4>
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="benefit_description"
                  editorHeight={320}
                />
              </div>
              <div className="col-12 mt-4">
                <h4>Plan Package</h4>
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="plan_package"
                  editorHeight={320}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button className="small-contained-button">
            {formType == "ADD" ? "Submit" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
