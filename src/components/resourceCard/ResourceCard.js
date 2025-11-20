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
import { useNavigate } from "react-router-dom";
import { s3baseUrl, baseUri } from "src/config/config";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";
import { htmlDecode } from "src/utils/convertHtml";
import { documentListApi } from "src/DAL/lessonDocument/LessonDocument";
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
import MenuOption from "src/components/MenuOption/MenuOptions";
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

export const ResourceCard = ({ documentList }) => {
  const navigate = useNavigate();
  const params = useParams();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDelete, setOpenDelete] = React.useState(false);

  const getResourceImage = (doc) => {
    if (doc.document_thumbnail) {
      return s3baseUrl + doc.document_thumbnail;
    } else if (doc.document_type == "image") {
      return s3baseUrl + doc?.document_images_url?.thumbnail_2;
    } else {
      const ext = doc.document_file_url?.split(".").pop();
      if (imageLink[ext]) {
        return imageLink[ext];
      } else {
        return imageLink.other;
      }
    }
  };
  return (
    <>
      {documentList.map((doc, i) => {
        return (
          <div className="col-sm-12 col-md-6 col-lg-4 mb-3" key={i}>
            <div className=" card lesson-card h-100">
              <div className="row p-3 resource-card">
                <div className="col-lg-3 col-md-4 col-sm-12">
                  <img
                    className="lesson-card-image"
                    src={getResourceImage(doc)}
                    alt="name"
                  />
                </div>
                <div className="col-lg-9 col-md-8 col-sm-12">
                  <h4 className="lesson-heading">{htmlDecode(doc.title)}</h4>
                  <div
                    className="normal-font"
                    dangerouslySetInnerHTML={{
                      __html: doc.detailed_description,
                    }}
                  ></div>
                </div>
                <div className="col-12 download-icon">
                  {isLoading ? (
                    <CircularProgress className="icon-style" />
                  ) : (
                    <Tooltip title="Download">
                      <DownloadIcon
                        onClick={() => {
                          let path = "";
                          if (doc.document_type === "image") {
                            path = doc.document_images_url.thumbnail_1;
                          } else {
                            path = doc.document_file_url;
                          }
                          handleDownload(path);
                        }}
                        className="icon-style"
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
