import { useSelector } from "react-redux";
// import ResponsiveTable from "../../Components/ResponsiveTable";
import NotificationsTable from "../../Components/Tables/NotificationsTable";

const Notifications = () => {
  const notifications = useSelector((state) => state.notifications.list);
  //   const unreadCount = notifications.filter(
  //     (notification) => !notification.isRead
  //   ).length;
  //   console.log(notifications);

  return (
    <div className="ml-0 md:ml-64">
      <NotificationsTable data={notifications} />
    </div>
  );
};

export default Notifications;
