import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/GeneralPages/HomePAge";

const UsersRoute = () => {
  return (
    <Routes>
      <Route path="/home" exact element={<HomePage />} />
      <Route path="/my-photos" exact element={<HomePage />} />
      <Route path="/settings" exact element={<HomePage />} />
      <Route exact path="/image/:id" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default UsersRoute;
