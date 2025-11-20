import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";

import { useNavigate, Link as RouterLink } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import TinyEditor from "../../components/ckeditor/Ckeditor";
import { clientSettingApi } from "src/DAL/ClientSetting/ClientSetting";
import { s3baseUrl } from "src/config/config";
import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";
import { add_goal_settings } from "src/DAL/GrowthTools/GrowthTools";
import Skeleton from "react-loading-skeleton";
import SettingsSkelton from "src/components/allSkeleton/SettingsSkelton";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function GoalSettings() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoadingBack, setIsLoadingBack] = useState(false);
  const [isLoadingBadge, setIsLoadingBadge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [forgetPageImage, setForgetPageImage] = React.useState();
  const [verificationImage, setVerificationImage] = React.useState();
  const [clientGeneralSetting, setClientGeneralSetting] = useState();
  const [oldLoginImage, setOldLoginImage] = useState();
  const [OldForgetImage, setOldForgetImage] = useState();
  const [oldVerificationImage, setOldVerificationImage] = useState();
  const [loginStatus, setLoginStatus] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [forgetStatus, setForgetStatus] = useState(false);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [programDescriptionCk, setProgramDescriptionCk] = React.useState("");

  const [inputs, setInputs] = React.useState({
    loginImage: {},
    forgetImage: {},
    verificationImage: {},
    certificate_thanks_text: "",
    certificate_text: "",
    achievement_text: "",
    certificate_description: "",
  });

  const getGoalSettings = async () => {
    setIsPageLoading(true);
    const result = await clientSettingApi();
    if (result.code == 200) {
      let generalSetting = result?.content_setting?.certificate_setting;
      setInputs(generalSetting);

      setOldLoginImage(generalSetting?.certificate_background_image);
      setOldForgetImage(generalSetting?.certificate_batch_image);
      setOldVerificationImage(generalSetting?.certificate_signature_image);
      setDetailDescriptionCk(generalSetting?.certificate_heading);

      setIsPageLoading(false);
    }
  };

  const fileChangedHandlerLogin = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setLoginStatus(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", "1920");
    setIsLoadingBack(true);
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["loginImage"]: imageUpload.image_path,
      });
      setIsLoadingBack(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingBack(false);
    }
  };

  const fileChangedHandlerForgetPassword = async (e) => {
    setForgetPageImage(URL.createObjectURL(e.target.files[0]));
    setForgetStatus(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", "256");
    setIsLoadingBadge(true);
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["forgetImage"]: imageUpload.image_path,
      });
      setIsLoadingBadge(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoadingBadge(false);
    }
  };
  const fileChangedHandlerVerification = async (e) => {
    setVerificationImage(URL.createObjectURL(e.target.files[0]));
    setVerificationStatus(true);
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("width", "1920");
    setIsLoading(true);
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["verificationImage"]: imageUpload.image_path,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs?.certificate_text?.length > 15) {
      enqueueSnackbar(
        "Maximum 15 characters are allowed in certificatate top text including spaces",
        { variant: "error" }
      );
      return;
    }
    if (inputs.achievement_text.length > 20) {
      enqueueSnackbar(
        "Maximum 20 characters are allowed in achievement text including spaces",
        { variant: "error" }
      );
      return;
    }
    if (inputs.certificate_description.length > 35) {
      enqueueSnackbar(
        "Maximum 35 characters are allowed in certificate description including spaces",
        { variant: "error" }
      );
      return;
    }

    if (inputs.certificate_thanks_text.length > 35) {
      enqueueSnackbar(
        "Maximum 35 characters are allowed in certificate thanks text including spaces",
        { variant: "error" }
      );
      return;
    }

    setIsPageLoading(true);
    var postData = {
      certificate_description: inputs.certificate_description,
      certificate_thanks_text: inputs.certificate_thanks_text,
      certificate_text: inputs.certificate_text, //thanks text
      achievement_text: inputs.achievement_text, //thanks text
      certificate_signature_image: inputs.verificationImage // signature image
        ? inputs.verificationImage
        : oldVerificationImage,
      certificate_batch_image: inputs.forgetImage //badge image
        ? inputs.forgetImage
        : OldForgetImage,
      certificate_background_image: inputs.loginImage
        ? inputs.loginImage
        : oldLoginImage, //background image
    };

    let Data = {
      certificate_setting: postData,
    };
    console.log(postData, "postDatapostDatapostData");
    setIsPageLoading(true);
    const result = await add_goal_settings(Data);
    if (result.code === 200) {
      //   getGoalSettings();
      enqueueSnackbar(result.message, { variant: "success" });
      setIsPageLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsPageLoading(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  React.useEffect(() => {
    getGoalSettings();
  }, []);

  return (
    <div className="container">
      <div className="row mobile-margin display-flex"></div>
      <div className="row">
        <div className="col-6">
          <h2>Goal Settings</h2>
        </div>
      </div>
      {isPageLoading ? (
        <SettingsSkelton />
      ) : (
        // <div class="card main-card">
        //   <div class="card-body">
        //     <div className="row mt-2 ">
        //       <div
        //         className="col-lg-12  mt-4"
        //         style={{ display: "flex", justifyContent: "space-between" }}
        //       >
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={200}
        //             height={60}
        //             style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //         <div style={{ marginRight: "10px" }}>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={60}
        //             height={80}
        //           />
        //         </div>
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#9F00FF"
        //             width={100}
        //             height={60}
        //             // style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //       </div>{" "}
        //       <div
        //         className="col-lg-12  mt-4"
        //         style={{ display: "flex", justifyContent: "space-between" }}
        //       >
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={200}
        //             height={60}
        //             style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //         <div style={{ marginRight: "10px" }}>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={60}
        //             height={80}
        //           />
        //         </div>
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#9F00FF"
        //             width={100}
        //             height={60}
        //             // style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //       </div>{" "}
        //       <div
        //         className="col-lg-12  mt-4"
        //         style={{ display: "flex", justifyContent: "space-between" }}
        //       >
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={200}
        //             height={60}
        //             style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //         <div style={{ marginRight: "10px" }}>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#ddd"
        //             width={60}
        //             height={80}
        //           />
        //         </div>
        //         <div>
        //           <Skeleton
        //             baseColor="#fff"
        //             highlightColor="#9F00FF"
        //             width={100}
        //             height={60}
        //             // style={{ borderRadius: "12px" }}
        //           />
        //         </div>
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={50}
        //           style={{ borderRadius: "10px" }}
        //         />
        //       </div>
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={50}
        //           style={{ borderRadius: "10px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={50}
        //           style={{ borderRadius: "10px" }}
        //         />
        //       </div>{" "}
        //       <div className="col-lg-12 col-md-6 col-sm-12 mt-4 h-100vh mt-2">
        //         <Skeleton
        //           baseColor="#dddde8"
        //           highlightColor="#fff"
        //           width="100%"
        //           height={50}
        //           style={{ borderRadius: "10px" }}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div class="card main-card">
          <div class="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                  <div className="row w-100 div-style ms-0 pt-0">
                    <div className="col-5">
                      <p className="">Certificate Background Image * </p>
                      <FormHelperText className="pt-0">
                        Recommended Size(1920 X 1080) ("JPG", "JPEG",
                        "PNG","WEBP")
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {file ? (
                        <img src={file} height="50" />
                      ) : (
                        oldLoginImage && (
                          <img src={s3baseUrl + oldLoginImage} height="50" />
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
                          onChange={fileChangedHandlerLogin}
                        />

                        <Button
                          className="small-contained-button-search"
                          startIcon={<FileUploadIcon />}
                          component="span"
                        >
                          {isLoadingBack ? "Uploading..." : "Upload"}
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
                    <div className="col-5">
                      <p className="">Certificate Badge Image *</p>
                      <FormHelperText className="pt-0">
                        Recommended Size (1920 X 1080) ("JPG", "JPEG",
                        "PNG","WEBP")
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {forgetPageImage ? (
                        <img src={forgetPageImage} height="50" />
                      ) : (
                        OldForgetImage && (
                          <img src={s3baseUrl + OldForgetImage} height="50" />
                        )
                      )}
                    </div>
                    <div className="col-5 text-end pt-2">
                      <label htmlFor="contained-button-file1">
                        <Input
                          accept="image/*"
                          id="contained-button-file1"
                          multiple
                          type="file"
                          name="image"
                          onChange={fileChangedHandlerForgetPassword}
                        />

                        <Button
                          className="small-contained-button-search"
                          startIcon={<FileUploadIcon />}
                          component="span"
                        >
                          {isLoadingBadge ? "Uploading..." : "Upload"}
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
                    <div className="col-5">
                      <p className="">Certificate Signature Image *</p>
                      <FormHelperText className="pt-0">
                        Recommended Size (1920 X 1080) ("JPG", "JPEG",
                        "PNG","WEBP")
                      </FormHelperText>
                    </div>
                    <div className="col-2">
                      {verificationImage ? (
                        <img src={verificationImage} height="50" />
                      ) : (
                        oldVerificationImage && (
                          <img
                            src={s3baseUrl + oldVerificationImage}
                            height="50"
                          />
                        )
                      )}
                    </div>
                    <div className="col-5 text-end pt-2">
                      <label htmlFor="contained-button-file2">
                        <Input
                          accept="image/*"
                          id="contained-button-file2"
                          multiple
                          type="file"
                          name="image"
                          onChange={fileChangedHandlerVerification}
                        />

                        <Button
                          className="small-contained-button-search"
                          startIcon={<FileUploadIcon />}
                          component="span"
                        >
                          {isLoading ? "Uploading..." : "Upload"}
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

                <div className="col-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Certificate Top Text"
                    variant="outlined"
                    fullWidth
                    required
                    name="certificate_text"
                    value={inputs.certificate_text}
                    onChange={handleChange}
                    error={inputs?.certificate_text?.length > 15 ? true : false}
                    helperText={
                      inputs.certificate_text?.length > 15
                        ? "Maximum 15 characters allowed including spaces."
                        : ""
                    }
                  />
                </div>
                <div className="col-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Achievement Text"
                    variant="outlined"
                    fullWidth
                    required
                    name="achievement_text"
                    value={inputs.achievement_text}
                    onChange={handleChange}
                    error={inputs.achievement_text.length > 20 ? true : false}
                    helperText={
                      inputs.achievement_text.length > 20
                        ? "Maximum 20 characters allowed including spaces."
                        : ""
                    }
                  />
                </div>
                <div className="col-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Certificate Description"
                    variant="outlined"
                    fullWidth
                    required
                    name="certificate_description"
                    value={inputs.certificate_description}
                    onChange={handleChange}
                    error={
                      inputs.certificate_description.length > 35 ? true : false
                    }
                    helperText={
                      inputs.certificate_description.length > 35
                        ? "Maximum 35 characters allowed including spaces."
                        : ""
                    }
                  />
                </div>
                <div className="col-12 mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Certificate Thanks Text"
                    variant="outlined"
                    fullWidth
                    required
                    name="certificate_thanks_text"
                    value={inputs.certificate_thanks_text}
                    onChange={handleChange}
                    error={
                      inputs.certificate_thanks_text.length > 35 ? true : false
                    }
                    helperText={
                      inputs.certificate_thanks_text.length > 35
                        ? "Maximum 35 characters allowed including spaces."
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="text-end mt-4">
                <button className="small-contained-button-search">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
