import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import homeFill from "@iconify/icons-eva/home-fill";
import personFill from "@iconify/icons-eva/person-fill";
import settings2Fill from "@iconify/icons-eva/settings-2-fill";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { get_root_value } from "src/utils/domUtils";
import unlockFill from "@iconify/icons-eva/unlock-fill";

import { alpha } from "@mui/material/styles";
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import MenuPopover from "../../components/MenuPopover";
//
import account from "../../_mocks_/account";
import { logout } from "../../DAL/Login/Login";
import { s3baseUrl } from "src/config/config";
import { useMode } from "src/Hooks/ModeContext";
import ChangePassword from "src/components/_dashboard/ChangePassword";
import dollarCircleFilled from "@iconify/icons-ant-design/dollar-circle-filled";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Edit Profile",
    icon: personFill,
    linkTo: "/profile",
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { mode, handleChangeMode, setProfileNewImage, profileNewImage } =
    useMode();
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(profileNewImage);
  const [openPasswordModal, setopenPasswordModal] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleProfile = (value) => {
    navigate(value);
    handleClose();
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!pathname.match("/payment-transactions")) {
      localStorage.removeItem("TransactionListSearch");
    }
    if (!pathname.match("/member")) {
      console.log("MemberListSearch");
      localStorage.removeItem("MemberListSearch");
      localStorage.removeItem("member_page_number");
      localStorage.removeItem("member_filter_state");
    }
    if (!pathname.match("/pending-member")) {
      localStorage.removeItem("pending_MemberListSearch");
      localStorage.removeItem("pending_member_page_number");
      localStorage.removeItem("pending_member_filter_state");
      localStorage.removeItem("rowsPerPage");
    }
    if (!pathname.match("/subscription-list")) {
      localStorage.removeItem("subscription_list_data");
    }
  }, [pathname]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setProfileImage(profileNewImage);
    }, 1000);
    return () => clearTimeout(timer);
  }, [profileNewImage]);
  return (
    <>
      <ChangePassword
        openPasswordModal={openPasswordModal}
        setopenPasswordModal={setopenPasswordModal}
      />
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar
          src={profileImage ? s3baseUrl + profileImage : account.photoURL}
          alt="photoURL"
        />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap className="fix-weight">
            {localStorage.getItem("name")}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
            noWrap
            className="fix-weight"
          >
            {localStorage.getItem("email")}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => handleProfile(option.linkTo)}
            sx={{ typography: "body2", py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24,
                color: "#9f00ff",
              }}
            />

            <span className="fix-weight">{option.label}</span>
          </MenuItem>
        ))}
        <MenuItem
          key=""
          onClick={() => {
            handleClose();
            setopenPasswordModal(true);
          }}
          sx={{ typography: "body2", py: 1, px: 2.5 }}
        >
          <Box
            component={Icon}
            icon={unlockFill}
            sx={{
              mr: 2,
              width: 24,
              height: 24,
              color: "#9f00ff",
            }}
          />
          <span className="fix-weight"> Change Password</span>
        </MenuItem>

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            sx={{ fontWeight: 600 }}
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
