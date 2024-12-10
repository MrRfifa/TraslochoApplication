import { useState } from "react";

const defaultFormData = {
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
  userProfileImage: null,
};

const defaultErrors = {
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
  userProfileImage: null,
};

export const useRegisterUserFormStates = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);

  return { formData, setFormData, errors, setErrors };
};
