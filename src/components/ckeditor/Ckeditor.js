import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
// import { invokeApi, s3baseUrl } from "../../bl_libs/invokeApi";
import { invokeApi } from "src/bl_libs/invokeApi";
import { s3baseUrl } from "src/config/config";

export default function TinyEditor({
  setDetailDescription,
  handleSubmit,
  detailDescriptionCk,
}) {
  const editorRef = useRef(null);
  const [focuse, setfocuse] = useState(false);

  const log = () => {
    if (editorRef.current) {
      setDetailDescription(editorRef.current.getContent());
    }
  };
  const example_image_upload_handler = (
    blobInfo,
    success,
    failure,
    progress
  ) => {
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
  };
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
  function handleEditorInit() {
    setTimeout(() => {
      let containerWarning = document.getElementsByClassName(
        "tox-notification--warning"
      );
      // console.log(containerWarning, "containercontainer");
      if (containerWarning.length > 0) {
        containerWarning[0].style.display = "none";
        setfocuse(false);
      }
      setfocuse(false);
    }, 100);
  }
  useEffect(() => {
    handleEditorInit();
  }, [focuse]);
  return (
    <>
      <Editor
        apiKey="4v4neyykcuxc7p8mnxweq3807d8t1pwtumr11b9xbvt7eaee"
        onChange={log}
        value={detailDescriptionCk}
        onInit={(evt, editor) => (
          (editorRef.current = editor), handleEditorInit()
        )}
        onEditorChange={(newValue, editor) => {
          //   setDetailDescription(newValue);
          setDetailDescription(editor.getContent());
          setfocuse(true);
        }}
        init={{
          setup: function (editor) {
            editor.on("focus", function (e) {
              setfocuse(true);
            });
          },
          images_upload_handler: example_image_upload_handler,
          height: 500,
          menubar: true,
          plugins:
            "advlist autolink lists link image print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
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
