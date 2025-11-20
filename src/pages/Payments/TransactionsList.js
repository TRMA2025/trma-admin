import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { get_root_value } from "src/utils/domUtils";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  Tooltip,
  Pagination,
  TableHead,
} from "@mui/material";
// components
// import Page from "../components/Page";
// import Label from "./Label";
// import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "src/components/NotFound/SearchNotFound";
import DeletedModal from "src/components/ModalPopover/DeleteModal";
import Label from "src/components/Label";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "src/components/_dashboard/user";
// import UserListHead from "./UserListHead";
// import GoalStatementMenu from "../components/_dashboard/user/GoalStatementMenu";
// import { QuestionListing } from "src/DAL/GoalStatement/GoalStatement";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { htmlDecode } from "src/utils/convertHtml";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import roundFilterList from "@iconify/icons-ic/round-filter-list";

import {
  deleteProgrammeSectionApi,
  programmeAutoGroupList,
  programmeSectionList,
  deleteProgrammeAutoGroupApi,
} from "src/DAL/Programme/Programme";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import { memberListing } from "src/DAL/member/member";
import { project_type, s3baseUrl } from "src/config/config";
import {
  consultantListing,
  DeleteConsultantApi,
} from "src/DAL/consultant/consultant";
import {
  deleteTransactionApi,
  transactionListApi,
} from "src/DAL/Transaction/transactionApi";
import moment from "moment";
import CustomDrawer from "src/components/DrawerForm/CustomDrawer";

import TransactionsFilter from "./TransactionsFilter";
import { get_root_value } from "src/utils/domUtils";
import { convertCurrencyToSign, dd_date_format } from "src/utils/constant";
import TransactionsFilterNew from "./TransactionsFilterNew";
import FilteredChip from "src/components/FilteredChip";
import CustomMUITable from "src/components/GeneralComponents/CustomMUITable/CustomMUITable";
import Skeleton from "react-loading-skeleton";
import ListSkeleton from "src/components/listSkeleton/ListSkeleton";

//
// import USERLIST from "../_mocks_/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false },
  { id: "number", label: "#", alignRight: false },

  //   { id: "name", label: " Name", alignRight: false },
  { id: "email", label: "Member", alignRight: false },
  { id: "amount", label: "Amount", alignRight: false },
  { id: "transactionDate", label: "Transaction Date", alignRight: false },
  { id: "created", label: "Created By", alignRight: false },

  // { id: "currency", label: "Currency", alignRight: false },
  // { id: "status", label: "Status", alignRight: false },
  { id: "type", label: "Transaction Type", alignRight: false },
  { id: "refUser", label: "Transaction Mode", alignRight: false },
];

