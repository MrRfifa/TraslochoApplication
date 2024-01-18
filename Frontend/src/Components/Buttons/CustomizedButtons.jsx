import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const LabelDestinationLinkButton = ({ label, destination }) => {
  return (
    <Link
      to={destination}
      className={
        "bg-[#FCA311] text-white font-semibold px-3 py-2 rounded duration-500 md:static hover:scale-110"
      }
    >
      {label}
    </Link>
  );
};

LabelDestinationLinkButton.propTypes = {
  label: PropTypes.any.isRequired,
  destination: PropTypes.string.isRequired,
};
