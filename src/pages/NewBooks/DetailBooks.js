import { CircularProgress, Container, IconButton } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { booksDetailApi } from "src/DAL/Books/Books";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Document, Page, pdfjs } from "react-pdf";
import { s3baseUrl } from "src/config/config";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function DetailBooks() {
  const classes = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [bookDetail, setBookDetail] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [videoVisible, setVideoVisible] = useState(false);
  const [audioVisible, setAudioVisible] = useState(false);
  const [message, setMessage] = useState("");

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(numPages, "numPagesnumPages");
    setNumPages(numPages);
  };
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the default context menu behavior
  };
  const goToPrevPage = () => setPageNumber((prevPage) => prevPage - 1);
  const goToNextPage = () => setPageNumber((prevPage) => prevPage + 1);
  const booksDetail = async () => {
    setIsLoading(true);
    const result = await booksDetailApi(params.id);
    if (result.code == 200) {
      setBookDetail(result.book);

      setIsLoading(false);
    }
  };
  useEffect(() => {
    booksDetail();
  }, []);
  if (isLoading === true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <Container>
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          <IconButton
            className="back-screen-button"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
        <div className="row section-space">
          <div className="col-12">
            <h2>{bookDetail?.name}</h2>
          </div>
        </div>
        {/* <div className="row">
          <div
            // style={{ width: 600 }}
            onContextMenu={handleContextMenu}
            className="pdf-view">
            <nav className="pdf-nav">
              <div>
                <button
                  // className="small-contained-button me-2"
                  className={`small-contained-button-pdf me-2 ${
                    pageNumber === 1 ? "disabled" : ""
                  }`}
                  disabled={pageNumber === 1}
                  onClick={goToPrevPage}>
                  Prev
                </button>
                <button
                  className={`small-contained-button-pdf me-2 ${
                    pageNumber === numPages ? "disabled" : ""
                  }`}
                  disabled={pageNumber === numPages}
                  onClick={goToNextPage}>
                  Next
                </button>
              </div>
              <div>
                <h5 className="pdf-pages">
                  Page {pageNumber} of {numPages}
                </h5>
              </div>
            </nav>
            <Document
              file={s3baseUrl + bookDetail.pdf_file}
              onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                width={600}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                customTextRenderer={false}
              />
            </Document>
          </div>
        </div> */}
      </div>
    </Container>
  );
}
