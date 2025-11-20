import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
// components
import Logo from "../../components/Logo";
import Scrollbar from "../../components/Scrollbar";
import NavSection from "../../components/NavSection";
import { MHidden } from "../../components/@material-extend";
//
import sidebarConfig from "./SidebarConfig";
import account from "../../_mocks_/account";
import { logout } from "../../DAL/Login/Login";
import { baseUri } from "../../config/config";
import { get_root_value } from "src/utils/domUtils";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200],
  cursor: "pointer",
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const formdata = new FormData();
    formdata.append("token", localStorage.getItem("token"));
    const result = await logout(formdata);
    if (result.code === 200) {
      localStorage.clear();
      navigate("/login");
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "inline-flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Logo />
        </Box>
      </Box>

      {/* <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
        <AccountStyle onClick={() => navigate('/user_profile')}>
          {localStorage.getItem('image') ? (
            <Avatar src={baseUri + localStorage.getItem('image')} alt="photoURL" />
          ) : (
            <Avatar>{localStorage.getItem('first_name').substring(0, 1)}</Avatar>
          )}
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {localStorage.getItem('first_name')} {(' ', localStorage.getItem('last_name'))}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                role
              </Typography>
          </Box>
        </AccountStyle>
        </Link>
      </Box> */}

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />

      {/* <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Button fullWidth onClick={() => handleLogout()} variant="contained">
          Logout
        </Button>
      </Box> */}
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              backgroundColor: get_root_value("--sidebars-background-color"),
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
