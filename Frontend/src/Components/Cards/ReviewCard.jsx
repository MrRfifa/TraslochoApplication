import { useState } from "react";
import StarRating from "../StarRating/StarRating";
import PropTypes from "prop-types";
import { FaRegTrashCan } from "react-icons/fa6";
import AuthVerifyService from "../../Services/Auth/AuthVerifyService";
import ReviewService from "../../Services/Reviews/ReviewService";
import { errorToast, successToast } from "../Toasts";

const ReviewCard = ({ reviews, onReviewDeleted,isPreview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeComment, setActiveComment] = useState("");
  function formatDate(dateStr) {
    const date = new Date(dateStr);
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

  const statusColors = {
    positive:
      "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-300",
    neutral:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-300",
    negative: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-300",
  };

  const deleteReview = async (reviewId) => {
    try {
      const result = await ReviewService.deleteReview(reviewId);
      if (result.success) {
        successToast(result.message);
        onReviewDeleted(reviewId);
      } else {
        errorToast(result.error);
      }
    } catch (error) {
      errorToast("Failed to delete request. Please try again.");
    }
  };

  return (
    <>
      {reviews.map((review, index) => {
        // Dynamically check if the comment is long for each review
        const isCommentLong = review.comment && review.comment.length > 50;

        return (
          <div
            key={index}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 h-72 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-6">
                <img
                  className="w-12 h-12 rounded-full"
                  src={
                    `data:image/png;base64,${review.fileContentBase64}` ||
                    "https://via.placeholder.com/150"
                  }
                  alt={`${index}'s profile`}
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                    {review.firstName + " " + review.lastName ||
                      "Unknown Owner"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review #{index + 1}
                  </p>
                </div>
                {parseInt(AuthVerifyService.getUserId()) ===
                  reviews[index].ownerId && isPreview && (
                  <FaRegTrashCan
                    color="red"
                    size={25}
                    className="hover:scale-110 cursor-pointer"
                    onClick={() => deleteReview(review.id)}
                  />
                )}
              </div>
              <div className="mt-4">
                <StarRating rating={review.rating} />
                <span
                  className={`text-sm font-medium p-1 rounded ${
                    statusColors[review.sentiment] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {review.sentiment || "N/A"}
                </span>
                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                  {review.comment || "No comment"}
                </p>
                {isCommentLong && (
                  <button
                    onClick={() => {
                      setActiveComment(review.comment);
                      setIsModalOpen(true);
                    }}
                    className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Continue Reading
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(review.reviewTime) || "Unknown Date"}
              </span>
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800 max-w-lg w-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Full Review
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {activeComment}
              </p>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ReviewCard.propTypes = {
  reviews: PropTypes.array.isRequired,
  onReviewDeleted: PropTypes.func.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default ReviewCard;
