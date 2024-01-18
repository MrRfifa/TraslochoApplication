import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_SERVER_URL;

const getMessages = async (contactId) => {
  try {
    const response = await axios.get(`${SOCKET_URL}messages/${contactId}`);
    if (response.data && response.status === 200) {
      return { success: true, message: response.data };
    } else {
      return { success: false, error: "Messages not available" };
    }
  } catch (error) {
    console.error("Error getting messages:", error);
    return { success: false, error: "Error getting messages" };
  }
};

const MessageService = {
  getMessages,
};

export default MessageService;
