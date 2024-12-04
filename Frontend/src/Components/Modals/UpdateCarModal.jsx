import Modal from "react-modal";
import PropTypes from "prop-types";
import UpdateCarForm from "../Forms/Cars/UpdateCarForm";

const UpdateCarModal = ({ isOpen, onClose, currentVehicle }) => {
  return (
    <Modal
      className="ml-0 md:ml-96"
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
      <UpdateCarForm currentVehicle={currentVehicle} />
    </Modal>
  );
};
UpdateCarModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Whether the modal is open
  onClose: PropTypes.func.isRequired, // Function to close the modal
  currentVehicle: PropTypes.object.isRequired, // Shipment ID for updating
};
export default UpdateCarModal;
