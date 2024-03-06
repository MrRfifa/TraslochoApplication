import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const login = (email, password) => {
  return axios
    .post(`${API_URL}Auth/login`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data && response.data.token) {
        const token = "bearer " + response.data.token;
        localStorage.setItem("token", token);
        return { success: true, message: "Logged in successfully!", token };
      } else if (response == "Not verified.") {
        return { success: false, error: "Not verified" };
      } else {
        return { success: false, error: "Email or password is incorrect" };
      }
    })
    .catch((error) => {
      console.error("Login error:", error.response.data);
      return {
        success: false,
        error: error.response.data,
      };
    });
};

const logout = (userId) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };
  return axios
    .post(`${API_URL}Auth/logout/${userId}`, {
      headers,
    })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        localStorage.removeItem("token");
        window.location.reload("/");
        return { success: true, message: "Logged out successfully!" };
      } else {
        return { success: false, error: "Logout failed" };
      }
    })
    .catch((error) => {
      console.error("Logout error:", error.response.data);
      return {
        success: false,
        error: error.response.data,
      };
    });
};

const register = (fd, transporter) => {
  const endpoint = transporter ? "register-transporter" : "register-owner";

  return axios
    .post(`${API_URL}Auth/${endpoint}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      if (response.status === 200) {
        return { success: true, message: "Signed up successfully!" };
      } else {
        return { success: false, error: "Registration failed" };
      }
    })
    .catch((error) => {
      return {
        success: false,
        error: error.response.data.error.errors[0].errorMessage,
      };
    });
};

const forgetPassword = (email) =>
  axios
    .post(`${API_URL}Auth/forgot-password`, `"${email}"`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.data) {
        return {
          success: true,
          message: "An email is sent to the provided email address.",
        };
      } else {
        // console.log("Password reset failed. Response:", response);
        return { success: false, error: "Password reset is failed" };
      }
    })
    .catch((error) => {
      // console.error("Forget password error:", error);
      return { success: false, error: error.response.data };
    });

const resetPassword = (token, password, confirmPassword) =>
  axios
    .post(
      `${API_URL}Auth/reset-password`,
      {
        token,
        password,
        confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      if (response.data) {
        return {
          success: true,
          message: "You have successfully resetted your password",
        };
      } else {
        return { success: false, error: response.data };
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      return { success: false, error: error.response.data };
    });

const verifyAccount = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return axios
    .get(`${API_URL}Auth/verify?token=${token}`, {
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

const getUserInfo = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };

  return axios
    .get(`${API_URL}User/user-info`, {
      headers,
    })
    .then((response) => {
      if (response.data) {
        return {
          userInfo: response.data,
        };
      } else {
        return { error: "User information not available" };
      }
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
      return { success: false, error: error.response.data };
    });
};

const getUserSpecificInfo = () => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  return axios
    .get(`${API_URL}User/spec-info/`, {
      headers,
    })
    .then((response) => {
      if (response.data) {
        return {
          userInfoSpec: response.data,
        };
      } else {
        return { error: "User information not available" };
      }
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
      return { success: false, error: error.response.data };
    });
};

const AuthService = {
  login,
  logout,
  register,
  forgetPassword,
  resetPassword,
  verifyAccount,
  getUserInfo,
  getUserSpecificInfo,
};

export default AuthService;
