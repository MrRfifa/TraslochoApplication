import UserServices from "../../Services/Users/UserServices";

export const getUserByIdCall = async (userId) => {
  const response = await UserServices.getUserById(userId);
  // console.log(response);
  return response;
};
