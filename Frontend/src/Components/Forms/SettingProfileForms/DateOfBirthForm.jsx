import { useEffect, useState } from "react";
import { FcCancel, FcCheckmark, FcSupport } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import UserSpecInfo from "../../../Redux/SlicesCalls/UserSpecInfo";
import { onFinishDobUpdate } from "../../../Helpers/Services/UserServicesCall";
import { login } from "../../../Redux/Features/userSpecInfo";
import { ImSpinner9 } from "react-icons/im";

const DateOfBirthForm = () => {
  const dispatch = useDispatch();
  const [updateDateOfBirth, setUpdateDateOfBirth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateOfBirthState, setDateOfBirthState] = useState({
    newDob: "",
    password: "",
  });
  UserSpecInfo(); // Ensure UserSpecInfo is called to fetch user information

  const dateOfBirth = useSelector(
    (state) => state.userSpecInfo.value.dateOfBirth // Without split, to avoid undefined error
  );

  useEffect(() => {
    if (dateOfBirth) {
      // Ensure dateOfBirth is defined before splitting
      const formattedDateOfBirth = dateOfBirth.split("T")[0];
      setDateOfBirthState((prevDateOfBirth) => ({
        ...prevDateOfBirth,
        newDob: formattedDateOfBirth,
      }));
    }
  }, [dateOfBirth]);

  const handleUpdateDateOfBirth = () => {
    setUpdateDateOfBirth((prevUpdateDob) => !prevUpdateDob);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await onFinishDobUpdate(
        dateOfBirthState.newDob,
        dateOfBirthState.password
      );
      if (response.success === true) {
        dispatch(login({ dateOfBirth: dateOfBirthState.newDob }));
      }
    } catch (error) {
      console.error("Error updating date of birth:", error);
    } finally {
      setIsLoading(false);
      setUpdateDateOfBirth(false);
      setDateOfBirthState((prevState) => ({
        ...prevState,
        newDob: updateDateOfBirth ? prevState.newDob : dateOfBirth,
        password: "",
      }));
    }
  };

  const handleCancel = () => {
    setDateOfBirthState((prevState) => ({
      ...prevState,
      newDob: dateOfBirth,
      password: "",
    }));
    handleUpdateDateOfBirth();
  };

  return (
    <form
      className="w-full space-x-5 flex flex-row justify-between"
      onSubmit={handleSubmit}
    >
      <input
        required
        disabled={!updateDateOfBirth}
        type="date"
        placeholder="dob"
        value={dateOfBirthState.newDob}
        onChange={(e) =>
          setDateOfBirthState({
            ...dateOfBirthState,
            newDob: e.target.value,
          })
        }
        className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500 w-1/2"
        style={{ cursor: !updateDateOfBirth ? "not-allowed" : "text" }}
      />
      <input
        required
        disabled={!updateDateOfBirth}
        type="password"
        placeholder="password"
        value={dateOfBirthState.password}
        onChange={(e) =>
          setDateOfBirthState({
            ...dateOfBirthState,
            password: e.target.value,
          })
        }
        className={`ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500 w-1/3 ${
          updateDateOfBirth ? "block" : "hidden"
        } `}
        style={{ cursor: !updateDateOfBirth ? "not-allowed" : "text" }}
      />

      <div className="space-x-5 w-1/3 flex flex-row justify-end items-center">
        <button
          type="button"
          className={`p-2 border-2 rounded-lg`}
          onClick={!updateDateOfBirth ? handleUpdateDateOfBirth : handleCancel}
        >
          {!updateDateOfBirth ? (
            <FcSupport size={22} />
          ) : (
            <FcCancel size={22} />
          )}
        </button>
        <button
          type="submit"
          onClick={handleUpdateDateOfBirth}
          className={`p-2 border-2 rounded-lg  ${
            updateDateOfBirth ? "block" : "hidden"
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

export default DateOfBirthForm;
