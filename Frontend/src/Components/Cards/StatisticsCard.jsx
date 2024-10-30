import PropTypes from "prop-types";

const StatisticsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="flex items-center p-3 sm:p-4 space-x-3 sm:space-x-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300">
      <div className={`p-3 sm:p-4 rounded-full ${color} bg-opacity-25`}>
        <Icon size={20} className={`${color}`} />
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
          {title}
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatisticsCard;

StatisticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
};
