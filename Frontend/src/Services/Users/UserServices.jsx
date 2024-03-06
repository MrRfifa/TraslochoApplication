import axios from "axios";
import AuthVerifyService from "../Auth/AuthVerifyService";

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

const changeEmailAddress = async (newEmail, currentPassword) => {
  const userId = AuthVerifyService.getUserId();
  try {
    const response = await axios.put(
      `${API_URL}User/${userId}/account/email`,
      {
        newEmail,
        currentPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (response.data) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return { success: false, error: "Email change request failed" };
    }
  } catch (error) {
    if (error.response) {
      console.error("Error changing email:", error.response.data);
      return { success: false, error: error.response.data };
    } else if (error.request) {
      console.error("Error changing email: No response received");
      return { success: false, error: "No response received" };
    } else {
      console.error("Error changing email:", error.message);
      return { success: false, error: error.message };
    }
  }
};

const changePassword = async (currentPassword, password, confirmPassword) => {
  const userId = AuthVerifyService.getUserId();
  try {
    const response = await axios.put(
      `${API_URL}User/${userId}/account/password`,
      {
        currentPassword,
        password,
        confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (response.data) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return { success: false, error: "Password change request failed" };
    }
  } catch (error) {
    if (error.response) {
      console.error("Error changing password:", error.response.data);
      return { success: false, error: error.response.data };
    } else if (error.request) {
      console.error("Error changing password: No response received");
      return { success: false, error: "No response received" };
    } else {
      console.error("Error changing password:", error.message);
      return { success: false, error: error.message };
    }
  }
};
const changeNames = async (currentPassword, newFirstname, newLastname) => {
  const userId = AuthVerifyService.getUserId();

  try {
    const response = await axios.put(
      `${API_URL}User/${userId}/account/names`,
      {
        currentPassword,
        newFirstname,
        newLastname,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    if (response.data) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      console.error("Unexpected response format:", response);
      return { success: false, error: "Names change request failed" };
    }
  } catch (error) {
    console.error("Error changing names:", error);
    return { success: false, error: error.response?.data || "Unknown error" };
  }
};

const getUserAddress = () => {
  const userId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  return axios
    .get(`${API_URL}User/user-address/${userId}/`, {
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

const changeAddress = async (
  city,
  street,
  country,
  state,
  postalCode,
  password
) => {
  const userId = AuthVerifyService.getUserId();

  try {
    const response = await axios.put(
      `${API_URL}User/${userId}/account/address`,
      {
        Street: street,
        City: city,
        State: state,
        PostalCode: postalCode,
        Country: country,
        Password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    if (response && response.data) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      console.error("Unexpected response format:", response);
      return { success: false, error: "Address change request failed" };
    }
  } catch (error) {
    console.error("Error changing address:", error);
    return {
      success: false,
      error: error.response?.data?.errors || "Unknown error",
    };
  }
};

const changeDateOfBirth = async (newDob, currentPassword) => {
  const userId = AuthVerifyService.getUserId();
  try {
    const response = await axios.put(
      `${API_URL}User/${userId}/account/dob`,
      {
        newDob,
        currentPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    if (response.data) {
      return {
        success: true,
        message: response.data.message, // Assuming response.data.message contains the success message
      };
    } else {
      return { success: false, error: "Date of birth change request failed" };
    }
  } catch (error) {
    if (error.response) {
      console.error("Error changing date of birth:", error.response.data);
      return { success: false, error: error.response.data };
    } else if (error.request) {
      console.error("Error changing date of birth: No response received");
      return { success: false, error: "No response received" };
    } else {
      console.error("Error changing date of birth:", error.message);
      return { success: false, error: error.message };
    }
  }
};

const verifyNewEmail = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return axios
    .get(`${API_URL}User/verify-email?token=${token}`, {
      headers,
    })
    .then((response) => {
      if (response.data.status === "success") {
        return {
          success: true,
          message: response.data.message,
        };
      } else if (response.data.status === "failed") {
        return {
          success: false,
          message: response.data.message,
        };
      }
    })
    .catch((error) => {
      console.error("Error handled when verifying the account:", error);
      return { success: false, error: error.response.data };
    });
};

const changeProfileImage = async (fd) => {
  const userId = AuthVerifyService.getUserId();
  try {
    const response = await axios.put(
      `${API_URL}User/${userId}/account/profile-image`,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (response.data) {
      return {
        success: true,
        message: response.data.message, // Assuming response.data.message contains the success message
      };
    } else {
      return { success: false, error: "Profile page change request failed" };
    }
  } catch (error) {
    if (error.response) {
      console.error("Error changing profile page", error.response.data);
      return { success: false, error: error.response.data };
    } else if (error.request) {
      console.error("Error changing profile page No response received");
      return { success: false, error: "No response received" };
    } else {
      console.error("Error changing profile page", error);
      return { success: false, error: error.message };
    }
  }
};

const UserServices = {
  getUserById,
  changeEmailAddress,
  changeNames,
  getUserAddress,
  changePassword,
  changeAddress,
  changeDateOfBirth,
  verifyNewEmail,
  changeProfileImage,
};

export default UserServices;
