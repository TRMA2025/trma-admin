import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Form, FormikProvider } from "formik";
import PinInput from "react-pin-input";
// material
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { get_root_value } from "src/utils/domUtils";

// ----------------------------------------------------------------------

export default function PinCodeForm({ onhandlePinCodeSubmit }) {
  const navigate = useNavigate();
  const [pinCode, setPinCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pinCode) {
      return;
    }
    onhandlePinCodeSubmit(pinCode);
  };
  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* <TextField
          fullWidth
          required
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          autoComplete="username"
          type="text"
          label="Pin Code"
        /> */}
        <PinInput
          length={6}
          initialValue=""
          secret={false}
          onChange={(value, index) => setPinCode(value)}
          type="numeric"
          inputMode="number"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
          inputStyle={{ borderColor: "red", color: "white" }}
          inputFocusStyle={{
            borderColor: get_root_value("--portal-theme-primary"),
          }}
          onComplete={(value, index) => {}}
          // autoSelect={true}
          // regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
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
