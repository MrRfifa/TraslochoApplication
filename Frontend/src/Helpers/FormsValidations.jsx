export const validateRegisterUsersForm = (formData, setErrors) => {
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
    newErrors.userName = "First name is required";
    isValid = false;
  }

  if (formData.lastName.trim() === "") {
    newErrors.userName = "Last name is required";
    isValid = false;
  }

  if (formData.dateOfBirth.trim() === "") {
    newErrors.userName = "Date of birth is required";
    isValid = false;
  }

  if (formData.userEmail.trim() === "") {
    newErrors.userEmail = "Email is required";
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(formData.userEmail)) {
    newErrors.userEmail = "Invalid email format";
    isValid = false;
  }

  if (formData.password.trim() === "") {
    newErrors.password = "Password is required";
    isValid = false;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(formData.password)) {
    newErrors.password =
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit.";
    isValid = false;
  }

  if (formData.confirmPassword.trim() === "") {
    newErrors.confirmPassword = "Confirm Password is required";
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  if (formData.userCountryPrefix.trim() === "") {
    newErrors.userCountryPrefix = "Prefix is required";
    isValid = false;
  }
  if (formData.userCountry.trim() === "") {
    newErrors.userCountryPrefix = "Country is required";
    isValid = false;
  }

  if (formData.userPhoneNumber.trim() === "") {
    newErrors.userPhoneNumber = "Phone number is required";
    isValid = false;
  }
  if (formData.userState.trim() === "") {
    newErrors.userState = "State is required";
    isValid = false;
  }

  if (formData.userCity.trim() === "") {
    newErrors.userCity = "City is required";
    isValid = false;
  }

  if (formData.userZipCode.trim() === "") {
    newErrors.userZipCode = "Zip Code is required";
    isValid = false;
  }

  if (formData.userStreet.trim() === "") {
    newErrors.userStreet = "Street is required";
    isValid = false;
  }

  if (!formData.userProfileImage) {
    newErrors.userProfileImage = "Profile Image is required";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};
