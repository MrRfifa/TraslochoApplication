import { HubConnectionBuilder } from "@microsoft/signalr";
import { addNotification } from "../../Redux/Features/notificationSlice";
import store from "../../Redux/store";
import { successToast } from "../../Components/Toasts";
const SIGNALR_URL = import.meta.env.VITE_APP_SIGNALR_SERVER_URL;
let connection = null;

const startSignalRConnection = async (userId, isTransporter) => {
  if (!userId) {
    console.error("Cannot start SignalR connection without a valid userId");
    return;
  }
  if (connection == null) {
    connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_URL)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (message) => {
      console.log("Received notification:", message);
      store.dispatch(addNotification(message)); // Dispatch to Redux store
      successToast("You received a notification");
    });
    connection.on("ReceiveGroupNotification", (message) => {
      console.log("Received notification:", message);
      store.dispatch(addNotification(message)); // Dispatch to Redux store
    });

    try {
      await connection.start();
      await connection.invoke("RegisterUser", userId, isTransporter);
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
