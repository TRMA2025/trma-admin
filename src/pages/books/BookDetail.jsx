import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFilePdf, FaFileWord, FaFileImage } from "react-icons/fa";

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
import mammoth from "mammoth";

import { useSnackbar } from "notistack";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import { makeStyles } from "@mui/styles";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { BarLoader } from "react-spinners";

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
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [isLoading, setIsLoading] = useState(false);
  const [programmeDetailInfo, setProgrammeDetailInfo] = useState();
  const [extensionUrl, setExtensionUrl] = useState("");
  const [loading, setLoading] = useState(true);
  console.log(s3baseUrl, "ssssssssssa333");

  const canvasRef = useRef(null);
  const [error, setError] = useState(false);

  const [docContent, setDocContent] = useState("Loading document...");

  const [openDelete, setOpenDelete] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const getDocumentUrl = (fileUrl) => {
    const extension = fileUrl?.split(".")?.pop();
    if (["pdf"].includes(extension)) {
      return s3baseUrl + fileUrl;
    } else if (["doc", "docx", "xls", "xlsx", "csv"].includes(extension)) {
      return s3baseUrl + fileUrl;
    }
    return s3baseUrl + fileUrl;
  };
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
      console.log(error, "errorerrassssssss");
      console.error("errorerrorerrorerror", error);
      enqueueSnackbar("error", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
    s;
  };
  let externalUrl1 = state?.detailValues?.external_url;

  // Remove the 'https://' or 'http://' if it's present
  externalUrl1 = externalUrl1?.replace(/^https?:\/\//, "");
  console.log(externalUrl1, "==-==-==-");
  const corsUrl = `https://cors-anywhere.herokuapp.com/${externalUrl1}`;

  const url =
    "https://cors-anywhere.herokuapp.com/jsoncompare.org/LearningContainer/SampleFiles/PDF/sample-pdf-with-images.pdf";

  const externalUrlLink = () => {
    window.open(programmeDetailInfo?.external_url);
  };

  const filePathViewr = programmeDetailInfo?.external_url;
  console.log(filePathViewr, "filePathViewrfilePathViewrfilePathViewr");

  const headers = {
    Accept: "application/json",
    // "X-Access-Token":
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDY1YjE4NWZiMDIxYTEwNGJlNDFjN2YiLCJsb2dpbl9ieSI6ImFkbWluX3VzZXIiLCJpYXQiOjE3MzUxODY5Njd9.aYIpTU7FMLZuM21-nMjOxNi86n9wF7bqn8JvE-AQz6c",

    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    origin: "http://localhost:3000/",
    "Sec-CH-UA":
      '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"Windows"',
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  };
  useEffect(() => {
    const checkPdfAvailability = async () => {
      try {
        console.log("Fetching PDF...");
        const response = await fetch(corsUrl, {
          method: "GET",
          headers: headers,
        });

        console.log("Response status:", response);

        if (!response.ok) {
          // If response is not ok, set PDF availability to false and capture the error
          throw new Error(`Failed to fetch PDF. Status: ${response.status}`);
        }

        // If PDF is available, set the state to true
        // setIsPdfAvailable(true);
        setError(null); // Clear any previous error
      } catch (error) {
        // Set the error state if something goes wrong
        console.error("Error fetching PDF:", error);
        // setIsPdfAvailable(false);
        setError(error.message); // Store the error message
      }
    };

    checkPdfAvailability();
  }, []);

  useEffect(() => {
    handleDetail();
  }, []);

  // useEffect(() => {
  //   const checkPdfAvailability = async () => {
  //     try {
  //       const response = await fetch(programmeDetailInfo?.external_url, {
  //         method: "GET",
  //         headers: headers,
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
  const externalUrl = programmeDetailInfo?.external_url;
  const iframeUrl = `https://docs.google.com/gview?url=${externalUrl}&embedded=true`;
  useEffect(() => {
    const iframe = document.getElementById("iframe");

    if (iframe?.onload) {
      iframe.onload = () => {
        setLoading(false);
        setError(false);
      };
    }
    if (iframe?.onerror) {
      iframe.onerror = () => {
        setLoading(false);
        setError(true);
      };
    }
  }, []);

  // useEffect(() => {
  //   const fetchAndRenderDocx = async () => {
  //     try {
  //       if (!programmeDetailInfo?.external_url) {
  //         setDocContent("No document URL provided.");
  //         return;
  //       }

  //       const response = await fetch(programmeDetailInfo.external_url);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch the document.");
  //       }

  //       const arrayBuffer = await response.arrayBuffer();
  //       const result = await mammoth.extractRawText({ arrayBuffer });
  //       setDocContent(result.value || "The document has no content.");
  //     } catch (error) {
  //       console.error("Error rendering DOCX:", error);
  //       setDocContent("Failed to load document.");
  //     }
  //   };

  //   fetchAndRenderDocx();
  // }, [programmeDetailInfo]);

  // useEffect(() => {
  //   setIsLoaded(false);
  // }, [programmeDetailInfo]);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  let breadCrumbMenu = [
    { title: "Books", navigation: `/books`, active: false },
    { title: programmeDetailInfo?.title, navigation: null, active: true },
  ];
  const randomParam = Math.random();
  const fileExtension = corsUrl?.split(".")?.pop();
  console.log(
    fileExtension,
    "fileExtensionfileExtensionfileExtensionfileExtension"
  );

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
                src={s3baseUrl + state?.detailValues?.image}
                alt="Group Image"
                className="img-fluid"
              />
            </div>
            <div className="col-9">
              <div>
                <h5 className="card-title">{state?.detailValues?.title}</h5>
                <div
                  dangerouslySetInnerHTML={{
                    __html: state?.detailValues?.detailed_description,
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
              {["pdf", "csv"].includes(
                programmeDetailInfo.document_file.split(".").pop().toLowerCase()
              ) ? (
                <FileViewer
                  fileType={extension}
                  filePath={getDocumentUrl(programmeDetailInfo?.document_file)}
                />
              ) : (
                <DocViewer
                  documents={[
                    {
                      uri: filePath,
                    },
                  ]}
                  pluginRenderers={DocViewerRenderers}
                />
              )}
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
                srcDoc={programmeDetailInfo?.embed_code}
                title="Embedded Document"
              ></iframe>
            )}
        </div>
        <div className="books-detail-document col-12">
          {state.detailValues && state?.detailValues?.type === "external_url" && (
            <>
              {fileExtension === "pdf" || fileExtension === "csv" ? (
                <FileViewer fileType={fileExtension} filePath={corsUrl} />
              ) : (
                <DocViewer
                  documents={[
                    {
                      uri: corsUrl,
                      fileType: fileExtension,
                    },
                  ]}
                  config={{
                    header: {
                      disableHeader: false,
                      disableFileName: false,
                      retainURLParams: false,
                      pdfVerticalScrollByDefault: true,
                    },
                  }}
                  prefetchMethod="GET"
                  requestHeaders={headers}
                  pluginRenderers={DocViewerRenderers}
                />
              )}

              {/* <iframe
                width="100%"
                height="500px"
                src={programmeDetailInfo?.external_url}
                // src={`https://docs.google.com/gview?url=${programmeDetailInfo?.external_url}&embedded=true`}
                frameBorder="0"
                allowFullScreen
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
                src={programmeDetailInfo?.external_url}
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
