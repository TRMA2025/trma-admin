import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
// material
import { styled } from "@mui/material/styles";
import { Card, Stack, Link, Container, Typography } from "@mui/material";
//

import { login } from "../DAL/Login/Login";
// layouts
import AuthLayout from "../layouts/AuthLayout";
// components
import Page from "../components/Page";
import { MHidden } from "../components/@material-extend";
import { LoginForm } from "../components/authentication/login";
import AuthSocial from "../components/authentication/AuthSocial";
import { bgImage } from "src/assets";
import {
  ProjectInfoApi,
  defaultSettingApi,
} from "src/DAL/SiteSetting/siteSetting";
import { s3baseUrl } from "src/config/config";
import { useContentSetting } from "src/Hooks/ContentSettingState";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { START_SOCKET_FORCEFULLY, handleSetUserInfo } = useContentSetting();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});
  const getProjectInfo = async () => {
    const result = await ProjectInfoApi();
    if (result.code === 200) {
      console.log(result, "resultresult called");
      setProjectInfo(result.default_setting);
    }
  };
  const getDefaultSetting = async () => {
    setLoading(true);
    const result = await defaultSettingApi();
    // console.log(result, "ilooooo");
    if (result.code === 200) {
      localStorage.setItem("favIcon", result.default_setting.admin_favicon);
      localStorage.setItem(
        `time_zone`,
        JSON.stringify(result?.default_setting?.time_zone)
      );
      localStorage.setItem("campaignName", result?.campaign_name);
      localStorage.setItem("adminLogo", result.default_setting.admin_logo);
      localStorage.setItem("metaTitle", result.default_setting.meta_title);
      localStorage.setItem(
        "metaDescription",
        result.default_setting.meta_description
      );
    } else {
      setLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSubmitLogin = async (data) => {
    setLoading(true);
    console.log(data, "get login data");
    const result = await login(data);
    console.log(result, "login result");
    if (result.code === 200) {
      // console.log(result, "login ok");
      START_SOCKET_FORCEFULLY(result.adminUser._id);
      handleSetUserInfo(result.adminUser);
      localStorage.setItem(`user_data`, JSON.stringify(result.adminUser));

      localStorage.setItem("token", result.token);
      localStorage.setItem("email", result.adminUser.email);
      localStorage.setItem("is_send_code", result.adminUser.is_send_code);
      localStorage.setItem(
        "is_verified_code",
        result.adminUser.is_verified_code
      );
      localStorage.setItem(
        "verification_code",
        result.adminUser.verification_code
      );
      localStorage.setItem("name", result.adminUser.name);
      localStorage.setItem("_id", result.adminUser._id);
      localStorage.setItem("image", result.adminUser.image.thumbnail_1);
      getDefaultSetting();
      enqueueSnackbar(result.message, { variant: "success" });
      navigate("/dashboard", { replace: true });
      setLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setLoading(false);
    }
  };
  useEffect(() => {
    getProjectInfo();
  }, []);

  return (
    <div
      style={{
        background: `url(${
          s3baseUrl + projectInfo?.admin_background_image
        }) no-repeat center center`,
        backgroundSize: "cover",
        width: "100%",
        backgroundSize: "cover",
      }}
      className="bg bg-mobile"
    >
      <Container maxWidth="sm" className="">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: projectInfo?.admin_login_page_text,
                }}
              ></div>
            </Typography>
          </Stack>
          {/* <AuthSocial /> */}

          <LoginForm isLoading={loading} onhandleLogin={handleSubmitLogin} />

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don’t have an account?&nbsp;
              {/* <Link variant="subtitle2" component={RouterLink} to="register">
                Get started
              </Link> */}
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </div>
  );
}
