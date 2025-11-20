import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { TextareaAutosize } from "@mui/base";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import {
  addPageApi,
  detailPageApi,
  editPageApi,
  list_thanks_and_payement_page_for_selection_api,
  templateListingApi,
} from "src/DAL/WebsitePages/websitepages";
import { s3baseUrl } from "src/config/config";
import { getMenuListApi } from "src/components/MenuItems/MenuItems";

// import {
//   getBookCallTypeListApi,
//   getMenuListApi,
// } from "src/DAL/MenuItems/MenuItems";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function AddOrUpdatePage() {

  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [thanksPages, setThanksPages] = useState([]);
  const [thanksTemplates, setThanksTemplates] = useState([]);
  const [paymentTemplates, setPaymentTemplates] = useState([]);
  const [paymentPages, setPaymentPages] = useState([]);
  const [formType, setFormType] = useState("ADD");
  const [menuItemsLists, setMenuItemsList] = React.useState([]);
  const [bookTypeList, setBookTypeList] = React.useState([]);
  const is_website_pages = window.location.pathname.includes("website-pages");
  const [images, setImages] = React.useState({
    brand_favicon: "",
    brand_logo: "",
    footer_logo: "",
  });

  const [oldImages, setOldImages] = React.useState({
    brand_favicon: "",
    brand_logo: "",
    footer_logo: "",
  });

  const [inputs, setInputs] = React.useState({
    brand_favicon: {},
    brand_logo: {},
    footer_logo: {},
    meta_title: "",
    meta_keywords: "",
    payment_mode: "sandBox",
    active_campaign_list_id: "",
    active_campaign_tag_id: "",
    // default_commission_percentage: 0,
    redirect_user: "thanks",
    type_of_page: "sale_page",
    thanks_template: "",
    payment_template: "",
    meta_description: "",
    pixel_code_header: "",
    pixel_code_body: "",
    google_tracking_code_header: "",
    google_tracking_code_body: "",
    website_portal_css_code: "",
    website_portal_js_code: "",
    template: "",
    is_general_brand_logo: true,
    // is_default_commission: false,
    is_general_social_links: true,
    facebook_link: "",
    pinterest_link: "",
    instagram_link: "",
    youtube_link: "",
    mailbox_link: "",
    snap_chat_link: "",
    twitter_link: "",
    linkedin_link: "",
    tiktok_link: "",
    thankyou_page_content: "",
    header_menu: "",
    footer_menu: "",
    is_publically_accessible: true,
    book_a_call_type: "",
  });

  const fileChangedHandler = (e) => {
    const { name, files } = e.target;
    setInputs({
      ...inputs,
      [name]: files[0],
    });
    setImages({
      ...images,
      [name]: URL.createObjectURL(files[0]),
    });
  };
  const getMenuItemList = async () => {
    const result = await getMenuListApi();
    if (result.code === 200) {
      let menu = result.menu;
      setMenuItemsList(result.menu);
      console.log(result.menu, "result.menuresult.menuresult.menu");
      get_thanks_and_payement_pages();
    }
  };
  // const getBookCallTypeList = async () => {
  //   const result = await getBookCallTypeListApi();
  //   if (result.code === 200) {
  //     setBookTypeList(result.call_types);
  //   }
  // };

  const get_thanks_and_payement_pages = async () => {
    const result = await list_thanks_and_payement_page_for_selection_api();
    if (result.code === 200) {
      setPaymentPages(result.payment_template_array);
      setThanksPages(result.thanks_template_array);
    }
  };

  const formatData = (data) => {
    setFormType("EDIT");
    const { brand_logo, brand_favicon, footer_logo } = data;
    setInputs(data);
    setInputs({
      ...data,
      template: data.template?._id,
    });
    setOldImages({
      brand_logo,
      brand_favicon,
      footer_logo,
    });
    setIsLoading(false);
  };

  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await detailPageApi(params.page_slug);
    if (result.code == 200) {
      formatData(result.sale_page);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const templatesListData = async () => {
    setIsLoading(true);
    let result = await templateListingApi();
    if (result.code == 200) {
      setTemplates(result.sale_page_template);
      setThanksTemplates(result.thank_you_page_template);
      setPaymentTemplates(result.payment_page_template);
      getMenuItemList();
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("meta_title", inputs.meta_title);
    formData.append("meta_description", inputs.meta_description);
    formData.append("payment_mode", inputs.payment_mode);
    formData.append("meta_keywords", inputs.meta_keywords);
    formData.append("pixel_code_header", inputs.pixel_code_header);
    formData.append(
      "google_tracking_code_header",
      inputs.google_tracking_code_header
    );
    formData.append(
      "google_tracking_code_body",
      inputs.google_tracking_code_body
    );
    formData.append("website_portal_css_code", inputs.website_portal_css_code);
    formData.append("website_portal_js_code", inputs.website_portal_js_code);
    formData.append("pixel_code_body", inputs.pixel_code_body);
    formData.append("active_campaign_list_id", inputs.active_campaign_list_id);
    formData.append("active_campaign_tag_id", 0);
    formData.append("redirect_user", inputs.redirect_user);
    if (inputs.type_of_page == "book_a_call_page") {
      formData.append("book_a_call_type", inputs.book_a_call_type);
    }
    formData.append(
      "is_publically_accessible",
      inputs.is_publically_accessible
    );
    formData.append("sale_page_title", inputs.sale_page_title);
    formData.append("thankyou_page_content", inputs.thankyou_page_content);
    formData.append("is_general_brand_logo", inputs.is_general_brand_logo);
    formData.append("is_general_social_links", inputs.is_general_social_links);
    // formData.append("is_default_commission", inputs.is_default_commission);
    // if (inputs.is_default_commission) {
    //   formData.append(
    //     "default_commission_percentage",
    //     inputs.default_commission_percentage
    //   );
    // }

    formData.append(
      "header_menu",
      inputs.header_menu == undefined ? "" : inputs.header_menu
    );
    formData.append(
      "footer_menu",
      inputs.footer_menu == undefined ? "" : inputs.footer_menu
    );
    if (inputs.type_of_page == "sale_page") {
      formData.append("thanks_template", inputs.thanks_template);
      formData.append("payment_template", inputs.payment_template);
    }
    if (formType === "ADD") {
      formData.append("template", inputs.template);
    }
    if (inputs.is_general_social_links == false) {
      formData.append("facebook_link", inputs.facebook_link);
      formData.append("pinterest_link", inputs.pinterest_link);
      formData.append("youtube_link", inputs.youtube_link);
      formData.append("instagram_link", inputs.instagram_link);
      formData.append("mailbox_link", inputs.mailbox_link);
      // added by Zubair
      formData.append("snap_chat_link", inputs.snap_chat_link);
      formData.append("twitter_link", inputs.twitter_link);
      formData.append("linkedin_link", inputs.linkedin_link);
      formData.append("tiktok_link", inputs.tiktok_link);
    }
    if (images.brand_logo) {
      formData.append("brand_logo", inputs.brand_logo);
    }
    if (images.brand_favicon) {
      formData.append("brand_favicon", inputs.brand_favicon);
    }
    if (images.footer_logo) {
      formData.append("footer_logo", inputs.footer_logo);
    }
    console.log(...formData);
    const result =
      formType === "ADD"
        ? await addPageApi(formData)
        : await editPageApi(formData, params.page_slug);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
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
  // React.useEffect(() => {
  //   getBookCallTypeList();
  // }, [inputs.type_of_page == "book_a_call_page"]);

  console.log(state, "statestatestatestate");

  React.useEffect(() => {
    if (params.page_slug) {
      if (state) {
        formatData(state);
      } else {
        getPageDetail();
      }
    }
    templatesListData();
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  const formatCampaignName = (campaignName) => {
    console.log(campaignName, "campaignNamecampaignName");
    if (campaignName && campaignName != "undefined") {
      const words = campaignName
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

      const formattedName = words.join(" ");
      return formattedName;
    } else {
      return "Campaign";
    }
  };
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
        <div className="col-12">
          <h2>{`${formType === "ADD" ? "Add" : "Edit"} Page`}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Page Title"
                  variant="outlined"
                  fullWidth
                  name="sale_page_title"
                  required
                  value={inputs.sale_page_title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Meta Title"
                  variant="outlined"
                  fullWidth
                  name="meta_title"
                  required
                  value={inputs.meta_title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Meta Keyword"
                  variant="outlined"
                  fullWidth
                  name="meta_keywords"
                  required
                  value={inputs.meta_keywords}
                  onChange={handleChange}
                />
              </div>
              {inputs.type_of_page !== "thanks_page" &&
                inputs.type_of_page !== "payment_page" && (
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">
                        Payment Mode
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="payment_mode"
                        required
                        value={inputs.payment_mode}
                        label="Payment Mode"
                        onChange={handleChange}
                      >
                        <MenuItem value="live">Live</MenuItem>
                        <MenuItem value="sandBox">SandBox</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                )}
              {inputs.type_of_page !== "thanks_page" &&
                inputs.type_of_page !== "payment_page" && (
                  <>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                      <FormControl fullWidth disabled>
                        <InputLabel id="demo-simple-select-label">
                          Type Of Page
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="type_of_page"
                          value={inputs.type_of_page}
                          label="Type Of Page"
                          onChange={handleChange}
                          required
                        >
                          <MenuItem value="sale_page">Sale Page</MenuItem>
                          <MenuItem value="thanks_page">Thanks Page</MenuItem>
                          <MenuItem value="payment_page">Payment Page</MenuItem>
                          <MenuItem value="book_a_call_page">
                            Book A Call Page
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    {inputs.type_of_page == "book_a_call_page" && (
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Book A Call Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="book_a_call_type"
                            value={inputs.book_a_call_type}
                            label="Book A Call Type"
                            onChange={handleChange}
                          >
                            {bookTypeList.map((val, i) => {
                              return (
                                <MenuItem value={val._id} key={i}>
                                  {val.title}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </>
                )}
              {inputs.type_of_page !== "thanks_page" &&
                inputs.type_of_page !== "payment_page" && (
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">
                        Choose Template
                      </InputLabel>
                      <Select
                        disabled={formType === "ADD" ? false : true}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="template"
                        value={inputs.template}
                        label="Choose Template"
                        onChange={handleChange}
                      >
                        {templates.map((template, i) => {
                          return (
                            <MenuItem value={template._id} key={i}>
                              {template.template_name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                )}

              {inputs.type_of_page === "sale_page" && (
                <>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Select Thanks Page
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="thanks_template"
                        value={inputs.thanks_template}
                        label="Select Thanks Page"
                        onChange={handleChange}
                      >
                        {thanksPages.map((page, i) => {
                          return (
                            <MenuItem value={page._id} key={i}>
                              {page.template_name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Select Payment Page
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="payment_template"
                        value={inputs.payment_template}
                        label="Select Payment Page"
                        onChange={handleChange}
                      >
                        {paymentPages.map((page, i) => {
                          return (
                            <MenuItem value={page._id} key={i}>
                              {page.template_name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </>
              )}
              {inputs.type_of_page !== "thanks_page" &&
                inputs.type_of_page !== "payment_page" && (
                  <>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Redirect User
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="redirect_user"
                          value={inputs.redirect_user}
                          label="Redirect User"
                          onChange={handleChange}
                        >
                          <MenuItem value="thanks">Thanks Page</MenuItem>
                          {/* <MenuItem value="appointment">Appointment</MenuItem> */}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                      <TextField
                        id="outlined-basic"
                        label={`Campaign Tag Name`}
                        variant="outlined"
                        fullWidth
                        name="active_campaign_list_id"
                        // type="number"
                        // onWheel={(event) => event.target.blur()}
                        value={inputs.active_campaign_list_id}
                        onChange={handleChange}
                      />
                    </div>
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Active Campaign Tag Id"
                    variant="outlined"
                    fullWidth
                    type="number"
                    name="active_campaign_tag_id"
                    value={inputs.active_campaign_tag_id}
                    onChange={handleChange}
                  />
                </div> */}
                  </>
                )}
              {/* header and footer menu */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Header Menu
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="header_menu"
                    value={inputs.header_menu}
                    label="Header Menu"
                    onChange={handleChange}
                  >
                    {menuItemsLists.map((menu, i) => {
                      return (
                        <MenuItem value={menu._id} key={i}>
                          {menu.menu_title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Footer Menu
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="footer_menu"
                    value={inputs.footer_menu}
                    label="Footer Menu"
                    onChange={handleChange}
                  >
                    {menuItemsLists.map((menu, i) => {
                      return (
                        <MenuItem value={menu._id} key={i}>
                          {menu.menu_title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              {}
              {is_website_pages &&
                inputs.type_of_page !== "thanks_page" &&
                inputs.type_of_page !== "payment_page" && (
                  <>
                    {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">
                      Do you want to use default commission
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="is_default_commission"
                      required
                      value={inputs.is_default_commission}
                      label=" Do you want to use default commission"
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {inputs.is_default_commission && (
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="default commission in %"
                      variant="outlined"
                      fullWidth
                      type="number"
                      required
                      name="default_commission_percentage"
                      value={inputs.default_commission_percentage}
                      InputProps={{ inputProps: { min: 1, max: 100 } }}
                      onChange={handleChange}
                    />
                  </div>
                )} */}
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Is Publically Accessible
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="is_publically_accessible"
                          required
                          value={inputs.is_publically_accessible}
                          label="Is Publically Accessible"
                          onChange={handleChange}
                        >
                          <MenuItem value={true}>Yes</MenuItem>
                          <MenuItem value={false}>No</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </>
                )}
              {/* header and footer menu end */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Use Website brand logo, footer logo and favicon?
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_general_brand_logo"
                    required
                    value={inputs.is_general_brand_logo}
                    label="Use Website brand logo, footer logo and favicon?"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    Use general Social Media Links?
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="is_general_social_links"
                    required
                    value={inputs.is_general_social_links}
                    label="Use general Social Media Links?"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {(inputs.is_general_social_links == false ||
                inputs.is_general_social_links == "false") && (
                <>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Facebook Link"
                      variant="outlined"
                      fullWidth
                      name="facebook_link"
                      value={inputs.facebook_link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Pinterest Link"
                      variant="outlined"
                      fullWidth
                      name="pinterest_link"
                      value={inputs.pinterest_link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Instagram Link"
                      variant="outlined"
                      fullWidth
                      name="instagram_link"
                      value={inputs.instagram_link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Youtube Link"
                      variant="outlined"
                      fullWidth
                      name="youtube_link"
                      value={inputs.youtube_link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="SnapChat Link"
                      variant="outlined"
                      fullWidth
                      name="snap_chat_link"
                      value={inputs.snap_chat_link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Twitter Link"
                      variant="outlined"
                      fullWidth
                      name="twitter_link"
                      value={inputs.twitter_link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Linkedin Link"
                      variant="outlined"
                      fullWidth
                      name="linkedin_link"
                      value={inputs.linkedin_link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Tiktok Link"
                      variant="outlined"
                      fullWidth
                      name="tiktok_link"
                      value={inputs.tiktok_link}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Mailbox Link"
                      variant="outlined"
                      fullWidth
                      name="mailbox_link"
                      value={inputs.mailbox_link}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              {inputs.is_general_brand_logo == false && (
                <>
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                    <div className="row w-100 div-style ms-0 pt-0">
                      <div className="col-6">
                        <p className="">Website Logo</p>
                        <FormHelperText className="pt-0">
                          Recommended Size (200 X 100) ("JPG", "JPEG",
                          "PNG","WEBP")
                        </FormHelperText>
                      </div>
                      <div className="col-2">
                        {formType === "EDIT" && images.brand_logo ? (
                          <img
                            className="image-border"
                            src={images.brand_logo}
                            height="50"
                          />
                        ) : (
                          oldImages.brand_logo && (
                            <img
                              className="image-border"
                              src={s3baseUrl + oldImages.brand_logo}
                              height="50"
                            />
                          )
                        )}
                      </div>
                      <div className="col-4 text-end pt-2">
                        <label htmlFor="contained-button-fileFb">
                          <Input
                            accept="image/*"
                            id="contained-button-fileFb"
                            multiple
                            type="file"
                            name="brand_logo"
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
                    {inputs?.image?.name == "" ? (
                      ""
                    ) : (
                      <p className="text-secondary">{inputs?.image?.name}</p>
                    )}
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                    <div className="row w-100 div-style ms-0 pt-0">
                      <div className="col-6">
                        <p className="">Brand Favicon</p>
                        <FormHelperText className="pt-0">
                          Recommended Size(32 X 32) ("JPG", "JPEG",
                          "PNG","WEBP")
                        </FormHelperText>
                      </div>
                      <div className="col-2">
                        {formType === "EDIT" && images.brand_favicon ? (
                          <img
                            className="image-border"
                            src={images.brand_favicon}
                            height="50"
                          />
                        ) : (
                          oldImages.brand_favicon && (
                            <img
                              className="image-border"
                              src={s3baseUrl + oldImages.brand_favicon}
                              height="50"
                            />
                          )
                        )}
                      </div>
                      <div className="col-4 text-end pt-2">
                        <label htmlFor="contained-button-fileInstagram">
                          <Input
                            accept="image/*"
                            id="contained-button-fileInstagram"
                            multiple
                            type="file"
                            name="brand_favicon"
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
                    {inputs?.image?.name == "" ? (
                      ""
                    ) : (
                      <p className="text-secondary">{inputs?.image?.name}</p>
                    )}
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                    <div className="row w-100 div-style ms-0 pt-0">
                      <div className="col-6">
                        <p className="">Footer Logo</p>
                        <FormHelperText className="pt-0">
                          Recommended Size (200 X 100) ("JPG", "JPEG",
                          "PNG","WEBP")
                        </FormHelperText>
                      </div>
                      <div className="col-2">
                        {formType === "EDIT" && images.footer_logo ? (
                          <img
                            className="image-border"
                            src={images.footer_logo}
                            height="50"
                          />
                        ) : (
                          oldImages.footer_logo && (
                            <img
                              className="image-border"
                              src={s3baseUrl + oldImages.footer_logo}
                              height="50"
                            />
                          )
                        )}
                      </div>
                      <div className="col-4 text-end pt-2">
                        <label htmlFor="contained-button-fileTwitter">
                          <Input
                            accept="image/*"
                            id="contained-button-fileTwitter"
                            multiple
                            type="file"
                            name="footer_logo"
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
                    {inputs?.image?.name == "" ? (
                      ""
                    ) : (
                      <p className="text-secondary">{inputs?.image?.name}</p>
                    )}
                  </div>
                </>
              )}
              <div className="col-12 mt-4">
                <FormControl fullWidth>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Meta Description"
                    multiline
                    rows={3}
                    name="meta_description"
                    value={inputs.meta_description}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
              {/* <div className="col-12 mt-4">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Facebook Tracking Code Header"
                multiline
                rows={3}
                name="pixel_code_header"
                value={inputs.pixel_code_header}
                onChange={handleChange}
              />
            </FormControl>
          </div> */}
              <div className="col-12 ">
                <p className="tracking_code_heading">
                  Facebook Tracking Code Header
                </p>

                <TextareaAutosize
                  aria-label="empty textarea"
                  className="textarea-autosize"
                  value={inputs.pixel_code_header}
                  name="pixel_code_header"
                  onChange={handleChange}
                  placeholder="Facebook Tracking Code Header"
                  style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "transparent",
                    color: "black",
                    borderRadius: "10px",
                    paddingTop: "8px",
                    paddingLeft: "5px",
                    outline: "none",
                    focus: "green",
                  }}
                />
                <p className="tracking_code_heading">
                  Facebook Tracking Code Body
                </p>
                <TextareaAutosize
                  aria-label="empty textarea"
                  value={inputs.pixel_code_body}
                  name="pixel_code_body"
                  onChange={handleChange}
                  className="textarea-autosize"
                  placeholder="Facebook Tracking Code Body"
                  style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "transparent",
                    color: "black",
                    borderRadius: "10px",
                    paddingTop: "8px",
                    paddingLeft: "5px",
                    outline: "none",
                    focus: "green",
                  }}
                />
                <p className="tracking_code_heading">
                  Google Tracking Code Header
                </p>
                <TextareaAutosize
                  aria-label="empty textarea"
                  value={inputs.google_tracking_code_header}
                  name="google_tracking_code_header"
                  onChange={handleChange}
                  className="textarea-autosize"
                  placeholder="Google Tracking Code Header"
                  style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "transparent",
                    color: "black",
                    borderRadius: "10px",
                    paddingTop: "8px",
                    paddingLeft: "5px",
                    outline: "none",
                  }}
                />
                <p className="tracking_code_heading">
                  Google Tracking Code Body
                </p>
                <TextareaAutosize
                  aria-label="empty textarea"
                  className="textarea-autosize"
                  value={inputs.google_tracking_code_body}
                  name="google_tracking_code_body"
                  onChange={handleChange}
                  placeholder="Google Tracking Code Body"
                  style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "transparent",
                    color: "black",
                    borderRadius: "10px",
                    paddingTop: "8px",
                    paddingLeft: "5px",
                    focus: "green",
                    outline: "none",
                  }}
                />
                <p className="tracking_code_heading">Website Portal Css Code</p>
                <TextareaAutosize
                  aria-label="empty textarea"
                  className="textarea-autosize"
                  value={inputs.website_portal_css_code}
                  name="website_portal_css_code"
                  onChange={handleChange}
                  placeholder="Website Portal Css Code"
                  style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "transparent",
                    color: "black",
                    borderRadius: "10px",
                    paddingTop: "8px",
                    paddingLeft: "5px",
                    focus: "green",
                    outline: "none",
                  }}
                />
                <p className="tracking_code_heading">Website Portal Js Code</p>
                <TextareaAutosize
                  aria-label="empty textarea"
                  className="textarea-autosize"
                  value={inputs.website_portal_js_code}
                  name="website_portal_js_code"
                  onChange={handleChange}
                  placeholder="Website Portal Js Code"
                  style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "transparent",
                    color: "black",
                    borderRadius: "10px",
                    paddingTop: "8px",
                    paddingLeft: "5px",
                    focus: "green",
                    outline: "none",
                  }}
                />
                {/* </FormControl> */}
              </div>
              {/* <div className="col-12 mt-4">
            <h4>Thank You Page Content</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="thankyou_page_content"
              editorHeight={320}
            />
          </div> */}
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
