import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Card,
  Chip,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageModelBox from "src/components/ModelBox/ImageModelBox";
import { htmlDecode } from "src/utils/convertHtml";
import { s3baseUrl } from "src/config/config";
import TinyEditor from "../../components/ckeditor/Ckeditor";

// import {
//   AddCommentAPI,
//   DeleteComment,
//   DeleteCommentImageOnS3,
//   UpdateCommentAPI,
//   UploadCommentImageOnS3,
// } from "src/DAL/SupportTicket/Comments";
import { useSnackbar } from "notistack";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import CustomPopover from "src/components/MenuOption/CustomPopoverSection";
import moment from "moment";

// import { useContentSetting } from "src/Hooks/ContentSettingState";
import {
  csvImage,
  docImage,
  pdfImage,
  wordImage,
  audioImage,
  xlsxImage,
  otherImage,
} from "src/assets";
import { defaultSettingApi } from "src/DAL/SiteSetting/siteSetting";
import {
  addSupportTicketComment,
  deleteSupportTicketComment,
  updateSupportTicketComment,
} from "src/DAL/supportTicket/supportTicket";
import {
  uploadImageOns3,
  uploadSupportImageOns3,
} from "src/DAL/commonApi/commonApi";
import { clickAbleUrl } from "src/utils/constant";

