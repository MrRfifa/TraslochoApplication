import PropTypes from "prop-types";

const UserAvatar = ({
  profileImage,
  connected,
  firstName,
  lastName,
  isPreview,
  onUserClick,
  user,
  hasUnreadMessages, // New prop to indicate unread messages
  lastMessagePreview, // New prop to show the last message preview
}) => {
  return (
    <div
      className={`flex flex-row justify-between items-center hover:cursor-pointer p-2 rounded-lg ${
        isPreview ? "hover:bg-gray-200" : ""
      } `}
      onClick={() => (!isPreview ? null : onUserClick(user))}
    >
      <div className="flex flex-row items-center space-x-5">
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

        {/* Name and last message */}
        <div className="flex flex-col">
          <h3
            className={`text-lg ${
              hasUnreadMessages ? "font-bold" : "font-normal"
            }`}
          >
            {firstName} {lastName}
          </h3>
          {isPreview && (
            <p
              className={`text-sm ${
                hasUnreadMessages ? "font-bold text-gray-800" : "text-gray-600"
              }`}
            >
              {lastMessagePreview}
            </p>
          )}
        </div>
      </div>

      {/* Unread message indicator */}
      {hasUnreadMessages && <span className="text-red-500 text-xl">●</span>}
    </div>
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
  hasUnreadMessages: PropTypes.bool, // Add new prop type for unread messages
  lastMessagePreview: PropTypes.string, // Add new prop type for last message preview
};

export default UserAvatar;
