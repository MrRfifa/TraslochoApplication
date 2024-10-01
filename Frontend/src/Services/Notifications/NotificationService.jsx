import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getNotificationsByUserId = (userId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  return axios
    .get(`${API_URL}Notification/notifications-by-user/${userId}`, {
      headers,
    })
    .then((response) => {
      if (response.data && response.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, error: "Notifications not available" };
      }
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
      return { success: false, error: error.response.data };
    });
};

const getNonReadNotificationsByUserId = (userId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  return axios
    .get(`${API_URL}Notification/non-read-notifications-by-user/${userId}`, {
      headers,
    })
    .then((response) => {
      if (response.data && response.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, error: "Notifications not available" };
      }
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
      return { success: false, error: error.response.data };
    });
};

const getNotificationById = (notificationId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  return axios
    .get(`${API_URL}Notification/${notificationId}`, {
      headers,
    })
    .then((response) => {
      if (response.data && response.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, error: "Notification not available" };
      }
    })
    .catch((error) => {
      console.error("Error fetching notification:", error);
      return { success: false, error: error.response.data };
    });
};

const markNotificationAsRead = (notificationId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  return axios
    .put(`${API_URL}Notification/${notificationId}`, {}, { headers })
    .then((response) => {
      if (response.data && response.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, error: "Notification not available" };
      }
    })
    .catch((error) => {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.response?.data || "Unknown error" };
    });
};

const NotificationsServices = {
  getNonReadNotificationsByUserId,
  getNotificationById,
  getNotificationsByUserId,
  markNotificationAsRead,
};

export default NotificationsServices;
