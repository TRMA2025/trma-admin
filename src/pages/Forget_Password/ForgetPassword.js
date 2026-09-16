import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
// material
import { styled } from "@mui/material/styles";
import { Card, Stack, Link, Container, Typography } from "@mui/material";
// api
import {
  confirmEmail,
  confirmPinCode,
  updatePassword,
} from "../../DAL/Login/Login";
// layouts
import AuthLayout from "../../layouts/AuthLayout";
// components
import Page from "../../components/Page";
import { MHidden } from "../../components/@material-extend";
import { LoginForm } from "../../components/authentication/login";
import AuthSocial from "../../components/authentication/AuthSocial";
import EmailForm from "./components/EmailForm";
import PinCodeForm from "./components/PinCodeForm";
import NewPasswordForm from "./components/NewPasswordForm";
import { ProjectInfoApi } from "src/DAL/SiteSetting/siteSetting";
import { s3baseUrl } from "src/config/config";

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

export default function ForgetPassword() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState(0);
  const [adminEmail, setAdminEmail] = useState("");
  const [projectInfo, setProjectInfo] = useState({});
  const getProjectInfo = async () => {
    const result = await ProjectInfoApi();
    if (result.code === 200) {
      console.log(result, "resultresult called");
      setProjectInfo(result.default_setting);
    }
  };

  const handleSubmitEmail = async (_email) => {
    // console.log(_email, "_email");
    if (_email == "") {
      enqueueSnackbar("Email is required", { variant: "error" });
    } else {
      setAdminEmail(_email);
      /* Sent as a plain object, not FormData (15 Sep 2026). invokeApi sets
         axios.defaults.headers.post Content-Type to application/json, and
         axios 0.24 passes FormData through without clearing that header - so
         the body went out as multipart while labelled JSON, bodyParser.json()
         threw, and Express answered with a 400 HTML page. invokeApi then read
         .message off that HTML, got undefined, and showed an empty error
         toast: the Submit button appeared to do nothing. These routes accept
         JSON. */
      const result = await confirmEmail({ email: _email });
      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });

        setStatus(1);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    }
  };

  const handleSubmitPinCode = async (pinCode) => {
    const result = await confirmPinCode({
      email: adminEmail,
      verification_code: pinCode,
    });
    if (result.code === 200) {
      setStatus(2);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleSubmitNewPassword = async (newPassword, confirmPassword) => {
    // console.log(
    //   adminEmail,
    //   newPassword,
    //   confirmPassword,
    //   "receive both Passwords"
    // );
    // The backend validator only accepts email / password / confirm_password.
    // It previously sent `new_password`, which Joi rejected (13 Sep 2026).
    const result = await updatePassword({
      email: adminEmail,
      password: newPassword,
      confirm_password: confirmPassword,
    });
    if (result.code === 200) {
      setStatus(0);
      navigate("/login");
      enqueueSnackbar("Password Changed Successfully", { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }

    // enqueueSnackbar('Password Changed Successfully', { variant: 'success' });
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
      className="bg bg-mobile">
      <RootStyle title="Forgot Password">
        <AuthLayout>
          Back to Login? &nbsp;
          <Link
            underline="none"
            variant="subtitle2"
            component={RouterLink}
            to="/login">
            Login
          </Link>
        </AuthLayout>

        {/* <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Forgot Password
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden> */}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack sx={{ mb: 2 }}>
              {/* <Typography variant="h4" gutterBottom>
              Forgot Password
            </Typography> */}
              {status === 0 ? (
                <>
                  <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
                    Forgot Password
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Enter your Email.
                  </Typography>
                </>
              ) : (
                ""
              )}
              {status === 1 ? (
                <>
                  <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
                    Please check your email
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Enter PIN Code here.
                  </Typography>
                </>
              ) : (
                ""
              )}
              {status === 2 ? (
                <>
                  <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
                    Forgot Password
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Enter your New Password.
                  </Typography>
                </>
              ) : (
                ""
              )}
            </Stack>
            {status === 0 ? (
              <EmailForm onhandleEmailSubmit={handleSubmitEmail} />
            ) : (
              ""
            )}
            {status === 1 ? (
              <PinCodeForm onhandlePinCodeSubmit={handleSubmitPinCode} />
            ) : (
              ""
            )}
            {status === 2 ? (
              <NewPasswordForm
                onhandleNewPasswordSubmit={handleSubmitNewPassword}
              />
            ) : (
              ""
            )}
            <MHidden width="smUp">
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Back to Login?&nbsp;
                <Link variant="subtitle2" component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            </MHidden>
          </ContentStyle>
        </Container>
      </RootStyle>
    </div>
  );
}
