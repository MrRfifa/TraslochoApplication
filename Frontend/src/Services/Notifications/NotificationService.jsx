import { HubConnectionBuilder } from "@microsoft/signalr";
import { addNotification } from "../../Redux/Features/notificationSlice";
import store from "../../Redux/store";
const SIGNALR_URL = import.meta.env.VITE_APP_SIGNALR_SERVER_URL;
let connection = null;

const startSignalRConnection = async (userId) => {
  if (!userId) {
    console.error("Cannot start SignalR connection without a valid userId");
    return;
  }
  if (connection == null) {
    connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_URL)
      .withAutomaticReconnect()
      .build();

      //TODO Update the mothods here
    connection.on("ReceiveNotification", (message) => {
      // // Define a regex pattern to identify connection IDs (assuming alphanumeric, e.g., 20 characters long)
      // const connectionIdPattern = /^[a-zA-Z0-9]{20}$/;

      // // Check if the notification message is an undesired default or connection message
      // if (
      //   message.message === "You are now connected." ||
      //   connectionIdPattern.test(message.message)
      // ) {
      //   return; // Skip adding these notifications
      // }
      console.log("Received notification:", message);
      store.dispatch(addNotification(message)); // Dispatch to Redux store
    });

    try {
      await connection.start();
      await connection.invoke("RegisterUser", userId);
      console.log("SignalR connected");
      const connectionId = await connection.invoke("GetConnectionId");
      console.log(`Connection Id: ${connectionId}`);
    } catch (error) {
      console.error("SignalR connection failed:", error);
    }
  }
};

const stopSignalRConnection = async (userId) => {
  if (connection != null) {
    await connection.stop();
    await connection.invoke("DeleteUser", userId);
    connection = null;
    console.log("SignalR connection stopped");
  }
};

export { startSignalRConnection, stopSignalRConnection };
