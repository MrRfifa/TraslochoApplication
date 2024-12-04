import { useState } from "react";
import { errorToast, successToast } from "../../Toasts";
import VehicleService from "../../../Services/Vehicles/VehicleService";

const CreateCarForm = () => {
  const [manufacture, setManufacture] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [vehicleType, setVehicleType] = useState("Van");
  const [lengthCar, setLengthCar] = useState("");
  const [heightCar, setHeightCar] = useState("");
  const [vehicleImages, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files); // Convert FileList to Array
    const newImages = uploadedFiles.map((file) => ({
      file, // Store file object
      preview: URL.createObjectURL(file), // Create preview URL for the image
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);

    // Simulate progress for file upload (optional)
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
    fd.append("Model", model);
    fd.append("Manufacture", manufacture);
    fd.append("Year", year);
    fd.append("Color", color);
    fd.append("VehicleType", vehicleType);
    fd.append("Length", lengthCar);
    fd.append("Height", heightCar);
    vehicleImages.forEach(({ file }) => {
      fd.append("VehicleImages", file);
    });
    setIsSubmitting(true);

    const result = await VehicleService.createCar(fd);

    if (result.success) {
      successToast(result.message);
      setColor("");
      setManufacture("");
      setModel("");
      setYear("");
      setHeightCar("");
      setLengthCar("");
      setVehicleType("Van");
      setImages([]);
      window.location.reload();
    } else {
      errorToast(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-10 max-w-2xl mx-auto p-2 bg-white rounded-lg shadow-sm">
      <div
        className="p-4 mb-4 text-sm text-white rounded-lg bg-[#FCA311] dark:bg-gray-800 dark:text-yellow-300"
        role="alert"
      >
        <span className="font-medium">Warning!</span> After adding a car, the
        page will reload!
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Type Selector */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Vehicle Type
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
          </select>
        </div>

        {/* Manufacture */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Manufacture
          </label>
          <input
            type="text"
            value={manufacture}
            placeholder="Tesla, Ford, Mercedes..."
            onChange={(e) => setManufacture(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Model</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Transit, Boxer, Daily..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Year */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Year</label>
          <input
            type="number"
            min={"1995"}
            max={new Date().getFullYear()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2020"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Color */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Color</label>
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="White, black, red..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Length */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Length (m)
          </label>
          <input
            type="number"
            value={lengthCar}
            onChange={(e) => setLengthCar(e.target.value)}
            placeholder="4.5"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Height */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Height (m)
          </label>
          <input
            type="number"
            value={heightCar}
            onChange={(e) => setHeightCar(e.target.value)}
            placeholder="2.5"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
            {vehicleImages.map((image, index) => (
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

export default CreateCarForm;
