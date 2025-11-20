export const update_root_value = (variable, value) => {
  document.documentElement.style.setProperty(variable, value);
};

export const get_root_value = (variable) => {
  return document.documentElement.style.getPropertyValue(variable);
};
