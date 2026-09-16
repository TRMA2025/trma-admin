import * as Yup from "yup";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// ----------------------------------------------------------------------

export default function LoginForm({ onhandleLogin, isLoading }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password, "email");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    onhandleLogin(formData);
  };

  // const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    // <FormikProvider value={formik}>
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          autoComplete="username"
          type="email"
          label="Email address"
          required
          sx={{
            input: {
              color: "#212b36",
            },
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="legend "
          // {...getFieldProps('email')}
          // error={Boolean(touched.email && errors.email)}
          // helperText={touched.email && errors.email}
        />

        <TextField
          fullWidth
          autoComplete="current-password"
          type={showPassword ? "text" : "password"}
          label="Password"
          required
          sx={{
            input: {
              color: "#212b36",
            },
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // {...getFieldProps('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          // error={Boolean(touched.password && errors.password)}
          // helperText={touched.password && errors.password}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ my: 2 }}>
        <Link component={RouterLink} variant="subtitle2" to="/forget_password">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        className="small-contained-button-search"
        loading={isLoading}>
        Login
      </LoadingButton>
    </form>
    // </FormikProvider>
  );
}
