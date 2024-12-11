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
  Brush,
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
            <Brush dataKey="name" height={30} stroke="#FCA311" />
            <Bar dataKey="shipments" fill="#FCA311" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};

BarChartComponent.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
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
            <Brush dataKey="name" height={30} stroke="#FCA311" />
            <Line type="monotone" dataKey="shipments" stroke="#FCA311" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};

LineChartComponent.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

// Define a color palette mapping for different charts
const CHART_COLORS = {
  "shipment status": ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
  Sentiments: ["#FF9F40", "#042a78", "#0fa6a1", "#4CAF50", "#9c0b9e"],
  // Add more titles and palettes as needed
};

// Pie Chart Component
const PieChartComponent = ({ data, title }) => {
  // Get the colors for the specific chart based on the title
  const colors = CHART_COLORS[title] || ["#CCCCCC"]; // Default to gray if no palette is found

  return (
    <div className={CardStyle}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]} // Cycle through the chart-specific palette
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
