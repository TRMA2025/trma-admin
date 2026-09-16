import axios from "axios";
import { baseUri } from "../../config/config";
import { invokeApi } from "src/bl_libs/invokeApi";

export const GettingStartingApi = async (slug) => {
  const requestObj = {
    path: `/api/getting_started/getting_started_list_by_program/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddGettingStartingApi = async (data) => {
  const requestObj = {
    path: `/api/getting_started/add_getting_started`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const Getting_starting_api = async (slug) => {
  const requestObj = {
    path: `/api/getting_started/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const GettingStartingDeleteApi = async (slug) => {
  const requestObj = {
    path: `/api/getting_started/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const EditGettingStartingApi = async (data, slug) => {
  const requestObj = {
    path: `/api/getting_started/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const GettingStartingrecordingListApi = async (slug) => {
  const requestObj = {
    path: `/api/getting_started_recording/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddRecordingGettingStartinApi = async (data) => {
  const requestObj = {
    path: `/api/getting_started_recording/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const GettingREcordingDetailApi = async (slug) => {
  const requestObj = {
    path: `/api/getting_started_recording/recording_detail/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const GettingStratingDelte = async (slug) => {
  const requestObj = {
    path: `/api/getting_started_recording/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const EditRecordingGettingStarting = async (data, slug) => {
  const requestObj = {
    path: `/api/getting_started_recording/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const documenlsistingGettingSlug = async (id) => {
  const requestObj = {
    path: `/api/getting_started_document/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DocumentGettingistApi = async (data) => {
  const requestObj = {
    path: `/api/getting_started_document/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddGettingResourcesApi = async (data) => {
  const requestObj = {
    path: `/api/getting_started_document/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditGettingStartingResourceDoApi = async (data, slug) => {
  console.log(slug, "slug");
  const requestObj = {
    path: `/api/getting_started_document/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteResourceGettingStatedDoc = async (slug) => {
  const requestObj = {
    path: `/api/getting_started_document/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

// Session PDF (13 Sep 2026). Stored privately, so it cannot be linked directly:
// fetch with the auth header and hand the blob to the browser.
export const downloadGettingStartedPdf = async (slug, filename) => {
  const response = await axios({
    method: "GET",
    url: `${baseUri}/api/getting_started/download_pdf/${slug}`,
    headers: { "x-sh-auth": localStorage.getItem("token") },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "getting-started.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Clears the DB reference only; the stored file is retained.
export const removeGettingStartedPdfApi = async (slug) => {
  const requestObj = {
    path: `/api/getting_started/remove_pdf/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
