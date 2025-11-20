import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { invokeApi } from "src/bl_libs/invokeApi";
import { s3baseUrl } from "src/config/config";

export default function GeneralIterativeCkeditor({
  inputs,
  setInputs,
  name,
  editorHeight,
  index,
}) {
  const editorRef = useRef(null);
  // console.log(inputs, "inputsinputs");
  const log = () => {
    if (editorRef.current) {
      const list = [...inputs];
      list[index][name] = editorRef.current.getContent();
      setInputs(list);
      // setInputs((prevState) => ({
      //   ...prevState,
      //   [name]: editorRef.current.getContent(),
      // }));
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

  return (
    <>
      <Editor
        apiKey="4v4neyykcuxc7p8mnxweq3807d8t1pwtumr11b9xbvt7eaee"
        onChange={log}
        value={inputs[index][name]}
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={(newValue, editor) => {
          log(newValue, editor);
        }}
        init={{
          images_upload_handler: example_image_upload_handler,
          height: editorHeight ? editorHeight : 500,
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
    </>
  );
}
