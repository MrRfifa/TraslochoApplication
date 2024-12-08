import PropTypes from "prop-types";
import StarRating from "../StarRating";
import DetailRow from "../DetailRow";

const ReviewsTable = ({ reviews }) => {
  //TODO add very positive and very negative
  const statusColors = {
    neutral:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    positive:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  function formatDate(dateStr) {
    const date = new Date(dateStr);

    // Format the date using Intl.DateTimeFormat
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return (
    <div className="container mx-auto p-4">
      {/* Table for large screens */}
      <table className="hidden md:table w-full bg-white shadow-md rounded-lg border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Index</th>
            <th className="py-3 px-4 text-left">Rating</th>
            <th className="py-3 px-4 text-left">Comment</th>
            <th className="py-3 px-4 text-left">Time</th>
            <th className="py-3 px-4 text-left">Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-600">{index + 1}</td>
              <td className="py-3 px-4 text-gray-600">
                <StarRating rating={item.rating} />
              </td>
              <td className="py-3 px-4 text-gray-600">
                {item.comment || "No comment"}
              </td>
              <td className="py-3 px-4 text-gray-600">
                {formatDate(item.reviewTime) || "Unknown"}
              </td>
              <td className="py-3 px-4 text-gray-600">
                <span
                  className={`text-sm font-medium me-2 p-2 rounded ${
                    statusColors[item.sentiment] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.sentiment || "N/A"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cards for small screens */}
      <div className="md:hidden grid gap-4">
        {reviews.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <div className="flex flex-col gap-2">
              <DetailRow label="Index" value={index + 1} isTable={false} />
              <DetailRow
                label="Rating"
                value={<StarRating rating={item.ratings} />}
                isTable={false}
              />
              <DetailRow
                label="Comment"
                value={item.comment || "No comment"}
                isTable={false}
              />
              <DetailRow
                label="Time"
                value={item.time || "Unknown"}
                isTable={false}
              />
              <div className="flex justify-between items-center p-4 border-b border-gray-300 text-black">
                <span className="font-semibold">Sentiment:</span>
                <span
                  className={`text-sm font-medium me-2 rounded p-2 ${
                    statusColors[item.sentiment] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>
              {/* <DetailRow
                label="Sentiment"
                value={item.sentiment || "N/A"}
                isTable={false}
              /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ReviewsTable.propTypes = {
  reviews: PropTypes.array.isRequired,
};

export default ReviewsTable;
