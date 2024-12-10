import Modal from "react-modal";
import PropTypes from "prop-types";
import CreateReviewForm from "../Forms/Reviews/CreateReviewForm";

const CreateReviewModal = ({
  isOpen,
  onClose,
  ownerId,
  transporterId,
  onReviewCreated,
}) => {
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
      <CreateReviewForm
        ownerId={ownerId}
        transporterId={transporterId}
        onReviewCreated={onReviewCreated}
      />
    </Modal>
  );
};
CreateReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Whether the modal is open
  onClose: PropTypes.func.isRequired, // Function to close the modal
  onReviewCreated: PropTypes.func.isRequired,
  ownerId: PropTypes.number.isRequired,
  transporterId: PropTypes.number.isRequired,
};
export default CreateReviewModal;
