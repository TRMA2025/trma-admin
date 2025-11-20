import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";

import { useSnackbar } from "notistack";
import { useEffect } from "react";
// import { client_Url } from "src/config/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { pagesListingApi } from "src/DAL/WebsitePages/websitepages";
import { addMenuApi, editMenuApi } from "src/components/MenuItems/MenuItems";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export const MenuItems = () => {
  const params = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef(null);
  const [formAction, setFormAction] = useState("ADD");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainHeading, setMainHeading] = useState("");
  const [pageData, setPageData] = useState([]);
  const [inputList, setInputList] = useState([
    {
      title: "",
      item_url_for: "custom",
      item_url: "",
      is_new_tab: false,
      page: "",
      section_id: "",
      status: true,
      new_child_menu: false,
      items: [],
    },
  ]);

  const classes = useStyles();
  const getPageList = async () => {
    let result = await pagesListingApi();
    if (result.code == 200) {
      setPageData(result.Sale_page);
      setIsLoading(false);
    }
  };

  // handle click event of the Add button
  const handleAddClick = (index) => {
    setInputList([
      ...inputList.slice(0, index),
      {
        title: "",
        item_url_for: "custom",
        item_url: "",
        is_new_tab: false,
        page: "",
        section_id: "",
        status: true,
        new_child_menu: false,
      },
      ...inputList.slice(index),
    ]);
  };

  const handleAddNestedMenuClick = (parentIndex, index) => {
    const list = [...inputList];
    let newItemObj = {
      title: "",
      item_url_for: "custom",
      item_url: "",
      is_new_tab: false,
      section_id: "",
      page: "",
      status: true,
    };
    list[parentIndex]["items"].push(newItemObj);
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleRemoveNestedClick = (parent, index) => {
    const list = [...inputList];
    const itemsList = list[parent];
    itemsList.items.splice(index, 1);
    setInputList(list);
  };

  // handle input change
  const handleInputChange = (e, index, parentIndex) => {
    const { name, value } = e.target;
    const list = [...inputList];
    const found = pageData.find((element) => element._id == value);
    if (parentIndex !== undefined) {
      let selected_index = list[parentIndex];
      selected_index["items"][index][name] = value;
      if (name === "page") {
        // selected_index["items"][index]["item_url"] =
        //   client_Url + found.page_component_name;
      } else {
        selected_index["items"][index][name] = value;
      }
      setInputList(list);
    } else {
      list[index][name] = value;
      if (name === "page" || name === "scroll_section") {
        // list[index]["item_url"] = client_Url + found.page_component_name;
      } else {
        list[index][name] = value;
      }

      setInputList(list);
    }
  };

  const handleRemoveValues = () => {
    setMainHeading("");
    setInputList([
      {
        title: "",
        item_url_for: "custom",
        item_url: "",
        is_new_tab: false,
        page: "",
        status: true,
        new_child_menu: false,
        items: [],
      },
    ]);
    setFormAction("ADD");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalData = {};
    inputList.map((item) => {
      if (item.title == "") {
      } else {
        if (item.item_url_for === "custom") {
          delete item.page;
          delete item.section_id;
        }
        if (item.item_url_for === "page") {
          delete item.section_id;
        }
        delete item._id;
        delete item.new_child_menu;

        item?.items?.map((nestedItem) => {
          if (nestedItem.item_url_for === "custom") {
            delete item.page;
            delete nestedItem.page;
            delete nestedItem.section_id;
          }
          if (nestedItem.item_url_for === "page") {
            delete nestedItem.section_id;
          }
          delete nestedItem._id;
        });
        setIsSubmitting(true);
        finalData = {
          menu_title: mainHeading,
          menu_items: inputList,
        };
      }
    });

    const result = state
      ? await editMenuApi(finalData, state._id)
      : await addMenuApi(finalData);
    if (result.code == 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsSubmitting(false);
      setMainHeading("");
      setInputList([
        {
          title: "",
          item_url_for: "custom",
          item_url: "",
          is_new_tab: true,
          page: "",
          section_id: "",
          status: true,
          new_child_menu: false,
          items: [],
        },
      ]);
      navigate("/menus");
      handleCloseForm();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsSubmitting(false);
    }
  };

  const handleManageNestedMenu = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
    if (value == true) {
      const list = [...inputList];
      let nestedItem = [
        {
          title: "",
          item_url_for: "",
          item_url: "",
          is_new_tab: false,
          page: "",
          status: true,
        },
      ];
      list[index].items = nestedItem;
      setInputList(list);
    }
  };

  const handleCloseForm = () => {
    handleRemoveValues();
    navigate("/menus");
  };
  const moveTop = (parentIndex) => {
    console.log(parentIndex, "top");
    let newArray = [...inputList];
    // newArray.splice(parentIndex, 0, parentIndex - 1);
    const temp = newArray[parentIndex];
    newArray[parentIndex] = newArray[parentIndex - 1];
    newArray[parentIndex - 1] = temp;
    setInputList(newArray);
  };
  const moveDown = (parentIndex) => {
    console.log(parentIndex, "parentIndexparentIndex");
    if (parentIndex >= 0 && parentIndex < inputList.length - 1) {
      console.log("entered");
      let newArray = [...inputList];
      // newArray.splice(parentIndex, 0, parentIndex - 1);
      const temp = newArray[parentIndex];
      newArray[parentIndex] = newArray[parentIndex + 1];
      newArray[parentIndex + 1] = temp;
      setInputList(newArray);
    }
  };
  const MENU_OPTIONS = [
    {
      label: "Move Up",
      icon: "ic:baseline-loop",
      handleClick: moveTop,
    },
    {
      label: "Move down",
      icon: "ic:baseline-loop",
      handleClick: moveDown,
    },
  ];
  const last_menu = [
    {
      label: "Move Up",
      icon: "ic:baseline-loop",
      handleClick: moveTop,
    },
  ];
  const MENU_OPTION = [
    {
      label: "Move down",
      icon: "ic:baseline-loop",
      handleClick: moveDown,
    },
  ];
  useEffect(() => {
    if (params.id !== undefined) {
      setInputList(state?.menu_items);
      setMainHeading(state?.menu_title);
      setFormAction("EDIT");
    }
  }, [params.id]);

  useEffect(() => {
    getPageList();
  }, []);

  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <IconButton
            className="back-screen-button mb-4"
            onClick={handleCloseForm}
          >
            <ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />{" "}
          </IconButton>
        </div>
        <div className="col-12 col-md-6">
          <h1>Menus</h1>
        </div>
      </div>
      {
        <form ref={ref}>
          <div className="row question-background mt-5">
            <div className="col-lg-12 col-md-12 col-sm-12 mt-3 mb-3">
              <TextField
                id="outlined-basic"
                label="Menu Heading"
                variant="outlined"
                fullWidth
                required
                value={mainHeading}
                onChange={(e) => setMainHeading(e.target.value)}
              />
            </div>
          </div>
          <div className="row question-background mt-4">
            {inputList?.map((x, parentIndex) => {
              return (
                <div className="col-lg-12 col-md-12 col-sm-12 mt-3 mb-3 d-flex">
                  <div className="col-10 card p-3">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12 ">
                        <TextField
                          id="outlined-basic"
                          label="Title"
                          variant="outlined"
                          fullWidth
                          name="title"
                          value={x.title}
                          required
                          onChange={(e) => handleInputChange(e, parentIndex)}
                        />
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Item Url For *
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="item_url_for"
                            value={x.item_url_for}
                            label="Item Url For *"
                            onChange={(e) => handleInputChange(e, parentIndex)}
                          >
                            <MenuItem value="page">Page</MenuItem>
                            <MenuItem value="custom">Custom</MenuItem>
                            <MenuItem value="scroll_section">
                              Scroll Section
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      {(x.item_url_for == "page" ||
                        x.item_url_for == "scroll_section") && (
                        <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Select Page *
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              name="page"
                              value={x.page}
                              label="Select Page *"
                              onChange={(e) =>
                                handleInputChange(e, parentIndex)
                              }
                            >
                              {pageData.map((value, i) => {
                                return (
                                  <MenuItem value={value._id}>
                                    {value?.sale_page_title}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </div>
                      )}
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                        <TextField
                          id="outlined-basic"
                          label="Item URL"
                          variant="outlined"
                          fullWidth
                          name="item_url"
                          value={x.item_url}
                          onChange={(e) => handleInputChange(e, parentIndex)}
                        />
                      </div>
                      {x.item_url_for == "scroll_section" && (
                        <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                          <TextField
                            id="outlined-basic"
                            label="Scroll Section Id"
                            variant="outlined"
                            fullWidth
                            name="section_id"
                            value={x.section_id}
                            onChange={(e) => handleInputChange(e, parentIndex)}
                          />
                        </div>
                      )}
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Menu Open In New Tab
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="is_new_tab"
                            value={x.is_new_tab}
                            label="Menu Open In New Tab"
                            onChange={(e) => handleInputChange(e, parentIndex)}
                          >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Status
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="status"
                            value={x.status}
                            label="Status "
                            onChange={(e) => handleInputChange(e, parentIndex)}
                          >
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            New Child Menu
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="new_child_menu"
                            value={
                              x.new_child_menu ? x.new_child_menu : "false"
                            }
                            label="New Child Menu"
                            onChange={(e) =>
                              handleManageNestedMenu(e, parentIndex)
                            }
                          >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    {x.items == undefined
                      ? ""
                      : x.items.length > 0 && (
                          <div className="row mt-3 mb-3 ms-1">
                            {x.items.map((nested, i) => {
                              return (
                                <>
                                  <div className="col-10 mt-3 card p-4 nested-child-menu">
                                    <div className="row">
                                      <div className="col-lg-12 col-md-12 col-sm-12 ">
                                        <TextField
                                          id="outlined-basic"
                                          label="Title"
                                          variant="outlined"
                                          fullWidth
                                          name="title"
                                          value={nested.title}
                                          onChange={(e) =>
                                            handleInputChange(e, i, parentIndex)
                                          }
                                        />
                                      </div>
                                      <div className="col-3 col-sm-6 mt-3">
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Item Url For *
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="item_url_for"
                                            value={nested.item_url_for}
                                            label="Item Url For *"
                                            onChange={(e) =>
                                              handleInputChange(
                                                e,
                                                i,
                                                parentIndex
                                              )
                                            }
                                          >
                                            <MenuItem value="page">
                                              Page
                                            </MenuItem>
                                            <MenuItem value="custom">
                                              Custom
                                            </MenuItem>
                                            <MenuItem value="scroll_section">
                                              Scroll Section
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </div>
                                      {(nested.item_url_for == "page" ||
                                        nested.item_url_for ==
                                          "scroll_section") && (
                                        <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                                          <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">
                                              Select Page *
                                            </InputLabel>
                                            <Select
                                              labelId="demo-simple-select-label"
                                              id="demo-simple-select"
                                              name="page"
                                              value={nested.page}
                                              label="Select Page *"
                                              onChange={(e) =>
                                                handleInputChange(
                                                  e,
                                                  i,
                                                  parentIndex
                                                )
                                              }
                                            >
                                              {pageData.map((value, i) => {
                                                return (
                                                  <MenuItem value={value._id}>
                                                    {value?.sale_page_title}
                                                  </MenuItem>
                                                );
                                              })}
                                            </Select>
                                          </FormControl>
                                        </div>
                                      )}
                                      {nested.item_url_for ==
                                        "scroll_section" && (
                                        <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                                          <TextField
                                            id="outlined-basic"
                                            label="Scroll Section Id"
                                            variant="outlined"
                                            fullWidth
                                            name="section_id"
                                            value={nested.section_id}
                                            onChange={(e) =>
                                              handleInputChange(
                                                e,
                                                i,
                                                parentIndex
                                              )
                                            }
                                          />
                                        </div>
                                      )}
                                      <div className="col-3 col-sm-6 mt-3">
                                        <TextField
                                          id="outlined-basic"
                                          label="Item URL"
                                          variant="outlined"
                                          fullWidth
                                          name="item_url"
                                          value={nested.item_url}
                                          onChange={(e) =>
                                            handleInputChange(e, i, parentIndex)
                                          }
                                        />
                                      </div>

                                      <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Menu Open In New Tab
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="is_new_tab"
                                            value={nested.is_new_tab}
                                            label="Menu Open In New Tab *"
                                            onChange={(e) =>
                                              handleInputChange(
                                                e,
                                                i,
                                                parentIndex
                                              )
                                            }
                                          >
                                            <MenuItem value={true}>
                                              Yes
                                            </MenuItem>
                                            <MenuItem value={false}>
                                              No
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </div>
                                      <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Status
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="status"
                                            value={nested.status}
                                            label="status "
                                            onChange={(e) =>
                                              handleInputChange(
                                                e,
                                                i,
                                                parentIndex
                                              )
                                            }
                                          >
                                            <MenuItem value={true}>
                                              Active
                                            </MenuItem>
                                            <MenuItem value={false}>
                                              Inactive
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-2">
                                    <AddCircleOutlineIcon
                                      className="question-survey"
                                      onClick={() =>
                                        handleAddNestedMenuClick(parentIndex, i)
                                      }
                                    />
                                    {x.items.length !== 0 && (
                                      <RemoveCircleOutlineIcon
                                        className="question-survey"
                                        onClick={() =>
                                          handleRemoveNestedClick(
                                            parentIndex,
                                            i
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        )}
                  </div>

                  <div className="col-2 d-flex">
                    <AddCircleOutlineIcon
                      className="question-surveys"
                      onClick={() => handleAddClick(parentIndex + 1)}
                    />
                    {inputList.length !== 1 && (
                      <RemoveCircleOutlineIcon
                        className="question-survey"
                        onClick={() => handleRemoveClick(parentIndex)}
                      />
                    )}
                    {inputList.length !== 1 && (
                      <span className="margin-top">
                        <CustomPopoverSection
                          menu={
                            parentIndex == "0"
                              ? MENU_OPTION
                              : parentIndex == inputList.length - 1
                              ? last_menu
                              : MENU_OPTIONS
                          }
                          data={parentIndex}
                        />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-12 mt-4 text-end mb-4">
            <button
              className="small-contained-button"
              onClick={formAction === "ADD" ? handleSubmit : handleSubmit}
            >
              {formAction === "ADD"
                ? isSubmitting
                  ? "Submitting"
                  : "Submit"
                : isSubmitting
                ? "Updating"
                : "Update"}
            </button>
            <button
              className="small-contained-button ms-2"
              onClick={handleCloseForm}
            >
              Close
            </button>
          </div>
        </form>
      }
    </div>
  );
};
