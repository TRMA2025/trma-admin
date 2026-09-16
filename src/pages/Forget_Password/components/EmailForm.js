import * as Yup from "yup";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// material
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// ----------------------------------------------------------------------

export default function EmailForm({ onhandleEmailSubmit }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!email) {
    //   return;
    // }
    onhandleEmailSubmit(email);
  };
  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          type="email"
          label="Email address"
        />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}>
        <LoadingButton
          className="small-contained-button-search"
          fullWidth
          size="large"
          type="submit"
          variant="contained">
          Submit
        </LoadingButton>
      </Stack>
    </form>
  );
}
