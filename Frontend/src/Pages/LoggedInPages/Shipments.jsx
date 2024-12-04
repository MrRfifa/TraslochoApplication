import { useSelector } from "react-redux";
import Tabs from "../../Components/Tabs/Tabs";
import GetShipmentsServiceCall from "../../Helpers/Services/GetShipmentsServiceCall";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";
import ShipmentsTab from "../../Components/Tabs/ShipmentsTab";

const Shipments = () => {
  const state = useSelector((state) => state.userInfo.value);
  UserInfo();
  const { shipments, loading, error } = GetShipmentsServiceCall();
  const isOwner = state.role === "Owner";
  const tabsData = ShipmentsTab({ shipments, loading, error, isOwner });
  return (
    <div className="md:ml-64 ml-0">
      <Tabs tabsElement={tabsData} />
    </div>
  );
};

export default Shipments;
