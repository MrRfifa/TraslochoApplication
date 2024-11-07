import ShipmentsTable from "../../Components/Tables/ShipmentsTable";
import Tabs from "../../Components/Tabs";

const sampleData = [
  {
    id: "1",
    type: "Express",
    status: "Delivered",
    date: "2024-10-01",
    price: 150,
    distance: 12,
  },
  {
    id: "2",
    type: "Standard",
    status: "In Transit",
    date: "2024-10-05",
    price: 85,
    distance: 25,
  },
  {
    id: "3",
    type: "Same-Day",
    status: "Pending",
    date: "2024-10-07",
    price: 200,
    distance: 5,
  },
];

const tabsData = [
  {
    label: "Pending",
    content: <ShipmentsTable areShipments={true} data={sampleData} />,
  },
  {
    label: "Completed",
    content: <div>Hello Completed</div>,
  },
  {
    label: "Accepted",
    content: <div>Hello Accepted</div>,
  },
  {
    label: "Canceled",
    content: <div>Hello Canceled</div>,
  },
];

const Shipments = () => {
  return (
    <div className="md:ml-64 ml-0">
      <Tabs tabsElement={tabsData} />
    </div>
  );
};

export default Shipments;
