// src/services/signalRService.js
import * as signalR from "@microsoft/signalr";
import store from "../../Redux/store"; // Adjust import as needed
import { addNotification } from "../../Redux/Features/notificationSlice";

var connection = null;

const startSignalRConnection = async (userId) => {
  if (!userId) {
    console.error("Cannot start SignalR connection without a valid userId");
    return;
  }
  if (connection == null) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5235/notificationHub") // Your SignalR hub URL
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (message) => {
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
