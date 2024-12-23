import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/LoggedInPages/Dashboard";
import Settings from "../Pages/LoggedInPages/Settings";
import Cars from "../Pages/LoggedInPages/Cars";
import Shipments from "../Pages/LoggedInPages/Shipments";
import ConfirmUpdateEMail from "../Pages/LoggedInPages/ConfirmUpdateEMail";
import Messages from "../Pages/LoggedInPages/Messages.jsx";
import ShipmentDetails from "../Pages/LoggedInPages/ShipmentDetails.jsx";
import Notifications from "../Pages/LoggedInPages/Notifications.jsx";
import CompleteShipmentDetails from "../Pages/LoggedInPages/CompleteShipmentDetails.jsx";
import TransporterProfilePage from "../Pages/LoggedInPages/TransporterProfilePage.jsx";

const UsersRoute = () => {
  return (
    <Routes>
      <Route path="/dashboard" exact element={<Dashboard />} />
      <Route path="/messages" exact element={<Messages />} />
      <Route path="/messages/:userId" element={<Messages />} />
      <Route path="/profile" exact element={<Settings />} />
      <Route path="/cars" exact element={<Cars />} />
      <Route path="/shipments" exact element={<Shipments />} />
      <Route path="/details/:shipmentId" element={<ShipmentDetails />} />
      <Route
        path="/complete-details/:shipmentId"
        element={<CompleteShipmentDetails />}
      />
      <Route
        path="/transporter-profile/:transporterId"
        element={<TransporterProfilePage />}
      />
      <Route path="/notifications" exact element={<Notifications />} />
      <Route
        path="/confirm-update-email"
        exact
        element={<ConfirmUpdateEMail />}
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
      {/* <Route exact path="/image/:id" element={<HomePage />} /> */}
    </Routes>
  );
};

export default UsersRoute;
