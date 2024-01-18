import { useSelector } from "react-redux";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";
import TestCard from "../../Components/Cards/TestCard";
import ShipmentService from "../../Services/Shipments/ShipmentService";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { addContactCall } from "../../Helpers/Services/ContactServicesCall";

const Dashboard = () => {
  const [transporters, setTransporters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const res = await ShipmentService.getAvailableTransporters();
        setTransporters(res.message);
        // console.log(res.message);
      } catch (error) {
        console.error("Error fetching transporters:", error);
      }
    };

    fetchTransporters();
  }, []);

  const connectedUserId = useSelector((state) => state.userInfo.value.id);
  UserInfo();

  return (
    <>
      <Toaster />
      <div>
        {transporters &&
          transporters.map((transporter, index) => (
            <TestCard
              key={index}
              email={transporter.email}
              firstName={transporter.firstName}
              lastName={transporter.lastName}
              addContactFunction={() => {
                addContactCall(connectedUserId, transporter.id, navigate);
              }}
              imageSrc={transporter.fileContentBase64}
              phoneNumber={
                "+" +
                transporter.internationalPrefix +
                " " +
                transporter.phoneNumber
              }
            />
          ))}
        {/* <TestCard  /> */}
      </div>
    </>
  );
};

export default Dashboard;
