import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_SERVER_URL;

const getContacts = async (userId) => {
  try {
    const response = await axios.get(`${SOCKET_URL}contacts/${userId}`);
    if (response.data && response.status === 200) {
      return { success: true, message: response.data };
    } else {
      return { success: false, error: "Contact creation not available" };
    }
  } catch (error) {
    console.error("Error adding contact:", error);
    return { success: false, error: "Error adding contact" };
  }
};

const addContact = async (participant1, participant2) => {
  try {
    const response = await axios.post(`${SOCKET_URL}contacts`, {
      participant1,
      participant2,
    });

    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Contact creation not available" };
    }
  } catch (error) {
    // console.error("Error adding contact:", error);
    return {
      success: false,
      error: error.response.data.error || "Error adding contact",
    };
  }
};

const ContactService = {
  getContacts,
  addContact,
};

export default ContactService;
