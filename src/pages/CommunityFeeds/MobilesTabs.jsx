import React from "react";
import { useState } from "react";
import MUICustomTabs from "src/components/GeneralComponents/MUICustomTabs";
import MainPart from "./MainPart";

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
      title: "Community Area",
      component: (
        <>
          <MainPart
            showInfoBox={showInfoBox}
            setShowInfoBox={setShowInfoBox}
            userInfo={userInfo}
            event_id=""
          />
        </>
      ),
    },
    {
      title: "Rewards",
      component: (
        <>
          {" "}
          <div className="col-12 pb-4">
            <div className="mini-cards">
              <h3>Rewards</h3>
            </div>
            <div className="mini-cards mt-2">
              <h3>Whats On</h3>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {tabValue == 0 ? (
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            <h2>Community Area</h2>
          </div>
          <div className="col-lg-6 col-sm-12 text-end">
            <button className="small-contained-button" onClick={handleMyPosts}>
              {" "}
              My Posts
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-lg-6 col-sm-12">
              <h2>Rewards</h2>
            </div>
          </div>
        </>
      )}

      <MUICustomTabs
        data={TABS_OPTIONS}
        value={tabValue}
        handleChange={handleChange}
        // className="mt-4"
      />
    </>
  );
}
