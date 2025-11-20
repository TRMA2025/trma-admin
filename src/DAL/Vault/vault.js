import { invokeApi } from "../../bl_libs/invokeApi";

export const VaultListing = async (data) => {
  const requestObj = {
    path: `/api/vault_category/list_vault_category`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const VaultActiveListing = async (data) => {
  const requestObj = {
    path: `/api/vault_category/get_active_vault_category`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addVaultCategoryApi = async (data) => {
  const requestObj = {
    path: `/api/vault_category/add_vault_category`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editVaultCategoryApi = async (data, slug) => {
  const requestObj = {
    path: `/api/vault_category/update_vault_category/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteVaultApi = async (id) => {
  const requestObj = {
    path: `/api/vault_category/delete_vault_category/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
