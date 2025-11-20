// here we add all base urls and keys

import { update_root_value } from "src/utils/domUtils";

export const baseUri = process.env.REACT_APP_API_BASE_URL;
export const s3baseUrl = process.env.REACT_APP_PIC_BASE_URL;
export const project_name = process.env.REACT_APP_PROJECT_NAME;
export const project_url = process.env.REACT_APP_PROJECT_URL;
export const client_url = process.env.REACT_APP_CLIENT_URL;
export const project_type = process.env.REACT_APP_PROJECT_TYPE;
export const clientPortalUrl = process.env.REACT_APP_CLIENT_PORTAL_URL;
export const socketBaseUri = process.env.REACT_APP_API_SOCKET_BASE_URL;

export const material_theme_palate = {
  lighter: "#d4bff2",
  light: "#ede7f6",
  main: "#1a93a9",
  dark: "#198BA8",
  darker: "#198BA8",
  contrastText: "#fff",
};

 if (project_name == "be-me-academy") {
  material_theme_palate.main = "#9F00FF";
  /* Main theme color */
  update_root_value("--portal-theme-primary", "#fff"); //c
  update_root_value("--portal-theme-secondary", "#9F00FF50"); //c
  update_root_value("--text-primary-color", "white"); //c
  update_root_value("--text-secondary-color", "rgb(150, 150, 150)");
  update_root_value("--text-color", "black");
  /* Main theme color end */

  /* Main background color*/
  update_root_value("--background-primary-color", "#9F00FF");
  update_root_value("--background-secondary-color", "#9F00FF");

  /* Main background color end*/

  /* Sidebar Properties */
  update_root_value("--sidebars-text-color", "white");
  update_root_value("--sidebars-active-color", "#e1b1ff");
  update_root_value("--sidebars-hover-color", "#e1b1ff");
  update_root_value("--sidebars-background-color", "#ffffff");
  /* Sidebar Properties */

  /* Popup / Popover properties  */
  update_root_value("--popup-background-color", "white");
  update_root_value("--popup-text-color", "#9F00FF");
  /* Popup / Popover properties end  */

  /* Element properties */
  update_root_value("--input-text-color", "black");
  update_root_value("--input-placeholder-color", "#fff"); //not yet
  update_root_value("--input-background-primary", "#fff"); //not yet
  update_root_value("--input-background-secondary", "#1d1c1d");
  update_root_value("--icons-color-allover", "#e1b1ff");
  /* Element properties ends*/

  /* Button Properties */
  update_root_value("--button-background-color", "#fff");
  update_root_value("--button-text-color", "#9F00FF");
  update_root_value("--button-outlined-color", "#fff");
  update_root_value("--button-hover-color", "#fff");
  /* Button Properties ends*/

  /* Audio Properties */
  update_root_value("--audio-color", "rgb(56, 54, 54)");
  /* Audio Properties ends*/

  /* calendar Properties */
  update_root_value("--calendar-selected-box", "#8b8b8b");
  /* calendar Properties ends*/
} 
// Keys
// export const secret_key = process.env.REACT_APP_API_SECRET_KEY;
