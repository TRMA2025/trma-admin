import React from "react";
import { Box, Card, Link, Typography, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProgrammRecording({ product }) {
  const navigate = useNavigate();
  return (
    <>
      <Card
        className="lesson-card"
        onClick={() =>
          navigate(
            "/programmes/programm_recording_detail/48ce0817-9219-4977-9149-168e020ad288",
            { state: { name: "Secrets of Serenity" } }
          )
        }
      >
        <div className="row p-3">
          <div className="col-lg-2 col-md-3 col-sm-12">
         
          </div>
          <div className="col-lg-10 col-md-9 col-sm-12">
            <h4 className="lesson-heading">Secrets of Serenity </h4>
            <p className="normal-font">
              It is for anyone who wants calmness and serenity in their life,
              and it’s perfect for people that crave clarity and direction and
              are ready to uplevel their thinking and results.
            </p>
            {/* <p className="programme-duration">5 Lessons &nbsp; | &nbsp; 5 hr 16 min 19 sec</p> */}
          </div>
        </div>
      </Card>
    </>
  );
}

export default ProgrammRecording;
