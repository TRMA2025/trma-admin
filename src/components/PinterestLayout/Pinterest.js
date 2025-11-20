import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import { styled, StyledEngineProvider } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";

function PinterestLayout(props) {
  const navigate = useNavigate();

  console.log(props.title, "ok now lets see");
  return (
    <>
      {/* <h4 className="quotes-heading">{props.title}</h4> */}

      <div className="grid-container ">
        {props.data.map((value, index) => {
          console.log(value, "data of map");
          return (
            <div key={index}>
              <img className="grid-item" src={value.img} alt="" />
              {/* <h3 className="quotes-heading">{value.title}</h3> */}
              {/* <h3 className="h2-heading">{value.title}</h3> */}
              <p className="programme-card-desc">{value.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PinterestLayout;
