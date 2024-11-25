import { useState } from "react";
import ShipmentService from "../../../Services/Shipments/ShipmentService";
import { errorToast, successToast } from "../../Toasts";

const CreateShipmentForm = () => {
  const [shipmentType, setShipmentType] = useState("Throwing");
  const [shipmentDate, setShipmentDate] = useState("");
  const [description, setDescription] = useState("");
  const [shipmentImages, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //   const [submissionResult, setSubmissionResult] = useState(null);
  //TODO fix styling and colors, everything goes fine
  // Disable dates before today
  const today = new Date().toISOString().split("T")[0];

  const handleImageUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const newImages = uploadedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Create a preview URL for the image
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);

    // Simulate progress for file upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Prepare FormData
    const fd = new FormData();
    fd.append("ShipmentType", shipmentType);
    fd.append("ShipmentDate", shipmentDate);
    fd.append("Description", description);
    shipmentImages.forEach((image) => {
      fd.append(`ShipmentImages`, image); // Append each image file
    });
    setIsSubmitting(true);
    const result = await ShipmentService.createShipment(fd);

    if (result.success) {
      successToast(result.message);
      setDescription("");
      setShipmentDate("");
      setShipmentType("Throwing");
      setImages([]);
    } else {
      errorToast(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-2 bg-white rounded-lg shadow-sm">
      <div
        className="p-4 mb-4 text-sm text-white rounded-lg bg-[#FCA311] dark:bg-gray-800 dark:text-yellow-300"
        role="alert"
      >
        <span className="font-medium">Warning!</span> After creating a shipment
        u have to complete its data in the next section.
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipment Type Selector */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Shipment Type
          </label>
          <select
            value={shipmentType}
            onChange={(e) => setShipmentType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Throwing">Throwing</option>
            <option value="Transporting">Transporting</option>
          </select>
        </div>

        {/* Date and Time Picker */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Date and Time
          </label>
          <input
            type="datetime-local"
            value={shipmentDate}
            onChange={(e) => setShipmentDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={`${today}T00:00`}
            required
          />
        </div>

        {/* Description Text Area */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Enter shipment description here..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Images Uploader */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Images
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#FCA311] file:text-blue-700 hover:file:bg-blue-100"
              multiple
            />
          </div>

          {/* Upload Progress */}
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

          {/* Preview of Uploaded Images */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {shipmentImages.map((image, index) => (
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
        </div>

        {/* Submit Button */}
        <button
          disabled={isSubmitting}
          type="submit"
          className={`w-full bg-[#FCA311] text-white py-2 px-4 rounded-lg hover:bg-yellow-500 transition duration-200  ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Create Shipment"}
        </button>
        {/* Submission Result */}
      </form>
    </div>
  );
};

export default CreateShipmentForm;
