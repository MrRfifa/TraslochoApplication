import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ShipmentService from "../../Services/Shipments/ShipmentService";
import helperFunctions from "../../Helpers/helperFunctions";
import AddAddressesForm from "../../Components/Forms/Shipments/AddAddressesForm";

const CompleteShipmentDetails = () => {
  const { shipmentId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentShipment, setCurrentShipment] = useState();
  const [currentShipmentImages, setCurrentShipmentImages] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  const thumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      setLoading(true); // Start loading
      try {
        const [responseShipment, responseImages] = await Promise.all([
          ShipmentService.getShipmentById(shipmentId),
          ShipmentService.getShipmentImagesById(shipmentId),
        ]);
        setCurrentShipment(responseShipment.message);
        setCurrentShipmentImages(responseImages.message.data);
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
        price: "0 €",
        distance: "0 Km",
        origin: "",
        destination: "",
        description: currentShipment.description,
      }
    : {};

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

  return (
    <div className="md:ml-64 ml-0 grid grid-rows-2 gap-2 -space-y-10">
      {/* First Row */}
      <div className="grid grid-cols-1 ml-2 md:grid-cols-2 gap-2 mt-10">
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
        </div>
        {/* Right Column */}
        <div className="bg-white rounded-lg p-5 flex flex-col justify-start">
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
            <div className="flex flex-col items-start p-4 space-y-2 border-b border-gray-300">
              <span className="font-semibold">Description:</span>
              <span className="text-gray-700">{shipmentData.description}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Second row */}
      <div>
        <AddAddressesForm shipmentId={shipmentId} />
      </div>
    </div>
  );
};

export default CompleteShipmentDetails;
