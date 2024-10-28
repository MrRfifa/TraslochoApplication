import { BrowserRouter as Router } from "react-router-dom";
import AuthVerifyService from "./Services/Auth/AuthVerifyService";
import AuthRoute from "./Routes/AuthRoute";
import UsersRoute from "./Routes/UsersRoute";

import store from "./Redux/store.js";
import { Provider } from "react-redux";
import Sidebar from "./Layout/Sidebar.jsx";
import NotificationProvider, {
  NotificationContext,
} from "./Services/Notifications/NotificationProvider.jsx";
import { useContext } from "react";

const NotificationIcon = () => {
  const { unreadCount, markAsRead } = useContext(NotificationContext);

  return (
    <div onClick={markAsRead}>
      <i className="bell-icon" /> {/* Add your notification icon here */}
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </div>
  );
};

function App() {
  const authStatus = AuthVerifyService.AuthVerify();

  if (authStatus === 0) {
    return (
      <Router>
        <AuthRoute />
      </Router>
    );
  }
  if (authStatus === 1 || authStatus === 2) {
    return (
      <Provider store={store}>
        <NotificationProvider>
          <NotificationIcon />
          <Router>
            <Sidebar />
            <UsersRoute />
          </Router>
        </NotificationProvider>
      </Provider>
    );
  }

  return null;
}

export default App;
