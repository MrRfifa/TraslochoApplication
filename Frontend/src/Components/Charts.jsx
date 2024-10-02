import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import PropTypes from "prop-types";

const CardStyle =
  "bg-white shadow-lg rounded-lg p-4 text-center hover:shadow-lg transform hover:scale-105 transition-transform duration-300"; // Common card style

// Common No Data Message
const NoDataMessage = () => (
  <div className="flex justify-center items-center h-full">
    <p className="text-gray-500">No data available</p>
  </div>
);

// Bar Chart Component
const BarChartComponent = ({ data, title }) => {
  return (
    <div className={CardStyle}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="shipments" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};

BarChartComponent.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

// Line Chart Component
const LineChartComponent = ({ data, title }) => {
  return (
    <div className={CardStyle}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};

LineChartComponent.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

// Pie Chart Component
const PieChartComponent = ({ data, title }) => {
  return (
    <div className={CardStyle}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};

PieChartComponent.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

// Grouped Export
export { BarChartComponent, LineChartComponent, PieChartComponent };
