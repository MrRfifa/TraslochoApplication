import Modal from "react-modal";
import PropTypes from "prop-types";
import { useState } from "react";
import ShipmentService from "../../Services/Shipments/ShipmentService";
import { errorToast, successToast } from "../Toasts";

const UpdateDateModal = ({ isOpen, onClose, shipmentId }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (!selectedDate) {
      errorToast("Please select a valid date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ShipmentService.updateShipmentDate(
        shipmentId,
        selectedDate
      );
      if (response.success) {
        successToast(response.message);
        window.location.reload(); // Reload the current page
      } else {
        errorToast(response.error);
      }
    } catch (error) {
      errorToast("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      onClose(); // Close the modal after handling
    }
  };

  return (
    <Modal
      className="ml-0 md:ml-96 bg-white"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Update Shipment Date Modal"
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
      <h1 className="text-2xl font-bold mb-4">Update Shipment Date</h1>
      <p className="text-lg mb-4">Please select a new date for the shipment:</p>
      <div className="mb-6">
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          disabled={isSubmitting}
          onClick={handleUpdate}
          className={`text-white border p-2 rounded-lg ${
            isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
        <button
          disabled={isSubmitting}
          onClick={onClose}
          className={`text-white border p-2 rounded-lg ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

UpdateDateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Whether the modal is open
  onClose: PropTypes.func.isRequired, // Function to close the modal
  shipmentId: PropTypes.number.isRequired, // Shipment ID for updating
};

export default UpdateDateModal;
