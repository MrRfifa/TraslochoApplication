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

const createRequest = async (transporterId, shipmentId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.post(
      `${API_URL}request`,
      {
        transporterId,
        shipmentId,
      },
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

const getRequest = async (requestId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(`${API_URL}request/${requestId}`, {
      headers,
    });
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

const transporterHasRequestForShipment = async (transporterId, shipmentId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}request/transporter/${transporterId}/shipment/${shipmentId}/exists`,
      {
        headers,
      }
    );

    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error("Error getting request:", error);
    return { success: false, error: "Error getting request" };
  }
};

const deleteRequest = async (requestId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.delete(`${API_URL}request/${requestId}`, {
      headers,
    });
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error("Error getting pending shipments:", error);
    return { success: false, error: "Error getting pending shipments" };
  }
};

const getRequestByTransporterAndShipment = async (
  transporterId,
  shipmentId
) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}request/transporter/${transporterId}/shipment/${shipmentId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error("Error getting pending shipments:", error);
    return { success: false, error: "Error getting pending shipments" };
  }
};

const acceptRequest = async (requestId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.post(
      `${API_URL}request/accept/${requestId}`,
      {},
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    return { success: false, error: "Error accepting request" };
  }
};

const ShipmentService = {
  getShipmentRequests,
  getRequest,
  createRequest,
  transporterHasRequestForShipment,
  deleteRequest,
  getRequestByTransporterAndShipment,
  acceptRequest
};

export default ShipmentService;