// ----------------------------------------------------------------------
function convertToTitleCase(variableName) {
  // Replace underscores with spaces
  let formattedName = variableName.replace(/_/g, " ");

  // Capitalize the first letter of each word
  formattedName = formattedName.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

  return formattedName;
}
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
  //   //console.log(arrayquery, "query");
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => {
      // _user.transaction_type.toLowerCase().indexOf(query.toLowerCase()) !==
      //   -1 ||
      // _user.email?.member?.email
      //   .toLowerCase()
      //   .indexOf(query.toLowerCase()) !== -1
      let memberName = "";
      if (_user.email) {
        memberName = _user.email;
      }
      return (
        memberName &&
        memberName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}
const USERLIST = [
  {
    id: 1,
    question: "Current Average Working Hours Per Week?",
    avatarUrl: "/static/mock-images/avatars/avatar_3.jpg",
    status: "active",
  },
];
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function PaymentTransactionsList() {
  const navigate = useNavigate();
  const params = useLocation();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [member, setData] = useState([]);
  const [filterDrawerState, setFilterDrawerState] = useState(false);
  const [isAllDates, setIsAllDates] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterNameStatus, setFilterNameStatus] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  console.log(searchText, "searchtexttexr");
  console.log(project_type, "project_typeproject_typeproject_typeproject_type");

  const [inputs, setInputs] = useState({
    search: "",
    transaction_type: "",
    transaction_status: "succeeded",
    transaction_mode:
      project_type == "dev"
        ? "sandBox"
        : project_type == "live"
        ? "live"
        : "all",
    start_date: null,
    end_date: null,
    platform: "all",
    sale_page: null,
    payment_request: [],
  });
  const ALTER_FILTER = {
    transaction_status: "",
  };
  const EMPTY_FILTER = {
    transaction_type: "all",
    sale_page: null,
    payment_plan: null,
    transaction_mode: "",
    // transaction_mode:
    //   project_type == "dev" ? "sandBox" : project_type == "dev" ? live : "all",
    // transaction_status: "succeeded",
    transaction_status: "",
    start_date: null,
    end_date: null,
    payment_request: [],
    search_text: searchText,
    filter_by_plateform: null,
  };
  const [filterData, setFilterData] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);

  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [transactionsList, setTransactionList] = useState([]);
  const [transactionMoode, setTransactionMode] = useState();
  console.log(transactionMoode, "transactionMoode");

  const [UserId, setUserId] = useState(false);
  const validateDate = () => {
    if (filterData.start_date && !filterData.end_date) {
      enqueueSnackbar("End date is required when start date is selected", {
        variant: "error",
      });
      return false; // Validation failed
    }

    if (!filterData.start_date && filterData.end_date) {
      enqueueSnackbar("Start date is required when end date is selected", {
        variant: "error",
      });
      return false; // Validation failed
    }

    return true; // Validation passed
  };

  // console.log(inputs, "sdfjhsdkj");
  const handleOpen = (e) => {
    //console.log.log("id", e);
    setUserId(e);
    setOpen(true);
  };
  const handleChangeOthers = (name, value) => {
    setFilterData((values) => ({ ...values, [name]: value }));
  };
  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  const searchFunction = () => {
    console.log(filterData, "dddddddddddddd");
    if (!validateDate()) {
      return;
    }
    // if (isAllDates == true) {
    //   enqueueSnackbar("both start and date is required", { variant: "error" });
    //   return;
    // }

    // if (!filterData.date?.chip_label == " ") {
    //   enqueueSnackbar("end date is required", { variant: "error" });
    //   return;
    // }

    setPage(0);
    setPageCount(1);
    filterData.search_text = searchText;
    getConsultantListing(filterData);
  };

  const handleClearFilter = () => {
    let clear_data = {
      ...EMPTY_FILTER,
      transaction_mode: "",
      transaction_status: "",
      transaction_type: "",
    };
    setFilterData(clear_data);
    getConsultantListing(clear_data);
    localStorage.removeItem("TransactionListSearch");
    countActiveFilters();
  };
  const countActiveFilters = () => {
    let count = 0;

    if (filterData?.date) count += 1;
    // if (filterData.start_date) count += 1;
    // if (filterData.end_date) count += 1;
    if (filterData.start_date && filterData.end_date) {
      count += 1;
    }

    if (
      filterData.transaction_mode === "sandBox" ||
      filterData.transaction_mode === "live" ||
      filterData.transaction_mode === "all"
    ) {
      count += 1;
    }

    if (filterData.transaction_status?.length > 0) count += 1;

    if (filterData.sale_page?.length > 0) count += 1;

    if (filterData.filter_by_plateform?.chip_label) count += 1;

    if (filterData.transaction_type === "sale_page") {
      count += 1;
    }
    if (filterData.transaction_type === "sale_page") {
      if (filterData.sale_page?.chip_label) count += 1;
    } else if (filterData.transaction_type === "payment_request") {
      if (filterData.payment_request?.length > 0) count += 1;
    }

    return count;
  };
  console.log(filterData, "filterdatafasgdksagdkj");

  const activeFilterCount = countActiveFilters();

  const handleDeleteChip = (data) => {
    console.log(data, "datadatadatadatadatadata");
    setPage(0);
    setPageCount(1);
    data.search_text = searchText;
    // if (!data.date) {
    //   data.start_date = null;
    //   data.end_date = null;
    //   setIsAllDates(false);
    // }

    let updatedFilterCount = activeFilterCount;
    if (!data.start_date) {
      updatedFilterCount -= 1;
      data.start_date = null;
    }
    if (!data.filter_by_plateform > 0) {
      updatedFilterCount -= 1;
      data.filter_by_plateform = null;
    }

    // if (!data.transaction_type == "sale_page") {
    //   updatedFilterCount -= 1;
    //   data.transaction_type
    // }
    if (!data.date_range) {
      updatedFilterCount -= 1;
      data.start_date = null;
      data.end_date = null;

      data.date_range = null;
    }

    if (!data.end_date || !data.start_date) {
      updatedFilterCount -= 1;
      data.end_date = null;
      data.start_date = null;
    }
    if (data.date_range) {
      delete data.date_range;
      data.start_date = null;
      data.end_date = null;
    } else {
      if (!data.start_date) data.start_date = null;
      if (!data.end_date) data.end_date = null;
    }

    if (!data.transaction_status?.length > 0) {
      updatedFilterCount -= 1;
    }
    if (!data.sale_page?.length > 0) {
      updatedFilterCount -= 1;
    }
    if (!data.transaction_type?.length > 0) {
      updatedFilterCount -= 1;
      data.transaction_type = "";
    }
    console.log(
      updatedFilterCount,
      "updatedFilterCountupdatedFilterCountupdatedFilterCount"
    );

    getConsultantListing(data);
    setFilterData(data);
    setFilterStateUpdated(data);
  };

  const getConsultantListing = async (filter_data) => {
    console.log(transactionsList, "transactionsList inside....");
    console.log(filter_data, "filter_datafilter_datafilter_data");
    const formattedStartDate = filter_data?.start_date
      ? moment(filter_data.start_date).format("YYYY-MM-DD")
      : null;
    const formated_end_Date = filter_data?.end_date
      ? moment(filter_data.end_date).format("YYYY-MM-DD")
      : null;

    let postData = {
      search: searchText,
      transaction_type: filter_data?.transaction_type,
      transaction_status: filter_data?.transaction_status,
      transaction_mode: filter_data?.transaction_mode,
      start_date: filter_data.start_date,
      end_date: filter_data.end_date,
      platform: filter_data?.filter_by_plateform?.chip_value,
      sale_page: filter_data?.sale_page?.chip_value,
      payment_request: filter_data?.payment_request?.chip_value,
    };
    setIsLoading(true);

    handleCloseFilterDrawer();

    if (postData.transaction_type == "sale_page") {
      postData.sale_page = filter_data?.sale_page?._id;
    } else {
      postData.sale_page = "";
    }

    if (postData.transaction_status) {
      postData.transaction_status = filter_data.transaction_status;
    }
    if (postData.payment_plan) {
      postData.payment_plan = filter_data.payment_plan._id;
    }

    if (postData?.transaction_type == "payment_request") {
      postData.payment_request = filter_data.payment_request?.map((item) => {
        return item._id;
      });
    }

    if (postData.start_date) {
      postData.start_date = moment(filter_data.start_date).format("YYYY-MM-DD");
    }

    if (postData.end_date) {
      postData.end_date = moment(filter_data.end_date).format("YYYY-MM-DD");
    }

    if (postData.filter_by_plateform) {
      postData.filter_by_plateform =
        filter_data.filter_by_plateform?.chip_value;
    }

    if (postData.transaction_type !== "sale_page") {
      postData.sale_page = null;
      // postData.payment_plan = null;
    }
    if (postData.transaction_type !== "payment_request") {
      postData.payment_request = [];
    }

    // console.log(value, "flasdkjf");
    // localStorage.setItem("TransactionListSearch", JSON.stringify(inputs));
    // let postData = {
    //   search: inputs.search,
    //   transaction_type: inputs.transaction_type,
    //   transaction_status: inputs.transaction_status,
    //   transaction_mode: inputs.transaction_mode,
    //   start_date: inputs.start_date,
    //   end_date: inputs.end_date,
    //   platform: inputs.platform,
    //   sale_page:
    //     inputs.transaction_type == "sale_page" ? inputs?.sale_page?._id : null,
    //   payment_request:
    //     inputs.transaction_type == "payment_request"
    //       ? inputs.payment_request.map((payment_request) => {
    //           return payment_request._id;
    //         })
    //       : [],
    // };
    // if (value) {
    //   localStorage.setItem("TransactionListSearch", JSON.stringify(value));
    //   postData = {
    //     search: value.search,
    //     transaction_type: value.transaction_type,
    //     transaction_status: value.transaction_status,
    //     transaction_mode: value.transaction_mode,
    //     start_date: value.start_date,
    //     end_date: value.end_date,
    //     platform: value.platform,
    //     sale_page:
    //       value.transaction_type == "sale_page" ? value?.sale_page?._id : null,
    //     payment_request:
    //       value.transaction_type == "payment_request"
    //         ? value.payment_request.map((payment_request) => {
    //             return payment_request._id;
    //           })
    //         : [],
    //   };
    // }
    // console.log(postData, "flkjsakld", inputs);
    try {
      setIsLoading(true);
      const result = await transactionListApi(page, rowsPerPage, postData);
      console.log(result, "=========");
      if (result.code === 200) {
        setTransactionList(result.transactions);
        setTransactionMode(result?.transactions?.transaction_mode);
        let chipData = { ...filter_data };
        // if (chipData.start_date) {
        //   let date = `Start Date : ${dd_date_format(
        //     chipData.start_date
        //   )} End Date :  ${dd_date_format(chipData.end_date)}`;
        //   chipData.date = {
        //     chip_label: date,
        //     chip_value: date,
        //   };
        //   delete chipData.start_date;
        //   delete chipData.end_date;
        // }
        if (chipData.transaction_type == "all") {
          delete chipData.transaction_type;
        }
        if (chipData.transaction_type !== "sale_page") {
          delete chipData.sale_page;
          delete chipData.payment_plan;
        }
        if (chipData.transaction_type !== "payment_request") {
          delete chipData.payment_request;
        }
        if (chipData.search_text) {
          delete chipData.search_text;
        }
        setFilterStateUpdated(chipData);
        setData(result.transactions);

        setQuestionData(result.transactions);
        const data = result.transactions.map((transaction) => {
          console.log(transaction, "transactiontransactiontransaction");
          let member_name = "";

          if (transaction.member) {
            if (transaction.member.first_name) {
              member_name = `${transaction.member.first_name} ${transaction.member.last_name} (${transaction.member.email})`;
            }
          } else if (!transaction.member) {
            member_name = `${transaction?.member_info?.name} (${transaction?.member_info?.email})`;
          } else {
            member_name = "No member info available";
          }
          return {
            ...transaction,
            id: transaction._id,
            amount: transaction.amount,
            email: member_name,
            transaction_type: transaction.transaction_type,
            transaction_date: transaction.transaction_date,
            currency: transaction.currency,
            refUser: transaction?.affliliate,
            transaction_mode: transaction?.transaction_mode,
            status: transaction?.transaction_status,
            name: member_name,
          };
        });
        setTotalPages(result.total_pages);

        setUserList(data);
        setTotalCount(result.total_transactions);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (value) => {
    //console.log.log(value, "edit value");
    navigate(`/consultant/edit-consultant/${value.id}`, {
      state: value,
    });
  };

  const handleAgreeDelete = (value) => {
    //console.log.log(value, "delete it ");
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    //console.log.log(deleteDoc, "delete function run");
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteTransactionApi(deleteDoc.id);
    if (result.code === 200) {
      getConsultantListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
    console.log(newPage, "nnnnnnnnnn");
  };
  const handleFilterByName = (event) => {
    console.log(event, "event scnz");
    setSearchText(event.target.value);
    // setFilterName(event.target.value);
    // setInputs((values) => ({ ...values, ["search_text"]: event.target.value }));
  };
  const handleSearchName = () => {
    console.log(filterData, "filter_datafilter_datafilter_datafilter_data");
    //console.log(filterName, "filterName for search");
    getConsultantListing(filterData);
    setFilterNameStatus(true);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchName();
    }
  };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };
  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }

    localStorage.setItem("member_page_number", newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const handleOpenFilterDrawer = () => {
    console.log(filterStateUpdated, "filterStateUpdated filterStateUpdated");
    setFilterDrawerState(true);
    filterStateUpdated.start_date = filterData.start_date;
    filterStateUpdated.end_date = filterData.end_date;

    setFilterData(filterStateUpdated);
  };
  const handleCloseFilterDrawer = () => {
    setFilterDrawerState(false);
  };
  // const handleFilterByName = (event) => {
  //   //console.log.log(event.target.value, "this is value");
  //   // setFilterName(event.target.value);
  //   setInputs((values) => ({
  //     ...values,
  //     ["search"]: event.target.value,
  //   }));
  // };
  const handleNavigate = () => {
    navigate(`/consultant/add-consultant`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );
  useEffect(() => {
    if (!filterNameStatus) {
      return;
    }
    getConsultantListing(filterData);
  }, []);

  const MENU_OPTIONS = [
    // {
    //   label: "Edit",
    //   icon: "akar-icons:edit",
    //   handleClick: handleEdit,
    // },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];
  const headers = [
    { label: "Name", key: "first_name" },
    { label: "Email", key: "email" },
    { label: "Amount", key: "amount" },
    { label: "Transaction Date", key: "transaction_date" },
    { label: "Transaction Mode", key: "transaction_mode" },
    { label: "Transaction Type", key: "transaction_type" },
  ];

  function download_csv_file(csv, csvFileData) {
    const headerRow = csv?.map((column) => column.label);
    const csvRows = [headerRow];

    csvFileData.forEach((row) => {
      const dataRow = csv.map((column) => {
        let value = row[column.key] || "";
        // Ensure the value is properly formatted for CSV (e.g., escaping commas)
        if (typeof value === "string" && value.includes(",")) {
          value = `"${value}"`; // Enclose in quotes if value contains a comma
        }
        return value.toString();
      });

      csvRows.push(dataRow);
    });

    const csvContent =
      "\uFEFF" + csvRows.map((row) => row.join(",")).join("\n"); // Adding BOM for UTF-8

    const hiddenElement = document.createElement("a");
    hiddenElement.href =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    hiddenElement.target = "_blank";
    hiddenElement.download = "data.csv";
    hiddenElement.click();
  }

  const handleExportClick = () => {
    download_csv_file(headers, csvData);
  };
  useEffect(() => {
    let filter_data = EMPTY_FILTER;
    // let find_filter = localStorage.getItem("TransactionListSearch");
    // if (find_filter) {
    //   filter_data = JSON.parse(find_filter);
    // }

    setFilterData(filter_data);

    (filterData.transaction_mode =
      project_type == "dev" ? "sandBox" : project_type == "dev" ? live : "all"),
      (filterData.transaction_status = "succeeded"),
      setFilterData({ ...filterData });

    setFilterStateUpdated(filter_data);
    getConsultantListing(filter_data);
    // if (JSON.parse(localStorage.getItem("TransactionListSearch"))) {
    //   setInputs(JSON.parse(localStorage.getItem("TransactionListSearch")));
    //   getConsultantListing(
    //     JSON.parse(localStorage.getItem("TransactionListSearch"))
    //   );
    // } else {
    //   getConsultantListing();
    // }
  }, [rowsPerPage, page]);

  useEffect(() => {
    const csvExportData = userList?.map((member) => {
      // console.log(userList, "sdfkhsdakj");
      return {
        ...member,
        first_name: member?.name,
        email: member?.email,
        amount: convertCurrencyToSign(member?.currency) + member?.amount,
        transaction_date: member?.transaction_date
          ? moment(member?.transaction_date).format("DD-MM-YYYY")
          : "N/A",
        transaction_type:
          convertToTitleCase(
            htmlDecode(
              member?.transaction_type == "payment_plan"
                ? "sale_page"
                : member?.transaction_type
            ) + ` | `
          ) +
          (member?.sale_page ? member?.sale_page?.sale_page_title : "") +
          (member?.payment_request
            ? ` | ` + member?.payment_request?.request_title
            : "") +
          (member?.plan ? ` | ` + member?.plan?.plan_title : "") +
          (member?.transaction_request_type
            ? ` | ` + convertToTitleCase(member?.transaction_request_type)
            : ""),
      };
    });

    setCsvData(csvExportData);
  }, [userList]);
  const isUserNotFound = userList.length === 0;

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
          <div className="col-lg-8 col-sm-12">
            <h2>Transactions</h2>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button
              className="small-contained-button  mt-1 mb-4 position-relative"
              onClick={handleOpenFilterDrawer}
            >
              Filters&nbsp;&nbsp;
              <Icon icon={roundFilterList} />
              {activeFilterCount > 0 && (
                <span className="filter-count-badge">{activeFilterCount}</span>
              )}
            </button>
            <button
              className="small-contained-button me-2 mt-1 mb-4"
              onClick={handleExportClick}
            >
              Export Csv &nbsp;&nbsp; <Icon icon={"ic:outline-file-download"} />
            </button>
            {/* <button onClick={handleNavigate} className="small-contained-button">
              Add Consultant
            </button> */}
          </div>
        </div>
        {/* <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton> */}

        <FilteredChip
          data={filterStateUpdated}
          tempState={filterData}
          EMPTY_FILTER={EMPTY_FILTER}
          // ALTER_FILTER={ALTER_FILTER}
          onDeleteChip={handleDeleteChip}
          onClear={handleClearFilter}
        />
        {/* <Typography variant="h4" gutterBottom>
              Goal Statement
            </Typography> */}
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <Card style={{ overflowX: "auto" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column align-items-start">
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20, 50]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Pagination
                  count={totalPages + 1}
                  page={pageCount}
                  defaultPage={0}
                  onChange={handleChangePages}
                  className="pagination-style"
                />
              </div>
              <div className="d-flex align-items-center">
                <UserListToolbar
                  numSelected={selected.length}
                  filterName={searchText}
                  onFilterName={handleFilterByName}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={() => getConsultantListing(filterData)}
                  className="small-contained-button-search me-3 mb-1"
                  // style={{ height: 32 }}
                >
                  Search
                </button>
              </div>
            </div>

            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {userList &&
                    userList.map((row, i) => {
                      // console.log(row, "rowrowrow");
                      const {
                        id,
                        name,
                        status,
                        lastName,
                        email,
                        profile,
                        goal,
                        address,
                        type,
                        memberCount,
                        amount,
                        transaction_date,
                        currency,
                        transaction_type,
                        created_by,
                        transaction_mode,
                        transaction_request_type,
                        payment_request,
                        sale_page,
                        plan,
                      } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className="action-in-table-width"
                          >
                            <CustomPopoverSection
                              menu={MENU_OPTIONS}
                              data={row}
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            className="action-in-table-width"
                          >
                            {page * rowsPerPage + (i + 1)}
                          </TableCell>

                          <TableCell component="th" scope="row">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0}
                            >
                              <Typography variant="subtitle2" noWrap>
                                <Tooltip title={convertToTitleCase(status)}>
                                  <FiberManualRecordIcon
                                    sx={{
                                      height: 20,
                                      width: 20,
                                      // color: "green",
                                      color:
                                        status == "succeeded"
                                          ? "#046307"
                                          : status == "canceled"
                                          ? "#f6bd4b"
                                          : status == "requires_action"
                                          ? "#163dbd"
                                          : status == "payment_failed"
                                          ? "#4b0505"
                                          : "",
                                    }}
                                  />
                                </Tooltip>
                                {email}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell component="th" scope="row">
                            {convertCurrencyToSign(currency)} {amount}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography className="text-nowrap">
                              {transaction_date
                                ? moment(transaction_date).format(
                                    "DD-MM-YYYY hh:mm A"
                                  )
                                : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {created_by
                              ? convertToTitleCase(created_by)
                              : "N/A"}
                          </TableCell>

                          {/* <TableCell component="th" scope="row">
                          {currency == "gbp"
                            ? "Pound"
                            : currency == "usd"
                            ? "Dollar"
                            : "N/A"}
                        </TableCell> */}
                          {/* <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={status === false ? "error" : "success"}
                          >
                            {status === false ? "Failed" : "Successful"}
                          </Label>
                        </TableCell> */}
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {convertToTitleCase(
                                htmlDecode(
                                  transaction_type == "payment_plan"
                                    ? "sale_page"
                                    : transaction_type
                                )
                              )}{" "}
                              ({" "}
                              {sale_page && sale_page?.sale_page_title + ` | `}
                              {payment_request &&
                                payment_request?.request_title + ` | `}
                              {plan && plan?.plan_title + ` | `}
                              {transaction_request_type &&
                                convertToTitleCase(
                                  transaction_request_type
                                )}{" "}
                              )
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {transaction_mode}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[50, 100, 150]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}
      </div>

      <CustomDrawer
        isOpenDrawer={filterDrawerState}
        onOpenDrawer={handleOpenFilterDrawer}
        onCloseDrawer={handleCloseFilterDrawer}
        pageTitle="Filters"
        componentToPassDown={
          <TransactionsFilterNew
            filterData={filterData}
            isAllDates={isAllDates}
            setIsAllDates={setIsAllDates}
            handleClearFilter={handleClearFilter}
            handleChangeOthers={handleChangeOthers}
            searchSubmitFilter={searchFunction}
          />
          // <TransactionsFilter
          //   // value={selectedValue}
          //   // setSelectedValue={setSelectedValue}
          //   dataList={getConsultantListing}
          //   onCloseDrawer={handleCloseFilterDrawer}
          //   inputs={inputs}
          //   setInputs={setInputs}
          //   isAllDates={isAllDates}
          //   setIsAllDates={setIsAllDates}
          // />
        }
      />
    </>
  );
}
