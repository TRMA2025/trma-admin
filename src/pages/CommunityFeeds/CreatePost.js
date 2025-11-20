import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import Modal from "@mui/material/Modal";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Avatar, CircularProgress, InputBase } from "@mui/material";
import {
  add_new_feed,
  update_feed,
  update_feed_image_on_s3,
  uploadMultipleFeedImageOns3,
} from "src/DAL/CommunityArea/Community";
import { useLocation, useNavigate } from "react-router-dom";
import GeneralMenuPopup from "src/components/EmojiPickerPopup";
import { useRef } from "react";
import { s3baseUrl } from "src/config/config";
import { makeStyles } from "@mui/styles";

import {
  uploadFeedImageOns3,
  uploadImageOns3,
} from "src/DAL/commonApi/commonApi";
import { useContentSetting } from "src/Hooks/ContentSettingState";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "45%",
    marginTop: "2%",
    marginBottom: "2%",
  },
}));
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  maxWidth: "100%",
  maxHeight: "100vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 1,
  overflow: "auto",
};

export default function CreatePost({
  openCreateModal,
  setOpenCreateModal,
  setFeedType,
  feedType,
  getFeedsListing,
  userInfo,
  formAction,
  selectedFeed,
  setFormAction,
  handleSuccessUpdate,
  openDetailModal,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { socket } = useContentSetting();

  const { enqueueSnackbar } = useSnackbar();
  const [previews, setPreviews] = useState([]);
  const [uploadedImage, setUploadedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [feedId, setFeedId] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const [inputs, setInputs] = useState({
    feedAppearBy: "public",
    VideoUrl: "",
    description: "",
    LiveUrl: "",
  });
  const handleRemove = () => {
    setThumbnail("");
  };
  const handleRemoveImage = (path) => {
    console.log(path, "path");
    setPreviews((images) => {
      return images.filter((image) => image !== path);
    });
    // setUploadedImage([]);
  };

  const UploadImagesold = async (formData) => {
    const result = await update_feed_image_on_s3(formData);
    return result.images_obj;
  };
  const UploadImages = async (formData) => {
    const result = await uploadMultipleFeedImageOns3(formData);
    return result.image_path;
  };
  const handleUpload = async (event) => {
    const fileList = event.target.files;
    const imagesToAdd = [];

    // Check if adding images will exceed the limit of 2
    if (previews.length + fileList.length > 2) {
      // If so, add only the remaining slots up to 2
      const remainingSlots = 2 - previews.length;
      for (let i = 0; i < remainingSlots; i++) {
        imagesToAdd.push({
          path: fileList[i],
          type: "file",
        });
      }
    } else {
      // If not, add all the selected images
      for (let i = 0; i < fileList.length; i++) {
        imagesToAdd.push({
          path: fileList[i],
          type: "file",
        });
      }
    }

    setPreviews((prevFiles) => [...prevFiles, ...imagesToAdd]);
  };

  const handleClose = () => {
    setOpenCreateModal(false);
    setInputs({
      feedAppearBy: "public",
      VideoUrl: "",
      description: "",
    });
    setPreviews([]);
    setUploadedImage([]);
    setImage("");
    setFormAction("ADD");
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (
      !inputs.VideoUrl &&
      !inputs.description &&
      !image &&
      previews.length < 1
    ) {
      enqueueSnackbar("Please add data to be posted", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    const results = previews.map((image, index) => {
      if (image.type === "file") {
        const formData = new FormData();
        formData.append("image", image.path);
        const result = UploadImages(formData);
        return result;
      } else {
        return image.path;
      }
    });
    Promise.all(results).then(async (img_results) => {
      const formData = new FormData();

      formData.append("video_url", inputs.VideoUrl);
      formData.append("description", inputs.description);

      if (feedType === "image" && previews.length >= 1) {
        // formData.append("image", previews[0].path);
        formData.append("images", JSON.stringify(img_results));
        formData.append("feed_type", "image");
      } else {
        if (inputs.VideoUrl) {
          formData.append("feed_type", "video");
        } else {
          formData.append("feed_type", "general");
        }
      }
      const postData = {
        video_url: inputs.VideoUrl,
        description: inputs.description,
      };
      if (feedType === "image" && previews.length >= 1) {
        postData.images = JSON.stringify(img_results);
        postData.feed_type = "image";
      } else {
        if (inputs.VideoUrl) {
          postData.feed_type = "video";
        } else {
          postData.feed_type = "general";
        }
      }
      console.log(postData, "postData");
      const result = await add_new_feed(postData);
      if (result.code === 200) {
        setInputs({
          feedAppearBy: "public",
          VideoUrl: "",
          description: "",
        });

        socket.emit("send_notification_count", result?.receiver_members);
        if (location.pathname.includes("my-posts")) {
          getFeedsListing(`api/feed/list_feed?page=0&limit=10`);
        } else {
          getFeedsListing(`api/feed/community_area?page=0&limit=10`);
        }
        setIsLoading(false);
        handleClose();
        enqueueSnackbar(result.message, {
          variant: "success",
        });
      } else {
        setIsLoading(false);
        enqueueSnackbar(result.message, { variant: "error" });
      }
    });
  };
  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleCancelUpdate = (e) => {
    e.preventDefault();
    handleClose();
  };
  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (!inputs.VideoUrl && !inputs.description && previews.length >= 1) {
      enqueueSnackbar(
        "There should be one of the content in feed [description, video, image]",
        { variant: "error" }
      );
      return;
    }
    // setIsLoading(true);
    const results = previews.map((image, index) => {
      if (image.type === "file") {
        const formData = new FormData();
        formData.append("image", image.path);
        const result = UploadImages(formData);
        return result;
      } else {
        return image;
      }
    });
    Promise.all(results).then(async (img_results) => {
      const formData = new FormData();

      formData.append("video_url", inputs.VideoUrl);
      formData.append("description", inputs.description);
      // formData.append("created_for", "general");
      console.log(feedType, "feedType");
      if (feedType === "image" && previews.length >= 1) {
        // formData.append(
        //   "image",
        //   previews[0].thumbnail_1 ? previews[0].thumbnail_1 : previews[0]?.path
        // );
        formData.append("image", JSON.stringify(img_results));

        formData.append("feed_type", "image");
      } else {
        if (inputs.VideoUrl) {
          formData.append("feed_type", "video");
        } else {
          formData.append("feed_type", "general");
        }
      }
      const postData = {
        video_url: inputs.VideoUrl,
        description: inputs.description,
      };
      if (feedType === "image" && previews.length >= 1) {
        postData.images = JSON.stringify(img_results);
        postData.feed_type = "image";
      } else {
        if (inputs.VideoUrl) {
          postData.feed_type = "video";
        } else {
          postData.feed_type = "general";
        }
      }
      console.log(postData, "update formdata");
      const result = await update_feed(postData, feedId);
      if (result.code === 200) {
        setInputs({
          feedAppearBy: "public",
          VideoUrl: "",
          description: "",
        });

        if (!openDetailModal) {
          if (location.pathname.includes("my-posts")) {
            getFeedsListing(`api/feed/list_feed?page=0&limit=10`);
          } else {
            getFeedsListing(`api/feed/community_area?page=0&limit=10`);
          }
          // if (!window.location.pathname.includes("/feed-detail")) {
          // getFeedsListing(`api/feed/community_area?page=0&limit=10`);
          // getFeedsListing(feedId);
        } else {
          getFeedsListing(feedId);
        }
        setIsLoading(false);
        handleClose();
        enqueueSnackbar(result.message, {
          variant: "success",
        });
        handleSuccessUpdate(selectedFeed);
      } else {
        setIsLoading(false);
        enqueueSnackbar(result.message, { variant: "error" });
      }
    });
  };

  useEffect(() => {
    if (formAction === "EDIT") {
      console.log(selectedFeed, "selectedFeedselectedFeed");
      setInputs({
        VideoUrl: selectedFeed.video_url,
        description: selectedFeed.description,
      });
      setFeedType(selectedFeed.feed_type);
      setFeedId(selectedFeed._id);

      if (
        selectedFeed.feed_type === "image" &&
        selectedFeed.images &&
        selectedFeed.images.length > 0
      ) {
        const newArray = [{ thumbnail_1: selectedFeed.images[0] }];
        setPreviews(selectedFeed.images);
        // setUploadedImage(selectedFeed.images);
        setImage(s3baseUrl + selectedFeed.image?.thumbnail_1);
      }
    }
  }, [formAction]);

  return (
    <div>
      <Modal
        open={openCreateModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <form
          className="create-post-title-form"
          onSubmit={formAction === "ADD" ? handleCreatePost : handleUpdatePost}>
          <Box sx={style} className="modal-theme">
            <div
              className="text-center modalIcon col-12 create-post-title-box"
              onClick={() => {
                handleClose();
              }}>
              <h2>{`${formAction == "ADD" ? "Create" : "Update"} post`}</h2>
              <hr />
              <span>x</span>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <div className="post-creator">
                  <Avatar
                    src={s3baseUrl + userInfo?.image?.thumbnail_1}
                    alt="photoURL">
                    {userInfo?.name ? userInfo?.name : ""}
                  </Avatar>
                  <div className="creator-name ps-2 ">
                    <h3>{userInfo?.name}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3 position-relative">
              <InputBase
                inputRef={inputRef}
                style={{
                  color: "black",
                  width: "100%",
                  whiteSpace: "wrap",
                  paddingRight: "45px",
                }}
                sx={{ ml: 1, flex: 1 }}
                placeholder="What's on your mind?"
                inputProps={{
                  "aria-label": "What's on your mind?",
                }}
                multiline
                minRows="2"
                maxRows="6"
                name="description"
                value={inputs.description}
                onChange={handleChange}
                autoFocus
              />
              <GeneralMenuPopup
                use_field="description"
                setInput={setInputs}
                inputRef={inputRef}
              />
            </div>
            {feedType === "video" && (
              <div className="col-12 mt-3 video-url-field search-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Video URL"
                  name="VideoUrl"
                  value={inputs.VideoUrl}
                  onChange={handleChange}
                />
                <span
                  className="video-url-cross"
                  onClick={() => {
                    setFeedType("general");
                  }}>
                  x
                </span>
              </div>
            )}

            {feedType === "image" && (
              <div className="col-md-12 mt-2">
                <div className="row">
                  {previews.length > 0 &&
                    previews.map((preview) => {
                      return (
                        <span className="col-3 mb-3 preview create-post-images">
                          <span
                            onClick={() => {
                              handleRemoveImage(preview);
                            }}>
                            x
                          </span>
                          <img
                            src={
                              preview.type == "file"
                                ? URL.createObjectURL(preview.path)
                                : s3baseUrl + preview.thumbnail_1
                            }
                          />
                        </span>
                      );
                    })}
                </div>
                <div className="row">
                  <div className={`col-12`}>
                    {previews.length < 2 && (
                      <span className="upload-button mt-2 w-100">
                        <input
                          multiple
                          color="primary"
                          accept="image/*"
                          type="file"
                          id="icon-button-file"
                          style={{ display: "none" }}
                          onChange={handleUpload}
                        />
                        <label htmlFor="icon-button-file">
                          <span
                            onClick={() => {
                              setFeedType("general");
                            }}>
                            x
                          </span>
                          <p className="mt-3">
                            Add Photo <br />
                            <CloudUploadIcon />
                          </p>
                        </label>
                        <p className="max-images">
                          Maximum 2 images are allowed per upload.
                        </p>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="col-12">
              <div className="video-image-selection">
                <div
                  onClick={() => {
                    setFeedType("image");
                  }}
                  className={`selection-box ${
                    feedType == "image" ? "selected" : ""
                  }`}>
                  <PhotoCameraIcon />
                </div>
                <div
                  onClick={() => {
                    setFeedType("video");
                  }}
                  className={`selection-box ${
                    feedType == "video" ? "selected" : ""
                  }`}>
                  <VideocamIcon />
                </div>
              </div>
            </div>
            <div className="col-12 text-center">
              {formAction === "ADD" && (
                <button
                  className="small-contained-button post-submit-btn"
                  disabled={isLoading}>
                  {/* {isLoading ? "Posting..." : "Post"} */}
                  {isLoading ? (
                    <>
                      <CircularProgress
                        className="loading-preview-svg"
                        size={14}
                        color="inherit"
                        sx={{ position: "relative", top: "2px", right: "10px" }}
                      />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </button>
              )}
              {formAction === "EDIT" && (
                <div className="d-flex justify-content-end">
                  <button
                    className="me-2 small-contained-button post-submit-btn"
                    onClick={handleCancelUpdate}>
                    Cancel
                  </button>
                  <button
                    className="small-contained-button post-submit-btn"
                    type="submit"
                    disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              )}
            </div>
          </Box>
        </form>
      </Modal>
    </div>
  );
}
