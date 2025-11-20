import React from "react";
import Skeleton from "react-loading-skeleton";

export default function SettingsSkelton() {
  return (
    <div className="row mt-2 ">
      <div className="col-lg-12 col-md-6 col-sm-12 h-100vh mt-1">
        <Skeleton
          baseColor="#fff"
          highlightColor="#ddd"
          width="100%"
          height={800}
          style={{ borderRadius: "15px" }}
        />
      </div>
    </div>
  );
}
