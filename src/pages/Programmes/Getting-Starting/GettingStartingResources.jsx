import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Link,
  Typography,
  Tooltip,
  Stack,
  Button,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import { useParams, Link as RouterLink, useLocation } from "react-router-dom";

import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import { s3baseUrl, baseUri } from "src/config/config";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";
import { htmlDecode } from "src/utils/convertHtml";
import {
  deleteLessonDocumentApi,
  documentListApi,
  documentListApiSlug,
} from "src/DAL/lessonDocument/LessonDocument";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  csvImage,
  docImage,
  pdfImage,
  wordImage,
  audioImage,
  xlsxImage,
  otherImage,
} from "src/assets";
import { makeStyles } from "@mui/styles";
import CustomPopover from "src/components/MenuOption/CustomPopover";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import { lesson_detail_api } from "src/DAL/lessons/lessons";
import DocumentModelBox from "src/components/ModelBox/DocumentModelBox";
import {
  deleteResourceGettingStatedDoc,
  documenlsistingGettingSlug,
  Getting_starting_api,
} from "src/DAL/gettingStarting/GettingStarting";
import RecordNotFound from "src/components/RecordNotFound";
import Skeleton from "react-loading-skeleton";
const ITEM_HEIGHT = 48;

const imageLink = {
  docx: wordImage,
  mp3: audioImage,
  pdf: pdfImage,
  csv: csvImage,
  doc: docImage,
  xlsx: xlsxImage,
  xls: xlsxImage,
  other: otherImage,
};
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export const GettingStartingResources = () => {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteDoc, setDeleteDoc] = React.useState("");
  const [gettingStartedInfo, setGettingStartedInfo] = useState();
  const [lessonName, setlessonName] = useState("");
  const [previewDoc, setPreviewDoc] = React.useState("");
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [documentType, setDocumentType] = useState([]);

  let programName = gettingStartedInfo?.program[0]?._id?.title;
  let program_slug_navgation =
    gettingStartedInfo?.program[0]?._id?.program_slug;
  let breadCrumbMenu = [
    {
      title: "Programmes",
      navigation: `/programmes`,
      active: false,
    },
    {
      title: programName,
      navigation: `/programmes/programmes-detail/${program_slug_navgation}`,
      active: false,
    },
    {
      title: "Getting Started",
      navigation: `/programmes/${program_slug_navgation}/getting-started-list`,
      active: false,
    },
    {
      title: gettingStartedInfo?.title,
      navigation: `/programmes/getting-started-detail/${params.slug}`,
      active: false,
    },
    {
      title: "Getting Started Resources",
      navigation: null,
      active: true,
    },
  ];
  const handleOpen = (value) => {
    let path = "";
    if (value.document_type === "image") {
      path = value.document_images_url.thumbnail_1;
      setDocumentType(value.document_type);
      setImageUrl(s3baseUrl + path);
    } else if (value.document_type === "audio") {
      setPreviewDoc(value);
      path = value.document_file_url;

      setDocumentType(value.document_type);
      setImageUrl(s3baseUrl + path);
    } else if (value.document_type === "embed_code") {
      setPreviewDoc(value);
      setDocumentType(value.document_type);
      setImageUrl(s3baseUrl + path);
    } else {
      setDocumentType(value.document_type);
      setPreviewDoc(value);
      path = value.document_file_url;
      setImageUrl(s3baseUrl + path);
    }
    setOpen(true);
  };
  const handleCloseImage = () => {
    setImageUrl("");
    setOpen(false);
  };
  const handleDownload = async (value) => {
    let path = "";
    if (value.document_type === "image") {
      path = value.document_images_url.thumbnail_1;
    } else if (value.document_type === "audio") {
      path = value.document_file_url;
    } else {
      path = value.document_file_url;
    }
    setIsLoading(true);
    const file_path = `${s3baseUrl}${path}`;
    fetch(file_path)
      .then(async (res) => {
        if (res.status === 200) {
          let blob = await res.blob();
          saveAs(blob, path);
          setIsLoading(false);
        } else {
          enqueueSnackbar(res.statusText, { variant: "error" });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const handleEdit = (value) => {
    navigate(`/programmes/getting-started/${params.slug}/edit-document`, {
      state: value,
    });
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteResourceGettingStatedDoc(
      deleteDoc.document_slug
    );
    if (result.code === 200) {
      getDocument();
      setIsLoading(false);
      enqueueSnackbar("Getting Started Resource  deleted successfully.", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getDocument = async () => {
    setIsWaiting(true);
    let result = await documenlsistingGettingSlug(params.slug);
    if (result.code == 200) {
      setIsWaiting(false);
      setDocumentList(result.getting_started_documents);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsWaiting(false);
    }
  };
  const getResourceImage = (doc) => {
    if (doc.document_thumbnail) {
      return s3baseUrl + doc.document_thumbnail;
    } else if (doc.document_type == "image") {
      return s3baseUrl + doc?.document_images_url?.thumbnail_1;
    } else if (doc.document_type == "embed_code") {
      return otherImage;
    } else {
      const ext = doc.document_file_url?.split(".").pop();
      if (imageLink[ext]) {
        return imageLink[ext];
      } else {
        return imageLink.other;
      }
    }
  };
  const handleGetValue = () => {};
  const handleDetail = async () => {
    setIsLoading(true);

    let result = await Getting_starting_api(params?.slug);
    if (result.code === 200) {
      setlessonName(result.getting_started.title);
      setGettingStartedInfo(result.getting_started);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  useEffect(() => {
    getDocument();
    handleDetail();
  }, []);

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },

    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  // if (isWaiting) {
  //   return <CircularProgress className={classes.loading} color="primary" />;
  // }
  if (isWaiting) {
    return (
      <div className="container mt-2">
        <div className="row">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="col-sm-12 col-md-6 col-lg-6 mb-4" key={index}>
              <div className="card mt-1 pods-cards-shadow cursor h-100 ">
                <div className="row card-body">
                  <div className="col-3">
                    <Skeleton
                      height="80px" // Adjust this based on your image size
                      width="80px"
                      style={{ marginBottom: 10 }}
                      baseColor="#dddde8"
                      highlightColor="#ddd"
                    />
                  </div>
                  <div className="col-7" style={{ marginLeft: "20px" }}>
                    {" "}
                    <Skeleton
                      height={30}
                      width="60%"
                      style={{ marginBottom: 10 }}
                      className="h2-heading"
                      baseColor="#dddde8"
                      highlightColor="#9F00FF"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />

      <div className="container">
        <div className="row">
          <div className="col-12">
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

            <div
              className="col-12 mt-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <h1>Getting Started Resources</h1>
              </div>
              <div>
                <button
                  onClick={() =>
                    navigate(
                      `/programmes/getting-started/${params.slug}/add-document`
                    )
                  }
                  className="small-contained-button float-end mt-1"
                >
                  Add Resource
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-12 col-sm-12 text-end"></div>
          {documentList.length < 1 ? (
            <RecordNotFound title="Getting Started Resource" />
          ) : (
            documentList.map((value, i) => {
              return (
                <div className="col-sm-12 col-md-6 col-lg-6 mb-4" key={i}>
                  <div className="card  pods-cards-shadow cursor h-100 ">
                    {!value.status && (
                      <div
                        className="inactive-badge"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          backgroundColor: "red",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "16px 0 10px 0", // rounded bottom-right corner
                          zIndex: 1,
                          height: "25px",
                          fontSize: "12px",
                        }}
                      >
                        Inactive
                      </div>
                    )}
                    <div className="row card-body">
                      <div className="col-3">
                        <img
                          src={getResourceImage(value)}
                          className="pt-3 ps-3"
                          height="80px"
                          alt=""
                        />
                      </div>
                      <div className="col-7">
                        <div>
                          <h3 className="h2-heading">
                            {htmlDecode(value.title)}
                          </h3>
                        </div>
                        <p className="programme-card-desc mb-3">
                          {htmlDecode(value.detailed_description)}
                        </p>
                      </div>

                      <div className="col-2">
                        <div className="d-flex flex-column align-items-end">
                          <div
                            onClick={handleGetValue}
                            className="align-self-end"
                          >
                            <CustomPopover menu={MENU_OPTIONS} data={value} />
                          </div>
                          <div className="d-flex">
                            <div className="download-icon">
                              <Tooltip title="Preview">
                                <VisibilityIcon
                                  onClick={() => {
                                    handleOpen(value);
                                  }}
                                  className="icon-style"
                                />
                              </Tooltip>
                            </div>
                            {value.document_type != "embed_code" && (
                              <div className="download-icon">
                                <Tooltip title="Download">
                                  <DownloadIcon
                                    onClick={() => {
                                      handleDownload(value);
                                    }}
                                    className="icon-style"
                                  />
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <DocumentModelBox
        open={open}
        handleClose={handleCloseImage}
        image_url={imageUrl}
        type={documentType}
        previewDoc={previewDoc}
      />
    </>
  );
};
