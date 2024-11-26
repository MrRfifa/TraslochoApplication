import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getVehicleByTransporterId = async (transporterId) => {
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

const VehicleService = {
  getVehicleByTransporterId,
};

export default VehicleService;
