import Empty from "../Empty";
import CreateShipmentForm from "../Forms/Shipments/CreateShipmentForm";
import ShipmentsTable from "../Tables/ShipmentsTable";
import LoadingSpin from "../../Components/LoadingSpin";

const ShipmentsTab = ({ shipments, loading, error, isOwner }) => {
  const renderTabContent = (data, key, tableProps) => {
    if (loading) return <LoadingSpin />;
    if (error) return <div>{error}</div>;
    if (data.length === 0) return <Empty key={key} />;
    return <ShipmentsTable {...tableProps} data={data} />;
  };

  const ownerTabs = [
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
      content: renderTabContent(shipments.new, "missing_data", {
        areShipments: true,
        labelActionButton: "Complete details",
        missingData: true,
        arePending: false,
      }),
    },
    {
      label: "Pending",
      content: renderTabContent(shipments.pending, "pending", {
        areShipments: true,
        labelActionButton: "View details",
        missingData: false,
        arePending: true,
      }),
    },
    {
      label: "Accepted",
      content: renderTabContent(shipments.accepted, "accepted", {
        areShipments: true,
        labelActionButton: "View details",
        missingData: false,
        arePending: false,
      }),
    },
    {
      label: "Canceled",
      content: renderTabContent(shipments.canceled, "canceled", {
        areShipments: true,
        labelActionButton: "View details",
        missingData: false,
        arePending: false,
      }),
    },
    {
      label: "Completed",
      content: renderTabContent(shipments.completed, "completed_shipment", {
        areShipments: true,
        labelActionButton: "View details",
        missingData: false,
        arePending: false,
      }),
    },
  ];

  const transporterTabs = [
    {
      label: "Pending",
      content: renderTabContent(shipments.pendingAvailable, "pending", {
        areShipments: true,
        labelActionButton: "View details",
        missingData: false,
        arePending: true,
      }),
    },
    {
      label: "Accepted",
      content: renderTabContent(shipments.accepted, "accepted", {
        areShipments: true,
        labelActionButton: "View details",
        missingData: false,
        arePending: false,
      }),
    },
    {
      label: "Canceled",
      content: renderTabContent(shipments.canceled, "canceled", {
        areShipments: true,
        labelActionButton: "View details",
        missingData: false,
        arePending: false,
      }),
    },
    {
      label: "Completed",
      content: renderTabContent(shipments.completed, "completed_shipment", {
        areShipments: true,
        labelActionButton: "View details",
        missingData: false,
        arePending: false,
      }),
    },
  ];

  return isOwner ? ownerTabs : transporterTabs;
};

export default ShipmentsTab;
