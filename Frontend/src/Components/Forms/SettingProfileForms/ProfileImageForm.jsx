import { useState, useEffect } from "react";
import { FcCancel, FcCheckmark, FcImageFile, FcSupport } from "react-icons/fc";
import { ImSpinner9 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { warningToast } from "../../Toasts";
import { onFinishProfilePageUpdate } from "../../../Helpers/Services/UserServicesCall";
import { login } from "../../../Redux/Features/userSpecInfo";
import AuthService from "../../../Services/Auth/AuthServices";
import UserSpecInfo from "../../../Redux/SlicesCalls/UserSpecInfo";
import UserAddress from "../../../Redux/SlicesCalls/UserAddress";
import { findCountryByIndex } from "../../../Helpers/europian_countries";
import helperFunctions from "../../../Helpers/helperFunctions";

const ProfileImageForm = () => {
  const dispatch = useDispatch();
  const [updateProfilePage, setUpdateProfileImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUserAddressReady, setIsUserAddressReady] = useState(false);

  // Redux state to fetch the user's information
  const fileBase64 = useSelector(
    (state) => state.userSpecInfo.value.fileContentBase64
  );
  const userSpecInfo = useSelector((state) => state.userSpecInfo.value);
  const userAddress = useSelector((state) => state.userAddress.value);

  // Initialize calls to fetch user info and address
  UserSpecInfo();
  UserAddress();

  // Monitor userAddress readiness
  useEffect(() => {
    if (
      userAddress &&
      userAddress.country &&
      userAddress.state &&
      userAddress.city &&
      userAddress.zipCode &&
      userAddress.street
    ) {
      setIsUserAddressReady(true);
    }
  }, [userAddress]);

  const countryObject = isUserAddressReady
    ? findCountryByIndex(userAddress.country)
    : {};
  const address = isUserAddressReady
    ? `${countryObject.name}, ${userAddress.state} ${userAddress.city} ${userAddress.zipCode}, ${userAddress.street}.`
    : "Loading address...";

  const handleUpdateProfileImage = () => {
    setUpdateProfileImage(!updateProfilePage);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    handleUpdateProfileImage();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!selectedFile) {
        warningToast("No file selected");
        return;
      }

      const fd = new FormData();
      fd.append("file", selectedFile);

      const response = await onFinishProfilePageUpdate(fd);
      if (response.success === true) {
        const userInfoResponse = await AuthService.getUserSpecificInfo();
        const userSpecInfo = userInfoResponse.userInfoSpec.message;
        dispatch(
          login({
            fileContentBase64: userSpecInfo.fileContentBase64,
          })
        );
      }
    } catch (error) {
      console.error("Error updating profile page:", error);
    } finally {
      setIsLoading(false);
      handleUpdateProfileImage();
      setSelectedFile(null);
    }
  };

  return (
    <div className="border border-solid rounded-lg py-6 px-8 shadow-xl w-full max-w-lg mx-auto">
      {isUserAddressReady ? (
        <>
          {/* Profile Image Display */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={`data:image/png;base64,${fileBase64}`}
                alt="Profile"
                className="border border-solid cursor-pointer rounded-md bg-gray-700 w-36 h-36 md:w-44 md:h-44"
              />
            </div>
            {!updateProfilePage ? (
              <p className="text-gray-600 mt-4 text-sm">
                Click to update profile picture
              </p>
            ) : null}
          </div>

          {/* Buttons and Upload Form */}
          <div className="flex justify-center space-x-10 mt-4">
            <button
              type="button"
              className="p-2 border-2 rounded-lg hover:scale-125"
              onClick={
                !updateProfilePage ? handleUpdateProfileImage : handleCancel
              }
            >
              {!updateProfilePage ? (
                <FcSupport size={25} />
              ) : (
                <FcCancel size={25} />
              )}
            </button>
            {updateProfilePage && (
              <form encType="multipart/form-data" className="flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer p-2 border-2 rounded-lg hover:scale-125"
                >
                  <FcImageFile size={25} />
                </label>
              </form>
            )}
            <button
              disabled={selectedFile === null || isLoading}
              type="submit"
              className={`p-2 border-2 rounded-lg  ${
                updateProfilePage ? "block" : "hidden"
              } ${
                selectedFile
                  ? "hover:scale-125 hover:cursor-pointer "
                  : "bg-gray-200"
              } `}
              onClick={handleUpload}
            >
              {isLoading ? (
                <ImSpinner9
                  size={25}
                  className="text-green-500 animate-spin mx-auto"
                />
              ) : (
                <FcCheckmark
                  size={25}
                  className={`${selectedFile ? "" : "cursor-not-allowed"}`}
                />
              )}
            </button>
          </div>

          {/* User Information Display */}
          <div className="md:mt-8 md:space-y-10 mt-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Name:</span>
              <span className="text-gray-600">{`${userSpecInfo.firstName} ${userSpecInfo.lastName}`}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-gray-600">{userSpecInfo.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Date of Birth:
              </span>
              <span className="text-gray-600">
                {helperFunctions.formatDateToHumanDate(
                  userSpecInfo.dateOfBirth
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Address:</span>
              <span className="text-gray-600 text-right">{address}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <ImSpinner9 size={30} className="text-yellow-500 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProfileImageForm;
