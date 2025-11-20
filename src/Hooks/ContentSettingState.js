import React, { useContext, useEffect, useState } from "react";
import {
  _get_user_from_localStorage,
  _get_timeZone_from_localStorage,
} from "../DAL/localstorage/LocalStorage";
import io from "socket.io-client";
import { socketBaseUri } from "src/config/config";

const CreateContentSetting = React.createContext();
const get_user = _get_user_from_localStorage();
const get_time_zone = _get_timeZone_from_localStorage();

let socket = {};
if (get_user?._id) {
  socket = io(socketBaseUri + `?user_id=${get_user?._id}`);
}
console.log(socket, "socketsocket==");
export const useContentSetting = () => useContext(CreateContentSetting);

export function ContentSettingState({ children }) {
  /* ------------------------------------------------------
  ------------------| States |--------------------
  ------------------------------------------------------- */

  const [userInfo, setUserInfo] = useState(get_user);
  const [timezone, setTimeZone] = useState(get_time_zone);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [notificationsCount, setNotificationsCount] = useState(0);

  /* ------------------------------------------------------
------------------/ Hooks Functions /-------------------
  ------------------------------------------------------- */

  const handleSetUserInfo = (val) => {
    setUserInfo(val);
  };
  const START_SOCKET_FORCEFULLY = (user_id) => {
    console.log("===========================caleedddddddddddddddddd====");
    socket = io(socketBaseUri + `?user_id=${user_id}`);
  };
  const STOP_SOCKET_FORCEFULLY = (user_id) => {
    socket.disconnect();
  };
  const handleSetTimeZone = (val) => {
    setTimeZone(val);
  };
  const handleNotificationsCount = (val) => {
    setNotificationsCount(val);
  };
  // useEffect(() => {
  // if (userInfo?._id && !isConnected) {
  //   socket.emit("live_event_room", userInfo._id);
  //   setIsConnected(true);
  // }
  // return () => {};
  // console.log(isConnected, "isConnected");
  // }, [userInfo,isConnected]);
  const collection = {
    handleSetUserInfo,
    handleSetTimeZone,
    setNotificationsCount,
    notificationsCount,
    handleNotificationsCount,
    userInfo,
    timezone,
    setUserInfo,
    setTimeZone,
    socket,
    START_SOCKET_FORCEFULLY,
    STOP_SOCKET_FORCEFULLY,
  };
  return (
    <CreateContentSetting.Provider value={collection}>
      {children}
    </CreateContentSetting.Provider>
  );
}
