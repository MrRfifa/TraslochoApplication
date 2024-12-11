import { FaShippingFast, FaDollarSign, FaBoxes, FaRuler } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import StatisticsCard from "../../Components/Cards/StatisticsCard";
import {
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
} from "../../Components/Charts";
import { useEffect, useState } from "react";
import StatisticService from "../../Services/Statistics/StatisticService";
import { errorToast } from "../../Components/Toasts";
import LoadingSpin from "../../Components/LoadingSpin";
import { useSelector } from "react-redux";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userStatistics, setUserStatistics] = useState({
    totalNumberOfShipments: 0,
    totalNumberOfRequests: 0,
    completedShipments: 0,
    totalExpenses: 0,
    totalRevenues: 0,
    totalDistance: 0,
    sentimentStatus: [],
    shipmentStatus: [],
  });

  const state = useSelector((state) => state.userInfo.value);
  UserInfo();
  const isOwner = state.role === "Owner";

  useEffect(() => {
    const loadUserStatistic = async () => {
      setLoading(true);
      try {
        const result = isOwner
          ? await StatisticService.getOwnerStatistics()
          : await StatisticService.getTransporterStatistics();

        if (result.success) {
          setUserStatistics(result.message || {});
        } else {
          errorToast(
            result.error || "An error occurred while processing your request."
          );
        }
      } catch (error) {
        console.error(error);
        errorToast("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUserStatistic();
  }, [isOwner]);

  if (loading) {
    return <LoadingSpin />;
  }

  if (!userStatistics || Object.keys(userStatistics).length === 0) {
    return (
      <div className="text-center mt-20">
        <p>No data available. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="md:ml-72 md:mt-4 mt-3 ml-0 overflow-hidden">
        <div className="grid grid-cols-2 mt-7 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
          <StatisticsCard
            title={!isOwner ? "Total Requests" : "Total Shipments"}
            value={
              isOwner
                ? userStatistics.totalNumberOfShipments
                : userStatistics.totalNumberOfRequests
            }
            icon={FaBoxes}
            color="text-blue-500"
          />
          <StatisticsCard
            title="Done Shipments"
            value={userStatistics.completedShipments}
            icon={FaShippingFast}
            color="text-yellow-500"
          />
          <StatisticsCard
            title={!isOwner ? "Revenue" : "Expenses"}
            value={
              isOwner
                ? userStatistics.totalExpenses + " €"
                : userStatistics.totalRevenues + " €"
            }
            icon={FaDollarSign}
            color={!isOwner ? "text-green-500" : "text-red-500"}
          />
          <StatisticsCard
            title="Total distance"
            value={userStatistics.totalDistance.toFixed(1) + " km"}
            icon={FaRuler}
            color="text-red-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Row 1 */}
          <PieChartComponent
            data={userStatistics.sentimentStatus}
            title="Sentiments"
          />
          <BarChartComponent
            data={userStatistics.shipmentsPerMonth}
            title="shipments/month"
          />

          {/* Row 2 */}
          <PieChartComponent
            data={userStatistics.shipmentStatus}
            title="shipment status"
          />
          <LineChartComponent
            data={
              isOwner
                ? userStatistics.expensesPerMonth
                : userStatistics.revenuesPerMonth
            }
            title={isOwner ? "expenses/month" : "revenues/month"}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
