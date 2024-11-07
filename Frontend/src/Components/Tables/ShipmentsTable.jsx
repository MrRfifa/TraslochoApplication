import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import StarRating from "../StarRating";
import { FaCheck } from "react-icons/fa6";

const ShipmentsTable = ({ data, areShipments }) => {
  //   const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting function
  const sortedData = [...data].sort((a, b) => {
    const { key, direction } = sortConfig;
    const order = direction === "asc" ? 1 : -1;
    if (a[key] < b[key]) return -1 * order;
    if (a[key] > b[key]) return 1 * order;
    return 0;
  });

  // Filtered data based on search
  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Toggle sorting direction
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const tableAttributes = areShipments
    ? ["Index", "type", "status", "date", "price", "distance", "actions"]
    : [
        "Index",
        "status",
        "Reviews",
        "Firstname",
        "Lastname",
        "Vehicle",
        "actions",
      ];

  return (
    <div className="container mx-auto p-4">
      {/* Redesigned Search Bar */}
      {areShipments && (
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 rounded-full shadow-md border border-gray-300 w-full md:w-1/2"
          />
        </div>
      )}

      {/* Table for large screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {tableAttributes.map((key) => (
                <th
                  key={key}
                  className="text-left p-4 font-semibold text-gray-700 cursor-pointer"
                  onClick={() => key !== "actions" && handleSort(key)}
                >
                  {key === "actions"
                    ? "Actions"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig.key === key &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {!areShipments ? (
                  <>
                    <td className="p-4 text-gray-600">{index}</td>
                    <td className="p-4 text-gray-600">{item.status}</td>
                    <td className="p-4 text-gray-600">
                      <StarRating rating={item.reviews} />
                    </td>
                    <td className="p-4 text-gray-600">{item.firstname}</td>
                    <td className="p-4 text-gray-600">{item.lastname}</td>
                    <td className="p-4 text-gray-600">{item.vehicle}</td>
                    <td className="p-4">
                      <button
                        //   onClick={() => handleViewDetails(index)}
                        className="text-white bg-green-400 hover:scale-105 hover:bg-green-600 px-4 py-2 rounded-full transition duration-200"
                      >
                        <FaCheck />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 text-gray-600">{index}</td>
                    <td className="p-4 text-gray-600">{item.type}</td>
                    <td className="p-4 text-gray-600">{item.status}</td>
                    <td className="p-4 text-gray-600">{item.date}</td>
                    <td className="p-4 text-gray-600">${item.price}</td>
                    <td className="p-4 text-gray-600">{item.distance} km</td>
                    <td className="p-4">
                      <Link to={`/details/${item.id}`}>
                        <button
                          //   onClick={() => handleViewDetails(item.id)}
                          className="text-white bg-[#FCA311] hover:scale-105 hover:bg-[#ff6700] px-4 py-2 rounded-full transition duration-200"
                        >
                          View Details
                        </button>
                      </Link>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden grid gap-4">
        {filteredData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="mb-2 flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span className="text-gray-600">
                  {key === "reviews" ? <StarRating rating={value} /> : value}
                </span>
              </div>
            ))}
            <div className="mt-3 text-center">
              {areShipments ? (
                <Link to={`/details/${item.id}`}>
                  <button className="text-white bg-[#FCA311] hover:scale-105 hover:bg-[#ff6700] px-4 py-2 rounded-full transition duration-200">
                    View Details
                  </button>
                </Link>
              ) : (
                <button className="text-white bg-green-400 hover:scale-105 hover:bg-green-600 px-4 py-2 rounded-full transition duration-200">
                  <FaCheck />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
ShipmentsTable.propTypes = {
  data: PropTypes.array.isRequired,
  areShipments: PropTypes.bool.isRequired,
};
export default ShipmentsTable;
