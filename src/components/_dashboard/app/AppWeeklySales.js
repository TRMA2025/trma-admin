import { Icon } from "@iconify/react";
import androidFilled from "@iconify/icons-ant-design/android-filled";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// material
import { alpha, styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
// utils
import { fShortenNumber } from "../../../utils/formatNumber";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.success.darker,
  backgroundColor: theme.palette.success.lighter,
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: theme.palette.success.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(
    theme.palette.success.dark,
    0
  )} 0%, ${alpha(theme.palette.success.dark, 0.24)} 100%)`,
}));

// ----------------------------------------------------------------------

export default function AppWeeklySales({ total }) {
  return (
    <RootStyle>
      <IconWrapperStyle>
        {/* <Icon icon={androidFilled} width={24} height={24} /> */}
        <AccountCircleIcon />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(total)}</Typography>
      <Typography
        variant="subtitle2"
        className="normal-font"
        //  sx={{ opacity: 0.72 }}
      >
        Recordings
      </Typography>
    </RootStyle>
  );
}
