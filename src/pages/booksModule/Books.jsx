import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chip, CircularProgress, TextField } from "@mui/material";
import Badge from "@mui/material/Badge";

import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { filter } from "lodash";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";
import BookFilter from "./BokFilter";
import FilterListIcon from "@mui/icons-material/FilterList"; // Import MUI filter icon
import { activeTagsApi, BookListApi } from "src/DAL/book";
import RecordNotFound from "src/components/RecordNotFound";
import Skeleton from "react-loading-skeleton";
import BookSkeleton from "src/components/allSkeleton/BookSkeleton";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
  notchedOutline: {
    borderColor: "#fff !important",
    height: "55px",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (user) => user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function BooksModule() {
  const classes = useStyles();
  const EMPTY_FILTER = {
    start_date: new Date(),
    end_date: new Date(),
    sale_page: null,
    payment_plan: null,
    expiry_in: "",
    expired: null,
    filter: "all",
    filter: "all",
    expiry_name: null,
    search_text: "",
    tags: [],
  };
  const observer = useRef();

  const [filterState, setFilterState] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);
  const [pageCount, setPageCount] = useState(1);
  const [filterCount, setFilterCount] = useState(0);
  const [groupsName, setGroupsName] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [orderBy, setOrderBy] = useState("number");
  const [order, setOrder] = useState("asc");
  const [bookslist, setBooksList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(true);
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingSection, setIsLoadingSection] = useState(true);
  const [cardSearchText, setCardSearchText] = useState("");

  const [loadMorePath, setLoadMorePath] = useState("");
  const load_more_path = "api/books_library/list?page=0&limit=15";

  const getTagsList = async () => {
    try {
      const result = await activeTagsApi();
      console.log(result, "resultresultresult");
      if (result.code === 200) {
        const tags = result.activeTags.map((tag) => ({
          chip_label: tag.name,
          chip_value: tag._id,
          ...tag,
        }));
        setTagsList(tags);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error fetching tags", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const BookList = async (value, path, isWaiting) => {
    console.log(path, "pathpathpathpathpathpathpath");
    if (!isWaiting) {
      setIsWaiting(true);
    }

    let postData = {
      search: searchText || cardSearchText,
      tags: value,
    };

    const result = await BookListApi(postData, path);

    if (result.code == 200) {
      setIsWaiting(false);
      setTotalCount(result.total);
      setTotalPages(result.total_pages);
      setLoadMorePath(result.load_more_url);

      if (!isWaiting) {
        setPageNumber(1);
        setBooksList(result.books);
      } else {
        const updatedBooksList = bookslist.concat(result.books);
        setBooksList(updatedBooksList);
        setPageNumber((prev) => prev + 1);
      }
      setIsLoadingMore(false);
    } else {
      setIsWaiting(false);
      setIsLoadingMore(false);
      setIsLoadingSection(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const loadMoreData = () => {
    setIsLoadingMore(true);
    BookList(groupsName, loadMorePath, true);
  };

  // const lastBookElementRef = useCallback(
  //   (node) => {
  //     if (isLoadingMore) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && totalPages >= pageNumber) {
  //         loadMoreData();
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [isLoadingMore, totalPages, pageNumber, loadMorePath, observer]
  // );

  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && loadMorePath) {
          loadMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, loadMorePath, observer]
  );

  const searchFunction = () => {
    setPage(0);
    setPageCount(1);
    filterState.search_text = searchText;
    setFilterCount(groupsName.length);
    BookList(groupsName, load_more_path);
    handleCloseFilterDrawer();
    localStorage.setItem("book_filter_data", JSON.stringify(filterState));
  };

  const handleClearFilter = () => {
    setGroupsName([]);
    setPage(0);
    setPageCount(1);
    setSearchText("");
    setFilterCount(0);
    setFilterState(EMPTY_FILTER);
    BookList([], load_more_path);
    handleCloseFilterDrawer();
  };

  const handleNavigateDetail = (value) => {
    console.log(value, "valuevaluevaluevaluevalue");
    navigate(`/books/book-detail/${value._id}`, {
      state: { detailValues: value },
    });
  };

  const handleOpenFilterDrawer = () => {
    setFilterDrawerState(true);
    setFilterState(filterStateUpdated);
  };

  const handleCloseFilterDrawer = () => {
    setFilterDrawerState(false);
  };

  const filteredPrograme = applySortFilter(
    bookslist,
    getComparator(order, orderBy),
    filterName
  );

  useEffect(() => {
    BookList(groupsName, load_more_path);
    getTagsList();
  }, []);
  const searchFunctionTwo = (e) => {
    console.log(e, "eeeeeeeeeeeeeeeeeeeeeeeeee");
    setBooksList([]);
    e.preventDefault();
    BookList(groupsName, load_more_path);
  };

  const isRecordNotFound = filteredPrograme.length === 0;
  return (
    <div className="container mt-2">
      <div className="row">
        <div className="col-lg-6 col-sm-12 d-flex">
          <h2>Books </h2>
        </div>
        <div className="col-lg-6 col-sm-12 d-flex justify-content-end">
          <Badge
            badgeContent={filterCount}
            color="error"
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            overlap="circular"
          >
            <button
              className="small-contained-button"
              onClick={handleOpenFilterDrawer}
            >
              <FilterListIcon /> Filters
            </button>
          </Badge>

          <button
            onClick={() => navigate(`/books/add-book`)}
            className="small-contained-button"
          >
            Add Book
          </button>
          <button
            onClick={() => navigate(`/books/manage-tags`)}
            className="small-contained-button"
          >
            Manage Tags
          </button>
        </div>
        <div
          style={{ display: "flex", justifyContent: "end" }}
          className="mt-2"
        >
          <TextField
            fullWidth
            label="Search"
            InputProps={{
              classes: {
                notchedOutline: classes.notchedOutline,
              },
            }}
            sx={{ marginRight: 2, width: 240 }}
            className="custom-search-field"
            value={cardSearchText}
            onChange={(e) => setCardSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchFunctionTwo(e);
            }}
          />
        </div>
        {isWaiting ? (
          <BookSkeleton />
        ) : (
          <div className="row">
            {filteredPrograme.map((value, index) => {
              return (
                <div
                  className="col-lg-4 col-md-4 col-sm-12 mb-4 mt-1"
                  key={index}
                >
                  <div className="card mt-1 pods-cards-shadow cursor h-100">
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
                          borderRadius: "16px 0 10px 0",
                          zIndex: 1,
                        }}
                      >
                        Inactive
                      </div>
                    )}
                    <img
                      src={s3baseUrl + value?.image}
                      className="card-img-top pods-image"
                      alt="Programme"
                      onClick={() => handleNavigateDetail(value)}
                    />
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <h3
                            className="h2-heading"
                            onClick={() => handleNavigateDetail(value)}
                          >
                            {htmlDecode(value.title)}
                          </h3>
                        </div>
                        <div className="tags-chip mb-1">
                          {value.tags &&
                            value.tags.map((tag, index) => (
                              <Chip
                                sx={{
                                  color: "white",
                                  backgroundColor: "#cf7fff",
                                  marginLeft: "4px",
                                  borderRadius: "7px",
                                  fontSize: "0.75rem",
                                  marginTop: "6px",
                                }}
                                key={index}
                                label={tag.title}
                                size="small"
                                variant="contained"
                              />
                            ))}
                        </div>
                      </div>
                      <p className="programme-card-desc">
                        {htmlDecode(value.short_description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {cardSearchText && bookslist.length == 0 && (
              <RecordNotFound title="Books" />
            )}

            {/* {totalPages >= pageNumber && (
            <div className="col-12 text-center p-2">
              <span
                ref={lastBookElementRef}
                className="mt-3"
                onClick={loadMoreData}
                id="load-more-feed"
              >
                {isLoadingMore ? <CircularProgress size={24} /> : ""}
              </span>
            </div>
          )} */}
            {filteredPrograme.length > 0 && loadMorePath && (
              <div className="col-12 text-center favourite-buttton-box">
                <button
                  // ref={lastBookElementRef}
                  className="small-contained-button mt-3"
                  onClick={loadMoreData}
                  id="load-more-feed"
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {isRecordNotFound && isLoading && <RecordNotFound title="Books" />}
          </div>
        )}
      </div>
      <CustomDrawer
        isOpenDrawer={filterDrawerState}
        onOpenDrawer={handleOpenFilterDrawer}
        onCloseDrawer={handleCloseFilterDrawer}
        pageTitle="Filters"
        componentToPassDown={
          <BookFilter
            searchSubmitFilter={searchFunction}
            handleClearFilter={handleClearFilter}
            setGroupsName={setGroupsName}
            groupsName={groupsName}
            setTagsList={setTagsList}
            tagsList={tagsList}
          />
        }
      />
    </div>
  );
}