function ChatCard({
  comments,
  ticket_id,
  list_data,
  supportTicketData,
  memberName,
  support_ticket_team_info,
  memberEmail,
}) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [oldImagesArray, setOldImagesArray] = useState([]);
  const [oldImageInsert, setOldImageInsert] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [member, setMember] = useState();
  const [personName, setPersonName] = useState([]);
  const [defaultTimeZone, setDefaultTimeZone] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [adminMessage, setAdminMessage] = React.useState("");
  console.log(supportTicketData, " supportTicketData supportTicketData");
  const [template, setTemplate] = useState([
    {
      label: `Hi ${memberName ? memberName : "User"}`,
      message: `Hi ${memberName ? memberName : "User"} How are you?`,
    },
    {
      label: "Greetings",
      message: "Thanks for reaching out to our support team, ",
    },
    { label: "Regards", message: "Regards BeeMe Academy Support Team" },
    {
      label: "Ending Signature",
      message: "Regards BeeMe Academy Support Team",
    },
    {
      label: "Thanks & Regards",
      message: "Thanks & Regards BeeMe Academy Support Team",
    },
    {
      label: "Feedback",
      message: "Please Let us know if this helps you",
    },
    {
      label: "Reminder",
      message:
        "Hi, " +
        `${memberEmail === undefined ? "" : memberEmail}` +
        " we hope your issue has been resolved kindly give your feedback\nRegards BeeMe Academy Support Team",
    },
  ]);
  const [showButtons, setShowButtons] = React.useState({
    addButton: true,
    editButton: false,
  });
  const [state, setState] = useState({
    message: "",
  });
  const handleOpen = (image_path) => {
    setImageUrl(image_path);
    setOpen(true);
  };

  const handleMessage = (value) => {
    console.log(value, "message to show");
    const messageTemplate = adminMessage + value;
    setAdminMessage(messageTemplate);
    setState((prevState) => {
      return {
        ...prevState,
        ["message"]: adminMessage,
      };
    });
  };
  const UploadImages = async (formData) => {
    console.log(...formData, "formDataformDataformData");
    const result = await uploadSupportImageOns3(formData);
    console.log(result, "resultresultresult");

    return result.image_path;
  };
  const DeleteImages = async (formData) => {
    // const result = await DeleteCommentImageOnS3(formData);
    // return result;
  };

  //   const { userInfo, adminTimeZone } = useContentSetting();

  const handleClose = () => setOpen(false);

  const handleRemove = (index) => {
    files.splice(index, 1);
    setFiles([...files]);
  };
  const handleUpload = (event) => {
    let setImageObject = {};
    const fileList = event.target.files;
    for (let i = 0; i < fileList.length; i++) {
      setImageObject = {
        path: fileList[i],
        type: "file",
        extension: fileList[i].type,
      };
      console.log(setImageObject, "setImageObject");
      setFiles((prevFiles) => [...prevFiles, setImageObject]);
    }
  };
  console.log(oldImagesArray, "oldImagesArray ok");
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const deleted_images_array = [];
    let deleted_images_object = {};
    oldImagesArray.map((old_image, index) => {
      const filtered_array = files.filter(
        (image, index) => image.thumbnail_1 == old_image.thumbnail_1
      );
      delete old_image.type;
      if (filtered_array.length == 0) {
        deleted_images_array.push(old_image);
      }
    });
    if (deleted_images_array.length > 0) {
      deleted_images_object = {
        moment_image: deleted_images_array,
      };
      const result = DeleteImages(deleted_images_object);
    }
    const results = files.map((image, index) => {
      console.log("calling api file");
      if (image.type === "file") {
        const formData = new FormData();
        formData.append("image", image.path);
        formData.append("width", 600);
        const result = UploadImages(formData);
        return result;
      } else {
        return image;
      }
    });

    Promise.all(results).then(async (img_results) => {
      console.log(img_results, "img_resultsimg_resultsimg_results");
      var setImageArray = [];
      img_results.map((image_path, index) => {
        setImageArray.push(image_path);
      });
      const formDataObject = {
        message: adminMessage,
      };
      if (files.length > 0) {
        formDataObject.comment_image = setImageArray;
      }
      const result = await updateSupportTicketComment(
        formDataObject,
        commentId
      );
      if (result.code === 200) {
        list_data();
        setState((prevState) => {
          return {
            ...prevState,
            ["message"]: "",
          };
        });
        setFiles([]);
        setCommentId("");
        setShowButtons({
          addButton: true,
          editButton: false,
        });
        setIsLoading(false);
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    });
  };
  //Deleting Note
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    // DeleteComment
    const result = await deleteSupportTicketComment(commentId);
    if (result.code === 200) {
      list_data();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  //Getting Note In textarea
  const handleEdit = (comment) => {
    console.log(comment, "commentcommentcomment");
    setAdminMessage(comment.message);
    setState((prevState) => {
      return {
        ...prevState,
        ["message"]: comment.message,
      };
    });
    setCommentId(comment._id);
    setShowButtons({
      addButton: false,
      editButton: true,
    });
    let setImageObject = {};
    comment?.comment_image?.map((images, index) => {
      setImageObject = {
        thumbnail_1: images?.thumbnail_1,
        thumbnail_2: images?.thumbnail_1,
        type: "image",
      };
      files.push(setImageObject);
      oldImagesArray.push(setImageObject);
      oldImageInsert.push(setImageObject);
    });
  };
  console.log(files, "filesfilesfiles");
  console.log(oldImagesArray, "oldImagesArray");
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(files, "img_resultsimg_results");

    const results = files.map((image, index) => {
      const formData = new FormData();
      formData.append("image", image.path);
      formData.append("width", "600");
      const result = uploadImageOns3(formData);
      console.log(result, "image path");
      console.log(formData, "image path");
      return result;
    });
    console.log(results, "resultsresults");

    Promise.all(results).then(async (img_results) => {
      console.log(img_results, "img_resultsok");
      var setImageArray = [];
      var setImageObject = {};
      img_results.map((image_path, index) => {
        setImageObject = {
          thumbnail_1: image_path.image_path,
        };
        setImageArray.push(setImageObject);
      });
      const formDataObject = {
        support_ticket: ticket_id,
        message: adminMessage,
        team_id: member,
      };
      if (files.length > 0) {
        formDataObject.comment_image = setImageArray;
      }
      console.log(formDataObject, "formDataObjectformDataObject");
      console.log(setImageArray, "setImageArraysetImageArray");
      // add comment api
      const result = await addSupportTicketComment(
        JSON.stringify(formDataObject)
      );
      if (result.code === 200) {
        setIsLoading(false);
        list_data();
        setState((prevState) => {
          return {
            ...prevState,
            ["message"]: "",
          };
        });

        setFiles([]);
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    });
  };

  const handleCancelUpdate = () => {
    setState((prevState) => {
      return {
        ...prevState,
        ["message"]: "",
      };
    });
    setCommentId("");
    setShowButtons({
      addButton: true,
      editButton: false,
    });
    setFiles([]);
  };
  const handleChangeMember = (value) => {
    console.log(value, "kokokokokokoko");
  };

  const handleAgreeDelete = (comment) => {
    setCommentId(comment._id);
    setOpenDelete(true);
  };
  const getDefaultSetting = async () => {
    setIsLoading(true);
    const result = await defaultSettingApi();
    if (result.code === 200) {
      moment.tz.setDefault(result?.default_setting?.time_zone);
      setDefaultTimeZone(result?.default_setting?.time_zone);
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
  const MENU_OPTIONS1 = [
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  const imageLinks = {
    docx: wordImage,
    mp3: audioImage,
    pdf: pdfImage,
    csv: csvImage,
    doc: docImage,
    xlsx: xlsxImage,
    xls: xlsxImage,
    other: otherImage,
  };

  const getCommentRecourse = (file) => {
    console.log(file, "filefilefilefile");
    const ext = file?.thumbnail_1?.split(".").pop();
    if (
      ext == "jpg" ||
      ext == "JPG" ||
      ext == "png" ||
      ext == "webp" ||
      ext == "jpeg" ||
      ext == "JPEG" ||
      ext == "PNG"
    ) {
      console.log(ext, "extextextextextext");
      return s3baseUrl + file.thumbnail_2;
    } else if (imageLinks[ext]) {
      console.log("imageLinksimageLinks");
      return imageLinks[ext];
    } else {
      console.log("otherotherotherotherother");
      return imageLinks.other;
    }
  };

  const getCommentImage = (file) => {
    console.log(file, "filefilefilefile");
    if (file.type === "file") {
      const ext = file.path.name.split(".").pop();
      if (
        ext == "jpg" ||
        ext == "JPG" ||
        ext == "png" ||
        ext == "webp" ||
        ext == "jpeg" ||
        ext == "JPEG" ||
        ext == "PNG"
      ) {
        return URL.createObjectURL(file.path);
      } else if (imageLinks[ext]) {
        return imageLinks[ext];
      } else {
        return imageLinks.other;
      }
    } else {
      const ext = file?.thumbnail_1?.split(".").pop();
      if (
        ext == "jpg" ||
        ext == "JPG" ||
        ext == "png" ||
        ext == "webp" ||
        ext == "jpeg" ||
        ext == "JPEG" ||
        ext == "PNG"
      ) {
        return s3baseUrl + file.thumbnail_2;
      } else if (imageLinks[ext]) {
        return imageLinks[ext];
      } else {
        return imageLinks.other;
      }
    }
  };
  useEffect(() => {
    getDefaultSetting();
    let supportTeam = [];
    console.log(supportTicketData, "supportTicketData");
    supportTicketData?.support_team_info?.map((team) => {
      return supportTeam.push(team._id);
    });
  }, []);
  useEffect(() => {
    setTemplate([
      {
        label: `Hi ${memberName ? memberName : "User"}`,
        message: `Hi ${memberName ? memberName : "User"} How are you?`,
      },
      {
        label: "Greetings",
        message: "Thanks for reaching out to our support team, ",
      },
      { label: "Regards", message: "Regards BeeMe Academy Support Team" },
      {
        label: "Ending Signature",
        message: "Regards BeeMe Academy Support Team",
      },
      {
        label: "Thanks & Regards",
        message: "Thanks & Regards BeeMe Academy Support Team",
      },
      {
        label: "Feedback",
        message: "Please Let us know if this helps you",
      },
      {
        label: "Reminder",
        message:
          "Hi, " +
          `${memberEmail === undefined ? "" : memberEmail}` +
          " we hope your issue has been resolved kindly give your feedback\nRegards BeeMe Academy Support Team",
      },
    ]);
  }, [memberName]);

  //   console.log(comments, "comments");
  //   moment.tz.setDefault(userInfo.time_zone);
  //   useEffect(() => {
  //     console.log(userInfo.time_zone, "Reload useEffect");
  //   }, []);
  useEffect(() => {
    setPersonName(support_ticket_team_info);
  }, [support_ticket_team_info]);

  console.log(support_ticket_team_info, "support_ticket_team_info");
  console.log(supportTicketData, "supportTicketData");
  console.log(personName, "personName");
  console.log(member, "member");
  return (
    <div className="col-12">
      {/* <Autocomplete
        multiple
        id="tags-outlined"
        options={personName}
        getOptionLabel={(option) =>
          option.first_name + " (" + option.email + ")"
        }
        filterSelectedOptions
        value={member}
        onChange={(event, newValue) => {
          setMember(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Members" placeholder="Members" />
        )}
      /> */}

      <Card className="chat-main-card p-2 mt-3">
        <div className="chat-message-box">
          {comments &&
            comments.map((comment, i) => {
              {
                /* console.log(comment, "comment.createdAtcomment.createdAt"); */
              }

              var moment = require("moment-timezone");
              var comment_date = moment.tz(
                comment.action_date,
                defaultTimeZone
              );
              {
                /* const comment_date = comment.action_date; */
              }
              {
                /* console.log(comment_date, "comment_datecomment_date11"); */
              }

              return (
                <>
                  <div className="incoming-message w-100 ps-2 pe-3">
                    <div className="chat-message-body pt-1 pb-4 mt-2">
                      <div className="d-flex ">
                        {/* <img
                            src={
                              s3baseUrl + comment.action_user_info.profile_image
                            }
                          /> */}
                        <Avatar
                          alt={comment?.action_user_info?.action_name}
                          src={
                            s3baseUrl + comment.action_user_info.profile_image
                          }
                        />
                        <div className="description w-100 custom-popover-box ps-2">
                          <div className="set-title-width d-flex justify-content-between w-100 pe-3">
                            <p className="card-title pt-2 mb-0">
                              {htmlDecode(comment.action_user_info.action_name)}
                            </p>
                            <span className="date-color pt-2 mb-0">
                              {/* {moment(comment_date).fromNow()} */}
                              {moment(
                                comment_date,
                                "YYYY-mm-dd HH:mm:ss"
                              ).fromNow()}
                            </span>
                          </div>
                          {/* <p className="mt-2 pe-3">
                            {htmlDecode(comment.message)}
                          </p> */}
                          <div
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: comment.message,
                            }}></div>
                          {comment.comment_image &&
                            comment.comment_image.map((image, i) => {
                              const ext = image?.thumbnail_1?.split(".").pop();
                              if (
                                ext == "jpg" ||
                                ext == "JPG" ||
                                ext == "png" ||
                                ext == "webp" ||
                                ext == "jpeg" ||
                                ext == "JPEG" ||
                                ext == "PNG"
                              ) {
                                return (
                                  <span className="preview" key={i}>
                                    <img
                                      onClick={() => {
                                        handleOpen(
                                          s3baseUrl + image.thumbnail_1
                                        );
                                      }}
                                      className="p-0 image-border"
                                      src={s3baseUrl + image.thumbnail_1}
                                    />
                                  </span>
                                );
                              } else {
                                return (
                                  <span className="preview" key={i}>
                                    <a
                                      href={s3baseUrl + image.thumbnail_1}
                                      target="_blank"
                                      rel="noopener noreferrer">
                                      <img
                                        className="image-border"
                                        src={getCommentRecourse(image)}
                                      />
                                    </a>
                                  </span>
                                );
                              }
                            })}
                        </div>
                        {comment?.action_user_info?.action_by ==
                        "consultant_user" ? (
                          <CustomPopover menu={MENU_OPTIONS} data={comment} />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <hr />
                </>
              );
            })}
          <form onSubmit={showButtons.addButton ? handleSubmit : handleUpdate}>
            {/* <div className="px-3">
                <TextField
                  id="outlined-multiline-static"
                  label="Enter Message"
                  multiline
                  rows={5}
                  variant="outlined"
                  style={{ width: "100%" }}
                  name="message"
                  value={state.message}
                  onChange={(e) => handleChange(e)}
                  className="w-100 mt-3"
                  required={true}
                />
              </div> */}
            <div className="col-12 mt-5">
              <h4>Enter Message *</h4>
              <TinyEditor
                setDetailDescription={setAdminMessage}
                detailDescriptionCk={adminMessage}
              />
            </div>
            {/* <div className="px-3 mt-3">
              <Stack spacing={2} sx={{ width: 300 }}>
                <Autocomplete
                  id="free-solo-demo"
                  getOptionLabel={(option) =>
                    option.first_name +
                    " " +
                    option.last_name +
                    " (" +
                    option.email +
                    ")"
                  }
                  onChange={(event, newValue) => {
                    setMember(newValue?._id);
                  }}
                  value={member}
                  options={personName}
                  renderInput={(params) => (
                    <TextField {...params} label="Comment On Behalf" required />
                  )}
                />
              </Stack>
            </div> */}
            <div className="col-12 mb-3 px-3 mt-2">
              <Divider className="mb-2" />
              {template.map((message) => {
                return (
                  <Chip
                    label={message.label}
                    className="me-1 mb-1"
                    onClick={() => handleMessage(message.message)}
                  />
                );
              })}

              <Divider className="mt-2" />
            </div>
            <div className="w-100 px-3 d-flex">
              <div className="row w-100 mb-3 add-photo">
                <p className="mt-2">Recommended Size (1000x670)</p>
                {files &&
                  files.map((file, index) => (
                    <div className="col-sm-3 col-md-2 col-lg-1 mt-2 ms-2 p-0">
                      <span className="preview">
                        <span onClick={() => handleRemove(index)}>x</span>
                        <img
                          className="image-border"
                          src={getCommentImage(file)}
                        />
                      </span>
                    </div>
                  ))}
                <div className="col-sm-3 col-md-2 col-lg-1 mt-2">
                  <span className="upload-button">
                    <input
                      color="primary"
                      type="file"
                      id="icon-button-file"
                      style={{ display: "none" }}
                      onChange={handleUpload}
                      multiple={true}
                      accept="image/*,.pdf,.xlsx,.xls,.docx,.csv,.doc"
                    />
                    <label htmlFor="icon-button-file" className="image-border">
                      <CloudUploadIcon />
                    </label>
                  </span>
                </div>
              </div>
            </div>
            {showButtons.addButton === true &&
              (supportTicketData.ticket_status === 0 ? (
                <button
                  type="submit"
                  className="mt-2 float-end small-contained-button-search mb-4 me-4"
                  disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="mt-2 float-end small-contained-button-search disabled mb-4 me-4"
                  disabled={true}>
                  Save
                </button>
              ))}
            {showButtons.editButton === true && (
              <div className="d-flex justify-content-end mb-4 me-4">
                <button
                  className="mt-2 me-2 small-outlined-button"
                  onClick={handleCancelUpdate}>
                  Cancel
                </button>
                <button
                  className="mt-2 small-contained-button"
                  type="submit"
                  disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            )}
            <CustomConfirmation
              open={openDelete}
              setOpen={setOpenDelete}
              title={"Are you sure you want to delete this comment?"}
              handleAgree={handleDelete}
            />
          </form>
        </div>
      </Card>

      <ImageModelBox
        open={open}
        handleClose={handleClose}
        image_url={imageUrl}
      />
    </div>
  );
}

export default ChatCard;
