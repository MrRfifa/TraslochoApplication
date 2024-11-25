import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getShipmentRequests = async (shipmentId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}request/requests-by-shipment/${shipmentId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Shipment request's not available" };
    }
  } catch (error) {
    console.error("Error getting pending shipments:", error);
    return { success: false, error: "Error getting pending shipments" };
  }
};

const ShipmentService = {
  getShipmentRequests,
};

export default ShipmentService;
