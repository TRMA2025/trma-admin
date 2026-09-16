// ----------------------------------------------------------------------

export default function Input(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            "& svg": { color: theme.palette.text.disabled },
          },
        },
        input: {
          // Guarantee legible input text (13 Sep 2026). Individual screens had
          // been setting `color: white` on a white card, making typed text
          // invisible. Set it once here so every TextField is readable, and
          // pin -webkit-text-fill-color, which otherwise wins over `color`.
          color: theme.palette.text.primary,
          WebkitTextFillColor: theme.palette.text.primary,
          caretColor: theme.palette.text.primary,
          "&::placeholder": {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
          // Chrome ignores background-color on autofilled fields, so the
          // background has to be painted with an inset shadow.
          "&:-webkit-autofill": {
            WebkitTextFillColor: theme.palette.text.primary,
            caretColor: theme.palette.text.primary,
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
            transition: "background-color 9999s ease-in-out 0s",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          "&:before": {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[500_12],
          "&:hover": {
            backgroundColor: theme.palette.grey[500_16],
          },
          "&.Mui-focused": {
            backgroundColor: theme.palette.action.focus,
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        underline: {
          "&:before": {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.grey[500_32],
          },
          "&.Mui-disabled": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.action.disabledBackground,
            },
          },
        },
      },
    },
  };
}
