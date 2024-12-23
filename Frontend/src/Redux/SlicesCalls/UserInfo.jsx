import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthService from "../../Services/Auth/AuthServices";
import { login } from "../Features/userInfo";
import { fetchMissedNotifications } from "../Features/notificationSlice";
import { startSocketConnection } from "../../Services/Messages/MessageSocketService";
import { startSignalRConnection } from "../../Services/Notifications/NotificationSocketServices";

const UserInfo = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await AuthService.getUserInfo();
        const userInfo = response.userInfo;
        startSignalRConnection(
          userInfo[0].value,
          userInfo[1].value === "Transporter"
        );
        startSocketConnection(userInfo[0].value);
        dispatch(
          login({
            id: userInfo[0].value,
            // dateOfBirth: userInfo[0].value.split(" ")[0],
            role: userInfo[1].value,
          })
        );
        // Dispatch fetchMissedNotifications to load missed notifications
        dispatch(fetchMissedNotifications(userInfo[0].value));
      } catch (error) {
        console.error("Error fetching user information:", error);
        // Handle errors as needed
      }
    };

    fetchUserInfo();
  }, [dispatch]);
  return null;
};

export default UserInfo;
