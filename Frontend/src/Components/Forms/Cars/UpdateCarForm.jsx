import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import VehicleService from "../../../Services/Vehicles/VehicleService";
import { errorToast, successToast } from "../../Toasts";

const UpdateCarForm = ({ currentVehicle }) => {
  const [manufacture, setManufacture] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [vehicleType, setVehicleType] = useState("Van");
  const [lengthCar, setLengthCar] = useState("");
  const [heightCar, setHeightCar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial state from currentVehicle
  useEffect(() => {
    if (currentVehicle) {
      setManufacture(currentVehicle.manufacture || "");
      setModel(currentVehicle.model || "");
      setYear(currentVehicle.year || "");
      setColor(currentVehicle.color || "");
      setVehicleType(currentVehicle.vehicleType || "Van");
      setLengthCar(currentVehicle.length || "");
      setHeightCar(currentVehicle.height || "");
    }
  }, [currentVehicle]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fd = new FormData();
    fd.append("Model", model);
    fd.append("Manufacture", manufacture);
    fd.append("Year", year);
    fd.append("Color", color);
    fd.append("VehicleType", vehicleType);
    fd.append("Length", lengthCar);
    fd.append("Height", heightCar);
    setIsSubmitting(true);

    const result = await VehicleService.updateCar(currentVehicle.id, fd);

    if (result.success) {
      successToast(result.message);
      window.location.reload();
    } else {
      errorToast(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="p-4 mb-6 text-sm text-white bg-yellow-500 rounded-md">
        <span className="font-bold">Note:</span> Make sure to double-check your
        information before submitting.
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Update Vehicle Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Manufacture */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Manufacture</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-500"
            value={manufacture}
            onChange={(e) => setManufacture(e.target.value)}
            placeholder="Enter vehicle manufacture"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Model</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-500"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter vehicle model"
          />
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Year</label>
          <input
            type="number"
            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-500"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter manufacturing year"
          />
        </div>

        {/* Color */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Color</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-500"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Enter vehicle color"
          />
        </div>

        {/* Vehicle Type */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Vehicle Type</label>
          <select
            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-500"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
          </select>
        </div>

        {/* Length */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Length</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-500"
            value={lengthCar}
            onChange={(e) => setLengthCar(e.target.value)}
            placeholder="Enter vehicle length"
          />
        </div>

        {/* Height */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Height</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-500"
            value={heightCar}
            onChange={(e) => setHeightCar(e.target.value)}
            placeholder="Enter vehicle height"
          />
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 focus:ring focus:ring-yellow-500"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

UpdateCarForm.propTypes = {
  currentVehicle: PropTypes.object.isRequired,
};

export default UpdateCarForm;
