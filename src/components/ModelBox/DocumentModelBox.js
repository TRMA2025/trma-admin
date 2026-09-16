// import * as React from "react";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import FileViewer from "react-file-viewer";
// import { Icon } from "@iconify/react";
// import { styled } from "@mui/material/styles";
// import { IconButton, CircularProgress } from "@mui/material";
// import closeFill from "@iconify/icons-eva/close-fill";
// import EmbedResource from "../resourceCard/EmbedResource";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
// import "@cyntler/react-doc-viewer/dist/index.css";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   maxWidth: "100%",
//   padding: "20px",
//   bgcolor: "#fff",
//   border: "1px solid #fff",
//   boxShadow: 24,
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   borderRadius: "15px",
// };

// const ProgrammesImgStyle = styled("img")({
//   height: "400px",
//   objectFit: "contain",
//   width: "100%",
// });

// export default function DocumentModelBox({
//   open,
//   handleClose,
//   image_url,
//   type,
//   previewDoc,
// }) {
//   const [isLoaded, setIsLoaded] = React.useState(false);
//   const [iframeSrc, setIframeSrc] = React.useState(null);
//   const [error, setError] = React.useState(false);
//   const [retry, setReTry] = React.useState(0);
//   const maxRetries = 5;
//   const retryDelay = 2000;

//   const resetStates = () => {
//     setIframeSrc(null);
//     setIsLoaded(false);
//     setError(false);
//   };

//   const fileName = image_url.split("/").pop();
//   let extension = fileName.split(".").pop().toLowerCase();
//   const fileExtensionsMap = {
//     xls: "xlsx",
//     ppt: "pptx",
//     doc: "docx",
//   };

//   extension = fileExtensionsMap[extension] || extension;
//   console.log(extension, "extensionextensionextensionextension");
//   const docs = [
//     { uri: image_url }, // Remote file
//     // { uri: require("./example-files/pdf.pdf") }, // Local File
//   ];

//   // const fetchDocument = async (url) => {
//   //   try {
//   //     if (!url || !isValidUrl(url)) {
//   //       setError(true);
//   //       return;
//   //     }

//   //     const response = await fetch(url, { method: "HEAD" });

//   //     if (response.ok) {
//   //       setIsLoaded(true);
//   //       setError(false);
//   //     } else {
//   //       setError(true);
//   //     }
//   //   } catch (err) {
//   //     setError(true);
//   //   }
//   // };

//   React.useEffect(() => {
//     if (type === "other_document" && image_url) {
//       resetStates();
//       // fetchDocument(image_url);
//     }
//   }, [type, image_url]);

//   const isValidUrl = (url) => {
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   return (
//     <Modal
//       keepMounted
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="keep-mounted-modal-title"
//       aria-describedby="keep-mounted-modal-description"
//     >
//       <Box sx={style}>
//         <IconButton onClick={handleClose} className="mui-btn-close-icon">
//           <Icon icon={closeFill} width={20} height={20} />
//         </IconButton>

//         {type === "image" && (
//           <ProgrammesImgStyle
//             src={image_url}
//             onContextMenu={(e) => e.preventDefault()}
//           />
//         )}

//         {type === "other_document" && (
//           <>
//             {/* {!isLoaded && (
//               <div className="loading-preview">
//                 <CircularProgress className="loading-preview-svg" />
//               </div>
//             )} */}

//             {/* For .doc files, use Google Docs viewer */}

//             <div className="other-resource">
//               <DocViewer documents={docs} />
//             </div>
//           </>
//         )}

//         {type === "audio" && (
//           <div className="audio-resource">
//             <h3 className="audio-title">{previewDoc?.title}</h3>
//             <audio
//               className="w-100"
//               src={image_url}
//               controls
//               controlsList="nodownload"
//               onContextMenu={(e) => e.preventDefault()}
//             />
//           </div>
//         )}

//         {type === "embed_code" && previewDoc?.embed_code && (
//           <div className="html-embed-resource">
//             <EmbedResource htmlCode={previewDoc.embed_code} />
//           </div>
//         )}
//       </Box>
//     </Modal>
//   );
// }
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FileViewer from "react-file-viewer";
import { fetchAuthenticatedPdf } from "src/utils/downloadResource";

import { Icon } from "@iconify/react";
import { styled } from "@mui/material/styles";
import { IconButton, CircularProgress } from "@mui/material";
import closeFill from "@iconify/icons-eva/close-fill";
import EmbedResource from "../resourceCard/EmbedResource";
import DocViewer from "@cyntler/react-doc-viewer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "100%",
  padding: "20px",
  bgcolor: "#fff",
  border: "1px solid #fff",
  boxShadow: 24,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "15px",
};

