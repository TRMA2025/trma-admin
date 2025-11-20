import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
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
import { AddProgrammeApi } from "src/DAL/Programme/Programme";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { addQuotesApi } from "src/DAL/quotes/Quotes";
import {
  detailConstentPageApi,
  detailContentPageApi,
  updatePageContentSettingApi,
} from "src/DAL/WebsitePages/websitepages";
import TinyEditorWebsiteSetting from "src/components/ckeditor/CkeditorWebsiteSetting";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import { result } from "lodash";
import { s3baseUrl } from "src/config/config";
import { handleImageExtensions } from "src/utils/constant";

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

export default function UpdatePageContent() {
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
  const [programList, setProgramList] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [templateFields, setTemplateFields] = useState([]);
  const [templateFieldsData, setTemplateFieldsData] = useState([]);

  const [inputs, setInputs] = React.useState({});
  const [defaultInputs, setDefaultInputs] = React.useState({});

  const getTemplateFieldList = async () => {
    setIsLoading(true);
    const result = await detailContentPageApi(params.id);
    if (result.code === 200) {
      setTemplateFields(result?.sale_page?.template?.template_attributes_info);
      setTemplateFieldsData(result?.sale_page?.sale_page_detail);

      //   setInputs({
      //     ...inputs,
      //     ["banner_image"]: templateFieldsData.banner_image,
      //     ["program_card_button_link"]:
      //       templateFieldsData.program_card_button_link,
      //   });
    }
    setIsLoading(false);
  };
  const fileChangedHandler = async (e, i) => {
    console.log(i, "iiiiiii");
    const name = e.target.name;
    // setIsLoading(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", i.width);
    formData.append("height", i.height);

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        [e.target.name]: imageUpload.image_path,
      });
      // setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
    // setProfileImage(URL.createObjectURL(e.target.files[0]));
  };
  const fileChangedHandlerUpdate = async (e, i) => {
    console.log(i, "iiiiiii");
    const name = e.target.name;
    setIsLoading(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", i.width);
    formData.append("height", i.height);

    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setTemplateFieldsData((prevState) => ({
        ...prevState,
        [name]: imageUpload.image_path,
      }));
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
    // setProfileImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setiswaiting(true);
    // setIsLoading(true);
    const result =
      templateFieldsData == undefined
        ? await updatePageContentSettingApi(inputs, params.id)
        : await updatePageContentSettingApi(templateFieldsData, params.id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
      setiswaiting(false);
    }
  };
  const handleChangeProgram = (e) => {
    setProgramName(e.target.value);
  };
  const handleChangeVault = (event) => {
    setVaultName(event.target.value);
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
  const getIndex = (event, i) => {};

  React.useEffect(() => {
    getTemplateFieldList();
  }, []);
  console.log(inputs, "inputsssssss");
  console.log(templateFieldsData, "inputsssssss");

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
          <h2>Add Page Detail</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {templateFields.map((template, i) => {
            console.log(template, "template");
            return (
              <>
                {template.attribute_type == "input" ? (
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                    <TextField
                      id="outlined-basic"
                      label={template?.attribute_label}
                      variant="outlined"
                      fullWidth
                      required={template.required}
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
                        <p className="">{template.attribute_label + " *"}</p>
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
                              s3baseUrl +
                              templateFieldsData[template?.attribute_db_name]
                            }
                            height="50"
                          />
                        ) : inputs[template.attribute_db_name] !== undefined ? (
                          <img
                            className="image-border"
                            src={s3baseUrl + inputs[template.attribute_db_name]}
                            height="50"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-5 text-end pt-2">
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
                                : (e) => fileChangedHandlerUpdate(e, template)
                            }
                            //   onChange={(e) => getIndex(e, i)}
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
                      {/* {templateFieldsData !== undefined
                      ? templateFieldsData[template?.attribute_db_name]
                      : inputs.template?.attribute_db_name == undefined
                      ? "name"
                      : inputs[template.attribute_db_name]} */}
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
                    <h4 className="mb-2">
                      {template?.attribute_label}
                      {template.required == true ? "*" : ""}
                    </h4>
                    <TinyEditorWebsiteSetting
                      setInputs={setInputs}
                      inputs={inputs}
                      setTemplateFieldsData={setTemplateFieldsData}
                      templateFieldsData={templateFieldsData}
                      name={template.attribute_db_name}
                      setDetailDescription={template.attribute_db_name}
                      // detailDescriptionCk={
                      //   templateFieldsData[template?.attribute_db_name]
                      // }
                    />
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          })}

          <div className="text-end mt-4">
            <button className="small-contained-button">
              {iswaiting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
