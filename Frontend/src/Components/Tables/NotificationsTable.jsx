import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa6";

const NotificationsTable = ({ data }) => {
  const tableAttributes = ["Index", "Content", "Date", "Actions"];
  return (
    <div className="container mx-auto p-4">
      {/* Table for large screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {tableAttributes.map((key) => (
                <th
                  key={key}
                  className="text-left p-4 font-semibold text-gray-700 cursor-pointer"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-4 text-gray-600">{index + 1}</td>
                <td className="p-4 text-gray-600">{item.content}</td>
                <td className="p-4 text-gray-600">
                  {new Date(item.dateSent).toLocaleString()}
                </td>
                <td className="p-4">
                  <button className="text-white bg-green-400 hover:scale-105 hover:bg-green-600 px-4 py-2 rounded-full transition duration-200">
                    <FaCheck />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden grid gap-4 mt-14">
        {data.map((item, index) => (
          <div
            key={index}
            className={`shadow-md rounded-lg p-4 border border-gray-200 ${
              item.isRead ? "bg-white " : "bg-[#FCA311]"
            }`}
          >
            <div
              key={item.key}
              className="mb-2 flex justify-between items-center"
            >
              <span className="font-semibold text-gray-100">Index:</span>
              <span>{index + 1}</span>
            </div>
            <div
              key={item.key}
              className="mb-2 flex justify-between items-center"
            >
              <span className="font-semibold text-gray-100">Content:</span>
              <span>{item.content}</span>
            </div>
            <div
              key={item.key}
              className="mb-2 flex justify-between items-center"
            >
              <span className="font-semibold text-gray-100">Date:</span>
              <span>{new Date(item.dateSent).toLocaleString()}</span>
            </div>
            <div className="mt-3 text-center">
              <button className="text-white bg-green-400 hover:scale-105 hover:bg-green-600 px-4 py-2 rounded-full transition duration-200">
                <FaCheck />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
NotificationsTable.propTypes = {
  data: PropTypes.array.isRequired,
};
export default NotificationsTable;
