import React, { useEffect, useState } from "react";
import MainPart from "./MainPart";
import { useNavigate } from "react-router-dom";
import MobilesTabs from "./MobilesTabs";
import { useContentSetting } from "src/Hooks/ContentSettingState";

export default function Feed({ groupFeed, group }) {
  const [showInfoBox, setShowInfoBox] = useState(false);
  const { userInfo } = useContentSetting();
  const navigate = useNavigate();
  console.log(userInfo, "userInfouserInfo");
  const handleMyPosts = () => {
    navigate(`/community-area/my-posts`);
  };
  return (
    <div className="container new-community-page">
      <div className="row d-none d-lg-flex">
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
      <div className="mobile-case d-block d-lg-none">
        {/* this will be changes on screen size 991 wd */}
        {window.screen.width < 911 && (
          <div className="row mt-3">
            <div className="community-main-section pb-4">
              <>
                <MobilesTabs
                  showInfoBox={showInfoBox}
                  setShowInfoBox={setShowInfoBox}
                  userInfo={userInfo}
                  event_id=""
                  handleMyPosts={handleMyPosts}
                />
              </>
            </div>
          </div>
        )}
      </div>
      <div className="row d-none d-lg-flex mt-3">
        <div className="col-3 pb-4">
          <div className="mini-cards">
            <h3>Rewards</h3>
          </div>
          <div className="mini-cards mt-2">
            <h3>Whats On</h3>
          </div>
        </div>
        <div className="community-main-section col-9 pb-4">
          <>
            <MainPart
              showInfoBox={showInfoBox}
              setShowInfoBox={setShowInfoBox}
              userInfo={userInfo}
              event_id=""
            />
          </>
        </div>
      </div>
    </div>
  );
}
