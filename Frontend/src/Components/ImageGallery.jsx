import { useRef, useState } from "react";
import PropTypes from "prop-types";

const ImageGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const thumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
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
  return (
    <div className="relative mb-4">
      <img
        //TODO: Refix images src
        src={`data:image/png;base64,${images[currentImageIndex]}`}
        // src={`${images[currentImageIndex]}`}
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
        {images.map((img, index) => (
          <img
            key={index}
            ref={(el) => (thumbnailRefs.current[index] = el)}
            //TODO: also here fix images
            // src={`${img}`}
            src={`data:image/png;base64,${img}`}
            alt={`Shipment thumbnail ${index + 1}`}
            className={`rounded-lg shadow-md cursor-pointer h-16 w-24 object-cover ${
              currentImageIndex === index ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => {
              setCurrentImageIndex(index);
              scrollToThumbnail(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};
ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
};

export default ImageGallery;
