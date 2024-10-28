import { createContext, useEffect, useState } from "react";
import NotificationService from "./NotificationService";
import AuthService from "../Auth/AuthServices"; // Ensure login is available
// import { useNavigate } from "react-router-dom";

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  //   const navigate = useNavigate();

  useEffect(() => {
    const initializeSignalRConnection = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const userInfo = await AuthService.getUserInfo();
        if (userInfo && userInfo.userInfo) {
          NotificationService.connect(token, handleNewNotification);
        //   loadExistingNotifications(); // Load notifications on login
        }
      }
    };

    initializeSignalRConnection();

    return () => {
      NotificationService.disconnect();
    };
  }, []);

  const handleNewNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

//   const loadExistingNotifications = async () => {
//     // Call your backend to load existing and missed notifications
//     const response = await AuthService.getUserSpecificInfo();
//     if (response && response.userInfoSpec) {
//       setNotifications(response.userInfoSpec.notifications);
//       const unread = response.userInfoSpec.notifications.filter(
//         (n) => !n.isRead
//       ).length;
//       setUnreadCount(unread);
//     }
//   };

  const markAsRead = () => {
    setUnreadCount(0);
    // Optionally send a request to mark notifications as read in the backend
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
