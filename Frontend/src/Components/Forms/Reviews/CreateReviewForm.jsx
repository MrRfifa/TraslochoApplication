import { useState } from "react";
import { errorToast, successToast } from "../../Toasts";
import ReviewService from "../../../Services/Reviews/ReviewService";
import PropTypes from "prop-types";
import StarRatingInput from "../../StarRating/StarRatingInput";

const CreateReviewForm = ({ ownerId, transporterId, onReviewCreated }) => {
  // Pass a function to handle the new review
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await ReviewService.createReview(
      ownerId,
      transporterId,
      parseInt(rating),
      comment
    );

    if (result.success) {
      successToast(result.message);
      onReviewCreated();
      setComment("");
      setRating(0);
    } else {
      errorToast(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="p-4 mb-6 text-sm text-white bg-yellow-500 rounded-md">
        <span className="font-bold">Note:</span> Make sure to double-check you
        have a commune shipment between you and this transporter. Else it would
        be deleted automatically.
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Create review
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Comment */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="2"
            placeholder="Enter comment"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Rating */}
        <StarRatingInput rating={rating} setRating={setRating} />

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 focus:ring focus:ring-yellow-500"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create review"}
          </button>
        </div>
      </form>
    </div>
  );
};

CreateReviewForm.propTypes = {
  ownerId: PropTypes.number.isRequired,
  transporterId: PropTypes.number.isRequired,
  onReviewCreated: PropTypes.func.isRequired, // New prop for the parent to handle the created review
};

export default CreateReviewForm;
