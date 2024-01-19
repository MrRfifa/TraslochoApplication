import { useTranslation } from "react-i18next";

export const ValidateRegisterUsersForm = (formData, setErrors) => {
  const { t } = useTranslation("register");
  let isValid = true;
  const newErrors = {
    firstName: "",
    lastName: "",
    userEmail: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    userCountry: "",
    userCountryPrefix: "",
    userPhoneNumber: "",
    userState: "",
    userCity: "",
    userZipCode: "",
    userStreet: "",
    userProfileImage: "",
  };

  // Basic validation example, you can customize based on your requirements
  if (formData.firstName.trim() === "") {
    newErrors.firstName = t("fisrtNameReq");
    isValid = false;
  }

  if (formData.lastName.trim() === "") {
    newErrors.lastName = t("lastNameReq");
    isValid = false;
  }

  if (formData.dateOfBirth.trim() === "") {
    newErrors.dateOfBirth = t("dateOfBirthReq");
    isValid = false;
  }

  if (formData.userEmail.trim() === "") {
    newErrors.userEmail = t("emailReq");
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(formData.userEmail)) {
    newErrors.userEmail = "Invalid email format";
    isValid = false;
  }

  if (formData.password.trim() === "") {
    newErrors.password = t("passwordReq");
    isValid = false;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(formData.password)) {
    newErrors.password =
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit.";
    isValid = false;
  }

  if (formData.confirmPassword.trim() === "") {
    newErrors.confirmPassword = t("retypePasswordReq");
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  if (formData.userCountryPrefix.trim() === "") {
    newErrors.userCountryPrefix = t("countryReq");
    isValid = false;
  }
  if (formData.userCountry.trim() === "") {
    newErrors.userCountryPrefix = "Country is required";
    isValid = false;
  }

  if (formData.userPhoneNumber.trim() === "") {
    newErrors.userPhoneNumber = t("phoneNumberReq");
    isValid = false;
  }
  if (formData.userState.trim() === "") {
    newErrors.userState = t("stateReq");
    isValid = false;
  }

  if (formData.userCity.trim() === "") {
    newErrors.userCity = t("cityReq");
    isValid = false;
  }

  if (formData.userZipCode.trim() === "") {
    newErrors.userZipCode = t("zipCodeReq");
    isValid = false;
  }

  if (formData.userStreet.trim() === "") {
    newErrors.userStreet = t("streetReq");
    isValid = false;
  }

  if (formData.userProfileImage === null) {
    newErrors.userProfileImage = t("profileImageReq");
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};
