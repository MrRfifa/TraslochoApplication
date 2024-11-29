import Modal from "react-modal";
import PropTypes from "prop-types";
import ShipmentService from "../../Services/Shipments/ShipmentService";
import { errorToast, successToast } from "../Toasts";
import { useState } from "react";

const CancelShipmentModal = ({ isOpen, onClose, shipmentId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    setIsSubmitting(true);
    const response = await ShipmentService.cancelShipment(shipmentId);
    if (response.success) {
      successToast(response.message);
      // Reload the current page
      window.location.reload();
    } else {
      errorToast(response.error);
    }
    console.log(response); // Replace this with actual cancellation logic (e.g., API call)
    setIsSubmitting(false);
    onClose(); // Close the modal after handling
  };

  return (
    <Modal
      className="ml-0 md:ml-96 mt-10 bg-white"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Cancel Shipment Modal"
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
      <h1 className="text-2xl font-bold mb-4">Cancel Shipment</h1>
      <p className="text-lg mb-8">
        Are you sure you want to cancel this shipment?
      </p>
      <div className="flex justify-end gap-4">
        <button
          disabled={isSubmitting}
          className="text-white border p-2 rounded-lg bg-red-600 hover:bg-red-700"
          onClick={handleCancel}
        >
          {isSubmitting ? "Canceling..." : "Yes, Cancel"}
        </button>
        <button
          className="text-white border p-2 rounded-lg bg-gray-600 hover:bg-gray-700"
          onClick={onClose}
        >
          No, keep it
        </button>
      </div>
    </Modal>
  );
};

CancelShipmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Whether the modal is open
  onClose: PropTypes.func.isRequired, // Function to close the modal
  shipmentId: PropTypes.number.isRequired, // Function to close the modal
};

export default CancelShipmentModal;
