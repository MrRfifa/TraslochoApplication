import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/GeneralPages/HomePAge";
import LoginPage from "../Pages/GeneralPages/LoginPage";
import RegisterOwnerPage from "../Pages/GeneralPages/RegisterOwnerPage";
import RegisterTransporterPage from "../Pages/GeneralPages/RegisterTransporterPage";
import ForgetPasswordPage from "../Pages/GeneralPages/ForgetPasswordPage";
import ResetPasswordPage from "../Pages/GeneralPages/ResetPasswordPage";

const AuthRoute = () => {
  return (
    <Routes>
      <Route path="/" exact element={<HomePage />} />
      <Route path="/login" exact element={<LoginPage />} />
      <Route path="/register-owner" exact element={<RegisterOwnerPage />} />
      <Route
        path="/register-transporter"
        exact
        element={<RegisterTransporterPage />}
      />
      <Route path="/forget-password" exact element={<ForgetPasswordPage />} />
      <Route path="/reset-password" exact element={<ResetPasswordPage />} />
      {/* <Route path="/delete-account" exact element={<DeleteAccountPage />} /> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AuthRoute;
