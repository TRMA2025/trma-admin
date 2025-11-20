import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";

import { useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress, Switch } from "@mui/material";
import {
  detailContentPageApi,
  updatePageContentSettingApi,
} from "src/DAL/WebsitePages/websitepages";
import TinyEditorWebsiteSetting from "src/components/ckeditor/CkeditorWebsiteSetting";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import { result } from "lodash";
import { s3baseUrl } from "src/config/config";
import { useEffect } from "react";
import { handleImageExtensions } from "src/utils/constant";
import zIndex from "@mui/material/styles/zIndex";
import moment, { duration } from "moment";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function UpdatePageContent() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [navigationPage, setnavigationPage] = useState(false);
  const [isAllAccess, setIsAllAccess] = useState(true);
  const [templateFields, setTemplateFields] = useState([]);
  const [salePageData, setSalePageData] = useState({});
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [templateFieldsData, setTemplateFieldsData] = useState([]);
  const [inputs, setInputs] = useState({});
  const is_template_pages = window.location.pathname.includes("template-pages");
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const getTemplateFieldList = async () => {
    setIsLoading(true);
    const result = await detailContentPageApi(params.id);
    if (result.code === 200) {
      setSalePageData(result.sale_page);
      setTemplateFields(result?.sale_page?.template?.template_attributes_info);
      setSelectedAccess(result?.sale_page?.template_attributes_info);
      setTemplateFieldsData(result?.sale_page?.sale_page_detail);
      setIsAllAccess(result?.sale_page?.is_content_access);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const fileChangedHandler = async (e, i) => {
    // setIsLoading(true);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", i.width);
    formData.append("height", i.height);
    let allowedImageExtension = i.image_extension;
    let uploadedImageExtension = e.target.files[0]?.name?.split(".")[1];
    let extension_matched = allowedImageExtension.includes(
      "." + uploadedImageExtension
    );
    if (extension_matched) {
      const imageUpload = await uploadImageOns3(formData);
      if (imageUpload.code == 200) {
        setInputs({
          ...inputs,
          [e.target.name]: imageUpload.image_path,
        });
        setIsLoading(false);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    } else {
      enqueueSnackbar(
        `Upload images with mentioned ${handleImageExtensions(
          allowedImageExtension
        )} extension`,
        {
          variant: "error",
        }
      );
    }
  };
  const fileChangedHandlerUpdate = async (e, i) => {
    // setIsLoading(true);
    // Set loading state for the specific image being updated

    const name = e.target.name;
    setImageLoadingStates((prevState) => ({
      ...prevState,
      [name]: true,
    }));

    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", i.width);
    formData.append("height", i.height);
    let allowedImageExtension = i.image_extension;
    let uploadedImageExtension = e.target.files[0]?.name?.split(".")[1];
    let extension_matched = allowedImageExtension.includes(
      "." + uploadedImageExtension
    );
    console.log(
      extension_matched,
      uploadedImageExtension,
      e.target.files[0],
      "extension_matched"
    );
    if (extension_matched == true) {
      const imageUpload = await uploadImageOns3(formData);
      if (imageUpload.code == 200) {
        setTimeout(() => {
          setTemplateFieldsData((prevState) => ({
            ...prevState,
            [name]: imageUpload.image_path,
          }));
          // Clear loading state after the timeout completes
          setImageLoadingStates((prevState) => ({
            ...prevState,
            [name]: false,
          }));
        }, 1000);

        setIsLoading(false);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        // Clear loading state in case of error
        setImageLoadingStates((prevState) => ({
          ...prevState,
          [name]: false,
        }));

        setIsLoading(false);
      }
    } else {
      enqueueSnackbar(
        `Upload images with mentioned ${handleImageExtensions(
          allowedImageExtension
        )} extension`,
        {
          variant: "error",
        }
      );
      // Clear loading state in case of error
      setImageLoadingStates((prevState) => ({
        ...prevState,
        [name]: false,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let content_info = {};
    if (templateFieldsData == undefined) {
      content_info = inputs;
    } else {
      templateFieldsData.event_date = moment(
        templateFieldsData.event_date
      ).format("YYYY-MM-DD");
      templateFields.map((item) => {
        content_info[item?.attribute_db_name] =
          templateFieldsData !== undefined
            ? templateFieldsData[item?.attribute_db_name]
              ? templateFieldsData[item.attribute_db_name]
              : null
            : "";
      });
    }

    let postData = {
      template_attributes_info: isAllAccess === false ? [] : selectedAccess,
      content_info,
      is_content_access: isAllAccess,
    };

    const result = await updatePageContentSettingApi(postData, params?.id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      if (navigationPage == true) {
        navigate(-1);
      }
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleSubmitAndExit = async (e) => {
    setnavigationPage(true);
    handleSubmit();
  };
  const handleChange = (event, i) => {
    const name = event.target.name;
    const value = event.target.value;
    setTemplateFieldsData((values) => ({ ...values, [name]: value }));
  };

  const handleChangeSet = (event, i) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleChangeDate = (event, name) => {
    setTemplateFieldsData((values) => ({ ...values, [name]: event }));
  };

  const handleChangeAllAccess = (e) => {
    const { checked } = e.target;
    setIsAllAccess(checked);
  };

  const handleChangeSwitch = (e) => {
    let target_id = e.target.name;
    let filter = selectedAccess.filter((item) => item == target_id);
    if (filter.length == 0) {
      setSelectedAccess((oldArray) => [...oldArray, target_id]);
    } else {
      let remove_element = selectedAccess.filter((item) => item !== target_id);
      setSelectedAccess(remove_element);
    }
  };

  useEffect(() => {
    getTemplateFieldList();
  }, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

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
          <span className="sale-page-title">
            {salePageData.sale_page_title}
          </span>
        </div>
      </div>

      <div className="row">
        <div className="col-12 d-flex justify-content-between">
          <h2>Update Page Content</h2>
          {/* <div className="all-fields-access">
            {is_template_pages && (
              <>
                <span className="content-access">Content Access</span>
                <Switch
                  className="float-end"
                  checked={isAllAccess}
                  onChange={handleChangeAllAccess}
                />
              </>
            )}
          </div> */}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div class="card main-card">
          <div class="card-body">
            <div className="row">
              {templateFields?.map((template, i) => {
                return (
                  <>
                    {template.attribute_type == "input" ? (
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-4" key={i}>
                        {is_template_pages && isAllAccess && (
                          <Switch
                            className="float-end"
                            onChange={handleChangeSwitch}
                            name={template._id}
                            checked={
                              selectedAccess?.indexOf(template._id) !== -1
                                ? true
                                : template.is_access
                            }
                          />
                        )}
                        <TextField
                          id="outlined-basic"
                          label={template?.attribute_label}
                          variant="outlined"
                          fullWidth
                          required={template.required == true ? true : false}
                          name={template?.attribute_db_name}
                          value={
                            templateFieldsData !== undefined
                              ? templateFieldsData[template?.attribute_db_name]
                              : inputs.template?.attribute_db_name
                          }
                          onChange={
                            templateFieldsData == undefined
                              ? (e) => handleChangeSet(e, i)
                              : (e) => handleChange(e, i)
                          }
                        />
                      </div>
                    ) : template.attribute_type == "file" ? (
                      <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                        <div className="row w-100 div-style ms-0 pt-0">
                          <div className="col-5">
                            <p className="">
                              {template.attribute_label}
                              {template.required == true ? " *" : ""}
                            </p>
                            <FormHelperText className="pt-0">
                              {/* {templateFieldsData !== undefined
                          ? templateFieldsData[template?.attribute_db_name]
                          : inputs.template?.attribute_db_name} */}
                            </FormHelperText>
                          </div>
                          <div className="col-2">
                            {templateFieldsData !== undefined ? (
                              <img
                                className="image-border"
                                src={
                                  templateFieldsData[
                                    template?.attribute_db_name
                                  ] == "" ||
                                  templateFieldsData[
                                    template?.attribute_db_name
                                  ] == null
                                    ? ""
                                    : s3baseUrl +
                                      templateFieldsData[
                                        template?.attribute_db_name
                                      ]
                                }
                                height="50"
                              />
                            ) : inputs[template.attribute_db_name] !==
                              undefined ? (
                              <img
                                className="image-border"
                                src={
                                  s3baseUrl + inputs[template.attribute_db_name]
                                }
                                height="50"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="col-2">
                            {is_template_pages && isAllAccess && (
                              <Switch
                                className="float-end"
                                onChange={handleChangeSwitch}
                                name={template._id}
                                checked={
                                  selectedAccess?.indexOf(template._id) !== -1
                                    ? true
                                    : template.is_access
                                }
                              />
                            )}
                          </div>
                          <div className="col-3 text-end pt-2">
                            <label htmlFor={template.attribute_db_name}>
                              <Input
                                accept="image/*"
                                id={template.attribute_db_name}
                                multiple
                                type="file"
                                name={template.attribute_db_name}
                                onChange={
                                  templateFieldsData == undefined
                                    ? (e) => fileChangedHandler(e, template)
                                    : (e) =>
                                        fileChangedHandlerUpdate(e, template)
                                }
                                //   onChange={(e) => getIndex(e, i)}
                              />
                              <Button
                                className="small-contained-button-search"
                                startIcon={<FileUploadIcon />}
                                component="span"
                              >
                                {imageLoadingStates[template.attribute_db_name]
                                  ? "Uploading..."
                                  : "Upload"}
                              </Button>
                            </label>
                          </div>

                          {inputs[template.attribute_db_name]}
                        </div>
                        <p className="text-muted">
                          {"Recommended size (" +
                            template.width +
                            "px * " +
                            template.height +
                            "px ) "}
                          {"( " +
                            handleImageExtensions(template.image_extension) +
                            " )"}
                        </p>
                      </div>
                    ) : template.attribute_type == "editor" ? (
                      <div className="col-12 mt-5">
                        <div className="d-flex justify-content-between">
                          <h4 className="mb-2">
                            {template?.attribute_label}
                            {template.required == true ? " *" : ""}
                          </h4>
                          {is_template_pages && isAllAccess && (
                            <Switch
                              className="float-end"
                              onChange={handleChangeSwitch}
                              name={template._id}
                              checked={
                                selectedAccess?.indexOf(template._id) !== -1
                                  ? true
                                  : template.is_access
                              }
                            />
                          )}
                        </div>

                        <TinyEditorWebsiteSetting
                          setInputs={setInputs}
                          inputs={inputs}
                          setTemplateFieldsData={setTemplateFieldsData}
                          templateFieldsData={templateFieldsData}
                          name={template.attribute_db_name}
                          setDetailDescription={template.attribute_db_name}
                          editorHeight={320}
                        />
                      </div>
                    ) : template.attribute_type == "date" ? (
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                        {is_template_pages && isAllAccess && (
                          <Switch
                            className="float-end"
                            onChange={handleChangeSwitch}
                            name={template._id}
                            checked={
                              selectedAccess?.indexOf(template._id) !== -1
                                ? true
                                : template.is_access
                            }
                          />
                        )}
                        {/* <TextField
                      id="outlined-basic"
                      label={template?.attribute_label}
                      variant="outlined"
                      fullWidth
                      required={template.required == true ? true : false}
                      name={template?.attribute_db_name}
                      value={
                        templateFieldsData !== undefined
                          ? templateFieldsData[template?.attribute_db_name]
                          : inputs.template?.attribute_db_name
                      }
                      onChange={
                        templateFieldsData == undefined
                          ? (e) => handleChangeSet(e, i)
                          : (e) => handleChange(e, i)
                      }
                    /> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              label={template?.attribute_label}
                              inputFormat="dd-MM-yyyy"
                              value={
                                templateFieldsData !== undefined
                                  ? templateFieldsData[
                                      template?.attribute_db_name
                                    ]
                                  : inputs.template?.attribute_db_name
                              }
                              onChange={
                                templateFieldsData == undefined
                                  ? (e) =>
                                      handleChangeDate(
                                        e,
                                        template?.attribute_db_name
                                      )
                                  : (e) =>
                                      handleChangeDate(
                                        e,
                                        template?.attribute_db_name
                                      )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name={template?.attribute_db_name}
                                />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-end mt-4" id="fixedbutton">
          <button
            className="small-contained-button  me-2"
            onClick={handleSubmitAndExit}
          >
            Save & Exit
          </button>
          <button className="small-contained-button">Save</button>
        </div>
      </form>
    </div>
  );
}
