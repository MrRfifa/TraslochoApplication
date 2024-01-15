import PropTypes from "prop-types";
import { FaComment } from "react-icons/fa6";

const TestCard = ({ email, imageSrc, firstName, lastName, phoneNumber }) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded-md overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src={`data:image/png;base64,${imageSrc}`}
        alt={`${firstName} ${lastName}`}
      />
      <div className="flex flex-row justify-between">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{`${firstName} ${lastName}`}</h2>
          <p className="text-gray-600 mb-2">{email}</p>
          <p className="text-gray-600">{phoneNumber}</p>
        </div>
        <div className="mr-10 my-auto">
          <FaComment
            size={40}
            color="#FCA311"
            className="hover:scale-110 hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default TestCard;

TestCard.propTypes = {
  imageSrc: PropTypes.any.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};
