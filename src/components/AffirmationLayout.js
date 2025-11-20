import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import { styled, StyledEngineProvider } from "@mui/material/styles";

function Affirmationlayout(props) {
  console.log(props, "okoko");

  return (
    <>
      {/* <h4 className="quotes-heading">Affirmations</h4> */}
      <div className="grid-container">
        {props.data.map((value, index) => {
          console.log(value, "data of map");
          return (
            <div>
              <img className="grid-item" src={value.img} alt="" />
              <p>{value.title}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Affirmationlayout;
