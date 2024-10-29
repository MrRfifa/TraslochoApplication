// NotificationsModal.js
import { useSelector, useDispatch } from "react-redux";
import { markAllAsReadBackend } from "../../Redux/Features/notificationSlice";
import PropTypes from "prop-types";

const NotificationsModal = ({ isOpen, onClose, userId }) => {
  const notifications = useSelector((state) => state.notifications.list);
  const dispatch = useDispatch();

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadBackend(userId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 max-h-[80vh] overflow-y-auto p-4">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button
            onClick={handleMarkAllAsRead}
            className="text-[#3c6e71] hover:underline font-bold"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        <ul className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No new notifications</p>
          ) : (
            notifications.map((notification, index) => (
              <li
                key={index}
                className={`p-4 rounded-lg shadow-sm border ${
                  notification.isRead ? "bg-gray-100" : "bg-white"
                }`}
              >
                <h4
                  className={`font-semibold text-lg ${
                    notification.isRead ? "text-black" : "text-[#FCA311]"
                  }`}
                >
                  {notification.content || notification}
                  {/* {notification.title || "Notification"} */}
                </h4>
                <small className="text-gray-500">
                  {new Date(notification.dateSent).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </small>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsModal;

NotificationsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
};
