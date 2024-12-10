import PropTypes from "prop-types";

const StarRatingInput = ({ rating, setRating }) => {
  const handleRatingClick = (index) => {
    setRating(index + 1);
  };

  return (
    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Rating</label>
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={index < rating ? "#fbbf24" : "#d1d5db"} // Yellow for selected, Gray for unselected
            onClick={() => handleRatingClick(index)}
            className="w-8 h-8 cursor-pointer transition-colors duration-200 hover:fill-yellow-400"
          >
            <path d="M12 .587l3.668 7.429 8.205 1.193-5.937 5.789 1.4 8.166L12 18.896l-7.336 3.868 1.4-8.166L.127 9.209l8.205-1.193L12 .587z" />
          </svg>
        ))}
      </div>
      <span className="text-gray-500 mt-1">
        Selected Rating: {rating} stars
      </span>
    </div>
  );
};
StarRatingInput.propTypes = {
  setRating: PropTypes.func.isRequired,
  rating: PropTypes.number.isRequired,
};
export default StarRatingInput;
