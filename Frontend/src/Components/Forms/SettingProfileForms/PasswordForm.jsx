import { useState } from "react";
import { FcCancel, FcCheckmark, FcSupport } from "react-icons/fc";
import { ImSpinner9 } from "react-icons/im";
import { onFinishPasswordUpdate } from "../../../Helpers/Services/UserServicesCall";

const PasswordForm = () => {
  const [updatePassword, setUpdatePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userPassword, setUserPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [errorMatch, setErrorMatch] = useState("");

  const handleUpdatePassword = () => {
    setUpdatePassword(!updatePassword);
    setError("");
    setErrorMatch("");
  };

  const handleCancel = () => {
    setUserPassword({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    handleUpdatePassword();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;

      if (userPassword.newPassword !== userPassword.confirmNewPassword) {
        setError("Passwords do not match.");
      } else if (!passwordRegex.test(userPassword.newPassword)) {
        setErrorMatch(
          "Passwords must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long."
        );
      } else {
        const response = await onFinishPasswordUpdate(
          userPassword.oldPassword,
          userPassword.newPassword,
          userPassword.confirmNewPassword
        );
        if (response.success) {
          // Reset form fields and update UI if API call succeeds
          setUserPassword({
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
          setError("");
          setErrorMatch("");
          handleUpdatePassword();
        } else {
          setError(response.error); // Display error message from the API response
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-row justify-between" onSubmit={handleSubmit}>
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-1/2 mb-4">
          <label htmlFor="oldPassword" className="text-gray-700">
            Old Password
          </label>
          <input
            required
            disabled={!updatePassword}
            id="oldPassword"
            type="password"
            placeholder="Enter old password"
            value={userPassword.oldPassword}
            onChange={(e) =>
              setUserPassword({ ...userPassword, oldPassword: e.target.value })
            }
            className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500"
            style={{ cursor: !updatePassword ? "not-allowed" : "text" }}
          />
        </div>
        <div className="flex flex-col w-1/2 mb-4">
          <label htmlFor="newPassword" className="text-gray-700">
            New Password
          </label>
          <input
            disabled={!updatePassword}
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={userPassword.newPassword}
            onChange={(e) =>
              setUserPassword({ ...userPassword, newPassword: e.target.value })
            }
            className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500"
            style={{ cursor: !updatePassword ? "not-allowed" : "text" }}
          />
        </div>
        <div className="flex flex-col w-1/2 mb-4">
          <label htmlFor="confirmPassword" className="text-gray-700">
            Confirm New Password
          </label>
          <input
            disabled={!updatePassword}
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={userPassword.confirmNewPassword}
            onChange={(e) =>
              setUserPassword({
                ...userPassword,
                confirmNewPassword: e.target.value,
              })
            }
            className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500"
            style={{ cursor: !updatePassword ? "not-allowed" : "text" }}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {errorMatch && <p className="text-red-500">{errorMatch}</p>}
      </div>
      <div className="flex flex-col justify-center items-center space-y-5">
        <button
          type="button"
          className={`p-2 border-2 rounded-lg`}
          onClick={!updatePassword ? handleUpdatePassword : handleCancel}
        >
          {!updatePassword ? <FcSupport size={22} /> : <FcCancel size={22} />}
        </button>
        <button
          type="submit"
          className={`p-2 border-2 rounded-lg  ${
            updatePassword ? "block" : "hidden"
          } `}
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
    </form>
  );
};

export default PasswordForm;
