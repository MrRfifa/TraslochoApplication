import { useSelector } from "react-redux";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";
import OwnerShipmentDetails from "./OwnerShipmentDetails";
import TransporterShipmentDetails from "./TransporterShipmentDetails";
//TODO Add view transporter profile
const ShipmentDetails = () => {
  const state = useSelector((state) => state.userInfo.value);
  UserInfo();
  const isOwner = state.role === "Owner";

  return (
    <div className="">
      {isOwner ? (
        <OwnerShipmentDetails />
      ) : (
        <TransporterShipmentDetails transporterId={parseInt(state.id)} />
      )}
    </div>
  );
};

export default ShipmentDetails;
