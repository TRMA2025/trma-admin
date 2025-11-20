import React, { useEffect } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  Link as RouterLink,
} from "react-router-dom";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
import { makeStyles } from "@mui/styles";
import DocumentModelBox from "src/components/ModelBox/DocumentModelBox";
import EmbedResource from "src/components/resourceCard/EmbedResource";
import { useState } from "react";

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
  const [openDelete, setOpenDelete] = useState(false);
  const [previewDoc, setPreviewDoc] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  console.log(state, "statestatestatestate");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleNavigateEdit = () => {
    navigate(`/books/${state?.detailValues._id}/edit-book`, {
      state: programmeDetailInfo,
    });
  };
  console.log(
    programmeDetailInfo,
    "programmeDetailInfoprogrammeDetailInfoprogrammeDetailInfo"
  );

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

  const handleDetail = async () => {
    setIsLoading(true);
    let result = await bookDetail(state?.detailValues._id);
    console.log(result, "detail book result......");
    if (result.code === 200) {
      setProgrammeDetailInfo(result.data);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  useEffect(() => {
    handleDetail();
  }, []);
  useEffect(() => {
    setIsLoaded(false);
  }, [programmeDetailInfo]);
  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(
    programmeDetailInfo,
    "programmeDetailInfoprogrammeDetailInfoprogrammeDetailInfo"
  );
  const getDocumentUrl = (fileUrl) => {
    console.log(fileUrl, "fileUrlfileUrlfileUrlfileUrl");
    const extension = fileUrl.split(".").pop();
    if (["pdf"].includes(extension)) {
      return s3baseUrl + fileUrl;
    } else if (["doc", "docx", "xls", "xlsx", "csv"].includes(extension)) {
      return `https://docs.google.com/gview?url=${
        s3baseUrl + fileUrl
      }&embedded=true`;
    }
    return s3baseUrl + fileUrl;
  };

  let breadCrumbMenu = [
    { title: "Books", navigation: `/books`, active: false },
    { title: programmeDetailInfo?.title, navigation: null, active: true },
  ];
  return (
    <Container>
      <CustomConfirmation
        handleOpenDelete={handleOpenDelete}
        setOpen={setOpenDelete}
        handleCloseDelete={handleCloseDelete}
        handleAgree={handleDelete}
        open={openDelete}
        setOpenDelete={setOpenDelete}
      />
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
              <p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: programmeDetailInfo?.detailed_description,
                  }}
                ></div>
              </p>
            </div>
          </div>
          <div className="col-1" style={{ textAlign: "end" }}>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon
                sx={{
                  fontWeight: 600,
                  fontSize: "2rem", // Adjust the size of the icon as needed
                }}
              />
            </IconButton>
          </div>
        </div>
      </div>
      <div>
        <div className="tags-section">
          {programmeDetailInfo?.tags?.length > 0 && (
            <div>
              <div
                className="tags d-flex flex-wrap"
                style={{
                  display: "flex",
                  flexWrap: "wrap", // Allows wrapping tags to the next line
                }}
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
                  <span key={tag._id}>
                    <Chip
                      label={tag.name} // No truncation needed here
                      className="tag"
                      style={{
                        margin: "4px",
                        color: "black",
                        backgroundColor: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="books-detail-document">
        {programmeDetailInfo?.type == "document_file" && (
          <>
            {!isLoaded && (
              <div className="loading-preview">
                <CircularProgress className="loading-preview-svg" />
              </div>
            )}
            {programmeDetailInfo &&
              programmeDetailInfo.type == "document_file" && (
                <iframe
                  className="other-resource"
                  width="100%"
                  frameborder="0"
                  preload="auto"
                  onLoad={() => setIsLoaded(true)}
                  onError={() => console.log("Error loading document")}
                  src={getDocumentUrl(programmeDetailInfo.document_file)}
                ></iframe>
              )}
          </>
        )}
      </div>

      <div className="books-detail-document">
        {programmeDetailInfo?.type == "external_url" && (
          <>
            <iframe
              className="other-resource"
              width="100%"
              frameborder="0"
              preload="auto"
              // onLoad={() => setIsLoaded(true)}
              onError={() => console.log("Error loading document")}
              // onError={console.log("Error loading document")}
              // src={`https://docs.google.com/gview?url=${programmeDetailInfo.document_file}&embedded=true`}
              src={programmeDetailInfo.external_url}
            ></iframe>
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
              // onLoad={() => setIsLoaded(true)}
              onError={() => console.log("Error loading document")}
              // onError={console.log("Error loading document")}
              // src={`https://docs.google.com/gview?url=${programmeDetailInfo.document_file}&embedded=true`}
              src={programmeDetailInfo.external_url}
            ></iframe>
          </>
        )}
      </div>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 6.5,
            width: "15ch",
          },
        }}
      >
        <MenuItem onClick={handleNavigateEdit}>
          <EditIcon className="me-3" height="10px" /> Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDelete}>
          <DeleteIcon className="me-3" height="10px" /> Delete
        </MenuItem>
      </Menu>
    </Container>
  );
}

export default BookDetail;
