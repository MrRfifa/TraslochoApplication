import { BrowserRouter as Router } from "react-router-dom";
import AuthVerifyService from "./Services/Auth/AuthVerifyService";
import AuthRoute from "./Routes/AuthRoute";
import UsersRoute from "./Routes/UsersRoute";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import Sidebar from "./Layout/Sidebar.jsx";
import NotificationSocket from "./Services/Sockets/NotificationSocket.jsx";

function App() {
  const authStatus = AuthVerifyService.AuthVerify();

  // useEffect(() => {
  //   if (authStatus === 1 || authStatus === 2) {
  //     // User logged in, start SignalR connection
  //     startSignalRConnection((message) => {
  //       console.log("Notification received:", message);
  //       // Handle notification messages, you can update your store here
  //     });
  //   }

  //   return () => {
  //     // Cleanup function, stop SignalR connection when the user logs out
  //     stopSignalRConnection();
  //   };
  // }, [authStatus]);

  return (
    <Provider store={store}>
      <Router>
        {authStatus === 0 ? (
          <AuthRoute />
        ) : (
          <>
            <Sidebar />
            <UsersRoute />
            <NotificationSocket />{" "}
            {/* Ensure SignalR connection is established */}
          </>
        )}
      </Router>
    </Provider>
  );
}

export default App;
