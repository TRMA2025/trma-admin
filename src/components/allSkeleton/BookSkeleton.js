import React from "react";
import Skeleton from "react-loading-skeleton";

export default function BookSkeleton() {
  return (
    <div className="container mt-2">
      <div className="row">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
            <div className="card mt-1 pods-cards-shadow cursor h-100">
              <Skeleton
                height={200}
                className="card-img-top pods-image"
                baseColor="#dddde8"
                highlightColor="#ffffff"
              />
              <div className="card-body">
                <Skeleton
                  height={30}
                  width="80%"
                  style={{ marginBottom: 10 }}
                  className="h2-heading"
                  baseColor="#dddde8"
                  highlightColor="#9F00FF"
                />
                <Skeleton
                  height={20}
                  width="80%"
                  style={{ marginBottom: 10 }}
                  className="h2-heading"
                  baseColor="#dddde8"
                  highlightColor="#cf7fff"
                />
                <Skeleton
                  height={20}
                  width="90%"
                  className="programme-card-desc mb-3"
                  baseColor="#dddde8"
                  highlightColor="#ffffff"
                />
                <Skeleton
                  height={20}
                  width="60%"
                  baseColor="#dddde8"
                  highlightColor="#ffffff"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
