import { bigSuccessToast, dangerToast } from "../../Components/Toasts";
import UserServices from "../../Services/Users/UserServices";

export const getUserByIdCall = async (userId) => {
  const response = await UserServices.getUserById(userId);
  // console.log(response);
  return response;
};

export const onFinishNamesUpdate = async (
  newLastname,
  newFirstname,
  password
) => {
  try {
    const response = await UserServices.changeNames(
      password,
      newFirstname,
      newLastname
    );

    if (response.success === true) {
      bigSuccessToast(response.message);
    } else {
      dangerToast(response.error);
    }

    return response;
  } catch (error) {
    console.error("Error updating names:", error);
    dangerToast("An error occurred while updating names");
    return { success: false, error: "An error occurred while updating names" };
  }
};

export const onFinishAddressUpdate = async (
  newCity,
  newStreet,
  newCountry,
  newState,
  newZipCode,
  password
) => {
  try {
    const response = await UserServices.changeAddress(
      newCity,
      newStreet,
      newCountry,
      newState,
      newZipCode,
      password
    );

    if (response.success === true) {
      bigSuccessToast(response.message);
    } else {
      dangerToast(response.error);
    }

    return response;
  } catch (error) {
    console.error("Error updating names:", error);
    dangerToast("An error occurred while updating names");
    return { success: false, error: "An error occurred while updating names" };
  }
};

export const onFinishDobUpdate = async (newDob, password) => {
  try {
    const response = await UserServices.changeDateOfBirth(newDob, password);
    if (response.success === true) {
      bigSuccessToast(response.message);
    } else {
      dangerToast(response.error);
    }

    return response;
  } catch (error) {
    console.error("Error updating date of birth:", error);
    dangerToast(error);
    return {
      success: false,
      error: "An error occurred while updating date of birth",
    };
  }
};

export const onFinishPasswordUpdate = async (
  password,
  newPassword,
  confirmNewPassword
) => {
  try {
    const response = await UserServices.changePassword(
      password,
      newPassword,
      confirmNewPassword
    );
    if (response.success === true) {
      bigSuccessToast(response.message);
    } else {
      dangerToast(response.error);
    }

    return response;
  } catch (error) {
    console.error("Error updating password:", error);
    dangerToast();
    return {
      success: false,
      error: "An error occurred while updating password",
    };
  }
};

export const onFinishEmailUpdate = async (newEmail, currentPassword) => {
  try {
    const response = await UserServices.changeEmailAddress(
      newEmail,
      currentPassword
    );
    // console.log(response);
    if (response.success === true) {
      bigSuccessToast(response.message);
    } else {
      dangerToast(response.error);
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while updating email",
    };
  }
};

export const onFinishProfilePageUpdate = async (fd) => {
  try {
    const response = await UserServices.changeProfileImage(fd);
    if (response.success === true) {
      bigSuccessToast(response.message);
    } else {
      dangerToast(response.error);
    }

    return response;
  } catch (error) {
    dangerToast("An error occurred while updating profile page");
    return {
      success: false,
      error: "An error occurred while updating profile page",
    };
  }
};
