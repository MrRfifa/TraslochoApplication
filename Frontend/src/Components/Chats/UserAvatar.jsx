import PropTypes from "prop-types";

const UserAvatar = ({
  profileImage,
  connected,
  firstName,
  lastName,
  isPreview,
  onUserClick,
  user,
}) => {
  return (
    <>
      <div
        className="flex flex-row justify-between hover:cursor-pointer "
        onClick={() => onUserClick(user)}
      >
        <div className="flex flex-row justify-start space-x-5">
          <div className="relative">
            <img
              className="w-12 h-12 rounded-full"
              src={`data:image/png;base64,${profileImage}`}
              alt=""
            />
            <span
              className={`top-0 left-7 absolute w-3.5 h-3.5 border-2 border-white dark:border-gray-800 rounded-full ${
                connected ? "bg-green-400" : "bg-red-400"
              }`}
            ></span>
          </div>
          <h3 className="text-lg font-semibold">
            {firstName} {lastName}
          </h3>
        </div>
        {isPreview && <h5>Last message</h5>}
      </div>
    </>
  );
};

UserAvatar.propTypes = {
  profileImage: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  connected: PropTypes.bool.isRequired,
  isPreview: PropTypes.bool.isRequired,
  onUserClick: PropTypes.func,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fileContentBase64: PropTypes.string,
  }).isRequired,
};

export default UserAvatar;
