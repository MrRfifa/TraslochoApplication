// src/components/NotificationSocket.jsx
import { useMemo } from "react";
import {
  startSignalRConnection,
  stopSignalRConnection,
} from "./NotificationService";
import { useSelector } from "react-redux";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";

const NotificationSocket = () => {
  const userInfo = useSelector((state) => state.userInfo);
  UserInfo();
  useMemo(() => {
    const initiateConnection = async () => {
      await startSignalRConnection(userInfo.value.id);
    };

    initiateConnection();

    return () => {
      stopSignalRConnection(userInfo.value.id); // Clean up on unmount
    };
  }, [userInfo.value.id]);

  return null; // No UI needed
};

export default NotificationSocket;
