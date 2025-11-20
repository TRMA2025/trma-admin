import { invokeApi } from '../../bl_libs/invokeApi';

export const projectListing = async (data) => {
  const requestObj = {
    path: `api/projects/project_listing.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const addProject = async (data) => {
  const requestObj = {
    path: `api/projects/add_project.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const detailProject = async (data) => {
  const requestObj = {
    path: `api/projects/detail_project.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const editProject = async (data) => {
  const requestObj = {
    path: `api/projects/edit_project.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const deleteProject = async (data) => {
  const requestObj = {
    path: `api/projects/delete_project.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const taskList = async (data) => {
  const requestObj = {
    path: `api/task/task_list.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const addTask = async (data) => {
  const requestObj = {
    path: `api/task/add_task.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const deleteTask = async (data) => {
  const requestObj = {
    path: `api/task/delete_task.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const changePriority = async (data) => {
  const requestObj = {
    path: `api/task/change_task_priority.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const changeStatus = async (data) => {
  const requestObj = {
    path: `api/task/change_task_status.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const addTaskMembers = async (data) => {
  const requestObj = {
    path: `api/task/add_member_task.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const deleteTaskMembers = async (data) => {
  const requestObj = {
    path: `api/task/delete_member_task.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const addTaskTargetDate = async (data) => {
  const requestObj = {
    path: `api/task/change_target_date.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const taskFilter = async (data) => {
  const requestObj = {
    path: `api/task/task_filter.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const taskOrder = async (data) => {
  const requestObj = {
    path: `api/task/change_task_order.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const uploadTaskFiles = async (data) => {
  const requestObj = {
    path: `api/task/add_task_files.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const removeTaskFiles = async (data) => {
  const requestObj = {
    path: `api/task/delete_task_files.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const detailTaskFiles = async (data) => {
  const requestObj = {
    path: `api/task/task_files_detail.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};

export const changeTaskDetail = async (data) => {
  const requestObj = {
    path: `api/task/edit_task_text.php`,
    method: 'POST',
    headers: {},
    postData: data
  };
  return invokeApi(requestObj);
};
