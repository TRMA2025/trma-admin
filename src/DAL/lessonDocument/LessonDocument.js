import { invokeApi } from "../../bl_libs/invokeApi";

export const documentListApiSlug = async (id) => {
  const requestObj = {
    path: `/api/lesson_document/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const documentListApi = async (data) => {
  const requestObj = {
    path: `/api/lesson_document/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const AddLessonDocumentApi = async (data) => {
  const requestObj = {
    path: `/api/lesson_document/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditLessonDocumentApi = async (data, slug) => {
  console.log(slug, "slug");
  const requestObj = {
    path: `/api/lesson_document/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteLessonDocumentApi = async (slug) => {
  const requestObj = {
    path: `/api/lesson_document/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const deleteLessonApi = async (slug) => {
  const requestObj = {
    path: `/api/lesson/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const LessonEvaluationApi = async (id) => {
  const requestObj = {
    path: `/api/lesson_note/list_lesson_notes_by_lesson/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddLessonEvaluationApi = async (data) => {
  const requestObj = {
    path: `/api/lesson_note/add_lesson_note_by_admin/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteLessonNoteDocumentApi = async (id) => {
  const requestObj = {
    path: `/api/lesson_note/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const EditLessonEvaluationApi = async (data, slug) => {
  console.log(slug, "slug");
  const requestObj = {
    path: `/api/lesson_note/update_lesson_notes_by_admin/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

//geting started evaluation notes..............

export const GettingStartedevaluation = async (id) => {
  const requestObj = {
    path: `/api/getting_started_note/list_getting_started_notes_by_getting_started/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddGettingStartedEvaluationApi = async (data) => {
  const requestObj = {
    path: `/api/getting_started_note/add_getting_started_note_by_admin/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteGettingStartedEvalApi = async (slug) => {
  const requestObj = {
    path: `/api/getting_started_note/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const EditGettingStartedEvaluationApi = async (data, slug) => {
  console.log(slug, "slug");
  const requestObj = {
    path: `/api/getting_started_note/update_getting_started_note_by_admin/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
