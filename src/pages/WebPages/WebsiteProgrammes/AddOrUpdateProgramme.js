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
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import {
  addWebsiteProgrammesApi,
  editWebsiteProgrammesApi,
  website_programmes_detail_api,
} from "../../../DAL/WebsitePages/WebsiteProgrammes";
import { useEffect } from "react";
import { s3baseUrl } from "src/config/config";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import { handleImageExtensions } from "src/utils/constant";
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

export default function AddOrUpdateProgramme() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("ADD");
  const [file, setProfileImage] = useState();
  const [oldImage, setOldImage] = useState("");
  const params = useParams();
  const [pageData, setPageData] = useState({});
  const module_actual_name = "website_programmes";
  const [moduleData, setModuleData] = useState({});
  const [moduleSizes, setModuleSizes] = useState({});
  const { state } = useLocation();
  const [inputs, setInputs] = useState({
    title: "",
    status: "true",
    image: {},
    button_text: "",
    button_link: "",
    short_description: "",
  });

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  const getProgrammeDeatil = async () => {
    setIsLoading(true);
    const result = await website_programmes_detail_api(params.programme_slug);
    if (result.code === 200) {
      setFormType("EDIT");
      setInputs(result.program);
      setOldImage(result.program.program_images.thumbnail_3);
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
    formData.append("title", inputs.title);
    formData.append("short_description", inputs.short_description);
    formData.append("status", inputs.status);
    formData.append("button_link", inputs.button_link);
    formData.append("button_text", inputs.button_text);

    if (params && params.page_id) {
      formData.append("created_for", "sale_page");
      formData.append("page_id", params.page_id);
    } else {
      formData.append("created_for", "general");
    }

    if (formType === "EDIT") {
      formData.append("order", inputs.order);
      if (file) {
        formData.append("main_image", inputs.image);
      }
    } else {
      formData.append("main_image", inputs.image);
    }

    const result =
      formType === "ADD"
        ? await addWebsiteProgrammesApi(formData)
        : await editWebsiteProgrammesApi(formData, inputs.program_slug);
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

  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await page_detail_by_id(params.page_id);
    if (result.code == 200) {
      handlePageDetail(result.sale_page);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handlePageDetail = (data) => {
    setPageData(data);
    const get_module_info = data.module_info.filter(
      (item) => item.module_actual_name == module_actual_name
    )[0];
    setModuleData(get_module_info.module_replica_info);
    setModuleSizes(get_module_info);
  };

  useEffect(() => {
    if (params && params.programme_slug) {
      if (state) {
        setFormType("EDIT");
        setInputs(state.data);
        setOldImage(state.data.program_images.thumbnail_3);
        if (params.page_id) {
          handlePageDetail(state.page_info);
        }
      } else {
        getProgrammeDeatil();
        if (params.page_id) {
          getPageDetail();
        }
      }
    } else {
      if (params.page_id) {
        if (state) {
          handlePageDetail(state);
        } else {
          getPageDetail();
        }
      }
    }
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
          <span className="sale-page-title">{pageData.sale_page_title}</span>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {moduleData?.add_page_heading ? (
            <h2>
              {formType === "ADD"
                ? moduleData.add_page_heading
                : moduleData.edit_page_heading}
            </h2>
          ) : (
            <h2>{`${formType === "ADD" ? "Add" : "Edit"} Programme`}</h2>
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
                  label="Title"
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
                  <InputLabel id="demo-simple-select-label">
                    Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={inputs.status}
                    label="Status*"
                    onChange={handleChange}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Button Text"
                  variant="outlined"
                  fullWidth
                  name="button_text"
                  value={inputs.button_text}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Button Link"
                  variant="outlined"
                  fullWidth
                  type="url"
                  name="button_link"
                  value={inputs.button_link}
                  onChange={handleChange}
                />
              </div>
              {formType !== "ADD" && (
                <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Order"
                    variant="outlined"
                    fullWidth
                    required
                    name="order"
                    value={inputs.order}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Image *</p>
                    {moduleSizes?.height !== undefined ? (
                      <FormHelperText className="pt-0">
                        Image Size(
                        {moduleSizes?.image_width +
                          " x " +
                          moduleSizes?.image_height}
                        ) ({handleImageExtensions(moduleSizes?.image_extension)}
                        )
                      </FormHelperText>
                    ) : (
                      <FormHelperText className="pt-0">
                        Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                      </FormHelperText>
                    )}
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
                        className="small-contained-button-search"
                        startIcon={<FileUploadIcon />}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
                {inputs.image?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs.image?.name}</p>
                )}
              </div>
              <div className="col-12 mt-5">
                {/* <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Short Description"
                multiline
                rows={6}
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
              <FormHelperText>Maximum limit 500 characters</FormHelperText>
            </FormControl> */}
                <GeneralCkeditor
                  setInputs={setInputs}
                  inputs={inputs}
                  name="short_description"
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
