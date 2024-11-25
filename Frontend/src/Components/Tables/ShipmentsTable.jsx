import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import StarRating from "../StarRating";
import { FaCheck } from "react-icons/fa6";
import helperFunctions from "../../Helpers/helperFunctions";
import DetailRow from "../DetailRow";

const ShipmentsTable = ({
  data,
  areShipments,
  labelActionButton,
  missingData,
}) => {
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
                  {key === "actions"
                    ? "Actions"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
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
                    <td className="p-4 text-gray-600">{index + 1}</td>
                    <td className="p-4 text-gray-600">
                      {helperFunctions.convertType(item.shipmentType)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {helperFunctions.convertStatus(item.shipmentStatus)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {helperFunctions.formatDate(item.shipmentDate)}
                    </td>
                    <td className="p-4 text-gray-600">${item.price}</td>
                    <td className="p-4 text-gray-600">
                      {item.distanceBetweenAddresses} km
                    </td>
                    <td className="p-4">
                      {!missingData ? (
                        <Link to={`/details/${item.id}`}>
                          <button
                            //   onClick={() => handleViewDetails(item.id)}
                            className="text-white bg-[#FCA311] hover:scale-105 hover:bg-[#ff6700] px-4 py-2 rounded-full transition duration-200"
                          >
                            {labelActionButton}
                          </button>
                        </Link>
                      ) : (
                        <Link to={`/complete-details/${item.id}`}>
                          <button
                            //   onClick={() => handleViewDetails(item.id)}
                            className="text-white bg-[#FCA311] hover:scale-105 hover:bg-[#ff6700] px-4 py-2 rounded-full transition duration-200"
                          >
                            {labelActionButton}
                          </button>
                        </Link>
                      )}
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
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <div key={index} className="mb-2 flex flex-col justify-around">
              {areShipments ? (
                <>
                  <DetailRow
                    label="Type"
                    value={helperFunctions.convertType(item.shipmentType)}
                  />
                  <DetailRow
                    label="Status"
                    value={helperFunctions.convertStatus(item.shipmentStatus)}
                  />
                  <DetailRow
                    label="Date"
                    value={helperFunctions.formatDate(item.shipmentDate)}
                  />
                  <DetailRow label="Price" value={item.price} />
                  <DetailRow
                    label="Distance"
                    value={`${item.distanceBetweenAddresses} km`}
                  />
                </>
              ) : (
                <>
                  <DetailRow label="Status" value={item.status} />
                  <DetailRow
                    label="Reviews"
                    value={<StarRating rating={item.reviews} />}
                  />
                  <DetailRow label="Firstname" value={item.firstname} />
                  <DetailRow label="Lastname" value={item.lastname} />
                  <DetailRow label="Vehicle" value={item.vehicle} />
                </>
              )}
            </div>
            {/* button */}
            <div className="mt-3 text-center">
              {areShipments ? (
                !missingData ? (
                  <Link to={`/details/${item.id}`}>
                    <button className="text-white bg-[#FCA311] hover:scale-105 hover:bg-[#ff6700] px-4 py-2 rounded-full transition duration-200">
                      {labelActionButton}
                    </button>
                  </Link>
                ) : (
                  <Link to={`/complete-details/${item.id}`}>
                    <button className="text-white bg-[#FCA311] hover:scale-105 hover:bg-[#ff6700] px-4 py-2 rounded-full transition duration-200">
                      {labelActionButton}
                    </button>
                  </Link>
                )
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
  labelActionButton: PropTypes.string.isRequired,
  missingData: PropTypes.bool.isRequired,
};
export default ShipmentsTable;
