import PropTypes from "prop-types";

const DetailRow = ({ label, value, isTable }) => {
  return (
    <div
      className={`flex justify-between items-center ${
        isTable
          ? "mb-2 flex-row text-gray-700"
          : "p-4 border-b border-gray-300 text-gray-600"
      }`}
    >
      <span className={`font-semibold ${isTable ? "" : "text-black"}`}>
        {label}:
      </span>
      <span>{value}</span>
    </div>
  );
};

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  isTable: PropTypes.bool.isRequired,
};

export default DetailRow;
