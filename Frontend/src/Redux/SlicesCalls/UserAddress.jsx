import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Features/userAddress";
import UserServices from "../../Services/Users/UserServices";

const UserAddress = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await UserServices.getUserAddress();
        // const userInfo = response.userInfo;

        dispatch(
          login({
            street: response.message.street,
            city: response.message.city,
            state: response.message.state,
            zipCode: response.message.postalCode,
            country: response.message.country,
          })
        );
      } catch (error) {
        console.error("Error fetching user information:", error);
        // Handle errors as needed
      }
    };

    fetchUserAddress();
  }, [dispatch]);
  return null;
};

export default UserAddress;
