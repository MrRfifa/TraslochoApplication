import { useState } from "react";
import ShipmentService from "../../../Services/Shipments/ShipmentService";
import PropTypes from "prop-types";
import { errorToast, successToast } from "../../Toasts";
import { useNavigate } from "react-router-dom";

const AddAddressesForm = ({ shipmentId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [originAddress, setOriginAddress] = useState({
    Street: "",
    City: "",
    State: "",
    PostalCode: "",
    Country: "",
  });

  const [destinationAddress, setDestinationAddress] = useState({
    Street: "",
    City: "",
    State: "",
    PostalCode: "",
    Country: "",
  });

  // Generalized input change handler
  const handleInputChange = (event, setAddress) => {
    const { name, value } = event.target;
    setAddress((prevState) => ({ ...prevState, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Create FormData
    const formData = new FormData();
    // Add DestinationAddress fields
    formData.append("DestinationAddress.City", destinationAddress.city);
    formData.append("DestinationAddress.Country", destinationAddress.country);
    formData.append(
      "DestinationAddress.PostalCode",
      destinationAddress.postalCode
    );
    formData.append("DestinationAddress.State", destinationAddress.state);
    formData.append("DestinationAddress.Street", destinationAddress.street);
    // Add OriginAddress fields
    formData.append("OriginAddress.City", originAddress.city);
    formData.append("OriginAddress.Country", originAddress.country);
    formData.append("OriginAddress.PostalCode", originAddress.postalCode);
    formData.append("OriginAddress.State", originAddress.state);
    formData.append("OriginAddress.Street", originAddress.street);

    const result = await ShipmentService.addAddresses(
      parseInt(shipmentId),
      formData
    );

    if (result.success) {
      successToast(result.message);
      setTimeout(() => {
        navigate(`/details/${shipmentId}`);
      }, 2000);
    } else {
      errorToast(result.error);
    }
    setLoading(false);
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
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Origin Address */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Origin Address</h2>
          {["country", "state", "city", "postalCode", "street"].map((field) => (
            <div key={field} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)} *
              </label>
              <input
                type="text"
                name={field}
                value={originAddress[field]}
                onChange={(e) => handleInputChange(e, setOriginAddress)}
                required
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
        </div>

        {/* Destination Address */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Destination Address</h2>
          {["country", "state", "city", "postalCode", "street"].map((field) => (
            <div key={field} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)} *
              </label>
              <input
                type="text"
                name={field}
                value={destinationAddress[field]}
                onChange={(e) => handleInputChange(e, setDestinationAddress)}
                required
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="col-span-1 lg:col-span-2 bg-[#FCA311] text-white py-2 px-4 rounded-md shadow hover:bg-yellow-500 transition"
        >
          {loading ? "Loading...." : "Submit Addresses"}
        </button>
      </form>
    </div>
  );
};
AddAddressesForm.propTypes = {
  shipmentId: PropTypes.string.isRequired,
};
export default AddAddressesForm;
