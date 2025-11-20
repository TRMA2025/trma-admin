import React from "react";
import { Container, ButtonGroup, Button } from "@mui/material";

function MemoriesDetails(props) {
  //console.log(props, "from layout title");
  return (
    <Container>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-6">
          <h2>Vault</h2>
        </div>
      </div>
    </Container>
  );
}

export default MemoriesDetails;
