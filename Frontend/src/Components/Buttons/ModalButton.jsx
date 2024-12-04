import { useState } from "react";
import PropTypes from "prop-types";

const ModalButton = ({
  buttonText,
  buttonStyle,
  ModalComponent,
  modalProps,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${buttonStyle} py-2 px-4 mb-5 rounded transition duration-200`}
      >
        {buttonText}
      </button>
      {isOpen && (
        <ModalComponent
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          {...modalProps}
        />
      )}
    </>
  );
};

ModalButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  buttonStyle: PropTypes.any.isRequired,
  ModalComponent: PropTypes.any.isRequired,
  modalProps: PropTypes.any.isRequired,
};

export default ModalButton;
