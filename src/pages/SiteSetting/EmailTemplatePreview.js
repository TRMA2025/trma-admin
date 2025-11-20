import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { detailEmailTemplateApi } from "src/DAL/SiteSetting/siteSetting";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const EmailTemplatePreview = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  console.log(params, "params");
  const previewDetail = async () => {
    const result = await detailEmailTemplateApi(params.id);
    if (result.code == 200) {
      console.log(result.email_body, "preview template");
      setPreview(result.email_body);
    }
  };
  useEffect(() => {
    previewDetail();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row mobile-margin display-flex">
          <div className="col-12">
            <IconButton
              className="back-screen-button mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon
                className="arrow-back-icon"
                style={{ color: "#fff !important", fill: "#fff !important" }}
              />{" "}
            </IconButton>
            {/* <button
            className="small-contained-button float-end mt-1"
            onClick={() => navigate(`/programmes/addreview/`)}
          >
            Add Programme Review
          </button> */}
          </div>
        </div>
      </div>
      {/* <div
        dangerouslySetInnerHTML={{
          __html: preview,
        }}
      ></div> */}
      <iframe
        className="responsive-iframe"
        srcdoc={preview}
        width="1000px"
        height="1600px"
      ></iframe>
    </>
  );
};