const ProgrammesImgStyle = styled("img")({
  height: "400px",
  objectFit: "contain",
  width: "100%",
});

export default function DocumentModelBox({
  open,
  handleClose,
  image_url,
  type,
  previewDoc,
  pdf_path,
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [iframeSrc, setIframeSrc] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [retry, setReTry] = React.useState(0);
  /* Object URL for a private PDF fetched through the authenticated route. */
  const [pdfUrl, setPdfUrl] = React.useState(null);
  const maxRetries = 5;
  const retryDelay = 2000;
  const docs = [{ uri: image_url }];

  const resetStates = () => {
    setIframeSrc(null);
    setIsLoaded(false);
    setError(false);
  };

  const fileName = image_url.split("/").pop();
  let extension = fileName.split(".").pop().toLowerCase();
  const fileExtensionsMap = {
    xls: "xlsx",
    ppt: "pptx",
  };

  extension = fileExtensionsMap[extension] || extension;
  console.log(extension, "extensionextensionextensionion");
  console.log(extension, "sccscscscscscscscs");

  const fetchDocument = async (url) => {
    try {
      if (!url || !isValidUrl(url)) {
        setError(true);
        return;
      }

      const response = await fetch(url, { method: "HEAD" });

      if (response.ok) {
        setIsLoaded(true);
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching document:", err);
      setError(true);
    }
  };

  React.useEffect(() => {
    if (type !== "other_document" || !image_url) return undefined;
    resetStates();

    /* PDFs are stored private (13 Sep 2026); the storage URL answers 403 and
       left this preview spinning forever. Load them through the
       authenticated route instead (16 Sep 2026). */
    if (extension === "pdf" && pdf_path) {
      let objectUrl = null;
      let cancelled = false;
      fetchAuthenticatedPdf(pdf_path)
        .then((blob) => {
          if (cancelled) return;
          objectUrl = URL.createObjectURL(blob);
          setPdfUrl(objectUrl);
          setIsLoaded(true);
          setError(false);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        });
      return () => {
        cancelled = true;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        setPdfUrl(null);
      };
    }

    fetchDocument(image_url);
    return undefined;
  }, [type, image_url, pdf_path]);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <IconButton onClick={handleClose} className="mui-btn-close-icon">
          <Icon icon={closeFill} width={20} height={20} />
        </IconButton>

        {type === "image" && (
          <ProgrammesImgStyle
            src={image_url}
            onContextMenu={(e) => e.preventDefault()}
          />
        )}

        {type === "other_document" && (
          <>
            <div className="other-resource">
              {isLoaded ? (
                extension === "csv" || extension === "pdf" ? (
                  <FileViewer
                    fileType={extension}
                    filePath={(extension === "pdf" && pdfUrl) || image_url}
                    errorComponent={<div>Error loading file</div>}
                    onError={(e) => console.error("FileViewer error:", e)}
                  />
                ) : (
                  <DocViewer
                    documents={docs}
                    config={{
                      header: { disableHeader: true },
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                      color: "#fff",
                    }}
                  />
                )
              ) : error ? (
                <div className="loading-preview" style={{ color: "#333" }}>
                  This file could not be previewed. Use Download instead.
                </div>
              ) : (
                <div className="loading-preview">
                  <CircularProgress className="loading-preview-svg" />
                </div>
              )}
            </div>
          </>
        )}

        {type === "audio" && (
          <div className="audio-resource">
            <h3 className="audio-title">{previewDoc?.title}</h3>
            <audio
              className="w-100"
              src={image_url}
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        )}

        {type === "embed_code" && previewDoc?.embed_code && (
          <div className="html-embed-resource">
            <EmbedResource htmlCode={previewDoc?.embed_code} />
          </div>
        )}
      </Box>
    </Modal>
  );
}
