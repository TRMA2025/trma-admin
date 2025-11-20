import React, { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
// import { invokeApi, s3baseUrl } from "../../bl_libs/invokeApi";
import { invokeApi } from "src/bl_libs/invokeApi";
import { s3baseUrl } from "src/config/config";

export default function TinyEditorWebsiteSetting({
  setInputs,
  inputs,
  setDetailDescription,
  handleSubmit,
  detailDescriptionCk,
  name,
  setTemplateFieldsData,
  templateFieldsData,
}) {
  const editorRef = useRef(null);

  const log = (value, editor) => {
    if (editorRef.current) {
      // setDetailDescription(editorRef.current.getContent());
      setInputs((prevState) => ({
        ...prevState,
        [name]: editorRef.current.getContent(),
      }));
    }
  };
  const logUpdate = (value, editor) => {
    if (editorRef.current) {
      // setDetailDescription(editorRef.current.getContent());
      setTemplateFieldsData((prevState) => ({
        ...prevState,
        [name]: editorRef.current.getContent(),
      }));
    }
  };
  function example_image_upload_handler(blobInfo, success, failure, progress) {
    let requestObj = {
      path: "/app/update_image_on_s3/",
      method: "POST",
      headers: {
        "x-sh-auth": localStorage.getItem("token"),
      },
    };

    let _formData = new FormData();
    _formData.append("image", blobInfo.blob());
    _formData.append("width", "600");
    requestObj["postData"] = _formData;

    invokeApi(requestObj).then((res) => {
      if (res.code === 200) {
        success(s3baseUrl + res.image_path);
      } else {
        failure(res.message);
      }
    });
  }
  const textToHtml = (text) => {
    const elem = document.createElement("div");
    return text
      .split(/\n\n+/)
      .map((paragraph) => {
        return (
          "<p>" +
          paragraph
            .split(/\n+/)
            .map((line) => {
              elem.textContent = line;
              return elem.innerHTML;
            })
            .join("<br/>") +
          "</p>"
        );
      })
      .join("");
  };

  return (
    <>
      <Editor
        apiKey="4v4neyykcuxc7p8mnxweq3807d8t1pwtumr11b9xbvt7eaee"
        onChange={log}
        value={
          templateFieldsData !== undefined
            ? templateFieldsData[name]
            : inputs.name
        }
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={
          templateFieldsData !== undefined
            ? (newValue, editor) => {
                logUpdate(newValue, editor);
              }
            : (newValue, editor) => {
                log(newValue, editor);
              }
        }
        init={{
          images_upload_handler: example_image_upload_handler,
          height: 500,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  );
}
