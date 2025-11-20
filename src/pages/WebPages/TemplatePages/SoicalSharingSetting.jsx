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
import {
  IconButton,
  Divider,
  CircularProgress,
  TextareaAutosize,
} from "@mui/material";
import TinyEditor from "src/components/ckeditor/Ckeditor";
import { s3baseUrl } from "src/config/config";
// import {
//   addPageApi,
//   detailPageApi,
//   editPageApi,
//   socail_links,
//   templateListingApi,
// } from "src/DAL/WebsitePages/websitepages";
import {
  detailPageApi,
  socailSharingUpdateApi,
} from "src/DAL/WebsitePages/websitepages";

import { uploadImageOns3 } from "src/DAL/commonApi/commonApi";

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

export default function SocialSharingSetting() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { state } = useLocation();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [iswaiting, setiswaiting] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState("Controlled");
  const [pageName, setPageName] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [fb, setFBImage] = React.useState();
  const [instagram, setInstagramImage] = React.useState();
  const [linkedInImage, setLinkedInImage] = React.useState();
  const [twitterImage, setTwitterImage] = React.useState();
  const [audioFile, setAudio] = React.useState();
  const [groups, setGroups] = React.useState([]);
  const [programList, setProgramList] = React.useState([]);
  const [menuLists, setMenuList] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const [programName, setProgramName] = React.useState("");
  const [vaultName, setVaultName] = React.useState("");
  const [navItems, setNavitems] = React.useState([]);
  const [detailDescriptionCk, setDetailDescriptionCk] = React.useState("");
  const [oldFb, setOldFb] = useState("");
  const [oldLinkedIn, setOldLinkedIn] = useState("");
  const [oldTwitter, setOldTwitter] = useState("");
  const [oldInstagram, setOldInstagram] = useState("");
  const [templates, setTemplates] = React.useState([]);
  const [pageSlug, setPageSlug] = useState("");
  const [shortDescriptionCk, setShortDescriptionCk] = useState("");
  const [menuItemsLists, setMenuItemsList] = React.useState([]);
  const [oldImage, setOldImage] = useState();
  const [inputs, setInputs] = React.useState({
    title: "",
    link: "",
    plan_image: "",
  });

  const fileChangedHandler = async (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("width", "823");
    formData.append("height", "363");
    const imageUpload = await uploadImageOns3(formData);
    if (imageUpload.code == 200) {
      setInputs({
        ...inputs,
        ["plan_image"]: imageUpload.image_path,
      });
    } else {
      enqueueSnackbar(imageUpload.message, { variant: "error" });
    }
  };
  const getPageDetail = async () => {
    setIsLoading(true);
    const result = await detailPageApi(params.page_id);

    if (result.code == 200) {
      setPageSlug(result?.sale_page?.sale_page_title_slug);
      // setInputs({
      //   ...inputs,
      //   ["template_type"]: result?.sale_page?.template?.template_slug,
      // });
      setPageName(result?.sale_page?.sale_page_title);
      setShortDescriptionCk(result?.sale_page?.social_sharing?.description);
      setOldImage(result?.sale_page?.social_sharing?.icon);
      setOldFb(result?.sale_page.brand_logo);
      setOldTwitter(result?.sale_page.footer_logo);
      setOldInstagram(result?.sale_page.brand_favicon);
      setInputs({
        ...inputs,
        ["title"]: result?.sale_page?.social_sharing?.title,
        // ["link"]: result?.sale_page?.social_sharing?.link,
      });
    }
    setIsLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data_obj = {
      title: inputs.title,
      // link: inputs.link,
      description: shortDescriptionCk,
      icon: file ? inputs.plan_image : oldImage,
    };
    let social_sharing = {
      social_sharing: data_obj,
    };
    setIsLoading(true);
    const result = await socailSharingUpdateApi(
      social_sharing,
      params?.page_id
    );

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
  React.useEffect(() => {
    getPageDetail();
  }, []);

  React.useEffect(() => {}, []);

  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12 d-flex">
          <IconButton
            className="back-screen-button d-flex"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
          <h3 className="pt-2 page-name">{pageName ? pageName : ""}</h3>
        </div>
        <div className="col-12">
          <h2>Social Sharing Setting</h2>
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
                  name="title"
                  required
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Link"
              variant="outlined"
              fullWidth
              name="link"
              required
              type="url"
              value={inputs.link}
              onChange={handleChange}
            />
          </div> */}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <div className="row w-100 div-style ms-0 pt-0">
                  <div className="col-5">
                    <p className="">Icon </p>
                    <FormHelperText className="pt-0">
                      Icon Size(250 X 250) ("JPG", "JPEG", "PNG","WEBP")
                    </FormHelperText>
                  </div>
                  <div className="col-3 pt-3">
                    {file ? (
                      <img className="image-border" src={file} width={50} />
                    ) : (
                      oldImage && (
                        <img
                          className="image-border"
                          src={s3baseUrl + oldImage}
                          width={50}
                        />
                      )
                    )}
                  </div>
                  <div className="col-4 text-end pt-2">
                    <label htmlFor="contained-button-file">
                      <Input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        name="plan_image"
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
                {/* {inputs?.plan_image == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.plan_image}</p>
            )} */}
              </div>
              <div className="col-12 mt-4">
                <TextField
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={6}
                  name="description"
                  required
                  value={shortDescriptionCk}
                  onChange={(e) => setShortDescriptionCk(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button className="small-contained-button">Submit</button>
        </div>
      </form>
    </div>
  );
}
