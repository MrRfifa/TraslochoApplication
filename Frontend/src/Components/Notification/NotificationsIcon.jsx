// NotificationsIcon.js
import { useSelector } from "react-redux";
import { FaBell } from "react-icons/fa";
import PropTypes from "prop-types";


const NotificationsIcon = ({ onClick }) => {
  const notifications = useSelector((state) => state.notifications);
  const unreadCount = notifications.unreadCount;

  return (
    <div
      onClick={onClick}
      className="left-3/4 mt-5"
      style={{ position: "absolute", cursor: "pointer" }}
    >
      <FaBell size={24} />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "3px 6px",
            fontSize: "12px",
          }}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationsIcon;

NotificationsIcon.propTypes = {
    onClick: PropTypes.func.isRequired,
  };