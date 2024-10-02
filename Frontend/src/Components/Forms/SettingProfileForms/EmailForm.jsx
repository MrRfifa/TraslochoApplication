import { useEffect, useState } from "react";
import { FcCancel, FcCheckmark, FcSupport } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import UserSpecInfo from "../../../Redux/SlicesCalls/UserSpecInfo";
import { ImSpinner9 } from "react-icons/im";
import { login } from "../../../Redux/Features/userSpecInfo";
import { onFinishEmailUpdate } from "../../../Helpers/Services/UserServicesCall";

const EmailForm = () => {
  const [updateEmail, setUpdateEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState({
    oldEmail: "",
    newEmail: "",
    password: "",
  });

  const dispatch = useDispatch();
  const email = useSelector((state) => state.userSpecInfo.value.email);
  UserSpecInfo();

  useEffect(() => {
    setUserEmail((prevUserEmail) => ({
      ...prevUserEmail,
      oldEmail: email,
    }));
  }, [email]);

  const handleUpdateEmail = () => {
    setUpdateEmail(!updateEmail);
  };

  const handleCancel = () => {
    setUserEmail({
      newEmail: "",
      password: "",
    });
    handleUpdateEmail();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await onFinishEmailUpdate(
        userEmail.newEmail,
        userEmail.password
      );
      if (response.success === true) {
        dispatch(
          login({
            email: response.newEmail,
          })
        );
      }
    } catch (error) {
      console.error("Error updating email:", error);
    } finally {
      setIsLoading(false);
      handleUpdateEmail();
      setUserEmail({
        ...userEmail,
        oldEmail: email,
        newEmail: "",
        password: "",
      });
    }
  };

  return (
    <form
      className="flex flex-col sm:flex-row justify-between sm:space-x-5"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col w-full">
        <div className="flex flex-col mb-4">
          <label htmlFor="oldEmail" className="text-gray-700">
            Email
          </label>
          <input
            disabled
            id="oldEmail"
            type="email"
            value={userEmail.oldEmail}
            className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500"
          />
        </div>

        {updateEmail && (
          <div className="flex flex-col sm:flex-row sm:space-x-5">
            <div className="flex flex-col w-full mb-4 sm:w-1/2">
              <label htmlFor="newEmail" className="text-gray-700">
                New Email
              </label>
              <input
                disabled={!updateEmail}
                id="newEmail"
                type="email"
                placeholder="Enter new email"
                onChange={(e) =>
                  setUserEmail({ ...userEmail, newEmail: e.target.value })
                }
                className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500"
                style={{ cursor: !updateEmail ? "not-allowed" : "text" }}
              />
            </div>
            <div className="flex flex-col w-full mb-4 sm:w-1/2">
              <label htmlFor="password" className="text-gray-700">
                Password
              </label>
              <input
                disabled={!updateEmail}
                id="password"
                type="password"
                placeholder="Type password"
                onChange={(e) =>
                  setUserEmail({ ...userEmail, password: e.target.value })
                }
                className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500"
                style={{ cursor: !updateEmail ? "not-allowed" : "text" }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center items-center space-y-5">
        <button
          type="button"
          className={`p-2 border-2 rounded-lg`}
          onClick={!updateEmail ? handleUpdateEmail : handleCancel}
        >
          {!updateEmail ? <FcSupport size={22} /> : <FcCancel size={22} />}
        </button>
        <button
          type="submit"
          className={`p-2 border-2 rounded-lg ${
            updateEmail ? "block" : "hidden"
          }`}
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

export default EmailForm;
