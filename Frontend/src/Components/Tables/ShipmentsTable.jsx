import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import StarRating from "../StarRating";
import { FaCheck } from "react-icons/fa6";
import { IoPersonCircle } from "react-icons/io5";
import helperFunctions from "../../Helpers/helperFunctions";
import DetailRow from "../DetailRow";
import TooltipButton from "../Buttons/TooltipButton";
import { useState } from "react";
import RequestService from "../../Services/Requests/RequestService";
import { errorToast, successToast } from "../Toasts";
import LoadingSpin from "../LoadingSpin";

const ShipmentsTable = ({
  data,
  areShipments,
  arePendingStatus,
  labelActionButton,
  missingData,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const statusColors = {
    0: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    2: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const acceptRequest = async (requestId) => {
    setLoading(true); // Start loading immediately
    try {
      const result = await RequestService.acceptRequest(requestId);

      if (result.success) {
        successToast(result.message); // Show success message
        window.location.reload();
      } else {
        errorToast(
          result.error || "An error occurred while processing your request."
        ); // Handle generic fallback
      }
    } catch (error) {
      errorToast("Failed to create request. Please try again."); // Show a generic error toast
    } finally {
      setLoading(false); // Always stop loading
    }
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
        "Type",
        "actions",
      ];
  if (loading) {
    return <LoadingSpin />;
  }
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
                    <td className="p-4 text-gray-600">{index + 1}</td>
                    <td className="p-4 text-gray-600">
                      <span
                        className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded ${
                          statusColors[item.status] ||
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {helperFunctions.convertRequestStatus(item.status)}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      <StarRating rating={item.ratings} />
                    </td>
                    <td className="p-4 text-gray-600">{item.firstname}</td>
                    <td className="p-4 text-gray-600">{item.lastname}</td>
                    <td className="p-4 text-gray-600">{item.vehicle}</td>
                    <td className="p-4 text-gray-600">{item.vehicleType}</td>
                    <td className="p-4 flex flex-row space-x-2">
                      {arePendingStatus && (
                        <TooltipButton
                          text="Accept request"
                          icon={<FaCheck />}
                          color="green"
                          onClickFunc={() => acceptRequest(item.requestId)}
                        />
                      )}
                      <TooltipButton
                        text="View Profile"
                        icon={<IoPersonCircle />}
                        color="yellow"
                        onClickFunc={() =>
                          navigate(`/transporter-profile/${item.transporterId}`)
                        }
                      />
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
                    isTable={true}
                    label="Type"
                    value={helperFunctions.convertType(item.shipmentType)}
                  />
                  <DetailRow
                    isTable={true}
                    label="Status"
                    value={helperFunctions.convertStatus(item.shipmentStatus)}
                  />
                  <DetailRow
                    isTable={true}
                    label="Date"
                    value={helperFunctions.formatDate(item.shipmentDate)}
                  />
                  <DetailRow isTable={true} label="Price" value={item.price} />
                  <DetailRow
                    isTable={true}
                    label="Distance"
                    value={`${item.distanceBetweenAddresses} km`}
                  />
                </>
              ) : (
                <>
                  <div
                    className={
                      "flex justify-between items-center mb-2 flex-row text-gray-700"
                    }
                  >
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded ${
                        statusColors[item.status] ||
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {helperFunctions.convertRequestStatus(item.status)}
                    </span>
                  </div>
                  <DetailRow
                    isTable={true}
                    label="Reviews"
                    value={<StarRating rating={item.ratings} />}
                  />
                  <DetailRow
                    isTable={true}
                    label="Firstname"
                    value={item.firstname}
                  />
                  <DetailRow
                    isTable={true}
                    label="Lastname"
                    value={item.lastname}
                  />
                  <DetailRow
                    isTable={true}
                    label="Vehicle"
                    value={item.vehicle}
                  />
                  <DetailRow
                    isTable={true}
                    label="Type"
                    value={item.vehicleType}
                  />
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
                <>
                  {arePendingStatus && (
                    <TooltipButton
                      text="Accept request"
                      icon={<FaCheck />}
                      color="green"
                      onClickFunc={() => acceptRequest(item.requestId)}
                    />
                  )}
                  <TooltipButton
                    text="View Profile"
                    icon={<IoPersonCircle />}
                    color="yellow"
                    onClickFunc={() =>
                      navigate(`/transporter-profile/${item.transporterId}`)
                    }
                  />
                </>
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
  arePendingStatus: PropTypes.bool.isRequired,
  labelActionButton: PropTypes.string.isRequired,
  missingData: PropTypes.bool.isRequired,
};
export default ShipmentsTable;
