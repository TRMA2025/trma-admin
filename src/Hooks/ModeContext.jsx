import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useSnackbar } from 'notistack';

const ModeContext = React.createContext();

export const useMode = () => useContext(ModeContext);
export function ContextMode({ children }) {
  /* ------------------------------------------------------
  ------------------| States |--------------------
  ------------------------------------------------------- */
  const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();
  const [mode, setMode] = React.useState(false);
  const [profileNewImage, setProfileNewImage] = React.useState();
  const [logo, setLogo] = React.useState();
  const [metaTitle, setMetaTitle] = React.useState("");
  const [campaignName, setCampaignName] = React.useState("Active Campaign");
  /* ------------------------------------------------------
  ------------------/ Hooks Functions /--------------------
  ------------------------------------------------------- */

  const handleChangeMode = (value) => {
    //console.log(value, "change mode");
    setMode(value);
    setProfileNewImage(localStorage.getItem("image"));
  };

  useEffect(() => {
    setProfileNewImage(localStorage.getItem("image"));
  }, [localStorage.getItem("image")]);

  useEffect(() => {
    setLogo(localStorage.getItem("adminLogo"));
    //console.log(logo, "logoContext");
  }, [localStorage.getItem("adminLogo")]);
  useEffect(() => {
    setMetaTitle(localStorage.getItem("metaTitle"));
  }, [localStorage.getItem("metaTitle")]);
  useEffect(() => {
    setCampaignName(localStorage.getItem("campaignName"));
  }, [localStorage.getItem("campaignName")]);
  const collection = {
    mode,
    handleChangeMode,
    profileNewImage,
    setProfileNewImage,
    logo,
    setLogo,
    metaTitle,
    campaignName,
  };
  return (
    <ModeContext.Provider value={collection}>{children}</ModeContext.Provider>
  );
}
