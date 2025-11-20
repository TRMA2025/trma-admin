// import * as React from "react";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import { Icon } from "@iconify/react";
// import { styled } from "@mui/material/styles";
// import { IconButton, CircularProgress } from "@mui/material";
// import closeFill from "@iconify/icons-eva/close-fill";
// import { get_root_value } from "src/utils/domUtils";

// import { useState } from "react";
// import { useEffect } from "react";
// import EmbedResource from "../resourceCard/EmbedResource";
// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   // width: 500,
//   maxWidth: "100%",
//   flexDirection: "column",
//   padding: "20px",
//   // height: 400,
//   bgcolor: get_root_value("--sidebars-background-color"),
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
//   audio_url,
//   type,
//   previewDoc,
// }) {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [videoVisible, setVideoVisible] = useState(false);
//   const [audioVisible, setAudioVisible] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     setIsLoaded(false);
//   }, [image_url]);

//   useEffect(() => {
//     // Show/hide video based on modal open/close state
//     setVideoVisible(open && type === "embed_code" && !!previewDoc?.embed_code);
//     setAudioVisible(open && type === "audio");
//     if (type === "embed_code") {
//       setMessage(previewDoc?.embed_code);
//     }
//   }, [open, type, previewDoc]);

//   // const randomParam = Date.now();
//   const randomParam = Math.random();
//   return (
//     <div>
//       <Modal
//         keepMounted
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="keep-mounted-modal-title"
//         aria-describedby="keep-mounted-modal-description"
//       >
//         <Box sx={style} className="mui-btn-close">
//           <IconButton onClick={handleClose} className="mui-btn-close-icon">
//             <Icon icon={closeFill} width={20} height={20} />
//           </IconButton>
//           {type == "image" && (
//             <ProgrammesImgStyle
//               src={image_url}
//               onContextMenu={(e) => e.preventDefault()}
//             />
//           )}

//           {type == "other_document" && (
//             <>
//               {!isLoaded && (
//                 <div className="loading-preview">
//                   <CircularProgress className="loading-preview-svg" />
//                 </div>
//               )}
//               {image_url && (
//                 <iframe
//                   className="other-resource"
//                   width="100%"
//                   frameborder="0"
//                   preload="auto"
//                   onLoad={() => setIsLoaded(true)}
//                   onError={() => console.log("Error loading document")}
//                   // onError={console.log("Error loading document")}
//                   src={`https://docs.google.com/gview?url=${image_url}&embedded=true`}
//                 ></iframe>
//               )}
//             </>
//           )}
//           {type == "audio" && (
//             <div className="audio-resource">
//               <h3 className="audio-title">{previewDoc?.title}</h3>
//               {audioVisible && (
//                 <div
//                   className="col-12 section-space"
//                   style={{ textAlign: "center" }}
//                 >
//                   <audio
//                     className="w-100"
//                     src={image_url}
//                     controls
//                     controlsList="nodownload"
//                     onContextMenu={(e) => e.preventDefault()}
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//           {type == "embed_code" && (
//             <div className="embed-resource">
//               {videoVisible && message && (
//                 // <div
//                 //   style={{ textAlign: "center" }}
//                 //   dangerouslySetInnerHTML={{
//                 //     __html: previewDoc?.embed_code,
//                 //   }}></div>
//                 <div className="html-embed-resource">
//                   <EmbedResource htmlCode={message} />
//                 </div>

//                 // <iframe src="https://ailsdoherty00.outgrow.us/661fa01a7100b01ca9f0a390"></iframe>
//               )}
//             </div>
//           )}
//         </Box>
//       </Modal>
//     </div>
//   );
// } /// Old Code     ...........
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
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [iframeSrc, setIframeSrc] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [retry, setReTry] = React.useState(0);
  const maxRetries = 5;
  const retryDelay = 2000;
  const docs = [
    { uri: image_url }, // Remote file
  ];

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
    if (type === "other_document" && image_url) {
      resetStates();
      fetchDocument(image_url);
    }
  }, [type, image_url]);

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
            {!isLoaded && (
              <div className="loading-preview">
                <CircularProgress className="loading-preview-svg" />
              </div>
            )}

            {extension === "doc" ? (
              <div className="other-resource">
                <DocViewer documents={docs} />
              </div>
            ) : (
              <div className="other-resource">
                <FileViewer fileType={extension} filePath={image_url} />
              </div>
            )}
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
            <EmbedResource htmlCode={previewDoc.embed_code} />
          </div>
        )}
      </Box>
    </Modal>
  );
}

/////////////////////////////////////////
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

import { Icon } from "@iconify/react";
import { styled } from "@mui/material/styles";
import { IconButton, CircularProgress } from "@mui/material";
import closeFill from "@iconify/icons-eva/close-fill";
import EmbedResource from "../resourceCard/EmbedResource";
import DocViewer from "@cyntler/react-doc-viewer";

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
//   const docs = [{ uri: image_url }];

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
//   };

//   extension = fileExtensionsMap[extension] || extension;
//   console.log(extension, "extensionextensionextensionion");

//   const fetchDocument = async (url) => {
//     try {
//       if (!url || !isValidUrl(url)) {
//         setError(true);
//         return;
//       }

//       const response = await fetch(url, { method: "HEAD" });

//       if (response.ok) {
//         setIsLoaded(true);
//         setError(false);
//       } else {
//         setError(true);
//       }
//     } catch (err) {
//       console.error("Error fetching document:", err);
//       setError(true);
//     }
//   };

//   React.useEffect(() => {
//     if (type === "other_document" && image_url) {
//       resetStates();
//       fetchDocument(image_url);
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
//             {!isLoaded && (
//               <div className="loading-preview">
//                 <CircularProgress className="loading-preview-svg" />
//               </div>
//             )}

//             <div className="other-resource">
//               {extension === "csv" || extension === "pdf" ? (
//                 <div className="other-resource">
//                   <FileViewer fileType={extension} filePath={image_url} />
//                 </div>
//               ) : (
//                 <div className="other-resource">
//                   <DocViewer
//                     documents={docs}
//                     config={{
//                       header: { disableHeader: true },
//                     }}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       overflow: "auto",
//                       color: "#fff",
//                     }}
//                   />{" "}
//                 </div>
//               )}
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
