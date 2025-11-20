import PropTypes from "prop-types";
// material
import { Box } from "@mui/material";
import { appLogoIcon } from "../assets";
import { s3baseUrl } from "src/config/config";
import { useMode } from "src/Hooks/ModeContext";
import { useEffect } from "react";

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }) {
  const { logo, setLogo } = useMode();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogo(localStorage.getItem("adminLogo"));
    }, 1000);
    return () => clearTimeout(timer);
  }, [localStorage]);

  return (
    <Box component="img" src={s3baseUrl + logo} sx={{ width: 120, ...sx }} />
  );
}
