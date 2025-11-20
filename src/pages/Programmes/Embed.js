import React from "react";
import { useLocation } from "react-router-dom";
// import DocViewer from "react-doc-viewer";

export default function Embed({ previewDoc }) {
  const docs = [
    {
      uri: "https://beme-academy-dev-app-bucket.s3.amazonaws.com/program_document/834798cd-66a0-408e-8340-ae1fe5bc4958.doc",
    },
  ];
  const { state } = useLocation();

  return (
    <>
      <div
        style={{ textAlign: "center" }}
        dangerouslySetInnerHTML={{
          __html: state?.embed_code,
        }}
      ></div>
      {/* <DocViewer documents={docs} /> */}
    </>
  );
}
