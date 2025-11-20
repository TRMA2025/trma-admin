import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  Input,
  TextField,
} from "@mui/material";

import FormHelperText from "@mui/material/FormHelperText";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Select from "@mui/material/Select";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  addBusinessStrategy,
  buisnessStrategyDetailApi,
  editBusinessStrategy,
} from "src/DAL/WebsitePages/BusinessStrategy";
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
const AddOrUpdateBusinessStrategy = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("ADD");
  const [file, setProfileImage] = useState();
  const [oldImage, setOldImage] = useState("");
  const params = useParams();
  const [moduleData, setModuleData] = useState({});
  const [moduleSizes, setModuleSizes] = useState({});
  const module_actual_name = "buisness_strategy";
  const [pageData, setPageData] = useState({});
  const { state } = useLocation();
  const [inputs, setInputs] = useState({
    title: "",
    video_url: "",
    button_text: "",
    button_link: "",
    description: "",
    strategy_type: "video",
    status: true,
    image: {},
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  const getStrategyDetailData = async () => {
    setIsLoading(true);
    const result = await buisnessStrategyDetailApi(params.strategy_id);
    if (result.code === 200) {
      const { images, strategy_type } = result.buisness_strategy;
      setFormType("EDIT");
      if (strategy_type === "image") {
        setOldImage(images.thumbnail_1);
      }
      setInputs(result.buisness_strategy);
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
    formData.append("description", inputs.description);
    formData.append("strategy_type", inputs.strategy_type);
    formData.append("status", inputs.status);
    formData.append("button_text", inputs.button_text);
    formData.append("button_link", inputs.button_link);

    if (params && params.page_id) {
      formData.append("created_for", "sale_page");
      formData.append("page_id", params.page_id);
    } else {
      formData.append("created_for", "general");
    }

    if (formType === "EDIT") {
      formData.append("order", inputs.order);
    }

    if (inputs.strategy_type === "video") {
      formData.append("video_url", inputs.video_url);
    } else {
      if (formType === "EDIT") {
        if (file) {
          formData.append("image", inputs.image);
        }
      } else {
        formData.append("image", inputs.image);
      }
    }

    const result =
      formType === "ADD"
        ? await addBusinessStrategy(formData)
        : await editBusinessStrategy(formData, params.strategy_id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(-1);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
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
    if (params && params.strategy_id) {
      if (state) {
        if (params.page_id) {
          handlePageDetail(state.page_info);
        }
        setFormType("EDIT");
        setInputs(state.data);
        if (state.data.strategy_type === "image") {
          setOldImage(state.data.images.thumbnail_1);
        }
      } else {
        getStrategyDetailData();
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
      <div className="row">
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
        <div className="col-6">
          {moduleData?.add_page_heading ? (
            <h2>
              {formType === "ADD"
                ? moduleData.add_page_heading
                : moduleData.edit_page_heading}
            </h2>
          ) : (
            <h2>{`${
              formType === "ADD" ? "Add" : "Edit"
            } Business Strategy`}</h2>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
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
              <InputLabel id="strategy_type">Strategy Type *</InputLabel>
              <Select
                labelId="strategy_type"
                id="demo-simple-select"
                name="strategy_type"
                value={inputs.strategy_type}
                label="Strategy Type"
                required
                onChange={handleChange}
              >
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="image">Image</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                value={inputs.status}
                label="Status"
                required
                onChange={handleChange}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
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
          {inputs.strategy_type === "video" ? (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Video URL"
                  name="video_url"
                  required
                  value={inputs.video_url}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
          ) : (
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
                      ) ({handleImageExtensions(moduleSizes?.image_extension)})
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
                      hidden
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
              {inputs.image?.name == "" ? (
                ""
              ) : (
                <p className="text-secondary">{inputs.image?.name}</p>
              )}
            </div>
          )}
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
              name="button_link"
              value={inputs.button_link}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mt-4">
            <h4> Description *</h4>
            <GeneralCkeditor
              setInputs={setInputs}
              inputs={inputs}
              name="description"
              editorHeight={320}
            />
          </div>
          <div className="text-end mt-4">
            <button className="small-contained-button">
              {formType == "ADD" ? "Submit" : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddOrUpdateBusinessStrategy;
