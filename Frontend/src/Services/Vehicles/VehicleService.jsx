import axios from "axios";
import AuthVerifyService from "../Auth/AuthVerifyService";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getVehicleByTransporterId = async () => {
  const transporterId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}Vehicle/transporter/${transporterId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Vehicle not available" };
    }
  } catch (error) {
    console.error("Error getting vehicle:", error);
    return { success: false, error: "Error getting vehicle" };
  }
};

const createCar = async (fd) => {
  const userId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.post(`${API_URL}vehicle/${userId}`, fd, {
      headers,
    });
    console.log(response);

    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error("Error creating shipment:", error);
    return { success: false, error: error.response.data.message };
  }
};

const VehicleService = {
  getVehicleByTransporterId,
  createCar,
};

export default VehicleService;
