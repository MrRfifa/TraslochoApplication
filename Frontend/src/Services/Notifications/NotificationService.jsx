import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const markNotificationAsRead = async (notificationId) => {
  try {
    // Use PATCH method to mark the notification as read
    const response = await axios.put(
      `${API_URL}notification/${notificationId}`
    );
    console.log(response);

    if (response.status === 200 && response.data) {
      return { success: true, message: response.data.message }; // Adjusted to return the success notification
    } else {
      return { success: false, error: "Failed to mark notification as read" };
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return {
      success: false,
      error: "An error occurred while marking the notification as read",
    };
  }
};

const NotificationService = {
  markNotificationAsRead,
};

export default NotificationService;
