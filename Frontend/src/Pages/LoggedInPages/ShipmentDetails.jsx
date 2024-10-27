import { useState } from "react";
import { useParams } from "react-router-dom";
import ResponsiveTable from "../../Components/ResponsiveTable";

// Placeholder images for the gallery
const placeholderImages = [
  "https://via.placeholder.com/400x300?text=Image+1",
  "https://via.placeholder.com/400x300?text=image+11",
  "https://via.placeholder.com/400x300?text=Image+3",
];

const ShipmentDetails = () => {
  const { shipmentId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Placeholder data for shipment attributes
  const shipmentData = {
    id: shipmentId,
    type: "Furniture",
    status: "In Transit",
    date: "2024-10-01",
    price: "$150",
    distance: "20 miles",
    origin: "Via A.Qwerty 1 Yuiop AS",
    destination: "Via D.Fghjkl Zxcvb NM",
    description:
      "This shipment contains various furniture items including chairs, tables, and cabinets.",
  };

  const sampleData = [
    {
      id: "1",
      status: "Accepted",
      reviews: 3,
      firstname: "Firstname 1",
      lastname: "Lastname 1",
      vehicle: "Peugeot Boxer 2014",
    },
    {
      id: "2",
      status: "Refused",
      reviews: 2,
      firstname: "Firstname 2",
      lastname: "Lastname 2",
      vehicle: "Peugeot Boxer 2014",
    },
    {
      id: "3",
      status: "Refused",
      reviews: 5,
      firstname: "Firstname 3",
      lastname: "Lastname 3",
      vehicle: "Peugeot Boxer 2014",
    },
  ];

  // Functions to navigate through images
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === placeholderImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? placeholderImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="p-5 md:ml-64 ml-0 grid grid-rows-2 gap-2">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col space-y-5 mt-5 md:mt-0">
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-gray-700">{shipmentData.description}</p>
          </div>
          <div className="relative mb-4">
            <img
              src={placeholderImages[currentImageIndex]}
              alt="Primary Shipment Image"
              className="rounded-lg shadow-lg w-full h-auto"
            />
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-200 transition duration-200"
            >
              &#10094; {/* Left arrow */}
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 hover:bg-gray-200 transition duration-200"
            >
              &#10095; {/* Right arrow */}
            </button>
            <div className="flex space-x-2 mt-2">
              {placeholderImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Shipment thumbnail ${index + 1}`}
                  className={`rounded-lg shadow-md cursor-pointer h-16 w-24 object-cover ${
                    currentImageIndex === index
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Shipment Attributes and Description */}
        <div className="bg-white rounded-lg p-5 flex flex-col justify-between">
          <div>
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
              <div className="flex justify-between items-center p-4 border-b border-gray-300">
                <span className="font-semibold">Origin address:</span>
                <span className="text-gray-700">{shipmentData.origin}</span>
              </div>
              <div className="flex justify-between items-center p-4 border-b border-gray-300">
                <span className="font-semibold">Destination address:</span>
                <span className="text-gray-700">
                  {shipmentData.destination}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex justify-between mt-0">
            <button className="bg-[#FCA311] hover:bg-[#ff6700] text-white py-2 px-4 rounded transition duration-200">
              Update Shipment Date
            </button>
          </div>
        </div>
      </div>
      {/* Second Row */}
      <div className="h-96">
        <ResponsiveTable areShipments={false} data={sampleData} />
      </div>
    </div>
  );
};

export default ShipmentDetails;
