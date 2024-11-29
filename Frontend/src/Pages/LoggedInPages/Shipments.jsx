import Empty from "../../Components/Empty";
import CreateShipmentForm from "../../Components/Forms/Shipments/CreateShipmentForm";
import ShipmentsTable from "../../Components/Tables/ShipmentsTable";
import Tabs from "../../Components/Tabs";
import ShipmentService from "../../Services/Shipments/ShipmentService";
import { useEffect, useState } from "react";

const Shipments = () => {
  const [pendingShipments, setPendingShipments] = useState([]);
  const [newShipments, setNewShipments] = useState([]);
  const [completedShipments, setCompletedShipments] = useState([]);
  const [acceptedShipments, setAcceptedShipments] = useState([]);
  const [canceledShipments, setCanceledShipments] = useState([]);
  const [loading, setLoading] = useState(true); // Optional: to handle loading state
  const [error, setError] = useState(null); // Optional: to handle errors

  useEffect(() => {
    const fetchPendingShipments = async () => {
      try {
        const responseShipment = await ShipmentService.getPendingShipments();
        // Check if responseShipment.message is an array and set accordingly
        setPendingShipments(
          Array.isArray(responseShipment.message)
            ? responseShipment.message
            : []
        );
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Failed to fetch pending shipments:", error);
        setError("Failed to load shipments.");
        setLoading(false);
      }
    };

    const fetchUncompletedShipments = async () => {
      try {
        const responseShipment =
          await ShipmentService.getPendingUncompletedShipments();
        setNewShipments(
          Array.isArray(responseShipment.message)
            ? responseShipment.message
            : []
        );
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Failed to fetch uncompleted shipments:", error);
        setError("Failed to load shipments.");
        setLoading(false);
      }
    };

    const fetchCompletedShipments = async () => {
      try {
        const responseShipment = await ShipmentService.getCompletedShipments();
        setCompletedShipments(
          Array.isArray(responseShipment.message)
            ? responseShipment.message
            : []
        );
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Failed to fetch completed shipments:", error);
        setError("Failed to load shipments.");
        setLoading(false);
      }
    };

    const fetchAcceptedShipments = async () => {
      try {
        const responseShipment = await ShipmentService.getAcceptedShipments();
        setAcceptedShipments(
          Array.isArray(responseShipment.message)
            ? responseShipment.message
            : []
        );
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Failed to fetch accepted shipments:", error);
        setError("Failed to load shipments.");
        setLoading(false);
      }
    };

    const fetchCanceledShipments = async () => {
      try {
        const responseShipment = await ShipmentService.getCanceledShipments();
        setCanceledShipments(
          Array.isArray(responseShipment.message)
            ? responseShipment.message
            : []
        );
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Failed to fetch canceled shipments:", error);
        setError("Failed to load shipments.");
        setLoading(false);
      }
    };

    fetchPendingShipments();
    fetchUncompletedShipments();
    fetchCompletedShipments();
    fetchAcceptedShipments();
    fetchCanceledShipments();
  }, []);

  // Define the tabs dynamically with real data
  const tabsData = [
    {
      label: "Create",
      content: loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <CreateShipmentForm />
      ),
    },
    {
      label: "Missing data",
      content: loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error...</div>
      ) : newShipments.length === 0 ? (
        <Empty key={"missing_data"} />
      ) : (
        <ShipmentsTable
          areShipments={true}
          data={newShipments}
          labelActionButton="Complete details"
          missingData={true}
        />
      ),
    },
    {
      label: "Pending",
      content: loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : pendingShipments.length === 0 ? (
        <Empty key={"pending_shipment"} />
      ) : (
        <ShipmentsTable
          areShipments={true}
          data={pendingShipments}
          labelActionButton="View details"
          missingData={false}
        />
      ),
    },

    {
      label: "Canceled",
      content: loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : completedShipments.length === 0 ? (
        <Empty key={"completed_shipment"} />
      ) : (
        <ShipmentsTable
          areShipments={true}
          data={canceledShipments}
          labelActionButton="View details"
          missingData={false}
        />
      ),
    },
    {
      label: "Accepted",
      content: loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : acceptedShipments.length === 0 ? (
        <Empty key={"accepted_shipment"} />
      ) : (
        <ShipmentsTable
          areShipments={true}
          data={acceptedShipments}
          labelActionButton="View details"
          missingData={false}
        />
      ),
    },
    {
      label: "Completed",
      content: loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : completedShipments.length === 0 ? (
        <Empty key={"completed_shipment"} />
      ) : (
        <ShipmentsTable
          areShipments={true}
          data={completedShipments}
          labelActionButton="View details"
          missingData={false}
        />
      ),
    },
  ];

  return (
    <div className="md:ml-64 ml-0">
      <Tabs tabsElement={tabsData} />
    </div>
  );
};

export default Shipments;
