import React from "react";
import {
  Box,
  Card,
  Link,
  Typography,
  Tooltip,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
function ResourcesCard({ imageLink }) {
  const navigate = useNavigate();
  return (
    <>
      <Card
        className="lesson-card"
        // onClick={() =>
        //   navigate(
        //     "/programmes/lessons_detail/48ce0817-9219-4977-9149-168e020ad288",
        //     { state: { name: "Creactive Concious" } }
        //   )
        // }
      >
        <div className="row p-3">
          <div className="col-lg-3 col-md-4 col-sm-12">
            <img className="lesson-card-image" src={imageLink} alt="name" />
          </div>
          <div className="col-lg-9 col-md-8 col-sm-12">
            <h4 className="lesson-heading">Resources Documents </h4>
            <p className="normal-font">
              It is for anyone who wants calmness and serenity in their life,
              and it’s perfect for people.
            </p>
            <Tooltip title="Download">
              <DownloadIcon className="icon-style" />
            </Tooltip>
            {/* <Button variant="outlined" startIcon={<DownloadIcon />}>
              Download
            </Button> */}
            {/* <p className="programme-duration">5 Lessons &nbsp; | &nbsp; 5 hr 16 min 19 sec</p> */}
          </div>
        </div>
      </Card>
    </>
  );
}

export default ResourcesCard;
