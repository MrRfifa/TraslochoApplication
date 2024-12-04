import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "react-modal";
import VehicleService from "../../Services/Vehicles/VehicleService";
import { errorToast, successToast, warningToast } from "../Toasts";

const UploadCarImages = ({ isOpen, onClose, vehicleId }) => {
  const [newVehicleImages, setNewVehicleImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const newImages = uploadedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewVehicleImages((prevImages) => [...prevImages, ...newImages]);

    // Simulate progress for file upload (optional)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  const handleDeleteImage = (index) => {
    setNewVehicleImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if there are no images uploaded
    if (newVehicleImages.length === 0) {
      warningToast("Please upload at least one image before submitting.");
      return;
    }
    const fd = new FormData();
    newVehicleImages.forEach(({ file }) => {
      fd.append("VehicleImages", file);
    });

    setIsSubmitting(true);

    const result = await VehicleService.updateCarImages(vehicleId, fd);

    if (result.success) {
      successToast(result.message);
      setNewVehicleImages([]);
      onClose();
      window.location.reload();
    } else {
      errorToast(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      className="ml-0 md:ml-96 bg-white"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Update Car images"
      ariaHideApp={false}
      style={{
        content: {
          maxWidth: "800px",
          maxHeight: "600px",
          margin: "auto",
          marginTop: "100px",
          padding: "20px",
        },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <div>
        <div className="p-4 mb-6 text-sm text-white bg-yellow-500 rounded-md">
          <span className="font-bold">Note:</span> Make sure to double-check
          your images before submitting. The older images will be deleted.
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#FCA311] file:text-blue-700 hover:file:bg-blue-100"
            multiple
          />
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-4">
          {newVehicleImages.map((image, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden"
            >
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          type="submit"
          className={`w-full bg-[#FCA311] text-white py-2 px-4 rounded-lg hover:bg-yellow-500 transition duration-200 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Update Images"}
        </button>
      </div>
    </Modal>
  );
};

UploadCarImages.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vehicleId: PropTypes.number.isRequired,
};

export default UploadCarImages;
