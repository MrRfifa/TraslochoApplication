import { useParams } from "react-router-dom";
import ImageGallery from "../../Components/ImageGallery";
import DetailRow from "../../Components/DetailRow";
import ProfileDetails from "../../Components/ProfileDetails";
import ReviewsTable from "../../Components/Tables/ReviewsTable";
import UserService from "../../Services/Users/UserServices";
import { useEffect, useState } from "react";
import { errorToast } from "../../Components/Toasts";
import LoadingSpin from "../../Components/LoadingSpin";
import Empty from "../../Components/Empty";
import helperFunctions from "../../Helpers/helperFunctions";

const TransporterProfilePage = () => {
  const { transporterId } = useParams();
  const [transporterData, setTransporterData] = useState({});
  const [loading, setLoading] = useState({});

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

  // console.log(transporterData.transporterReviews[0]);

  if (loading) {
    return <LoadingSpin />;
  }
  //TODO add add review
  //TODO add add as friend and start chatting
  return (
    <div className="ml-0 md:ml-96 grid grid-rows-2 gap-4 p-5 h-full">
      {/* First Row: Transporter Profile and Vehicle Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {/* Left Column: Transporter Profile */}
        <div>
          <ProfileDetails
            activityType={transporterData.transporterType}
            imageProfile={transporterData.fileContentBase64}
            dateOfBirth={transporterData.dateOfBirth}
            firstName={transporterData.firstName}
            lastName={transporterData.lastName}
            address={transporterData.userAddress}
          />
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
          <ReviewsTable reviews={transporterData.transporterReviews} />
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
