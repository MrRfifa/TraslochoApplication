import UserService from "../../Services/Users/UserServices";
import { useParams } from "react-router-dom";

const TransporterProfilePage = () => {
  const { transporterId } = useParams();

  const loadTransporterData = async () => {
    // setLoading(true); // Start loading immediately
    try {
      const result = await UserService.GetTransporterInfoById(transporterId);

      if (result.success) {
        console.log(result);

        // successToast(result.message); // Show success message
        // window.location.reload();
      } else {
        console.error("here: not success");

        // errorToast(
        //   result.error || "An error occurred while processing your request."
        // ); // Handle generic fallback
      }
    } catch (error) {
      console.error(error);

      //errorToast("Failed to create request. Please try again."); // Show a generic error toast
    } finally {
      //setLoading(false); // Always stop loading
    }
  };
  loadTransporterData()
  return (
    <div className="ml-0 md:ml-96">TransporterProfilePage {transporterId} </div>
  );
};


export default TransporterProfilePage;
