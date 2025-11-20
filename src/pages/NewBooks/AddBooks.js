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
import { activeMemberListing } from "../../DAL/member/member";
import Autocomplete from "@mui/material/Autocomplete";

import { useNavigate, Link as RouterLink } from "react-router-dom";
import { IconButton, CircularProgress } from "@mui/material";
import { programmeListing } from "src/DAL/Programme/Programme";
import { pdfImage } from "src/assets";
import {
  AddBooksApi,
  UnassignedMembersAgainstProgram,
  UploadPdfFile,
} from "src/DAL/Books/Books";

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

export default function AddBooks() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setProfileImage] = React.useState();
  const [groupListing, setGroupListing] = React.useState([]);
  const [groupsName, setGroupsName] = React.useState([]);
  const [member, setMember] = React.useState([]);
  const [otherDocument, setOtherDocument] = React.useState();

  const [inputs, setInputs] = React.useState({
    title: "",
    status: "true",
    image: {},
    short_description: "",
    pdfPath: "",
    otherDocument: {},
  });

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  const getPrograms = async () => {
    setIsLoading(true);
    const result = await programmeListing();
    if (result.code === 200) {
      setGroupListing(result.program);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const getMember = async () => {
    let group_array = [];
    groupsName?.map((group) => {
      group_array.push(group);
    });
    let postData = {
      programms: group_array,
    };
    const result = await UnassignedMembersAgainstProgram(postData);
    if (result.code === 200) {
      console.log(result, "list of member");
      setPersonName(result.members);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
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
  const fileChangedHandlerOther = async (e) => {
    setOtherDocument(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["otherDocument"]: e.target.files[0],
    });
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const pdfUpload = await UploadPdfFile(formData);
    if (pdfUpload.code == 200) {
      setInputs({
        ...inputs,
        ["pdfPath"]: pdfUpload.path,
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let group_array = [];
    groupsName.map((group) => {
      group_array.push(group);
    });
    let selected_member_array = [];
    member.map((member) => {
      selected_member_array.push(member._id);
    });
    const formData = new FormData();
    formData.append("name", inputs.title);
    if (file) {
      formData.append("image", inputs.image);
    }
    formData.append("description", inputs.short_description);
    formData.append("status", inputs.status);
    formData.append("programms", JSON.stringify(group_array));
    formData.append("members", JSON.stringify(selected_member_array));
    formData.append("pdf_file", inputs.pdfPath);

    console.log(...formData, "formDataformDataformData");
    if (inputs.short_description.length > 500) {
      enqueueSnackbar("Short Description Must Be Less Than 500 Characters", {
        variant: "error",
      });
    } else {
      if (!file) {
        enqueueSnackbar("Image Is Required", {
          variant: "error",
        });
      } else {
        if (inputs.pdfPath == "") {
          enqueueSnackbar("PDF File Is Required", {
            variant: "error",
          });
        } else {
          setIsLoading(true);
          const result = await AddBooksApi(formData);
          if (result.code === 200) {
            enqueueSnackbar(result.message, { variant: "success" });
            navigate(-1);
          } else {
            enqueueSnackbar(result.message, { variant: "error" });
            setIsLoading(false);
          }
        }
      }
    }
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  React.useEffect(() => {
    getPrograms();
    getMember();
  }, []);
  React.useEffect(() => {
    getMember();
  }, [groupsName]);

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
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2>Add Book</h2>
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
              <InputLabel id="demo-simple-select-label">Status*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                value={inputs.status}
                label="Status*"
                onChange={handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>InActive</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12">
            <FormControl className="mt-3" fullWidth>
              <InputLabel id="demo-multiple-name-label">Programmes</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={groupsName}
                onChange={handleChangeGroup}
                input={<OutlinedInput label="Programmes" />}
                MenuProps={MenuProps}
              >
                {groupListing.map((name) => (
                  <MenuItem
                    key={name}
                    value={name._id}
                    style={getStyles(name, groupsName, theme)}
                  >
                    {name.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={personName}
              getOptionLabel={(option) =>
                option.first_name + " (" + option.email + ")"
              }
              filterSelectedOptions
              value={member}
              onChange={(event, newValue) => {
                setMember(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Members" placeholder="Members" />
              )}
            />
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Image *</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-1">
                {file && <img src={file} height={50}></img>}
              </div>
              <div className="col-6 text-end pt-2">
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
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs.image.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs.image.name}</p>
            )}
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload PDF*</p>
                <FormHelperText className="pt-0">
                  Upload Book PDF
                </FormHelperText>
              </div>
              <div className="col-2">
                {otherDocument && <img src={pdfImage} height="50" />}
              </div>
              <div className="col-5 text-end pt-2 link-button">
                <label htmlFor="contained-button-file-other">
                  <Input
                    accept=".pdf"
                    id="contained-button-file-other"
                    multiple
                    type="file"
                    name="otherDocument"
                    onChange={fileChangedHandlerOther}
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
            {inputs.otherDocument.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs.otherDocument.name}</p>
            )}
          </div>
          <div className="col-12 mt-2">
            <FormControl fullWidth required>
              <TextField
                id="outlined-multiline-flexible"
                label="Short Description"
                multiline
                rows={6}
                required
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
              <FormHelperText>Maximum limit 500 characters</FormHelperText>
            </FormControl>
          </div>

          <div className="text-end mt-4">
            <button className="small-contained-button">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}
