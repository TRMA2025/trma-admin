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
import moment from "moment";
import { makeStyles } from "@mui/styles";
import {
  addWebsiteTestimonial,
  detailWebsiteTestimonialApi,
  editWebsiteTestimonialApi,
} from "src/DAL/WebsitePages/testimonial";
import {
  handleImageExtensions,
  urlPatternValidation,
} from "src/utils/constant";
import { useEffect } from "react";
import { page_detail_by_id } from "src/DAL/WebsitePages/websitepages";
import { s3baseUrl } from "src/config/config";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
const AddOrUpdateWebPageTestimonial = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useLocation();
  const [file, setProfileImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const [moduleData, setModuleData] = useState({});
  const [moduleSizes, setModuleSizes] = useState({});
  const [pageData, setPageData] = useState({});
  const module_actual_name = "testimonial";
  const [formType, setFormType] = useState("ADD");
  const [oldImage, setOldImage] = useState("");

  const [inputs, setInputs] = useState({
    title: "",
    name: "",
    testimonial_type: "image",
    button_text: "",
    button_link: "",
    description: "",
    status: "true",
    image: {},
    video_url: "",
    rating: "0",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (inputs.description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
      setIsLoading(false);
    } else {
      if (
        inputs.testimonial_type == "video" &&
        urlPatternValidation(inputs.video_url) === false
      ) {
        enqueueSnackbar("Enter Valid Video URLLL", { variant: "error" });
        setIsLoading(false);
      } else {
        const formData = new FormData();
        formData.append("title", inputs.title);
        formData.append("name", inputs.name);
        formData.append("description", inputs.description);
        formData.append("status", inputs.status);
        formData.append("testimonial_type", inputs.testimonial_type);
        formData.append("button_text", inputs.button_text);
        formData.append("button_link", inputs.button_link);
        formData.append("rating", inputs.rating);
        if (params && params.page_id) {
          formData.append("created_for", "sale_page");
          formData.append("page_id", params.page_id);
        } else {
          formData.append("created_for", "general");
        }

        if (inputs.testimonial_type == "video") {
          formData.append("video_url", inputs.video_url);
        }
        // if (inputs.testimonial_type == "image") {
        //   if (file) {
        //     formData.append("image", inputs.image);
        //   }
        // }
        if (inputs.testimonial_type == "both") {
          formData.append("video_url", inputs.video_url);
          if (file) {
            formData.append("image", inputs.image);
          }
        }

        if (formType === "EDIT") {
          formData.append("order", inputs.order);
        }

        if (inputs.testimonial_type == "image") {
          if (formType == "EDIT") {
            if (file) {
              formData.append("image", inputs.image);
            }
          } else {
            if (file) {
              formData.append("image", inputs.image);
            }
          }
        }
        // console.log(...formData);
        const result =
          formType == "ADD"
            ? await addWebsiteTestimonial(formData)
            : await editWebsiteTestimonialApi(formData, params.testimonial_id);
        if (result.code === 200) {
          enqueueSnackbar(result.message, { variant: "success" });
          navigate(-1);
        } else {
          enqueueSnackbar(result.message, { variant: "error" });
          setIsLoading(false);
        }
      }
    }
  };

  const getTestimonialDetailData = async () => {
    setIsLoading(true);

    const result = await detailWebsiteTestimonialApi(params.testimonial_id);
    if (result.code === 200) {
      const { images } = result.testimonial;
      setFormType("EDIT");
      setOldImage(images.thumbnail_1);
      setInputs({
        ...result.testimonial,
        ["image"]: images?.thumbnail_1,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params && params.testimonial_id) {
      if (state) {
        if (params.page_id) {
          handlePageDetail(state.page_info);
        }
        setFormType("EDIT");
        setInputs(state.data);
        if (
          state.data.testimonial_type === "image" ||
          state.data.testimonial_type === "both"
        ) {
          setOldImage(state.data.images.thumbnail_1);
        }
      } else {
        getTestimonialDetailData();
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
  console.log(oldImage, "oldImage");
  console.log(state, "statestate");
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
          <h2>
            {moduleData?.add_page_heading ? (
              <h2>
                {formType === "ADD"
                  ? moduleData.add_page_heading
                  : moduleData.edit_page_heading}
              </h2>
            ) : (
              <h2>{`${formType === "ADD" ? "Add" : "Edit"} Testimonial`}</h2>
            )}
          </h2>
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
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              fullWidth
              required
              name="name"
              value={inputs.name}
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

          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">File Type *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="testimonial_type"
                value={inputs.testimonial_type}
                required
                label="File Type"
                onChange={handleChange}
              >
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="both">Both</MenuItem>
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
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Rating"
              variant="outlined"
              fullWidth
              type="number"
              onWheel={(event) => event.target.blur()}
              InputProps={{ inputProps: { min: 0, max: 5 } }}
              name="rating"
              value={inputs.rating}
              onChange={handleChange}
            />
          </div>
          {inputs.testimonial_type == "image" && (
            <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
              <div className="row w-100 div-style ms-0 pt-0">
                <div className="col-5">
                  <p className="">Upload Image *</p>
                  <FormHelperText className="pt-0">
                    Image Size(
                    {moduleSizes?.image_width +
                      " x " +
                      moduleSizes?.image_height}
                    ) ({handleImageExtensions(moduleSizes?.image_extension)})
                  </FormHelperText>
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
              {inputs?.image?.name == "" ? (
                ""
              ) : (
                <p className="text-secondary">{inputs?.image?.name}</p>
              )}
            </div>
          )}
          {inputs.testimonial_type == "video" && (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Video Url"
                variant="outlined"
                fullWidth
                required
                name="video_url"
                value={inputs.video_url}
                onChange={handleChange}
              />
            </div>
          )}
          {inputs.testimonial_type == "both" && (
            <>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Video Url"
                  variant="outlined"
                  fullWidth
                  name="video_url"
                  value={inputs.video_url}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Upload Image </p>
                    <FormHelperText className="pt-0">
                      Image Size(
                      {moduleSizes?.image_width +
                        " x " +
                        moduleSizes?.image_height}
                      ) ({handleImageExtensions(moduleSizes?.image_extension)})
                    </FormHelperText>
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
                {inputs?.image?.name == "" ? (
                  ""
                ) : (
                  <p className="text-secondary">{inputs?.image?.name}</p>
                )}
              </div>
            </>
          )}

          <div className="col-12 mt-5">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Short Description "
                multiline
                rows={6}
                name="description"
                value={inputs.description}
                onChange={handleChange}
              />
              <FormHelperText>Maximum limit 500 characters</FormHelperText>
            </FormControl>
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

export default AddOrUpdateWebPageTestimonial;
