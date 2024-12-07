import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import helperFunctions from "../../Helpers/helperFunctions";
import ShipmentService from "../../Services/Shipments/ShipmentService";
import { getCompleteRequestsCall } from "../../Helpers/Services/GettingRequestsCall";
import LoadingSpin from "../../Components/LoadingSpin";
import ImageGallery from "../../Components/ImageGallery";
import DetailRow from "../../Components/DetailRow";
import Empty from "../../Components/Empty";
import ShipmentsTable from "../../Components/Tables/ShipmentsTable";
import ModalButton from "../../Components/Buttons/ModalButton";
import CancelShipmentModal from "../../Components/Modals/CancelShipmentModal";
import UpdateDateModal from "../../Components/Modals/UpdateDateModal";
import MapModal from "../../Components/Modals/MapModal";

const OwnerShipmentDetails = () => {
  const { shipmentId } = useParams();
  const [currentShipment, setCurrentShipment] = useState();
  const [currentShipmentAddress, setCurrentShipmentAddress] = useState([]);
  const [currentShipmentImages, setCurrentShipmentImages] = useState([]);
  const [currentShipmentRequests, setCurrentShipmentRequests] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [originCord, setOriginCord] = useState(null);
  const [destinationCord, setDestinationCord] = useState(null);

  const statusColors = {
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Accepted:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Completed:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    Canceled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      setLoading(true); // Start loading
      try {
        const [
          responseShipment,
          responseAddresses,
          responseImages,
          shipmentRequests,
        ] = await Promise.all([
          ShipmentService.getShipmentById(shipmentId),
          ShipmentService.getShipmentAddressesById(shipmentId),
          ShipmentService.getShipmentImagesById(shipmentId),
          getCompleteRequestsCall(shipmentId),
        ]);
        setCurrentShipment(responseShipment.message);
        setCurrentShipmentAddress(responseAddresses.message.data);
        setCurrentShipmentImages(responseImages.message.data);
        setCurrentShipmentRequests(shipmentRequests);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch shipment details:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchShipmentDetails();
  }, [shipmentId]);

  const shipmentData = currentShipment
    ? {
        id: shipmentId,
        type: helperFunctions.convertType(currentShipment.shipmentType),
        status: helperFunctions.convertStatus(currentShipment.shipmentStatus),
        date: helperFunctions.formatDate(currentShipment.shipmentDate),
        price: `${currentShipment.price} $`,
        distance: `${currentShipment.distanceBetweenAddresses} Km`,
        origin: helperFunctions.formatAddress(currentShipmentAddress[0]),
        destination: helperFunctions.formatAddress(currentShipmentAddress[1]),
        description: currentShipment.description,
      }
    : {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      const originCoords = await ShipmentService.fetchCoordinates(
        shipmentData.origin
      );
      const destinationCoords = await ShipmentService.fetchCoordinates(
        shipmentData.destination
      );

      setOriginCord({
        ...originCoords,
        address: shipmentData.origin,
      });

      setDestinationCord({
        ...destinationCoords,
        address: shipmentData.destination,
      });
    };

    fetchData();
    setLoading(true);
  }, [shipmentData.destination, shipmentData.origin, shipmentId]);

  const canBeCanceled = helperFunctions.isShipmentPendingOrAccepted(
    shipmentData.status
  );
  const isPending = helperFunctions.isShipmentPending(shipmentData.status);

  const arePendingRequests = () => {
    if (!currentShipmentRequests || currentShipmentRequests.length === 0) {
      return false; // No requests, so not all are pending
    }

    return (
      currentShipmentRequests.every((request) => request.status === 0) &&
      isPending
    );
  };

  const isCanceledOrCompleted = helperFunctions.isShipmentCanceledOrCompleted(
    shipmentData.status
  );

  if (loading) {
    // Render loading spinner while data is being fetched
    return <LoadingSpin />;
  }
  return (
    <div className={"p-5 md:ml-64 ml-0 grid grid-rows-2 gap-2 "}>
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col space-y-5 mt-5 md:mt-10">
          <ImageGallery images={currentShipmentImages} />
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-gray-700">{shipmentData.description}</p>
          </div>
        </div>
        {/* Right Column */}
        <div className="bg-white rounded-lg p-5 flex flex-col justify-between">
          <h1 className="text-3xl font-bold mb-4">Shipment Details</h1>
          <div className="grid grid-cols-1 gap-0 mb-6">
            <DetailRow isTable={false} label="Type" value={shipmentData.type} />
            <div
              className={
                "flex justify-between items-center p-4 border-b border-gray-300 text-gray-600"
              }
            >
              <span className="font-semibold  text-black">Status:</span>
              <span
                className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded ${
                  statusColors[shipmentData.status] ||
                  "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {shipmentData.status}
              </span>
            </div>
            <DetailRow isTable={false} label="Date" value={shipmentData.date} />
            <DetailRow
              isTable={false}
              label="Price"
              value={shipmentData.price}
            />
            <DetailRow
              isTable={false}
              label="Distance"
              value={shipmentData.distance}
            />
            <div className="flex flex-col justify-start p-4 border-b border-gray-300">
              <span className="font-semibold">From:</span>
              <span className="text-gray-700">{shipmentData.origin}</span>
            </div>
            <div className="flex flex-col justify-start p-4 border-b border-gray-300">
              <span className="font-semibold">To:</span>
              <span className="text-gray-700">{shipmentData.destination}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-0 justify-evenly">
            <ModalButton
              buttonText="View on Map"
              buttonStyle="bg-[#14213D] hover:bg-[#3c6e71] text-white"
              ModalComponent={MapModal}
              modalProps={{
                origin: originCord,
                destination: destinationCord,
              }}
            />
          </div>
          {/* Updates buttons */}
          <div className="flex flex-col md:flex-row mt-0 justify-evenly">
            {!isCanceledOrCompleted && (
              <ModalButton
                buttonText="Update Date"
                buttonStyle="bg-[#FCA311] hover:bg-[#ff6700] text-white"
                ModalComponent={UpdateDateModal}
                modalProps={{
                  shipmentId: parseInt(shipmentId),
                }}
              />
            )}
            {canBeCanceled && (
              <ModalButton
                buttonText="Cancel shipment"
                buttonStyle="bg-red-600 hover:bg-red-800 text-white"
                ModalComponent={CancelShipmentModal}
                modalProps={{
                  shipmentId: parseInt(shipmentId),
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* Second Row */}
      <div className="h-96">
        {currentShipmentRequests.length > 0 ? (
          <>
            <h1 className="text-2xl font-semibold">Requests</h1>
            <ShipmentsTable
              areShipments={false}
              data={currentShipmentRequests}
              labelActionButton=""
              missingData={false}
              arePendingStatus={arePendingRequests()}
            />
          </>
        ) : (
          <Empty
            message="No requests available"
            description="There are no shipment requests at this time."
          />
        )}
      </div>
    </div>
  );
};

export default OwnerShipmentDetails;
