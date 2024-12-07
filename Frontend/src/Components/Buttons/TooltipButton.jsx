import PropTypes from "prop-types";

const TooltipButton = ({ icon, text, color,onClickFunc }) => {
  return (
    <div className="relative group">
      <button
      onClick={onClickFunc}
        className={`text-white bg-${color}-400 hover:scale-105 hover:bg-${color}-600 px-4 py-2 rounded-full transition duration-200`}
      >
        {icon}
      </button>
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-[#E5E5E5] text-[#14213D] text-sm py-1 px-3 rounded">
        {text}
      </span>
    </div>
  );
};

TooltipButton.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClickFunc: PropTypes.func.isRequired,
  icon: PropTypes.any.isRequired,
};

export default TooltipButton;
