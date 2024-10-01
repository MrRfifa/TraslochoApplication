// components/Notification.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../../Redux/Features/notificationSlice";
import NotificationsServices from "../../Services/Notifications/NotificationService";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";
import UserNotifications from "../../Redux/SlicesCalls/NotificationsCall";

const Notification = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo); // Assuming you have userId in auth state

  UserInfo();

  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response =
  //         await NotificationsServices.getNonReadNotificationsByUserId(
  //           userInfo.value.id
  //         );

  //       if (response && response.success) {
  //         dispatch(setNotifications(response.message)); // Set notifications in the store
  //       }
  //     } catch (error) {
  //       console.error("Error fetching unread notifications:", error);
  //     }
  //   };

  //   if (userInfo.value.id) {
  //     fetchNotifications(); // Fetch notifications if userId exists
  //   }
  // }, [dispatch, userInfo.value.id]); // Effect depends on userId and dispatch

  UserNotifications(userInfo.value.id);

  console.log(notifications);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.content || notification}</li> // Adjust based on notification structure
        ))}
      </ul>
    </div>
  );
};

export default Notification;
