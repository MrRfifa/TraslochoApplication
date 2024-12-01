import PropTypes from "prop-types";

const TooltipButton = ({ icon, text }) => {
  return (
    <div className="relative group">
      <button className="text-white bg-blue-400 hover:scale-105 hover:bg-blue-600 px-4 py-2 rounded-full transition duration-200">
        {icon}
      </button>
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-[#14213D] text-white text-sm py-1 px-3 rounded">
        {text}
      </span>
    </div>
  );
};

TooltipButton.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
};

export default TooltipButton;
