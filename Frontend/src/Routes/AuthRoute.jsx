import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/GeneralPages/HomePAge";
import LoginPage from "../Pages/GeneralPages/LoginPage";
import ForgetPasswordPage from "../Pages/GeneralPages/ForgetPasswordPage";
import ResetPasswordPage from "../Pages/GeneralPages/ResetPasswordPage";
import Register from "../Pages/GeneralPages/Register";
import RegisterUsers from "../Pages/GeneralPages/RegisterUsers";
// import RegisterCompany from "../Pages/GeneralPages/RegisterCompany";

const AuthRoute = () => {
  return (
    <Routes>
      <Route path="/" exact element={<HomePage />} />
      <Route path="/login" exact element={<LoginPage />} />
      <Route path="/register" exact element={<Register />} />
      <Route path="/register-private" exact element={<RegisterUsers />} />
      <Route path="/register-owner" exact element={<RegisterUsers />} />
      {/* <Route path="/register-company" exact element={<RegisterCompany />} /> */}
      <Route path="/forget-password" exact element={<ForgetPasswordPage />} />
      <Route path="/reset-password" exact element={<ResetPasswordPage />} />
      {/* <Route path="/delete-account" exact element={<DeleteAccountPage />} /> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AuthRoute;
