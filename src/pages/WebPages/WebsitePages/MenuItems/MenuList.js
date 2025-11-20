import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";

import {
  deleteMenuApi,
  getMenuListApi,
} from "src/components/MenuItems/MenuItems";
import CustomMUITable from "src/components/CustomMUITable";
// import Card from "src/theme/overrides/Card";
import Skeleton from "react-loading-skeleton";
import ListStagesTypeSkeleton from "src/components/listSkeleton/ListStagesTypeSkeleton";

const TABLE_HEAD = [
  {
    id: "action",
    label: "Action",
    alignRight: false,
    type: "action",
    className: "action-in-table-width",
  },
  {
    id: "number",
    label: "#",
    alignRight: false,
    type: "number",
    className: "action-in-table-width",
  },
  { id: "menu_title", label: "Menu", alignRight: false },
];

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function MenuList() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [menuList, setMenuList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickAddMenu = (value) => {
    navigate(`/menu/add-menu`);
  };

  const getMenuListing = async () => {
    setIsLoading(true);
    const result = await getMenuListApi();
    if (result.code === 200) {
      setMenuList(result.menu);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleEdit = (value) => {
    navigate(`/menu/${value._id}`, {
      state: value,
    });
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await deleteMenuApi(deleteDoc._id);
    if (result.code === 200) {
      getMenuListing();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMenuListing();
  }, []);

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

  return (
    <>
      <CustomConfirmation
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />

      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-8 col-sm-12">
            <h1>Menus</h1>
          </div>
          <div className="col-lg-4 col-sm-12 text-end">
            <button
              className="small-contained-button float-end mt-1"
              onClick={handleClickAddMenu}
            >
              Add Menu
            </button>
          </div>
        </div>
        {isLoading ? (
          <ListStagesTypeSkeleton />
        ) : (
          <CustomMUITable
            TABLE_HEAD={TABLE_HEAD}
            data={menuList}
            MENU_OPTIONS={MENU_OPTIONS}
            className="card-with-background"
            pagePagination={true}
          />
        )}
      </div>
    </>
  );
}
