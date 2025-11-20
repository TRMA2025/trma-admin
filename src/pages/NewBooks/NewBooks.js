import { useEffect, useState } from "react";
// material
import { CircularProgress } from "@mui/material";
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import RecordNotFound from "src/components/RecordNotFound";
import { DeleteBookApi, booksListing } from "src/DAL/Books/Books";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function NewBooks() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const booksList = async () => {
    const result = await booksListing();
    if (result.code == 200) {
      setIsLoading(false);
      setBooks(result.books);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleEdit = (value) => {
    navigate(`/books/edit-book/${value._id}`);
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await DeleteBookApi(deleteDoc._id);
    if (result.code === 200) {
      booksList();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
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
  const handleNavigateDetail = (value) => {
    navigate(`/books/detail-book/${value._id}`);
  };
  useEffect(() => {
    booksList();
  }, []);
  if (isLoading === true) {
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
          <div className="col-lg-7 col-sm-12">
            <h2>Books </h2>
          </div>
          <div className="col-lg-5 col-sm-12 text-end">
            <button
              onClick={() => navigate(`/books/add-book`)}
              className="small-contained-button">
              Add Book
            </button>
          </div>
          {books.length < 1 ? (
            <RecordNotFound title="Books" />
          ) : (
            books.map((value, index) => {
              return (
                <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
                  <div className="card mt-4 pods-cards-shadow cursor h-100">
                    <img
                      src={s3baseUrl + value.image.thumbnail_1}
                      className="card-img-top pods-image"
                      alt="Book"
                      // onClick={() => handleNavigateDetail(value)}
                    />
                    <div
                      className="card-body"
                      style={{ minHeight: "fit-content" }}>
                      <div className="row">
                        <div className="col-10">
                          <h3
                            className="h2-heading"
                            // onClick={() => handleNavigateDetail(value)}
                          >
                            {htmlDecode(value.name)}
                          </h3>
                        </div>

                        <div className="col-2 menu-option">
                          <CustomPopoverSection
                            menu={MENU_OPTIONS}
                            data={value}
                          />
                        </div>
                      </div>
                      <p className="programme-card-desc">
                        {htmlDecode(value.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
