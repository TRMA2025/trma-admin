import React from "react";
import { useState } from "react";
import MUICustomTabs from "../GeneralComponents/MUICustomTabs";

export default function MobilesTabs({
  showInfoBox,
  setShowInfoBox,
  userInfo,
  handleMyPosts,
}) {
  const [tabValue, setTabValue] = useState(0);

  //Changing tab values
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const TABS_OPTIONS = [
    {
      title: "Active",
      component: <>{/* <ActiveMembers /> */}</>,
    },
    {
      title: "Pending",
      component: <>{/* <PendingMembers /> */}</>,
    },
  ];

  return (
    <>
      <MUICustomTabs
        data={TABS_OPTIONS}
        value={tabValue}
        handleChange={handleChange}
        // className="mt-4"
      />
    </>
  );
}
