import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getUserById = (userId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  return axios
    .get(`${API_URL}User/user-${userId}/`, {
      headers,
    })
    .then((response) => {
      if (response.data && response.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, error: "User not available" };
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      return { success: false, error: error.response.data };
    });
};

const UserServices = {
  getUserById,
};

export default UserServices;
