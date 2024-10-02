import {
  FaChartLine,
  FaUsers,
  FaShippingFast,
  FaDollarSign,
} from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import StatisticsCard from "../../Components/Cards/StatisticsCard";
import {
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
} from "../../Components/Charts";

const Dashboard = () => {
  const pieData1 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const pieData2 = [
    { name: "Category 1", value: 600 },
    { name: "Category 2", value: 400 },
    { name: "Category 3", value: 100 },
  ];

  const barData = [
    { name: "Jan", shipments: 4000 },
    { name: "Feb", shipments: 3000 },
    { name: "Mar", shipments: 2000 },
    { name: "Apr", shipments: 2780 },
  ];

  const lineData = [
    { name: "Week 1", sales: 2400 },
    { name: "Week 2", sales: 1398 },
    { name: "Week 3", sales: 9800 },
    { name: "Week 4", sales: 3908 },
  ];

  return (
    <>
      <Toaster />
      <div className="md:ml-72 md:mt-4 mt-3 ml-0 overflow-hidden">
        <div className="grid grid-cols-2 mt-7 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
          <StatisticsCard
            title="Total Shipments"
            value="1,245"
            icon={FaUsers}
            color="text-blue-500"
          />
          <StatisticsCard
            title="Done Shipments"
            value="342"
            icon={FaShippingFast}
            color="text-yellow-500"
          />
          <StatisticsCard
            title="Revenue || expenses"
            value="$48,200"
            icon={FaDollarSign}
            color="text-green-500"
          />
          <StatisticsCard
            title="Total distance"
            value="120 Km"
            icon={FaChartLine}
            color="text-red-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Row 1 */}
          <PieChartComponent data={pieData1} title="Sentiments" />
          <BarChartComponent data={barData} title="shipments/month" />

          {/* Row 2 */}
          <PieChartComponent data={pieData2} title="shipment status" />
          <LineChartComponent data={lineData} title="money/month" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;