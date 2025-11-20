import { invokeApi } from '../../bl_libs/invokeApi';

export const addTeam = async (data) => {
  const requestObj = {
    path: `api/team/add_team.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const teamList = async (data) => {
  const requestObj = {
    path: `api/team/team_list.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const teamDetail = async (data) => {
  const requestObj = {
    path: `api/team/team_detail.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const editTeam = async (data) => {
  const requestObj = {
    path: `api/team/edit_team.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const teamDelete = async (data) => {
  const requestObj = {
    path: `api/team/delete_team.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const teamChangePassword = async (data) => {
  const requestObj = {
    path: `api/update_password/team_change_password_by_manager.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};
