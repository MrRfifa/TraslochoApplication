import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const LabelDestinationLinkButton = ({ label, destination }) => {
  return (
    <Link
      to={destination}
      className={
        "bg-[#FCA311] text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static hover:scale-110"
      }
    >
      {label}
    </Link>
  );
};

LabelDestinationLinkButton.propTypes = {
  label: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
};
