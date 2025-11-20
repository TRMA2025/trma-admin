import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import {
  Container,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import { s3baseUrl } from "src/config/config";
import { bookDetail, deleteBookApi } from "src/DAL/book";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";

import { useSnackbar } from "notistack";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import { makeStyles } from "@mui/styles";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import { color } from "@mui/system";
import CustomPopover from "src/components/MenuOption/CustomPopover";
import FileViewer from "react-file-viewer";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
const ITEM_HEIGHT = 48;

function BookDetail(props) {
  const classes = useStyles();
  const { state } = useLocation();
  console.log(state, "state ");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [isLoading, setIsLoading] = useState(false);
  const [programmeDetailInfo, setProgrammeDetailInfo] = useState();
  const [extensionUrl, setExtensionUrl] = useState("");
  const canvasRef = useRef(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  // const getDocumentUrl = (fileUrl) => {
  //   const extension = fileUrl?.split(".")?.pop();
  //   if (["pdf"].includes(extension)) {
  //     return s3baseUrl + fileUrl;
  //   } else if (["doc", "docx", "xls", "xlsx", "csv"].includes(extension)) {
  //     return s3baseUrl + fileUrl;
  //   }
  //   return s3baseUrl + fileUrl;
  // };
  const filePath = s3baseUrl + programmeDetailInfo?.document_file;

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);
  const fileName = programmeDetailInfo?.document_file?.split("/").pop();
  let extension = fileName?.split(".").pop().toLowerCase();
  const fileExtensionsMap = {
    doc: "docx",
    xls: "xlsx",
    ppt: "pptx",
  };
  extension = fileExtensionsMap[extension] || extension;
  console.log(extension, "extensionextensionextension");

  const fileNameUrl = programmeDetailInfo?.external_url?.split("/").pop();
  console.log(extensionUrl, "extensionUrlextensionUrlextensionUrl");

  const handleNavigateEdit = () => {
    navigate(`/books/${state?.detailValues._id}/edit-book`, {
      state: programmeDetailInfo,
    });
  };
  const handleDelete = async () => {
    let result = await deleteBookApi(state?.detailValues._id);
    if (result.code === 200) {
      handleCloseDelete();
      enqueueSnackbar(result.message, { variant: "success" });
      navigate("/books");
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      handleCloseDelete();
    }
  };
  console.log(state, "statestate");

  const handleDetail = async () => {
    setIsLoading(true);
    try {
      let result = await bookDetail(state?.detailValues?._id);
      console.log(result, "resultresultresult");
      if (result.code === 200) {
        setProgrammeDetailInfo(result?.data);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      console.error("errorerror", error);
      enqueueSnackbar("error", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const filePathViewr = programmeDetailInfo?.external_url;
  console.log(filePathViewr, "filePathViewr external url");

  useEffect(() => {
    handleDetail();
  }, []);

  // useEffect(() => {
  //   const checkPdfAvailability = async () => {
  //     try {
  //       const response = await fetch(programmeDetailInfo?.external_url, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/pdf",
  //         },
  //       });
  //       console.log(response, "rseresresrse");
  //       if (!response.ok) {
  //         throw new Error(response);
  //       }
  //     } catch (error) {
  //       console.error("error from here", error);
  //     } finally {
  //       // setIsLoading(false);
  //     }
  //   };

  //   if (programmeDetailInfo?.external_url) {
  //     checkPdfAvailability();
  //   }
  // }, [programmeDetailInfo]);

  const docs = [{ uri: state?.detailValues?.external_url }];
  console.log(docs, "docsdocsdocsdocsdocs");

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleNavigateEdit,
    },

    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleOpenDelete,
    },
  ];

  // useEffect(() => {
  //   setIsLoaded(false);
  // }, [programmeDetailInfo]);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(
    programmeDetailInfo,
    "programmeDetailInfoprogrammeDetailInfoprogrammeDetailInfo"
  );
  let breadCrumbMenu = [
    { title: "Books", navigation: `/books`, active: false },
    { title: programmeDetailInfo?.title, navigation: null, active: true },
  ];
  const randomParam = Math.random();
  console.log(breadCrumbMenu, "breadCrumbMenubreadCrumbMenubreadCrumbMenu");

  return (
    <>
      <div className="container">
        <div className="row mobile-margin display-flex">
          <div className="col-12">
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-2">
              <img
                width={120}
                height="auto"
                src={s3baseUrl + programmeDetailInfo?.image}
                alt="Group Image"
                className="img-fluid"
              />
            </div>
            <div className="col-9">
              <div>
                <h5 className="card-title">{programmeDetailInfo?.title}</h5>
                <div
                  dangerouslySetInnerHTML={{
                    __html: programmeDetailInfo?.detailed_description,
                  }}
                ></div>
              </div>
            </div>
            <div className="col-1" style={{ textAlign: "end" }}>
              <CustomPopover menu={MENU_OPTIONS} data={programmeDetailInfo} />
            </div>
          </div>
        </div>
        <div>
          {programmeDetailInfo?.tags?.length > 0 && (
            <div className="tags-section">
              <div
                className="tags d-flex flex-wrap"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                <p
                  className="mt-2"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "white",
                    marginRight: "8px",
                  }}
                >
                  Book Tags:
                </p>
                {programmeDetailInfo.tags.map((tag) => (
                  <Chip
                    key={tag._id}
                    label={tag.name}
                    style={{
                      margin: "4px",
                      color: "black",
                      backgroundColor: "white",
                      fontWeight: "bold",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="books-detail-document">
          {programmeDetailInfo && programmeDetailInfo.type === "document_file" && (
            <div className="other-resource" style={{ overflow: "hidden" }}>
              {/* {["pdf", "csv"].includes(
                programmeDetailInfo.document_file.split(".").pop().toLowerCase()
              ) ? (
                <FileViewer
                  fileType={extension}
                  filePath={getDocumentUrl(programmeDetailInfo.document_file)}
                />
              ) : ( */}
              <DocViewer
                documents={[
                  {
                    uri: filePath,
                  },
                ]}
                pluginRenderers={DocViewerRenderers}
              />
              {/* )} */}
            </div>
          )}
          {programmeDetailInfo?.type === "embed_code" &&
            programmeDetailInfo?.embed_code && (
              <iframe
                className="other-resource"
                width="100%"
                height="600px"
                frameBorder="0"
                preload="auto"
                srcDoc={programmeDetailInfo.embed_code}
                title="Embedded Document"
              ></iframe>
            )}
        </div>
        <div className="books-detail-document col-12">
          {programmeDetailInfo && programmeDetailInfo?.type === "external_url" && (
            <>
              {console.log(
                programmeDetailInfo,
                docs,
                "programmeDetailInfoprogrammeDetailInfo"
              )}
              <DocViewer
                // documents={docs}
                documents={[
                  {
                    uri: programmeDetailInfo?.external_url,
                    fileType: "pdf",
                  },
                ]}
                // pluginRenderers={DocViewerRenderers}
              />
              {/* <iframe
                src={programmeDetailInfo?.external_url}
                width="100%"
                height="600px"
                frameBorder="0"
              ></iframe> */}
            </>
          )}
        </div>
        <div className="books-detail-document">
          {programmeDetailInfo?.type == "embed_code" && (
            <>
              <iframe
                className="other-resource"
                width="100%"
                frameborder="0"
                preload="auto"
                onError={() => console.log("Error loading document")}
                src={programmeDetailInfo.external_url}
              ></iframe>
            </>
          )}
        </div>
      </div>
      <CustomConfirmation
        handleOpenDelete={handleOpenDelete}
        setOpen={setOpenDelete}
        handleCloseDelete={handleCloseDelete}
        handleAgree={handleDelete}
        open={openDelete}
        setOpenDelete={setOpenDelete}
      />
    </>
  );
}
export default BookDetail;
