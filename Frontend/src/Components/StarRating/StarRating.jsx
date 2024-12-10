import PropTypes from "prop-types";
// StarRating Component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating); // Count full stars
  const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star
  const stars = [];

  // Create full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className="text-yellow-500">
        &#9733;
      </span>
    ); // Filled star
  }

  // Create half star if applicable
  if (hasHalfStar) {
    stars.push(
      <span key={fullStars} className="text-yellow-500">
        &#9734;
      </span>
    ); // Half star (or use a different symbol for half star)
  }

  // Fill remaining stars up to 5
  for (let i = stars.length; i < 5; i++) {
    stars.push(
      <span key={i} className="text-gray-300">
        &#9734;
      </span>
    ); // Empty star
  }

  return <div>{stars}</div>;
};

export default StarRating;

StarRating.propTypes = {
  rating: PropTypes.any.isRequired,
};
