import { useSelector } from "react-redux";
import NotificationsTable from "../../Components/Tables/NotificationsTable";
import FetchAllNotifications from "../../Redux/SlicesCalls/FetchAllNotifications";

const Notifications = () => {
  FetchAllNotifications();
  const allNotifications = useSelector((state) => state.notifications.list);
  const sortedNotifications = [...allNotifications].sort((a, b) => {
    // First, check if notifications are unread (true means unread)
    if (a.isRead === b.isRead) {
      // If both have the same read status, sort by time (latest first)
      return new Date(b.dateSent) - new Date(a.dateSent); // Assuming `date` is the timestamp
    }
    // Prioritize unread notifications (false = unread, true = read)
    return a.isRead ? 1 : -1;
  });

  return (
    <div className="ml-0 md:ml-64">
      <NotificationsTable data={sortedNotifications} />
    </div>
  );
};

export default Notifications;
