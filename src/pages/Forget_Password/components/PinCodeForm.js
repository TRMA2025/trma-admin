import React, { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Form, FormikProvider } from "formik";
import PinInput from "react-pin-input";
// material
import { Stack, TextField, FormHelperText } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// ----------------------------------------------------------------------

const PIN_LENGTH = 6;

export default function PinCodeForm({ onhandlePinCodeSubmit }) {
  const navigate = useNavigate();
  const [pinCode, setPinCode] = useState("");
  const [error, setError] = useState("");
  const pinRef = useRef(null);

  /* Pasting the code from the email (16 Sep 2026).
   *
   * react-pin-input only calls onChange while the user TYPES: PinInput's
   * onItemChange guards it with `if (!isPasting)`, so on a paste the pin never
   * reached React state and Submit sent an empty or one-digit code. Its own
   * paste handler is also strict - PinInput.onPaste bails unless the pasted
   * string is exactly `length` characters - so "645784 " or "Code: 645784"
   * did nothing at all.
   *
   * This strips the clipboard text down to digits and, when that is the right
   * length, drives the component's own update path and sets the state.
   */
  const handlePaste = (e) => {
    const text = (e.clipboardData || window.clipboardData)?.getData("text") || "";
    const digits = text.replace(/\D/g, "");
    if (digits.length !== PIN_LENGTH) return;

    e.preventDefault();
    if (pinRef.current && typeof pinRef.current.onPaste === "function") {
      pinRef.current.onPaste(digits);
    }
    setPinCode(digits);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Never fail silently: the old code returned here with no feedback, which
       is what made a failed paste look like a dead button. */
    if (!pinCode || pinCode.length < PIN_LENGTH) {
      setError(`Please enter all ${PIN_LENGTH} digits of your code`);
      return;
    }
    setError("");
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
        <div onPaste={handlePaste}>
        <PinInput
          ref={pinRef}
          length={PIN_LENGTH}
          initialValue=""
          secret={false}
          onChange={(value, index) => setPinCode(value)}
          type="numeric"
          inputMode="number"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
          }}
          // 13 Sep 2026: digits were `color: "white"` on a transparent box,
          // i.e. invisible. The hardcoded `borderColor: "red"` was NOT an error
          // state - it was applied to all six boxes at all times. Neutral
          // border here; the focused box still uses the portal theme colour via
          // inputFocusStyle below.
          inputStyle={{
            color: "#212b36",
            WebkitTextFillColor: "#212b36",
            caretColor: "#212b36",
            backgroundColor: "#fff",
            border: "1px solid #c4cdd5",
            borderRadius: "8px",
            width: "48px",
            height: "48px",
            margin: "0",
            padding: "0",
            boxSizing: "border-box",
            flex: "0 0 auto",
            fontSize: "18px",
          }}
          // 13 Sep 2026: this was get_root_value("--portal-theme-primary"),
          // which config.js sets to #fff - a white border on a white box, so
          // the focused (usually last) box appeared to have no border at all.
          // The variable is used as a white ink colour by ~130 other call
          // sites, so it is left alone and a concrete accent is used here.
          inputFocusStyle={{
            borderColor: "#9f00ff",
            boxShadow: "0 0 0 2px rgba(159, 0, 255, 0.18)",
          }}
          /* On a paste this is the only callback react-pin-input fires, so the
             state has to be set here as well as in onChange. */
          onComplete={(value, index) => {
            setPinCode(value);
            setError("");
          }}
          // autoSelect={true}
          // regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        />
        </div>
        {error && (
          <FormHelperText error sx={{ mt: 1 }}>
            {error}
          </FormHelperText>
        )}
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
