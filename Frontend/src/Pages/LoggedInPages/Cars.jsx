import React from "react";

const Car = () => {
  const carDetails = {
    manufacture: "Toyota",
    model: "Camry",
    year: 2021,
    color: "Blue",
    vehicleType: "Sedan",
    length: 4.87, // in meters
    height: 1.45, // in meters
    isAvailable: true,
    vehicleImages: [
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg",
    ],
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 ml-0 md:ml-64">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 md:mt-0">
        {/* Vehicle Characteristics */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:col-span-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {carDetails.manufacture} {carDetails.model}
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between text-gray-700">
              <span>Year:</span>
              <span className="font-medium">{carDetails.year}</span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>Color:</span>
              <span className="font-medium">{carDetails.color}</span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>Type:</span>
              <span className="font-medium">{carDetails.vehicleType}</span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>Dimensions:</span>
              <span className="font-medium">
                {carDetails.length}m (L) x {carDetails.height}m (H)
              </span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>Availability:</span>
              <span
                className={`font-medium ${
                  carDetails.isAvailable ? "text-green-500" : "text-red-500"
                }`}
              >
                {carDetails.isAvailable ? "Available" : "Not Available"}
              </span>
            </li>
          </ul>
        </div>

        {/* Vehicle Image Gallery */}
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {carDetails.vehicleImages.map((image, index) => (
            <div key={index} className="grid gap-4">
              <div>
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={image}
                  alt={`Car Image ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Car;
