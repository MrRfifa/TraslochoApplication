import axios from "axios";
import AuthVerifyService from "../Auth/AuthVerifyService";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getOwnerStatistics = async () => {
  const ownerId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}Statistic/owner-statistics/${ownerId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.data };
    } else {
      return { success: false, error: "Statistic not available" };
    }
  } catch (error) {
    console.error("Error getting statistics:", error);
    return { success: false, error: "Error getting statistics" };
  }
};

const getTransporterStatistics = async () => {
  const transporterId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}Statistic/transporter-statistics/${transporterId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.data };
    } else {
      return { success: false, error: "Statistic not available" };
    }
  } catch (error) {
    console.error("Error getting statistics:", error);
    return { success: false, error: "Error getting statistics" };
  }
};

const StatisticService = {
  getOwnerStatistics,
  getTransporterStatistics,
};

export default StatisticService;
