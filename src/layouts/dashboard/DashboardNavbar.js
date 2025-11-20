import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import menu2Fill from "@iconify/icons-eva/menu-2-fill";
// material
import { alpha, styled } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar, IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
// components
import { MHidden } from "../../components/@material-extend";
//
import Searchbar from "./Searchbar";
import AccountPopover from "./AccountPopover";
import LanguagePopover from "./LanguagePopover";
import NotificationsPopover from "./NotificationsPopover";
import { get_root_value } from "src/utils/domUtils";
import { useEffect, useState } from "react";
import { defaultSettingApi } from "src/DAL/SiteSetting/siteSetting";
import {
  notification_list_with_pagination,
  read_all_notification,
  read_notification_by_id,
} from "src/DAL/Notification/Notification";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useContentSetting } from "src/Hooks/ContentSettingState";
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 42;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: get_root_value("--background-primary-color"),
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP + 20,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {

  const navigate = useNavigate();
  const {
    socket,
    notificationsCount,
    setNotificationsCount,
    handleSetTimeZone,
    handleNotificationsCount,
    navbarList,
    handleSetUserInfo,
  } = useContentSetting();
  const { enqueueSnackbar } = useSnackbar();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [loadMorePath, setLoadMorePath] = useState("");
  const [open, setOpen] = useState(false);
  const [loadMore, setLoadMore] = useState(
    "api/notification/list_user_notification?page=0&limit=10"
    // "api/feeds/notification_list_with_pagination?page=0&limit=10"
  );
  const getDefaultSetting = async () => {
    const result = await defaultSettingApi();
    if (result.code === 200) {
      handleNotificationsCount(result?.unread_notification_count);

      localStorage.setItem(`user_data`, JSON.stringify(result?.admin_user));
      handleSetUserInfo(result?.admin_user);
      localStorage.setItem(
        `time_zone`,
        JSON.stringify(result?.default_setting?.time_zone)
      );
      handleSetTimeZone(result?.default_setting?.time_zone);
    } else {
      // enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const getMoreNotificationList = async (load_path) => {
    const result = await notification_list_with_pagination(load_path);
    if (result.code === 200) {
      // var newArray = notifications.concat(result.notifications);
      var newArray = result.notifications;
      setNotifications(newArray);
      setPageNumber((page) => page + 1);
      setTotalPages(result?.total_pages);
      setUnreadNotificationCount(result?.unread_notification_count);
      handleNotificationsCount(result?.unread_notification_count);
      setLoadMorePath(result.load_more);
      setIsLoadingMore(false);
      setIsLoading(false);
    } else {
      setIsLoadingMore(false);
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleRedirect = async (notification_id, feed_id) => {
    setOpen(false);
    const result = await read_notification_by_id(notification_id);

    if (result.code === 200) {
      setNotifications((notifications) => {
        const notification_list = notifications.map((notification) => {
          if (notification._id === notification_id) {
            return {
              ...notification,
              is_read: true,
            };
          } else {
            return notification;
          }
        });
        if (unreadNotificationCount > 0) {
          setUnreadNotificationCount(unreadNotificationCount - 1);
        }

        return notification_list;
      });
      // navigate(`/post-detail`);
      navigate(`/post-detail/${feed_id}`);
    } else {
      setIsLoadingMore(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleMarkAllAsRead = () => {
    setUnreadNotificationCount(0);
    read_all_notification();
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
  };
  useEffect(() => {
    setPageNumber(0);
    setTotalPages(0);
    if (open) {
      getMoreNotificationList(loadMore);
    }
  }, [open]);

  useEffect(() => {
    setUnreadNotificationCount(notificationsCount);
  }, [notificationsCount]);
  // console.log(socket, "socket ou out");

  useEffect(() => {
    console.log(socket, "socket out");

    if (socket?.connected) {
      console.log(socket, "socket inside");
    }
    socket?.on("notification_count", async (data) => {
      console.log(data, "new_notification_receiver");
      setUnreadNotificationCount(data.unread_notification_count);
      setNotificationsCount(data.unread_notification_count);
    });
  }, [socket]);
  useEffect(() => {
    getDefaultSetting();
  }, []);
  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton
            onClick={onOpenSidebar}
            sx={{ mr: 1, color: "text.primary", marginRight: "auto" }}
          >
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 0.7 }}
        >
          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}
          {/* {navbarList && navbarList.community_feeds && ( */}
          <NotificationsPopover
            notifications={notifications}
            isLoadingMore={isLoadingMore}
            isLoading={isLoading}
            setIsLoadingMore={setIsLoadingMore}
            totalPages={totalPages}
            pageNumber={pageNumber}
            unreadNotificationCount={unreadNotificationCount}
            getMoreNotificationList={getMoreNotificationList}
            loadMorePath={loadMorePath}
            handleRedirect={handleRedirect}
            handleMarkAllAsRead={handleMarkAllAsRead}
            setOpen={setOpen}
            open={open}
          />
          {/* )} */}
          <AccountPopover />
          {/* <FormControlLabel
            value="start"
            control={
              <Switch
                color="primary"
                value={mode}
                onChange={(e) => handleChangeMode(e.target.checked)}
              />
            }
            label="Dark Mode"
            labelPlacement="start"
          /> */}
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
