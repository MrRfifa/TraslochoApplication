import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShipmentsTable from "../../Components/Tables/ShipmentsTable";
import ShipmentService from "../../Services/Shipments/ShipmentService";
import helperFunctions from "../../Helpers/helperFunctions";
import MapModal from "../../Components/Modals/MapModal";
import Empty from "../../Components/Empty";
import ImageGallery from "../../Components/ImageGallery";
import DetailRow from "../../Components/DetailRow";
import { getCompleteRequestsCall } from "../../Helpers/Services/GettingRequestsCall";
import UpdateDateModal from "../../Components/Modals/UpdateDateModal";
import CancelShipmentModal from "../../Components/Modals/CancelShipmentModal";
//TODO: Add the update shipment details service call.
const ShipmentDetails = () => {
  const { shipmentId } = useParams();
  const [currentShipment, setCurrentShipment] = useState();
  const [currentShipmentAddress, setCurrentShipmentAddress] = useState([]);
  const [currentShipmentImages, setCurrentShipmentImages] = useState([]);
  const [currentShipmentRequests, setCurrentShipmentRequests] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [originCord, setOriginCord] = useState(null);
  const [destinationCord, setDestinationCord] = useState(null);

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
  }, [shipmentData.destination, shipmentData.origin]);

  if (loading) {
    // Render loading spinner while data is being fetched
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const canBeCanceled = helperFunctions.isShipmentPendingOrAccepted(
    shipmentData.status
  );

  return (
    <div className="p-5 md:ml-64 ml-0 grid grid-rows-2 gap-2">
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
            <DetailRow
              isTable={false}
              label="Status"
              value={shipmentData.status}
            />
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
            <DetailRow isTable={false} label="Type" value={shipmentData.type} />
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
            <button
              onClick={() => setIsUpdateOpen(true)}
              className="bg-[#FCA311] hover:bg-[#ff6700] text-white mb-5 py-2 px-4 rounded transition duration-200"
            >
              Update Date
            </button>
            {isUpdateOpen && (
              <UpdateDateModal
                isOpen={isUpdateOpen}
                shipmentId={parseInt(shipmentId)}
                onClose={() => setIsUpdateOpen(false)}
              />
            )}
            <button
              onClick={() => setIsMapOpen(true)}
              className="bg-[#14213D] hover:bg-[#3c6e71] text-white py-2 px-4 mb-5 rounded transition duration-200"
            >
              View on Map
            </button>
            {isMapOpen && (
              <MapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                origin={originCord}
                destination={destinationCord}
              />
            )}
          </div>
          {canBeCanceled && (
            <div className="flex flex-row justify-evenly">
              <button
                onClick={() => setIsCancelOpen(true)}
                className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded transition duration-200"
              >
                Cancel shipment
              </button>
              {isCancelOpen && (
                <CancelShipmentModal
                  isOpen={isCancelOpen}
                  onClose={() => setIsCancelOpen(false)}
                  shipmentId={parseInt(shipmentId)}
                />
              )}
            </div>
          )}
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

export default ShipmentDetails;
