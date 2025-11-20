import React, { useEffect, useMemo, useState, useRef } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import profileImg from "../../assets/images/profileImg.png";
import R from "../../assets/images/R.jpeg";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSnackbar } from "notistack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import { TimeZones } from "src/utils/constants";
// import { EditProfileApi, memberDetail } from "src/DAL/Profile/Profile";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  CircularProgress,
  FormHelperText,
  inputClasses,
} from "@mui/material";
// import countryList from "react-select-country-list";
import { get_root_value } from "src/utils/domUtils";
import { s3baseUrl } from "src/config/config";

import { DatePicker, LocalizationProvider } from "@mui/lab";
import moment from "moment";
import { editProfileApi } from "src/DAL/EditProfile/EditProfile";
import { htmlDecode } from "src/utils/convertHtml";
import { useMode } from "src/Hooks/ModeContext";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import EditPhoto from "src/components/MenuOption/EditPhoto";
// import { _get_user_from_localStorage } from "src/DAL/localstorage/LocalStorage";
// import { EditProfileApi, GetProfileApi } from "src/DAL/Profile/Profile";
// import { useContentSetting } from "src/Hooks/ContentSettingState";
// import { TimeZones } from "src/utils/constants";

const Input = styled("input")({
  display: "none",
});

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
  paper: {
    background: get_root_value("--popup-background-color"),
    color: get_root_value("--input-text-color"),
  },
}));

function EditProfile(props) {
  const classes = useStyles();
  //   const { userInfo, setUserInfo, handleSetUserInfo } = useContentSetting();
  const { mode, handleChangeMode, setProfileNewImage, profileNewImage } =
    useMode();
  const { enqueueSnackbar } = useSnackbar();
  const [previews, setPreviews] = useState("");
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apimage, setApiImage] = useState("");
  const [file, setProfileImage] = React.useState({});
  const [imageStatus, setImageStatus] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const [oldProfile, setOldProfile] = useState();
  const myInputRef = useRef(null);
  const [adminData, setAdminData] = useState({
    first_name: "",
    image: "",
    email: "",
  });

  // const options = useMemo(() => countryList().getData(), []);
  // const user_profile = _get_user_from_localStorage();

  const consultantProfile = async () => {
    const result = await "";
    if (result.code === 200) {
      localStorage.setItem("admin_time_zone", JSON.stringify(result.time_zone));
      setUserProfile(result.consultant);
      handleSetUserInfo(result.consultant);
      setMemberData(result.consultant);
      // setUserInfo(result.consultant);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const MENU_OPTIONS = [
    {
      label: "Update Image",
      icon: "akar-icons:edit",
      handleClick: () => {
        myInputRef.current.click();
      },
    },
    {
      label: "View Profile",
      icon: "line-md:image",
      handleClick: handleOpen,
    },
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", adminData.first_name);
    formData.append("email", adminData.email);
    if (imageStatus) {
      formData.append("image", file);
    }
    const result = await editProfileApi(formData);
    if (result.code === 200) {
      console.log("Edit Profile  :", result);
      localStorage.setItem(`name`, result?.admin?.name);
      if (imageStatus) {
        // console.log("dsfksadjflkas", result?.admin.image?.thumbnail_1);
        localStorage.setItem(`image`, result?.admin.image?.thumbnail_1);
        setProfileNewImage(result?.admin.image?.thumbnail_1);
      }
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
    setIsLoading(false);
  };
  const handleUploadFile = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAdminData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleUpload = (event) => {
    // console.log("dsfksadjflkas", event.target.files[0]);
    setImageStatus(true);
    // setImage(event.target.files[0]);
    setProfileImage(event.target.files[0]);
    const preview = URL.createObjectURL(event.target.files[0]);
    setPreviews(preview);
  };

  useEffect(() => {
    console.log(s3baseUrl + localStorage.getItem("image"), "dfajslkdjfa");
    setOldProfile(localStorage.getItem("image"));
    setAdminData({
      ...adminData,
      ["first_name"]: htmlDecode(localStorage.getItem("name")),
      ["email"]: htmlDecode(localStorage.getItem("email")),
    });
  }, []);
  useEffect(() => {
    consultantProfile();
  }, []);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <div className="container">
      {open && (
        <div className="image-popup">
          <span className="cross" onClick={handleClose}>
            x
          </span>
          <img
            className="image-border"
            src={previews ? previews : s3baseUrl + oldProfile}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
      <form onSubmit={handleUpdate}>
        <div className="mt-4 mb-4 d-flex justify-content-center">
          <div className="">
            <div className=" image d-flex flex-column justify-content-center align-items-center">
              <div className="edit-profile-icon">
                <Avatar
                  alt={adminData.first_name}
                  src={previews ? previews : s3baseUrl + oldProfile}
                  sx={{ width: 110, height: 110 }}
                />
                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    name="profile_image"
                    onChange={(e) => handleUpload(e)}
                  />
                  <IconButton
                    className="edit-profile-icon-position"
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    {/* <PhotoCamera
                      sx={{ width: 85, height: 85 }}
                      className="camera"
                    /> */}

                    {/* <IconButton
                      className="edit-profile-icon-positions"
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton> */}
                  </IconButton>
                </label>

                <span
                  // className="small-contained-button"
                  style={{
                    position: "absolute",
                    bottom: "31px",
                    right: "-4px",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    padding: "4px 5px",
                  }}
                >
                  <EditPhoto menu={MENU_OPTIONS} />
                  <input
                    hidden
                    type="file"
                    ref={myInputRef}
                    onChange={handleUpload}
                  />
                </span>
              </div>
              <div className="row w-100 mt-3">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      name="first_name"
                      value={adminData.first_name}
                      onChange={(e) => handleChange(e)}
                      required={true}
                    />
                  </div>
                </div>{" "}
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="mt-4">
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      name="email"
                      value={adminData.email}
                      onChange={(e) => handleChange(e)}
                      required={true}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 ms-auto">
                <button className="small-contained-button-search mt-4 ">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
