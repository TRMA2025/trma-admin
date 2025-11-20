import { invokeApi } from "../../bl_libs/invokeApi";
export const testimonialListingApi = async (data) => {
  const requestObj = {
    path: `/api/testimonial/general_testimonial`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const generalTestimonialListingApi = async (data) => {
  const requestObj = {
    path: `/api/testimonial/general_testimonial`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// export const templateListingApi = async (data) => {
//   const requestObj = {
//     path: `/api/template_configuration/active_template_configuration`,
//     method: "GET",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//   };
//   return invokeApi(requestObj);
// };
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
export const detailWebsiteTestimonialApi = async (id) => {
  const requestObj = {
    path: `/api/testimonial/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
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
// export const addPageApi = async (data) => {
//   const requestObj = {
//     path: `/api/sale_page`,
//     method: "POST",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };
// export const editPageApi = async (data, id) => {
//   const requestObj = {
//     path: `/api/sale_page/${id}`,
//     method: "PUT",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };
// export const detailPageApi = async (id) => {
//   const requestObj = {
//     path: `/api/sale_page/${id}`,
//     method: "GET",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//   };
//   return invokeApi(requestObj);
// };
// export const detailContentPageApi = async (id) => {
//   const requestObj = {
//     path: `/api/sale_page/${id}`,
//     method: "GET",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//   };
//   return invokeApi(requestObj);
// };
// export const updatePageContentSettingApi = async (data, id) => {
//   const requestObj = {
//     path: `/api/sale_page/update_sale_page_detail/${id}`,
//     method: "PUT",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };
export const salePageTestimonialListApi = async (id) => {
  const requestObj = {
    path: `/api/testimonial/sale_page/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
