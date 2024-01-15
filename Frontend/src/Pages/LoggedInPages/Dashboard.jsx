// import { useSelector } from "react-redux";
// import UserInfo from "./UserInfo";
// import UserSpecInfo from "../../Redux/SlicesCalls/UserSpecInfo";
import TestCard from "../../Components/Cards/TestCard";
import ShipmentService from "../../Services/Shipments/ShipmentService";
// import TestCard from "../../Components/Cards/TestCard";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [transporters, setTransporters] = useState([]);

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
  }, []); // Empty dependency array to run the effect only once when the component mounts

  console.log(transporters);

  return (
    <div>
      hello
      {transporters &&
        transporters.map((transporter, index) => (
          <TestCard
            key={index}
            email={transporter.email}
            firstName={transporter.firstName}
            lastName={transporter.lastName}
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
  );
};

export default Dashboard;
