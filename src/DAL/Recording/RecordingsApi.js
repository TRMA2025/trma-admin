import { invokeApi } from "../../bl_libs/invokeApi";

// export const RecordingListingApi = async (data) => {
//   const requestObj = {
//     path: `/api/program_recording`,
//     method: "GET",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//   };
//   return invokeApi(requestObj);
// };
export const RecordingListingApi = async (page, limit, search) => {
  const requestObj = {
    path: `/api/program_recording/recording_list_with_pagination?page=${page}&limit=${limit}&search_text=${
      search == undefined || search == "" ? "" : search
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddRecording = async (data) => {
  const requestObj = {
    path: `/api/program_recording/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditRecordingApi = async (recording_slug, data) => {
  const requestObj = {
    path: `/api/program_recording/${recording_slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteRecording = async (recoding_slug) => {
  const requestObj = {
    path: `/api/program_recording/${recoding_slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
