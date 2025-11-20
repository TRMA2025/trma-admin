import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { Icon } from "@iconify/react";
import bellFill from "@iconify/icons-eva/bell-fill";
import clockFill from "@iconify/icons-eva/clock-fill";
import doneAllFill from "@iconify/icons-eva/done-all-fill";
// material
import { alpha } from "@mui/material/styles";
import {
  Box,
  List,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
} from "@mui/material";
// utils
// components
import Scrollbar from "../../components/Scrollbar";
import MenuPopover from "../../components/MenuPopover";
import { commentIcon, communityHeart, newPost } from "src/assets";
import moment from "moment";
import { useContentSetting } from "src/Hooks/ContentSettingState";
import { get_date_with_user_time_zone } from "src/utils/constant";
import { s3baseUrl } from "src/config/config";
import RecordNotFound from "src/components/RecordNotFound";

// ----------------------------------------------------------------------

export default function NotificationsPopover({
  notifications,
  pageNumber,
  totalPages,
  setIsLoadingMore,
  isLoadingMore,
  unreadNotificationCount,
  getMoreNotificationList,
  loadMorePath,
  handleRedirect,
  handleMarkAllAsRead,
  setOpen,
  isLoading,
  open,
}) {
  const { timezone } = useContentSetting();
  const anchorRef = useRef(null);
  const observer = useRef();
  const totalUnRead = unreadNotificationCount;
  function renderContent(notification) {
    const title = (
      <Typography variant="subtitle2" className="notification-title">
        <Typography
          component="span"
          variant="body2"
          sx={{ color: "text.secondary" }}>
          {notification.title}
        </Typography>
      </Typography>
    );

    return {
      avatar: (
        <img
          alt={notification.title}
          src={notification.user_info_sender?.profile_image}
        />
      ),
      title,
    };
  }

  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && totalPages > pageNumber) {
          console.log("called=======");
          loadMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, totalPages, pageNumber, loadMorePath, observer]
  );
  NotificationItem.propTypes = {
    notification: PropTypes.object.isRequired,
  };
  function NotificationItem({ notification }) {
    const { title } = renderContent(notification);

    const notification_date = get_date_with_user_time_zone(
      notification.createdAt,
      "YYYY-MM-DD HH:mm",
      timezone,
      timezone
    );

    return (
      <div
        to="#"
        disableGutters
        // component={RouterLink}
        sx={{
          p: 1.5,
          mt: "1px",
          ...(notification.is_read && {
            color: "#fff",
          }),
        }}
        className={`notification-item-box ${
          notification.is_read === true
            ? "notification-item"
            : "notification-item-unread"
        }`}>
        <CircleIcon
          className={`notifications-circle ${
            notification.is_read ? "notifications-circle-seen" : ""
          }`}
        />
        <ListItemAvatar>
          <div className="like-profile-image">
            <Avatar
              // src={avatar}
              src={s3baseUrl + notification.created_by?.profile_image}
              alt="photoURL">
              {notification.created_by?.name}
            </Avatar>
            <div className="tiny-like-icon tiny-like-icon-notification">
              {notification.notification_type === "feed_liked" ||
              notification.notification_type === "comment_liked" ? (
                <img src={communityHeart} alt="" />
              ) : notification.notification_type === "feed_added" ? (
                <img src={newPost} alt="" />
              ) : (
                <img src={commentIcon} alt="" />
              )}
            </div>
          </div>
          {/* <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar> */}
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                color: "text.disabled",
              }}>
              <Box
                component={Icon}
                icon={clockFill}
                sx={{ mr: 0.5, width: 16, height: 16 }}
              />
              {/* {formatDistanceToNow(new Date(notification.createdAt))} ago */}
              {/* {moment(notification?.createdAt, "YYYY-MM-DD HH:mm").fromNow()} */}
              {moment(notification_date, "YYYY-MM-DD HH:mm").fromNow()}
            </Typography>
          }
          onClick={(e) => {
            e.preventDefault();
            handleRedirect(
              notification._id,
              notification.feed_id ? notification.feed_id : "",
              notification.notification_type,
              notification
            );
          }}
        />
      </div>
    );
  }
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadMoreData = () => {
    setIsLoadingMore(true);
    console.log(loadMorePath, "==loadMorePath");
    getMoreNotificationList(loadMorePath);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? "primary" : "default"}
        className="notification-icons-btn"
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.focusOpacity
              ),
          }),
        }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360, border: "none" }}
        className="notification-popover-paper">
        <Box
          sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}
          className="notification-popover">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ color: "#000" }}>
              Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {totalUnRead} unread notifications
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar
          className="notification-popover"
          sx={{ height: { xs: 340, sm: "auto" } }}>
          {isLoading ? (
            <CircularProgress
              className="notification-popover-loader loading-preview-svg"
              color="primary"
            />
          ) : notifications?.length < 1 ? (
            <RecordNotFound title="Notifications" />
          ) : (
            <List disablePadding>
              {notifications.map((notification, index) => (
                <NotificationItem key={index} notification={notification} />
              ))}
            </List>
          )}
          {totalPages > pageNumber ? (
            <div className="col-12 text-center p-2">
              <span
                ref={lastBookElementRef}
                className=" mt-3"
                onClick={loadMoreData}
                id="load-more-feed">
                {isLoadingMore ? "Loading..." : "Load More"}
              </span>
            </div>
          ) : (
            ""
          )}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
