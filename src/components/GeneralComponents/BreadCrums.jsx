import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";

export default function ActiveLastBreadcrumb({ breadCrumbMenu }) {
  const navigate = useNavigate();
  function handleClick(event, value) {
    event.preventDefault();
    navigate(value);
  }
  console.log(breadCrumbMenu, "breadCrumbMenu");
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {breadCrumbMenu.map((item, index) => {
          return (
            <Link
              underline="hover"
              color={item.active == true ? "#f6bd4b" : "white"}
              onClick={() => navigate(item?.navigation)}
            >
              <span style={{ cursor: "pointer" }}>{item?.title}</span>
            </Link>
          );
        })}
        {/* <Link underline="hover" color="inherit">
          Core
        </Link>
        <Link underline="hover" color="text.primary" aria-current="page">
          Breadcrumbs
        </Link> */}
      </Breadcrumbs>
    </div>
  );
}
