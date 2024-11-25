import PropTypes from "prop-types";

const DetailRow = ({ label, value }) => (
  <div className="mb-2 flex flex-row justify-between items-center">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
};

export default DetailRow;
