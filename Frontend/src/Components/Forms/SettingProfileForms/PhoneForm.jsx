import { useState } from "react";
import { FcCheckmark, FcSupport } from "react-icons/fc";

const PhoneForm = () => {
  const [updateEmail, setUpdateEmail] = useState(false);

  const handleUpdateEmail = () => {
    setUpdateEmail(!updateEmail);
  };

  return (
    <form className="flex flex-row justify-between">
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-1/2 mb-4">
          <label htmlFor="oldEmail" className="text-gray-700">
            Old Email
          </label>
          <input
            id="oldEmail"
            type="password"
            placeholder="Enter old password"
            value={"hello"}
            className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500"
          />
        </div>
        <div className="flex flex-col w-1/2 mb-4">
          <label htmlFor="newEmail" className="text-gray-700">
            New Email
          </label>
          <input
            id="newEmail"
            type="password"
            placeholder="Enter new password"
            value={"hello"}
            className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center space-y-5">
        <button
          type="button"
          disabled={updateEmail}
          onClick={handleUpdateEmail}
          className={`p-2 border-2 rounded-lg ${
            !updateEmail
              ? "bg-white text-gray-700"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          <FcSupport size={22} />
        </button>
        <button
          type="button"
          disabled={!updateEmail}
          onClick={handleUpdateEmail}
          className={`p-2 border-2 rounded-lg ${
            updateEmail
              ? "bg-white text-gray-700"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          <FcCheckmark size={22} />
        </button>
      </div>
    </form>
  );
};

export default PhoneForm;
