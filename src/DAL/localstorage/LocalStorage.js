const _get_user_from_localStorage = () => {
  //console.log("localStorage.getItem", localStorage.getItem("user_data"));

  const user_profile = localStorage.getItem("user_data");
  if (
    user_profile &&
    user_profile !== undefined &&
    user_profile !== "undefined" &&
    user_profile !== null
  ) {
    //console.log("if");
    return JSON.parse(localStorage.getItem("user_data"));
  } else {
    //console.log("else");
    return {};
  }
};
const _get_timeZone_from_localStorage = () => {
  const user_profile = localStorage.getItem("time_zone");
  if (
    user_profile &&
    user_profile !== undefined &&
    user_profile !== "undefined" &&
    user_profile !== null
  ) {
    //console.log("if");
    return JSON.parse(localStorage.getItem("time_zone"));
  } else {
    //console.log("else");
    return {};
  }
};

module.exports = {
  _get_user_from_localStorage,
  _get_timeZone_from_localStorage,
};
