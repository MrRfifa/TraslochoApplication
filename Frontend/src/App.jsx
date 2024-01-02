import { BrowserRouter as Router } from "react-router-dom";
import AuthVerifyService from "./Services/Auth/AuthVerifyService";
import AuthRoute from "./Routes/AuthRoute";
import UsersRoute from "./Routes/UsersRoute";

function App() {
  const authStatus = AuthVerifyService.AuthVerify();

  if (authStatus === 0) {
    return (
      <Router>
        <AuthRoute />
      </Router>
    );
  }
  if (authStatus === 1) {
    return (
      <Router>
        <UsersRoute />
      </Router>
      // <AuthContextProvider>

      // </AuthContextProvider>
    );
  }

  return null;
}

export default App;
