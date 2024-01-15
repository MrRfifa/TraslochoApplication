import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getAvailableTransporters = () => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  return axios
    .get(`${API_URL}Shipment/get-available-transporters/`, {
      headers,
    })
    .then((response) => {
      if (response.data && response.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, error: "Transporters not available" };
      }
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
      return { success: false, error: error.response.data };
    });
};

const ShipmentService = {
  getAvailableTransporters,
};

export default ShipmentService;
