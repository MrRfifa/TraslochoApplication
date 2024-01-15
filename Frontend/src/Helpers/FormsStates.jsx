import { useState } from "react";

export const RegisterUserFormStates = () => {
  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState({
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
  });

  return { formData, setFormData, errors, setErrors };
};
