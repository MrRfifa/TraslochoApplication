import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_SERVER_URL;

const getMessages = async (contactId) => {
  try {
    const response = await axios.get(`${SOCKET_URL}/messages/${contactId}`);

    if (response.status === 200 && response.data) {
      return { success: true, message: response.data }; // Adjusted to return an array of messages
    } else {
      return { success: false, error: "Messages not available" };
    }
  } catch (error) {
    console.error("Error getting messages:", error);
    return {
      success: false,
      error: "An error occurred while retrieving messages",
    };
  }
};

const markMessageAsRead = async (messageId) => {
  try {
    // Use PATCH method to mark the message as read
    const response = await axios.patch(
      `${SOCKET_URL}/messages/${messageId}/read`
    );

    if (response.status === 200 && response.data) {
      return { success: true, message: response.data.message }; // Adjusted to return the success message
    } else {
      return { success: false, error: "Failed to mark message as read" };
    }
  } catch (error) {
    console.error("Error marking message as read:", error);
    return {
      success: false,
      error: "An error occurred while marking the message as read",
    };
  }
};

const getLastMessage = async (contactId) => {
  try {
    const response = await axios.get(
      `${SOCKET_URL}/messages/${contactId}/last-message`
    );
    if (response.status === 200 && response.data) {
      return { success: true, message: response.data.content }; // Adjusted to return an array of messages
    } else {
      return { success: false, error: "Messages not available" };
    }
  } catch (error) {
    console.error("Error getting messages:", error);
    return {
      success: false,
      error: "An error occurred while retrieving messages",
    };
  }
};

const MessageService = {
  getMessages,
  markMessageAsRead,
  getLastMessage,
};

export default MessageService;
