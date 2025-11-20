import * as Yup from "yup";
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { useSnackbar } from "notistack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import { changeMemberPassword } from "src/DAL/member/member";
import ActiveLastBreadcrumb from "src/components/ActivePaths";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function ChangePassword() {
  const navigate = useNavigate();
  const classes = useStyles();
  const params = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let breadCrumbMenu = [
    {
      title: "Members",
      navigation: -1,
      active: false,
    },

    {
      title: "Change Password",
      navigation: null,
      active: true,
    },
  ];
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Password and Confirm Password does not match", {
        variant: "error",
      });
    } else {
      let postData = {
        password: newPassword,
        confirm_password: confirmPassword,
      };
      const result = await changeMemberPassword(postData, params.state.id);
      if (result.code === 200) {
        setIsLoading(false);
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(-1);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };
  if (isLoading == true) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  return (
    <div className="row">
      <div className="col-12 mb-3">
        {/* <IconButton
          className="back-screen-button mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton> */}
        <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
      </div>
      <div>
        <h2>Change Password</h2>
      </div>

      <div className="col-12 mt-5">
        <div className="col-5 ms-auto me-auto text-center">
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <div class="card main-card">
              <div class="card-body">
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ my: 2 }}>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    className="small-contained-button-search mt-4 mb-0">
                    Change
                  </LoadingButton>
                </Stack>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
