import PropTypes from "prop-types";

const UserAvatar = ({ profileImage, connected, names }) => {
  return (
    <div className="flex flex-row justify-between space-x-5">
      <div className="relative">
        <img className="w-10 h-10 rounded-full" src={profileImage} alt="" />
        <span
          className={`top-0 left-7 absolute  w-3.5 h-3.5 border-2 border-white dark:border-gray-800 rounded-full ${
            connected ? "bg-green-400" : "bg-red-400"
          }`}
        ></span>
      </div>
      <h3 className="text-lg font-semibold">{names}</h3>
    </div>
  );
};

export default UserAvatar;

UserAvatar.propTypes = {
  profileImage: PropTypes.any.isRequired,
  names: PropTypes.string.isRequired,
  connected: PropTypes.bool.isRequired,
};