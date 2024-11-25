import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShipmentsTable from "../../Components/Tables/ShipmentsTable";
import ShipmentService from "../../Services/Shipments/ShipmentService";
// import RequestService from "../../Services/Requests/RequestService";
import helperFunctions from "../../Helpers/helperFunctions";
import MapModal from "../../Components/MapModal";
import Empty from "../../Components/Empty";

const ShipmentDetails = () => {
  const { shipmentId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentShipment, setCurrentShipment] = useState();
  const [currentShipmentAddress, setCurrentShipmentAddress] = useState([]);
  const [currentShipmentImages, setCurrentShipmentImages] = useState([]);
  const [currentShipmentRequests, setCurrentShipmentRequests] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [originCord, setOriginCord] = useState(null);
  const [destinationCord, setDestinationCord] = useState(null);

  const thumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);
  useEffect(() => {
    const fetchShipmentDetails = async () => {
      setLoading(true); // Start loading
      try {
        const [
          responseShipment,
          responseAddresses,
          responseImages,
          // shipmentRequests,
        ] = await Promise.all([
          ShipmentService.getShipmentById(shipmentId),
          ShipmentService.getShipmentAddressesById(shipmentId),
          ShipmentService.getShipmentImagesById(shipmentId),
          // RequestService.getShipmentRequests(shipmentId),
        ]);
        setCurrentShipment(responseShipment.message);
        setCurrentShipmentAddress(responseAddresses.message.data);
        setCurrentShipmentImages(responseImages.message.data);
        // setCurrentShipmentRequests(shipmentRequests);
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

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentShipmentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? currentShipmentImages.length - 1 : prevIndex - 1
    );
  };

  const scrollToThumbnail = (index) => {
    if (thumbnailContainerRef.current && thumbnailRefs.current[index]) {
      thumbnailContainerRef.current.scrollTo({
        left:
          thumbnailRefs.current[index].offsetLeft -
          thumbnailContainerRef.current.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    // Render loading spinner while data is being fetched
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  // console.log(currentShipmentRequests);

  return (
    <div className="p-5 md:ml-64 ml-0 grid grid-rows-2 gap-2">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col space-y-5 mt-5 md:mt-10">
          <div className="relative mb-4">
            <img
              src={`data:image/png;base64,${currentShipmentImages[currentImageIndex]}`}
              alt="Primary Shipment Image"
              className="rounded-lg shadow-lg w-full h-auto"
            />
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-200 transition duration-200"
            >
              &#10094;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-200 transition duration-200"
            >
              &#10095;
            </button>
            <div
              ref={thumbnailContainerRef}
              className="flex space-x-2 mt-2 overflow-x-auto scrollbar-hidden"
            >
              {currentShipmentImages.map((img, index) => (
                <img
                  key={index}
                  ref={(el) => (thumbnailRefs.current[index] = el)}
                  src={`data:image/png;base64,${img}`}
                  alt={`Shipment thumbnail ${index + 1}`}
                  className={`rounded-lg shadow-md cursor-pointer h-16 w-24 object-cover ${
                    currentImageIndex === index
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    scrollToThumbnail(index);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-gray-700">{shipmentData.description}</p>
          </div>
        </div>
        {/* Right Column */}
        <div className="bg-white rounded-lg p-5 flex flex-col justify-between">
          <h1 className="text-3xl font-bold mb-4">Shipment Details</h1>
          <div className="grid grid-cols-1 gap-0 mb-6">
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <span className="font-semibold">Type:</span>
              <span className="text-gray-700">{shipmentData.type}</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <span className="font-semibold">Status:</span>
              <span className="text-gray-700">{shipmentData.status}</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <span className="font-semibold">Date:</span>
              <span className="text-gray-700">{shipmentData.date}</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <span className="font-semibold">Price:</span>
              <span className="text-gray-700">{shipmentData.price}</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <span className="font-semibold">Distance:</span>
              <span className="text-gray-700">{shipmentData.distance}</span>
            </div>
            <div className="flex flex-col justify-start p-4 border-b border-gray-300">
              <span className="font-semibold">From:</span>
              <span className="text-gray-700">{shipmentData.origin}</span>
            </div>
            <div className="flex flex-col justify-start p-4 border-b border-gray-300">
              <span className="font-semibold">To:</span>
              <span className="text-gray-700">{shipmentData.destination}</span>
            </div>
          </div>
          <div className="flex flex-row mt-0 space-x-5">
            <button className="bg-[#FCA311] hover:bg-[#ff6700] text-white py-2 px-4 rounded transition duration-200">
              Update Shipment Date
            </button>
            <button
              onClick={() => setIsMapOpen(true)}
              className="bg-[#FCA311] hover:bg-[#ff6700] text-white py-2 px-4 rounded transition duration-200"
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
