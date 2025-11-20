import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { get_root_value } from "src/utils/domUtils";
import { convertToTitleCase } from "src/utils/convertHtml";

export default function ActiveLastBreadcrumb({ breadCrumbMenu }) {
  const navigate = useNavigate();
  return (
    <div role="presentation">
      <Breadcrumbs style={{ color: "white" }} aria-label="breadcrumb">
        {breadCrumbMenu.map((item, index) => {
          return (
            <Link
              className="bread-crumb"
              underline="hover"
              color={
                item.active == true
                  ? get_root_value("--portal-theme-primary")
                  : "black"
              }
              onClick={() => navigate(item?.navigation)}
              sx={{
                "&:hover": {
                  color: "#fff",
                },
              }}
            >
              {" "}
              <span style={{ cursor: "pointer" }} className="normal-font">
                {convertToTitleCase(item?.title)}
              </span>
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
