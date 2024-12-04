import { useState, useEffect } from "react";
import ShipmentService from "../../Services/Shipments/ShipmentService";

const GetShipmentsServiceCall = () => {
  const [shipments, setShipments] = useState({
    pending: [],
    pendingAvailable: [],
    new: [],
    completed: [],
    accepted: [],
    canceled: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipments = async (fetchFn, key, errorMessage) => {
      try {
        const response = await fetchFn();
        setShipments((prev) => ({
          ...prev,
          [key]: Array.isArray(response.message) ? response.message : [],
        }));
      } catch (err) {
        console.error(errorMessage, err);
        setError(errorMessage);
      }
    };

    const fetchAllShipments = async () => {
      setLoading(true);
      await Promise.all([
        fetchShipments(
          ShipmentService.getPendingShipments,
          "pending",
          "Failed to fetch pending shipments."
        ),
        fetchShipments(
          ShipmentService.getPendingAvailableShipments,
          "pendingAvailable",
          "Failed to fetch pending available shipments."
        ),
        fetchShipments(
          ShipmentService.getPendingUncompletedShipments,
          "new",
          "Failed to fetch uncompleted shipments."
        ),
        fetchShipments(
          ShipmentService.getCompletedShipments,
          "completed",
          "Failed to fetch completed shipments."
        ),
        fetchShipments(
          ShipmentService.getAcceptedShipments,
          "accepted",
          "Failed to fetch accepted shipments."
        ),
        fetchShipments(
          ShipmentService.getCanceledShipments,
          "canceled",
          "Failed to fetch canceled shipments."
        ),
      ]);
      setLoading(false);
    };

    fetchAllShipments();
  }, []);

  return { shipments, loading, error };
};

export default GetShipmentsServiceCall;
