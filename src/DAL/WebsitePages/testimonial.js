import { invokeApi } from "../../bl_libs/invokeApi";

export const addWebsiteTestimonial = async (data) => {
  const requestObj = {
    path: `/api/testimonial`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editWebsiteTestimonialApi = async (data, id) => {
  const requestObj = {
    path: `/api/testimonial/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteWebsiteTestimonial = async (id) => {
  const requestObj = {
    path: `/api/testimonial/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const detailWebsiteTestimonialApi = async (id) => {
  const requestObj = {
    path: `/api/testimonial/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const salePageTestimonialListApi = async (id) => {
  let api_path = `/api/testimonial/general_testimonial`;
  if (id) {
    api_path = `/api/testimonial/sale_page/${id}`;
  }
  const requestObj = {
    path: api_path,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
