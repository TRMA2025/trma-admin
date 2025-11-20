import React, { useEffect } from "react";

const EmbedResource = ({ htmlCode }) => {
  useEffect(() => {
    const extractScript = (htmlString) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      const scriptTag = doc.querySelector("script");
      if (scriptTag) {
        const scriptElement = document.createElement("script");
        scriptElement.async = true;
        scriptElement.defer = true;
        scriptElement.innerHTML = scriptTag.innerHTML;
        scriptElement.dataset.injected = "true"; // Custom attribute for identification
        document.body.appendChild(scriptElement);
      }
    };

    // Inject script from the htmlCode
    extractScript(htmlCode);

    // Cleanup function
    return () => {
      const insertedScript = document.body.querySelector(
        `script[data-injected="true"]`
      );
      if (insertedScript && insertedScript.parentNode === document.body) {
        document.body.removeChild(insertedScript);
      }
    };
  }, [htmlCode]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: htmlCode?.split("<script")[0] || "",
      }}
    />
  );
};

export default EmbedResource;
