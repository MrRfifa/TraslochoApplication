import { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { FcCancel, FcCheckmark, FcSupport } from "react-icons/fc";
import UserSpecInfo from "../../../Redux/SlicesCalls/UserSpecInfo";
import { useDispatch, useSelector } from "react-redux";
import { onFinishNamesUpdate } from "../../../Helpers/Services/UserServicesCall";
import { login } from "../../../Redux/Features/userSpecInfo";

const NamesForm = () => {
  const [updateName, setUpdateName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userNames, setUserNames] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const dispatch = useDispatch();
  const userSpecInfo = useSelector((state) => state.userSpecInfo);
  UserSpecInfo();
  useEffect(() => {
    setUserNames((prevUserNames) => ({
      ...prevUserNames,
      firstName: userSpecInfo.value.firstName,
      lastName: userSpecInfo.value.lastName,
    }));
  }, [userSpecInfo]);

  const handleUpdateNames = () => {
    setUpdateName((prevUpdateName) => !prevUpdateName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await onFinishNamesUpdate(
        userNames.lastName,
        userNames.firstName,
        userNames.password
      );
      if (response.success === true) {
        dispatch(
          login({
            firstName: response.newFirstName,
            lastName: response.newLastName,
          })
        );
      }
    } catch (error) {
      console.error("Error updating names:", error);
    } finally {
      setIsLoading(false);
      handleUpdateNames();
      setUserNames({ ...userNames, password: "" });
    }
  };

  const handleCancel = () => {
    setUserNames({
      firstName: userSpecInfo.value.firstName,
      lastName: userSpecInfo.value.lastName,
      password: "",
    });
    handleUpdateNames();
  };

  return (
    <form
      className="w-full space-y-4 sm:space-y-0 sm:space-x-5 flex flex-col sm:flex-row justify-between items-center"
      onSubmit={handleSubmit}
    >
      {/* First Name */}
      <input
        required
        disabled={!updateName}
        type="text"
        placeholder="First name"
        value={userNames.firstName}
        onChange={(e) =>
          setUserNames({ ...userNames, firstName: e.target.value })
        }
        className="ring-1 ring-gray-300 rounded-md text-md px-4 py-2 outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-1/3"
        style={{ cursor: !updateName ? "not-allowed" : "text" }}
      />

      {/* Last Name */}
      <input
        required
        disabled={!updateName}
        type="text"
        placeholder="Surname"
        value={userNames.lastName}
        onChange={(e) =>
          setUserNames({ ...userNames, lastName: e.target.value })
        }
        className="ring-1 ring-gray-300 rounded-md text-md px-4 py-2 outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-1/3"
        style={{ cursor: !updateName ? "not-allowed" : "text" }}
      />

      {/* Password */}
      <input
        disabled={!updateName}
        type="password"
        required
        placeholder="Password"
        value={userNames.password}
        onChange={(e) =>
          setUserNames({ ...userNames, password: e.target.value })
        }
        className={`ring-1 ring-gray-300 rounded-md text-md px-4 py-2 outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-1/3 ${
          updateName ? "block" : "hidden"
        }`}
        style={{ cursor: !updateName ? "not-allowed" : "text" }}
      />

      {/* Action Buttons */}
      <div className="flex space-x-4 w-full sm:w-1/3 justify-end">
        <button
          type="button"
          className={`p-2 border-2 rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            updateName ? "text-red-500" : "text-blue-500"
          }`}
          onClick={!updateName ? handleUpdateNames : handleCancel}
        >
          {!updateName ? <FcSupport size={22} /> : <FcCancel size={22} />}
        </button>
        <button
          type="submit"
          className={`p-2 border-2 rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            updateName ? "block" : "hidden"
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

export default NamesForm;
