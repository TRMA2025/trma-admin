import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { defaultMenuListApi } from "src/DAL/Menu/Menu";
import { programmeActiveListing } from "src/DAL/Programme/Programme";
import {
  addDefaultSettingApi,
  addInvoiceSettingApi,
  defaultSettingApi,
} from "src/DAL/SiteSetting/siteSetting";

import { s3baseUrl } from "src/config/config";
import { TimeZones } from "../../utils/constant";
import { useEffect } from "react";
import { clientSettingApi } from "src/DAL/ClientSetting/ClientSetting";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import Skeleton from "react-loading-skeleton";
import SettingsSkelton from "../allSkeleton/SettingsSkelton";

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

export default function InvoiceSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = useState();
  const [invoiceImage, setInvoiceImage] = useState();
  const [programList, setProgramList] = useState([]);
  const [menuLists, setMenuList] = useState([]);
  const [programName, setProgramName] = useState("");
  const [navItems, setNavitems] = useState([]);
  const [oldInvoiceImage, setOldInvoiceImage] = useState("");
  const [oldLogo, setOldLogo] = useState("");
  const [groupsName, setGroupsName] = useState([]);
  const [programmeListing, setProgramListing] = useState([]);
  const [timeZoneValue, setTimeZoneValue] = useState();
  const [inputValue, setInputValue] = useState("");
  const [membershipNavItems, setMembershipNavitems] = useState([]);
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [dynamiteLifestyleAddress, setDynamiteLifestyleAddress] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");

  const [inputs, setInputs] = useState({
    logo: {},
    InvoiceImage: {},
    dynamite_digital_address: "",
    invoice_from: "",
  });

  const getNavItemList = async () => {
    const result = await defaultMenuListApi();
    if (result.code === 200) {
      setMenuList(result.menus);
    }
  };
  const getDefaultSetting = async () => {
    setIsLoading(true);
    const result = await clientSettingApi();
    if (result.code === 200) {
      console.log(result.content_setting, "result.content_setting");
      setInputs(result.content_setting.invoice_setting);
      setPaymentInfo(result?.content_setting.invoice_setting?.payment_info);
      setInvoiceAddress(
        result?.content_setting.invoice_setting?.skin_sister_address
      );
      setDynamiteLifestyleAddress(
        result?.content_setting.invoice_setting?.dynamite_lifestyle_address
      );
      setOldInvoiceImage(
        result?.content_setting.invoice_setting?.invoice_image
      );
      setOldLogo(result?.content_setting?.invoice_setting?.invoice_logo);
      setIsLoading(false);
    }
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

  const handleChangeNavItem = (event) => {
    const {
      target: { value },
    } = event;
    setNavitems(
      // On autofill we get a stringified value.
      typeof value === "st  ring" ? value.split(",") : value
    );
  };
  const getProgramListing = async () => {
    const result = await programmeActiveListing();
    setIsLoading(true);
    if (result.code === 200) {
      setProgramList(result.program);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
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
  const fileChangedHandlerFB = async (e) => {
    setInvoiceImage(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "600");

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["InvoiceImage"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleChangeGroup = (event) => {
    const {
      target: { value },
    } = event;
    setGroupsName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let postData = {
      invoice_logo: inputs.logo,

      invoice_from: inputs?.invoice_from,

      skin_sister_address: invoiceAddress,
      payment_info: paymentInfo,
    };

    if (invoiceImage) {
      postData.invoice_image = inputs.InvoiceImage;
    } else {
      postData.invoice_image = oldInvoiceImage;
    }

    if (file) {
      postData.invoice_logo = inputs.logo;
    } else {
      postData.invoice_logo = oldLogo;
    }
    let formData = {
      invoice_setting: postData,
    };
    const result = await addInvoiceSettingApi(formData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangeProgram = (e) => {
    setProgramName(e.target.value);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    getDefaultSetting();
  }, []);

  // useEffect(() => {
  //   setTimeZoneValue(inputs.time_zone);
  // }, [inputs.time_zone]);

  return (
    <div className="container">
      {/* <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={() => navigate(-1)}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton>
        </div>
      </div> */}
      <div className="row">
        <div className="col-6">
          <h2>Invoice Setting</h2>
        </div>
      </div>
      {isLoading ? (
        <SettingsSkelton />
      ) : (
        // <div class="card main-card" style={{ height: "auto" }}>
        //   <div class="card-body">
        //     <div className="row mt-2 ">
        //       <div className="col-lg-6 col-md-6 col-sm-12 mt-4 mb-3">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={450}
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={200}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width={150}
        //           height={20}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={400}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 mb-3">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width="100%"
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 mb-3">
        //         <Skeleton
        //           baseColor="#fff"
        //           highlightColor="#ddd"
        //           width="100%"
        //           height={60}
        //           style={{ borderRadius: "12px" }}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Dynamite Digital Address"
            variant="outlined"
            fullWidth
            name="dynamite_digital_address"
            required
            value={inputs.dynamite_digital_address}
            onChange={handleChange}
          />
        </div> */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Invoice From"
                  variant="outlined"
                  fullWidth
                  name="invoice_from"
                  required
                  value={inputs?.invoice_from}
                  onChange={handleChange}
                />
              </div>
             
              <div className="col-12 mt-5">
                <h4>BeeMe Academy Address *</h4>
                <TinyEditor
                  setDetailDescription={setInvoiceAddress}
                  detailDescriptionCk={invoiceAddress}
                  editorHeight={300}
                />
              </div>
            
              <div className="col-12 mt-5">
                <h4>Payment Info *</h4>
                <TinyEditor
                  setDetailDescription={setPaymentInfo}
                  detailDescriptionCk={paymentInfo}
                  editorHeight={300}
                />
              </div>
             
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Invoice Logo</p>
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
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
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
                    <p className="">Invoice Image</p>
                    <FormHelperText className="pt-0">
                      (Recommended Size 1000 X 250)
                    </FormHelperText>
                  </div>
                  <div className="col-2">
                    {invoiceImage ? (
                      <img
                        className="image-border"
                        src={invoiceImage}
                        height="50"
                      />
                    ) : (
                      oldInvoiceImage && (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldInvoiceImage}
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
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
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
            </div>
          </div>
        </div>
      )}

      <div className="text-end mt-4">
        <button
          onClick={handleSubmit}
          className="small-contained-button"
          id="fixedbutton"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
