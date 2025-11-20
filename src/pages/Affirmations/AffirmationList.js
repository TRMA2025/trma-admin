import * as React from "react";
import PinterestLayout from "src/components/PinterestLayout/Pinterest";
import {
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  useNavigate,
  useParams,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";

function AffirmationList() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(-1);
  };
  const itemData = [];
  return (
    <>
      <div className="container-fluid">
        <div className="row mobile-margin display-flex">
          <div className="col-12">
            <IconButton
              className="back-screen-button mb-4"
              onClick={() => handleNavigate()}
            >
              <ArrowBackIcon
                className="arrow-back-icon"
                style={{ color: "#fff !important", fill: "#fff !important" }}
              />{" "}
            </IconButton>
            <button
              className="small-contained-button float-end me-4"
              // onClick={() => navigate(`/programmes/lessons_card/${id}`, { state: location.state })}
            >
              Add Affirmation
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <h2 className="quotes-heading ">Affirmation List</h2>
          </div>
        </div>
      </div>
      <PinterestLayout data={itemData} />
    </>
  );
}

export default AffirmationList;
