import { SnackbarProvider } from "notistack";
import { Slide, StyledEngineProvider } from "@mui/material";

// routes
import Routers from "./routes";
// theme
import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/index.css";
import "./assets/css/style.css";
// import "./assets/css/dark.css";
// components
import ScrollToTop from "./components/ScrollToTop";
import { BaseOptionChartStyle } from "./components/charts/BaseOptionChart";
import { ContextMode } from "./Hooks/ModeContext";

import { Helmet } from "react-helmet-async";
import { s3baseUrl } from "./config/config";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function App() {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [favIcon, setFavIcon] = useState("");

  useEffect(() => {
    setMetaTitle(localStorage.getItem("metaTitle"));
    setMetaDescription(localStorage.getItem("metaDescription"));
    setFavIcon(localStorage.getItem("favIcon"));
  }, [localStorage]);

  return (
    <ContextMode>
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />

        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          TransitionComponent={Slide}
          maxSnack={3}
        >
          <Helmet>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="icon" type="image/x-icon" href={s3baseUrl + favIcon} />
          </Helmet>
          <Routers />
        </SnackbarProvider>
      </ThemeConfig>
    </ContextMode>
  );
}
