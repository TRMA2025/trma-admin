import React, { useEffect, useState } from "react";
import { Tooltip, CircularProgress } from "@mui/material";
import { useParams, Link as RouterLink, useLocation } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { s3baseUrl, baseUri } from "src/config/config";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";
import { htmlDecode } from "src/utils/convertHtml";
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
import { deleteProgrammeDocumentApi } from "src/DAL/Programme/Programme";
import RecordNotFound from "src/components/RecordNotFound";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import DocumentModelBox from "src/components/ModelBox/DocumentModelBox";
import {
  delete_challenges_resources,
  list_challenge_resources,
} from "src/DAL/GrowthTools/Challenges";

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

export default function ChallengeResources() {
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useLocation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteDoc, setDeleteDoc] = React.useState("");
  const [previewDoc, setPreviewDoc] = React.useState("");
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const handleOpen = (value) => {
    console.log(value, "==== value ====");

    let path = "";
    if (value.resource_type === "audio") {
      setPreviewDoc(value);
      path = value.resource_file;
      setDocumentType(value.resource_type);
      setImageUrl(s3baseUrl + path);
    } else if (value.resource_type === "embed_code") {
      setPreviewDoc(value);
      setDocumentType(value.resource_type);
      setImageUrl(s3baseUrl + path);
    } else {
      setDocumentType(value.resource_type);
      setPreviewDoc(value);
      path = value.resource_file;
      setImageUrl(s3baseUrl + path);
    }
    setOpen(true);
  };
  const handleCloseImage = () => {
    setImageUrl("");
    setOpen(false);
  };

  let breadCrumbMenu = [
    {
      title: "Challenges",
      navigation: `/challenges`,
      active: false,
    },
    {
      title: `${state?.title}`,
      navigation: `/challenge-detail/${params.id}`,
      active: false,
    },
    {
      title: "Challenge Resources",
      navigation: null,
      active: true,
    },
  ];
  const handleDownload = async (value) => {
    let path = "";
    if (value.resource_type === "audio") {
      path = value.resource_file;
    } else {
      path = value.resource_file;
    }
    setIsLoading(true);
    const file_path = `${s3baseUrl}${path}`;
    console.log(file_path, "file_path");
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
      .catch((err) => {});
  };
  const handleEdit = (value) => {
    navigate(`/challenge/${params.id}/challenge-resources-edit/${value._id}`, {
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
    const result = await delete_challenges_resources(deleteDoc._id);
    if (result.code === 200) {
      getDocument();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const getDocument = async () => {
    setIsWaiting(true);
    let result = await list_challenge_resources(params.id);
    if (result.code == 200) {
      setIsWaiting(false);
      setDocumentList(result.challenge_resource);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsWaiting(false);
    }
  };
  const getResourceImage = (doc) => {
    if (doc.resource_thumbnail) {
      return s3baseUrl + doc.resource_thumbnail;
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
  useEffect(() => {
    getDocument();
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

  if (isWaiting) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
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

            <button
              onClick={() =>
                navigate(`/challenge/${params.id}/challenge-resources-add`)
              }
              className="small-contained-button float-end mt-1">
              Add Resource
            </button>
          </div>
          <div className="col-12">
            <h1>Challenge Resources</h1>
          </div>
          <div className="col-lg-12 col-sm-12 text-end"></div>

          {documentList.length < 1 ? (
            <RecordNotFound title="Resources" />
          ) : (
            documentList?.map((value, i) => {
              return (
                <div className="col-sm-12 col-md-6 col-lg-6 mb-4" key={i}>
                  <div className="card mt-4 pods-cards-shadow cursor h-100 ">
                    <div className="row card-body">
                      <div className="col-3">
                        <img
                          src={getResourceImage(value)}
                          className="ps-3"
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
                          {htmlDecode(value.description)}
                        </p>
                      </div>
                      <div className="col-2">
                        <div className="d-flex flex-column align-items-end">
                          <div
                            onClick={handleGetValue}
                            className="align-self-end">
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
                            {value.resource_type != "embed_code" && (
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
}
