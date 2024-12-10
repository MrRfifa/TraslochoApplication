import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "../../Components/ImageGallery";
import DetailRow from "../../Components/DetailRow";
import ProfileDetails from "../../Components/ProfileDetails";
import UserService from "../../Services/Users/UserServices";
import { useEffect, useState } from "react";
import { errorToast, warningToast } from "../../Components/Toasts";
import LoadingSpin from "../../Components/LoadingSpin";
import Empty from "../../Components/Empty";
import helperFunctions from "../../Helpers/helperFunctions";
import ReviewCard from "../../Components/Cards/ReviewCard";
import ModalButton from "../../Components/Buttons/ModalButton";
import CreateReviewModal from "../../Components/Modals/CreateReviewModal";
import AuthVerifyService from "../../Services/Auth/AuthVerifyService";
import ContactService from "../../Services/Messages/Conversations";
import { addContactCall } from "../../Helpers/Services/ContactServicesCall";

const TransporterProfilePage = () => {
  const { transporterId } = useParams();
  const [transporterData, setTransporterData] = useState({});
  const [loading, setLoading] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const loadTransporterData = async () => {
      setLoading(true); // Start loading immediately
      try {
        const result = await UserService.GetTransporterInfoById(transporterId);

        if (result.success) {
          setTransporterData(result.message);
        } else {
          errorToast(
            result.error || "An error occurred while processing your request."
          ); // Handle generic fallback
        }
      } catch (error) {
        console.error(error);
        errorToast("Failed to load data. Please try again."); // Show a generic error toast
      } finally {
        setLoading(false); // Always stop loading
      }
    };
    loadTransporterData();
  }, [transporterId]);

  const vehicleImages =
    transporterData.vehicle?.vehicleImages?.map(
      (image) => image.fileContentBase64
    ) || [];

  const handleReviewCreated = () => {
    // Fetch updated transporter data after a review is created
    const loadUpdatedData = async () => {
      const result = await UserService.GetTransporterInfoById(transporterId);
      if (result.success) {
        setTransporterData(result.message); // Update the transporter data, including reviews
      }
    };
    loadUpdatedData();
  };

  const handleReviewDeleted = (reviewId) => {
    setTransporterData((prevData) => ({
      ...prevData,
      transporterReviews: prevData.transporterReviews.filter(
        (review) => review.id !== reviewId
      ),
    }));
  };

  const handleCreateContact = async () => {
    try {
      const existsContact = await ContactService.checkContactExists(
        AuthVerifyService.getUserId(),
        transporterId
      );

      if (existsContact.message) {
        // Assuming `exists` is returned as a boolean
        // If contact exists, navigate to the messaging page
        navigate(`/messages/${transporterId}`);
      } else {
        // If contact does not exist, create it and then navigate
        const addResponse = await addContactCall(
          AuthVerifyService.getUserId(),
          transporterId
        );
        if (addResponse.success) {
          navigate(`/messages/${transporterId}`);
        }
      }
    } catch (error) {
      warningToast("An error occurred while handling contact creation.");
      console.error("Error in handleCreateContact:", error);
    }
  };

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div className="ml-0 md:ml-64 grid grid-rows-2 gap-4 p-5 h-full">
      {/* First Row: Transporter Profile and Vehicle Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {/* Left Column: Transporter Profile */}
        <div className="flex flex-col space-y-5">
          <ProfileDetails
            activityType={transporterData.transporterType}
            imageProfile={transporterData.fileContentBase64}
            dateOfBirth={helperFunctions.formatDateToHumanDate(
              transporterData.dateOfBirth
            )}
            firstName={transporterData.firstName}
            lastName={transporterData.lastName}
            address={transporterData.userAddress}
          />
          <div className="flex flex-row justify-center space-x-5">
            <ModalButton
              buttonText="Create review"
              ModalComponent={CreateReviewModal}
              modalProps={{
                transporterId: parseInt(transporterId),
                ownerId: parseInt(AuthVerifyService.getUserId()),
                onReviewCreated: handleReviewCreated,
              }}
              buttonStyle={"bg-yellow-500 hover:bg-yellow-700 text-white"}
            />
            <button
              onClick={handleCreateContact}
              className={
                "bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 mb-5 rounded transition duration-200"
              }
            >
              Chat
            </button>
          </div>
        </div>

        {/* Right Column: Vehicle Details */}
        <div className="grid grid-rows-2 -space-y-9 gap-0 p-4 border border-solid rounded-lg shadow-xl bg-white">
          {/* Vehicle Images */}
          <div>
            <ImageGallery images={vehicleImages} />
          </div>

          {/* Vehicle Details */}
          <div className="flex flex-col gap-2">
            <DetailRow
              label="Manufacture"
              value={transporterData.vehicle.manufacture}
              isTable={false}
            />
            <DetailRow
              label="Model"
              value={transporterData.vehicle.model}
              isTable={false}
            />
            <DetailRow
              label="Year"
              value={transporterData.vehicle.year}
              isTable={false}
            />
            <DetailRow
              label="Color"
              value={transporterData.vehicle.color}
              isTable={false}
            />
            <DetailRow
              label="Type"
              value={helperFunctions.convertVehicleType(
                transporterData.vehicle.vehicleType
              )}
              isTable={false}
            />
            <DetailRow
              label="Dimensions"
              value={`${transporterData.vehicle.length} m * ${transporterData.vehicle.height} m`}
              isTable={false}
            />
            <div className="flex justify-between items-center text-base p-4 border-gray-300 text-gray-600">
              <span className="font-semibold text-black">Availability:</span>
              <span
                className={
                  transporterData.vehicle.isAvailable
                    ? "text-green-500 font-bold"
                    : "text-red-500 font-bold"
                }
              >
                {transporterData.vehicle.isAvailable
                  ? "Available"
                  : "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Reviews Section */}
      <div>
        {transporterData.transporterReviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReviewCard
              onReviewDeleted={handleReviewDeleted}
              reviews={transporterData.transporterReviews}
              isPreview={true}
            />
          </div>
        ) : (
          <Empty
            description={"It looks like there are no reviews at the moment!"}
            message={"No reviews"}
          />
        )}
      </div>
    </div>
  );
};

export default TransporterProfilePage;
