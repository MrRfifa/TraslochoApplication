import { useState } from "react";
import { FcCancel, FcCheckmark, FcImageFile, FcSupport } from "react-icons/fc";
import { ImSpinner9 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { warningToast } from "../../Toasts";
import { onFinishProfilePageUpdate } from "../../../Helpers/Services/UserServicesCall";
import { login } from "../../../Redux/Features/userSpecInfo";
import AuthService from "../../../Services/Auth/AuthServices";

const ProfileImageForm = () => {
  const dispatch = useDispatch();
  const [updateProfilePage, setUpdateProfileImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileBase64 = useSelector(
    (state) => state.userSpecInfo.value.fileContentBase64
  );

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
      // Handle error, perhaps show a toast or alert
    } finally {
      setIsLoading(false);
      handleUpdateProfileImage();
      setSelectedFile(null);
    }
  };

  return (
    <div className="border border-solid rounded-lg py-5 px-14 flex flex-row justify-between shadow-xl">
      <div className="flex flex-row justify-start items-center w-3/5 space-x-5">
        <img
          src={`data:image/png;base64,${fileBase64}`}
          alt="Profile"
          className="border border-solid cursor-pointer rounded-full bg-gray-700 w-36 h-36"
        />
      </div>
      <div className="my-auto p-3">
        <div className="flex flex-row justify-center items-center space-x-5">
          <button
            type="button"
            className="p-2 border-2 rounded-lg"
            onClick={
              !updateProfilePage ? handleUpdateProfileImage : handleCancel
            }
          >
            {!updateProfilePage ? (
              <FcSupport size={22} />
            ) : (
              <FcCancel size={22} />
            )}
          </button>
          {updateProfilePage && (
            <form
              encType="multipart/form-data"
              className="p-2 border-2 rounded-lg"
              style={{ height: "43px" }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none", height: "fit-content" }}
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <FcImageFile size={22} />
              </label>
            </form>
          )}
          <button
            disabled={selectedFile === null || isLoading}
            type="submit"
            className={`p-2 border-2 rounded-lg ${
              updateProfilePage ? "block" : "hidden"
            }`}
            onClick={handleUpload}
          >
            {isLoading ? (
              <ImSpinner9
                size={22}
                className="text-green-500 animate-spin mx-auto"
              />
            ) : (
              <FcCheckmark size={22} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageForm;
