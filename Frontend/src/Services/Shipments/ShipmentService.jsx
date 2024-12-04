import axios from "axios";
import AuthVerifyService from "../Auth/AuthVerifyService";

const API_URL = import.meta.env.VITE_APP_API_URL;
const API_KEY = import.meta.env.VITE_APP_OPENCAGE_API_KEY;

const getPendingShipments = async () => {
  const userId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(`${API_URL}shipment/pending/${userId}`, {
      headers,
    });
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Shipments not available" };
    }
  } catch (error) {
    console.error("Error getting pending shipments:", error);
    return { success: false, error: "Error getting pending shipments" };
  }
};

const getPendingUncompletedShipments = async () => {
  const userId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}shipment/uncompleted-data/${userId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Shipments not available" };
    }
  } catch (error) {
    // console.error("Error getting pending shipments:", error);
    return { success: false, error: error.response.data.message };
  }
};

const getCompletedShipments = async () => {
  const userId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(`${API_URL}shipment/completed/${userId}`, {
      headers,
    });
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Shipments not available" };
    }
  } catch (error) {
    console.error("Error getting completed shipments:", error);
    return { success: false, error: "Error getting completed shipments" };
  }
};

const getAcceptedShipments = async () => {
  const userId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(`${API_URL}shipment/accepted/${userId}`, {
      headers,
    });
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Shipments not available" };
    }
  } catch (error) {
    console.error("Error getting completed shipments:", error);
    return { success: false, error: "Error getting completed shipments" };
  }
};

const getCanceledShipments = async () => {
  const userId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(`${API_URL}shipment/canceled/${userId}`, {
      headers,
    });
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Shipments not available" };
    }
  } catch (error) {
    console.error("Error getting completed shipments:", error);
    return { success: false, error: "Error getting completed shipments" };
  }
};

const getShipmentById = async (shipmentId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(`${API_URL}shipment/${shipmentId}`, {
      headers,
    });
    if (response.data && response.status === 200) {
      return { success: true, message: response.data };
    } else {
      return { success: false, error: "Shipments not available" };
    }
  } catch (error) {
    console.error("Error getting completed shipments:", error);
    return { success: false, error: "Error getting completed shipments" };
  }
};

const getShipmentAddressesById = async (shipmentId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}shipment/get-shipment-addresses/${shipmentId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data };
    } else {
      return { success: false, error: "Addresses not available" };
    }
  } catch (error) {
    console.error("Error getting addresses:", error);
    return { success: false, error: "Error getting addresses" };
  }
};

const getShipmentImagesById = async (shipmentId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}shipment/get-shipment-images/${shipmentId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data };
    } else {
      return { success: false, error: "Images not available" };
    }
  } catch (error) {
    console.error("Error getting images:", error);
    return { success: false, error: "Error getting images" };
  }
};

const createShipment = async (fd) => {
  const userId = AuthVerifyService.getUserId();
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.post(
      `${API_URL}shipment/create/${userId}`,
      fd,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    // console.error("Error creating shipment:", error);
    return { success: false, error: error.response.data.message };
  }
};

const addAddresses = async (shipmentId, addresses) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, error: "Unauthorized. Token is missing." };
  }

  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: token,
  };

  try {
    const response = await axios.post(
      `${API_URL}shipment/add-addresses/${shipmentId}`,
      addresses,
      { headers }
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        message: response.data?.message || "Addresses added successfully.",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred.",
    };
  }
};

const fetchCoordinates = async (address) => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);

    if (response.data.results && response.data.results.length > 0) {
      const { geometry } = response.data.results[0];
      return {
        lat: geometry.lat,
        lng: geometry.lng,
      };
    } else {
      console.error("No results found for the given address.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    return null;
  }
};

const cancelShipment = async (shipmentId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.put(
      `${API_URL}shipment/cancel/${shipmentId}`,
      {}, // Empty body
      { headers } // Pass headers here
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

const updateShipmentDate = async (shipmentId, newDate) => {
  const headers = {
    Authorization: localStorage.getItem("token"), // Authorization header
  };

  const formData = new FormData();
  formData.append("newDate", newDate); // Attach the date as form-data

  try {
    const response = await axios.put(
      `${API_URL}shipment/update-date/${shipmentId}`,
      formData, // Pass the formData as the body
      { headers } // Pass headers
    );

    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

const getPendingAvailableShipments = async () => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(`${API_URL}shipment/pending`, {
      headers,
    });
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Shipments not available" };
    }
  } catch (error) {
    console.error("Error getting pending shipments:", error);
    return { success: false, error: "Error getting pending shipments" };
  }
};

const ShipmentService = {
  getPendingShipments,
  getPendingUncompletedShipments,
  getCompletedShipments,
  getAcceptedShipments,
  getCanceledShipments,
  getShipmentById,
  getShipmentAddressesById,
  getShipmentImagesById,
  createShipment,
  addAddresses,
  fetchCoordinates,
  cancelShipment,
  updateShipmentDate,
  getPendingAvailableShipments
};

export default ShipmentService;
