import PropTypes from "prop-types";

const UserContact = ({
  selected,
  connected,
  imgSrc,
  firstName,
  lastName,
  handleContactClick,
}) => {
  return (
    <div
      onClick={handleContactClick}
      className={`relative h-16 w-[50%] rounded-xl px-2 hover:cursor-pointer shadow-md shadow-black
      ${
        selected
          ? "bg-[#FCA311] font-bold hover:cursor-not-allowed "
          : "bg-[#E5E5E5] hover:bg-slate-300 hover:scale-110 "
      }  `}
    >
      <div className="relative flex flex-row justify-between items-center">
        <div className="relative flex items-center">
          <img
            className="rounded-full w-14 py-1"
            src={`data:image/png;base64,${imgSrc}`}
            alt={`${firstName} ${lastName}`}
          />
          {connected && (
            <div className="absolute bottom-0 h-3 w-3 bg-green-500 rounded-full ml-10"></div>
          )}
        </div>
        <div className="mr-12 my-auto">
          {firstName} {lastName}
        </div>
      </div>
    </div>
  );
};

export default UserContact;

UserContact.propTypes = {
  selected: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired, // New prop for indicating user connection status
  imgSrc: PropTypes.any.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  handleContactClick: PropTypes.func.isRequired,
};
