import { BrowserRouter as Router } from "react-router-dom";
import AuthVerifyService from "./Services/Auth/AuthVerifyService";
import AuthRoute from "./Routes/AuthRoute";
import UsersRoute from "./Routes/UsersRoute";
import store from "./Redux/store.js";
import { Provider } from "react-redux";
import Sidebar from "./Layout/Sidebar.jsx";

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
        <Router>
          <Sidebar />
          <UsersRoute />
        </Router>
      </Provider>
    );
  }

  return null;
}

export default App;
