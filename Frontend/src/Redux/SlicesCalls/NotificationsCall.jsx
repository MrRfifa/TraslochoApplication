// src/components/UserNotifications.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNotifications } from "../Features/notificationSlice";
import NotificationsServices from "../../Services/Notifications/NotificationService";

const UserNotifications = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response =
          await NotificationsServices.getNonReadNotificationsByUserId(userId);
        console.log(response);

        if (response && response.data) {
          dispatch(setNotifications(response.data)); // Set notifications in the store
        }
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
        // Handle errors as needed
      }
    };

    if (userId) {
      fetchUnreadNotifications(); // Fetch notifications if userId exists
    }
  }, [dispatch, userId]);

  return null; // This component does not need UI
};

export default UserNotifications;
