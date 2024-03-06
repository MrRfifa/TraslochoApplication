import { useEffect, useState } from "react";
import AuthService from "../../Services/Auth/AuthServices";
import { ImSpinner9 } from "react-icons/im";

const ConfirmAccountPage = () => {
  //   const { token } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      setLoading(true);
      const response = await AuthService.verifyAccount(token);
      setMessage(response.message);
    };
    verifyAccount();
    setLoading(false);
  }, [token]);
  //   TODO: update the UI here
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

export default ConfirmAccountPage;
