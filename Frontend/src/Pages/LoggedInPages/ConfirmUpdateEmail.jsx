import { useEffect, useState } from "react";
import UserServices from "../../Services/Users/UserServices";
import { ImSpinner9 } from "react-icons/im";

const ConfirmUpdateEMail = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Initially set loading to true

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await UserServices.verifyNewEmail(token);
        console.log(response);
        if (response.success) {
          setMessage(response.message);
        } else {
          setMessage(response.error.message);
        }
      } catch (error) {
        // Handle errors if necessary
        console.error("Error verifying email:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    if (token) {
      verifyAccount(); // Call the function only if token is available
    } else {
      setLoading(false); // If token is not available, set loading to false
    }
  }, [token]);

  return (
    <div
      className={`flex justify-center items-center h-screen ${
        loading ? "bg-[#14213D]" : "bg-[#FCA311]"
      }`}
    >
      {loading ? (
        <ImSpinner9 className="text-[#E5E5E5] animate-spin" size={100} />
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
        </div>
      )}
    </div>
  );
};

export default ConfirmUpdateEMail;
