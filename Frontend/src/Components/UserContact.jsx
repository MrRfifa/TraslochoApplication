import PropTypes from "prop-types";

const UserContact = ({
  selected,
  imgSrc,
  firstName,
  lastName,
  handleContactClick,
}) => {
  return (
    <div
      onClick={handleContactClick}
      className={`h-16 w-[50%] rounded-xl px-2 hover:cursor-pointer shadow-md shadow-black
      ${
        selected
          ? "bg-[#FCA311] font-bold hover:cursor-not-allowed "
          : "bg-[#E5E5E5] hover:bg-slate-300 hover:scale-110 "
      }  `}
    >
      <div className="flex flex-row justify-between  ">
        <div className="ml-10">
          <img
            className="rounded-full w-14 py-1"
            src={`data:image/png;base64,${imgSrc}`}
            alt={`${firstName} ${lastName}`}
          />
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
  imgSrc: PropTypes.any.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  handleContactClick: PropTypes.func.isRequired,
};
