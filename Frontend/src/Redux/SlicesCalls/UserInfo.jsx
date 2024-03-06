import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthService from "../../Services/Auth/AuthServices";
import { login } from "../Features/userInfo";

const UserInfo = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await AuthService.getUserInfo();
        const userInfo = response.userInfo;

        dispatch(
          login({
            id: userInfo[0].value,
            // dateOfBirth: userInfo[0].value.split(" ")[0],
            role: userInfo[1].value,
          })
        );
      } catch (error) {
        console.error("Error fetching user information:", error);
        // Handle errors as needed
      }
    };

    fetchUserInfo();
  }, [dispatch]);
  return null;
};

export default UserInfo;
