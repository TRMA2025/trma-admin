import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { s3baseUrl } from "src/config/config";
import { useEffect } from "react";
import {
  clientSettingApi,
  updateSiteSettingApi,
} from "src/DAL/ClientSetting/ClientSetting";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import GeneralCkeditor from "src/components/GeneralCkeditor";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function SiteSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [paymentPageBackground, setPaymentPageBackground] = useState();
  const [file, setProfileImage] = useState();
  const [agreementKimSign, setAgreementKimSign] = useState();
  const [agreementKimSignOld, setAgreementKimSignOld] = useState();
  const [agreementHeaderLogo, setAgreementHeaderLogo] = useState();
  const [agreementHeaderLogoOld, setAgreementHeaderLogoOld] = useState();
  const [agreementFooterLogo, setAgreementFooterLogo] = useState();
  const [agreementFooterLogoOld, setAgreementFooterLogoOld] = useState();
  const [thankyouImage, setThankyouImage] = useState();
  const [thankYouLogo, setThankYouLogo] = useState();
  const [oldThankyouImage, setOldThankyouImage] = useState("");
  const [oldThankyouLogo, setOldThankyouLogo] = useState("");
  const [oldLogo, setOldLogo] = useState("");
  const [oldPaymentPageBackground, setOldPaymentPageBackground] = useState("");

  const [inputs, setInputs] = useState({
    logo: {},
    payment_page_background: {},
    plan_heading: "",
    selected_plan_heading: "",
    personal_information_heading: "",
    billing_address_heading: "",
    card_heading: "",
    card_button_text: "",
    payment_logo: {},
    payment_top_button_text: "",
    payment_top_button_link: "",
    payment_privacy_policy_text: "",
    payment_footer_menus: "",
    payment_top_description: "",
    payment_facebook_link: "",
    payment_instagram_link: "",
    payment_twitter_link: "",
    payment_linkedin_link: "",
    thank_you_privacy_policy_text: "",
    thank_you_footer_menus: "",
    privacy_policy_text: "",
    thank_you_logo: {},
    thank_you_image: {},
    agreement_header_logo: {},
    agreement_footer_logo: {},
    agreement_kim_sign: {},
    thank_you_button_text: "",
    thank_you_button_link: "",
    thank_you_button_top_text: "",
    thank_you_button_top_link: "",
    thank_you_facebook_link: "",
    thank_you_instagram_link: "",
    thank_you_twitter_link: "",
    thank_you_linkedin_link: "",
    free_plan_button_text: "",
    signature_lable: "",
    on_behalf_text: "",
    agreement_checkbox_text: "",
    submit_button_text: "",
    copyright_text: "",
  });

  const getDefaultSetting = async () => {
    setIsLoading(true);
    const result = await clientSettingApi();
    if (result.code === 200) {
      const paymentData = result.content_setting?.payment_object;
      const thanksData = result.content_setting?.thanks_object;
      const agreementData = result.content_setting?.agreement_object;
      const resultFields = {
        ...result.content_setting?.payment_object,
        ...result.content_setting?.thanks_object,
        ...result.content_setting?.agreement_object,
      };
      setInputs(resultFields);
      setOldLogo(paymentData.payment_logo);
      setOldPaymentPageBackground(paymentData.payment_page_background);
      setOldThankyouImage(thanksData.thank_you_image);
      setOldThankyouLogo(thanksData.thank_you_logo);
      setAgreementKimSignOld(agreementData.agreement_kim_sign);
      setAgreementHeaderLogoOld(agreementData.agreement_header_logo);
      setAgreementFooterLogoOld(agreementData.agreement_footer_logo);
      setIsLoading(false);
    }
  };

  const fileChangedHandler = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["logo"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const agreementHeaderLogoHandler = async (e) => {
    setAgreementHeaderLogo(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["agreement_header_logo"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const agreementKimSignHandler = async (e) => {
    setAgreementKimSign(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["agreement_kim_sign"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const agreementFooterLogoHandler = async (e) => {
    setAgreementFooterLogo(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["agreement_footer_logo"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const fileChangedHandlerPaymentBackground = async (e) => {
    setPaymentPageBackground(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["payment_page_background"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const fileChangedHandlerFB = async (e) => {
    setThankYouLogo(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["thank_you_logo"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const fileChangedHandlerThankYouImage = async (e) => {
    setThankyouImage(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["thank_you_image"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    let paymentInfo = {
      plan_heading: inputs.plan_heading,
      selected_plan_heading: inputs.selected_plan_heading,
      personal_information_heading: inputs.personal_information_heading,
      billing_address_heading: inputs.billing_address_heading,
      card_heading: inputs.card_heading,
      card_button_text: inputs.card_button_text,
      payment_logo: inputs.payment_logo,
      payment_top_button_text: inputs.payment_top_button_text,
      payment_top_button_link: inputs.payment_top_button_link,
      payment_privacy_policy_text: inputs.payment_privacy_policy_text,
      payment_top_description: inputs.payment_top_description,
      payment_footer_menus: inputs.payment_footer_menus,
      payment_facebook_link: inputs.payment_facebook_link,
      payment_instagram_link: inputs.payment_instagram_link,
      payment_linkedin_link: inputs.payment_linkedin_link,
      payment_twitter_link: inputs.payment_twitter_link,
      payment_page_background: inputs.payment_page_background,
      free_plan_button_text: inputs.free_plan_button_text,
    };
    let thankyouInfo = {
      thank_you_button_text: inputs.thank_you_button_text,
      thank_you_button_link: inputs.thank_you_button_link,
      thank_you_button_top_text: inputs.thank_you_button_top_text,
      thank_you_button_top_link: inputs.thank_you_button_top_link,
      thank_you_privacy_policy_text: inputs.thank_you_privacy_policy_text,
      thank_you_footer_menus: inputs.thank_you_footer_menus,
      thank_you_facebook_link: inputs.thank_you_facebook_link,
      thank_you_instagram_link: inputs.thank_you_instagram_link,
      thank_you_linkedin_link: inputs.thank_you_linkedin_link,
      thank_you_twitter_link: inputs.thank_you_twitter_link,
    };

    let agreementInfo = {
      signature_lable: inputs.signature_lable,
      on_behalf_text: inputs.on_behalf_text,
      agreement_checkbox_text: inputs.agreement_checkbox_text,
      submit_button_text: inputs.submit_button_text,
      copyright_text: inputs.copyright_text,
      privacy_policy_text: inputs.privacy_policy_text,
    };

    if (thankyouImage) {
      thankyouInfo.thank_you_image = inputs.thank_you_image;
    } else {
      thankyouInfo.thank_you_image = oldThankyouImage;
    }

    if (agreementKimSign) {
      agreementInfo.agreement_kim_sign = inputs.agreement_kim_sign;
    } else {
      agreementInfo.agreement_kim_sign = agreementKimSignOld;
    }

    if (agreementFooterLogo) {
      agreementInfo.agreement_footer_logo = inputs.agreement_footer_logo;
    } else {
      agreementInfo.agreement_footer_logo = agreementFooterLogoOld;
    }

    if (agreementHeaderLogo) {
      agreementInfo.agreement_header_logo = inputs.agreement_header_logo;
    } else {
      agreementInfo.agreement_header_logo = agreementHeaderLogoOld;
    }

    if (file) {
      paymentInfo.payment_logo = inputs.logo;
    } else {
      paymentInfo.payment_logo = oldLogo;
    }
    let formData = {
      payment_object: paymentInfo,
      thanks_object: thankyouInfo,
      agreement_object: agreementInfo,
    };

    const result = await updateSiteSettingApi(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoadingForm(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingForm(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    getDefaultSetting();
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  console.log(agreementFooterLogoOld, "agreementFooterLogoOld");
  console.log(agreementHeaderLogoOld, "agreementHeaderLogoOld");
  console.log(agreementKimSignOld, "agreementKimSignOld");

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h2>Payment Setting</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Plan Heading"
              variant="outlined"
              fullWidth
              name="plan_heading"
              required
              value={inputs.plan_heading}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Selected Plan Heading"
              variant="outlined"
              fullWidth
              name="selected_plan_heading"
              required
              value={inputs.selected_plan_heading}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Personal Information Heading"
              variant="outlined"
              fullWidth
              name="personal_information_heading"
              required
              value={inputs.personal_information_heading}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Billing Address Heading"
              variant="outlined"
              fullWidth
              name="billing_address_heading"
              required
              value={inputs.billing_address_heading}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Card Heading"
              variant="outlined"
              fullWidth
              name="card_heading"
              required
              value={inputs.card_heading}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Paid Plan Button Text"
              variant="outlined"
              fullWidth
              name="card_button_text"
              required
              value={inputs.card_button_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Free Plan Button Text"
              variant="outlined"
              fullWidth
              name="free_plan_button_text"
              required
              value={inputs.free_plan_button_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Top Button Text"
              variant="outlined"
              fullWidth
              name="payment_top_button_text"
              value={inputs.payment_top_button_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Top Button Link"
              variant="outlined"
              fullWidth
              name="payment_top_button_link"
              value={inputs.payment_top_button_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Payment Privacy Policy"
              variant="outlined"
              fullWidth
              name="payment_privacy_policy_text"
              required
              value={inputs.payment_privacy_policy_text}
              onChange={handleChange}
            />
          </div>
          {/* social links */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Facebook Link"
              variant="outlined"
              fullWidth
              type="url"
              name="payment_facebook_link"
              value={inputs.payment_facebook_link}
              onChange={handleChange}
            />
          </div>{" "}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Twitter Link"
              variant="outlined"
              fullWidth
              type="url"
              name="payment_twitter_link"
              value={inputs.payment_twitter_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Instagram Link"
              variant="outlined"
              fullWidth
              type="url"
              name="payment_instagram_link"
              value={inputs.payment_instagram_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="linkedIn link"
              variant="outlined"
              fullWidth
              type="url"
              name="payment_linkedin_link"
              value={inputs.payment_linkedin_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Payment Page Background</p>
                <FormHelperText className="pt-0">
                  (Recommended Size 1000 X 670)
                </FormHelperText>
              </div>
              <div className="col-2">
                {paymentPageBackground ? (
                  <img
                    className="image-border"
                    src={paymentPageBackground}
                    height="50"
                  />
                ) : (
                  oldPaymentPageBackground && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldPaymentPageBackground}
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
                    onChange={fileChangedHandlerPaymentBackground}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.payment_page_background?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">
                {inputs?.payment_page_background?.name}
              </p>
            )}
          </div>
          {/* social links end*/}
          <div className="col-12 mt-5">
            <h4>Payment Description *</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="payment_top_description"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-5">
            <h4>Payment Footer Menus *</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="payment_footer_menus"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h2>Thank You Setting :</h2>
          </div>
          {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Thank You Button Text"
              variant="outlined"
              fullWidth
              name="thank_you_button_text"
              value={inputs.thank_you_button_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Thank You Button Link"
              variant="outlined"
              fullWidth
              name="thank_you_button_link"
              value={inputs.thank_you_button_link}
              onChange={handleChange}
            />
          </div> */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Thank You Button Top Text"
              variant="outlined"
              fullWidth
              name="thank_you_button_top_text"
              value={inputs.thank_you_button_top_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Thank You Button Top Link"
              variant="outlined"
              fullWidth
              name="thank_you_button_top_link"
              value={inputs.thank_you_button_top_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Thank You Privacy Policy Text"
              variant="outlined"
              fullWidth
              name="thank_you_privacy_policy_text"
              required
              value={inputs.thank_you_privacy_policy_text}
              onChange={handleChange}
            />
          </div>
          {/* social links */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Facebook Link"
              variant="outlined"
              fullWidth
              type="url"
              name="thank_you_facebook_link"
              value={inputs.thank_you_facebook_link}
              onChange={handleChange}
            />
          </div>{" "}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Twitter Link"
              variant="outlined"
              fullWidth
              type="url"
              name="thank_you_twitter_link"
              value={inputs.thank_you_twitter_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Instagram Link"
              variant="outlined"
              fullWidth
              type="url"
              name="thank_you_instagram_link"
              value={inputs.thank_you_instagram_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="linkedIn Link"
              variant="outlined"
              fullWidth
              type="url"
              name="thank_you_linkedin_link"
              value={inputs.thank_you_linkedin_link}
              onChange={handleChange}
            />
          </div>
          {/* social links end*/}
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Payment Logo</p>
                <FormHelperText className="pt-0">
                  (Recommended Size 250 X 100)
                </FormHelperText>
              </div>
              <div className="col-2">
                {file ? (
                  <img className="image-border" src={file} height="50" />
                ) : (
                  oldLogo && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldLogo}
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
                    component="span">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.logo?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.logo?.name}</p>
            )}
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Thank You Logo</p>
                <FormHelperText className="pt-0">
                  (Recommended Size 1000 X 250)
                </FormHelperText>
              </div>
              <div className="col-2">
                {thankYouLogo ? (
                  <img
                    className="image-border"
                    src={thankYouLogo}
                    height="50"
                  />
                ) : (
                  oldThankyouLogo && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldThankyouLogo}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-button-fileFb">
                  <Input
                    accept="image/*"
                    id="contained-button-fileFb"
                    multiple
                    type="file"
                    name="InvoiceImage"
                    onChange={fileChangedHandlerFB}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.logo?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.logo?.name}</p>
            )}
          </div>{" "}
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Thank You Image</p>
                <FormHelperText className="pt-0">
                  (Recommended Size 1000 X 250)
                </FormHelperText>
              </div>
              <div className="col-2">
                {thankyouImage ? (
                  <img
                    className="image-border"
                    src={thankyouImage}
                    height="50"
                  />
                ) : (
                  oldThankyouImage && (
                    <img
                      className="image-border"
                      src={s3baseUrl + oldThankyouImage}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-button-filethankyou">
                  <Input
                    accept="image/*"
                    id="contained-button-filethankyou"
                    multiple
                    type="file"
                    name="InvoiceImage"
                    onChange={fileChangedHandlerThankYouImage}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.logo?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.logo?.name}</p>
            )}
          </div>
          <div className="col-12 mt-5">
            <h4>Thank You Footer Menus *</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="thank_you_footer_menus"
              editorHeight={320}
            />
          </div>
          <div className="col-12 mt-4">
            <h2>Agreement Setting :</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Signature Lable"
              variant="outlined"
              fullWidth
              name="signature_lable"
              value={inputs.signature_lable}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="On Behalf Text"
              variant="outlined"
              fullWidth
              name="on_behalf_text"
              value={inputs.on_behalf_text}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Agreement Checkbox Text"
              variant="outlined"
              fullWidth
              name="agreement_checkbox_text"
              value={inputs.agreement_checkbox_text}
              onChange={handleChange}
            />
          </div>
          {/* social links */}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Submit Button Text"
              variant="outlined"
              fullWidth
              type="text"
              name="submit_button_text"
              value={inputs.submit_button_text}
              onChange={handleChange}
              required
            />
          </div>{" "}
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Copy Right Text"
              variant="outlined"
              fullWidth
              type="text"
              name="copyright_text"
              value={inputs.copyright_text}
              onChange={handleChange}
            />
          </div>
          {/* social links end*/}
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Header Logo</p>
                <FormHelperText className="pt-0">
                  (Recommended Size 250 X 100)
                </FormHelperText>
              </div>
              <div className="col-2">
                {agreementHeaderLogo ? (
                  <img
                    className="image-border"
                    src={agreementHeaderLogo}
                    height="50"
                  />
                ) : (
                  agreementHeaderLogoOld && (
                    <img
                      className="image-border"
                      src={s3baseUrl + agreementHeaderLogoOld}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="agreement_header_logo">
                  <Input
                    accept="image/*"
                    id="agreement_header_logo"
                    multiple
                    type="file"
                    name="agreement_header_logo"
                    onChange={agreementHeaderLogoHandler}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.agreement_header_logo?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">
                {inputs?.agreement_header_logo?.name}
              </p>
            )}
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Agreement Kim Sign</p>
                <FormHelperText className="pt-0">
                  (Recommended Size 1000 X 250)
                </FormHelperText>
              </div>
              <div className="col-2">
                {agreementKimSign ? (
                  <img
                    className="image-border"
                    src={agreementKimSign}
                    height="50"
                  />
                ) : (
                  agreementKimSignOld && (
                    <img
                      className="image-border"
                      src={s3baseUrl + agreementKimSignOld}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="agreement_kim_sign">
                  <Input
                    accept="image/*"
                    id="agreement_kim_sign"
                    multiple
                    type="file"
                    name="agreement_kim_sign"
                    onChange={agreementKimSignHandler}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.agreement_kim_sign?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">
                {inputs?.agreement_kim_sign?.name}
              </p>
            )}
          </div>{" "}
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Footer Logo</p>
                <FormHelperText className="pt-0">
                  (Recommended Size 1000 X 250)
                </FormHelperText>
              </div>
              <div className="col-2">
                {agreementFooterLogo ? (
                  <img
                    className="image-border"
                    src={agreementFooterLogo}
                    height="50"
                  />
                ) : (
                  agreementFooterLogoOld && (
                    <img
                      className="image-border"
                      src={s3baseUrl + agreementFooterLogoOld}
                      height="50"
                    />
                  )
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="agreement_footer_logo">
                  <Input
                    accept="image/*"
                    id="agreement_footer_logo"
                    multiple
                    type="file"
                    name="agreement_footer_logo"
                    onChange={agreementFooterLogoHandler}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.agreement_footer_logo?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">
                {inputs?.agreement_footer_logo?.name}
              </p>
            )}
          </div>
          <div className="col-12 mt-4">
            <h4>Privacy Policy</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="privacy_policy_text"
              editorHeight={320}
            />
          </div>
          <div className="text-end mt-4">
            <button className="small-contained-button">
              {isLoadingForm ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
