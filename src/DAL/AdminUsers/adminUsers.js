import { invokeApi } from "../../bl_libs/invokeApi";
const h = () => ({ "x-sh-auth": localStorage.getItem("token") });
export const listAdminUsers = async () => invokeApi({ path: `/admin_users/list_admin_users`, method: "GET", headers: h() });
export const addAdminUser = async (data) => invokeApi({ path: `/admin_users/add_admin_user`, method: "POST", headers: h(), postData: data });
export const deleteAdminUser = async (id) => invokeApi({ path: `/admin_users/delete_admin_user/${id}`, method: "DELETE", headers: h() });
