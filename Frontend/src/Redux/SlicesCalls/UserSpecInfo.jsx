import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthService from "../../Services/Auth/AuthServices";
import { login } from "../Features/userSpecInfo";

const UserSpecInfo = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await AuthService.getUserSpecificInfo();
        const userSpecInfo = response.userInfoSpec.message;
        dispatch(
          login({
            email: userSpecInfo.email,
            firstName: userSpecInfo.firstName,
            lastName: userSpecInfo.lastName,
            filename: userSpecInfo.fileName,
            fileContentBase64: userSpecInfo.fileContentBase64,
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

export default UserSpecInfo;
