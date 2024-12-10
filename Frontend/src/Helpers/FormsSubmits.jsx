import {
  bigSuccessToast,
  dangerToast,
  warningToast,
} from "../Components/Toasts";
import AuthService from "../Services/Auth/AuthServices";

export const OnFinishRegisterUsersForm = async (
  formData,
  transporter,
  navigate
) => {
  const realFormData = new FormData();

  realFormData.append("FirstName", formData.firstName);
  realFormData.append("LastName", formData.lastName);
  realFormData.append("Email", formData.userEmail);
  realFormData.append("Password", formData.password);
  realFormData.append("ConfirmPassword", formData.confirmPassword);
  realFormData.append("InternationalPrefix", formData.userCountryPrefix);
  realFormData.append("PhoneNumber", formData.userPhoneNumber);
  realFormData.append("DateOfBirth", formData.dateOfBirth);
  realFormData.append("ProfileImage", formData.userProfileImage);
  realFormData.append("UserAddress.City", formData.userCity);
  realFormData.append("UserAddress.Street", formData.userStreet);
  realFormData.append("UserAddress.State", formData.userState);
  realFormData.append("UserAddress.Country", formData.userCountry);
  realFormData.append("UserAddress.PostalCode", formData.userZipCode);

  const response = await AuthService.register(realFormData, transporter);

  if (response.success === true) {
    bigSuccessToast(response.message);
    navigate("/login");
  } else {
    warningToast(response.error);
  }
  return response;
};

export const OnFinishLoginUsersForm = async (email, password) => {
  const response = await AuthService.login(email, password);

  if (response.success === true) {
    bigSuccessToast(response.message);
  } else if (response.message === "Not verified.") {
    warningToast(response.error);
  } else {
    dangerToast(response.error);
  }
  return response;
};
