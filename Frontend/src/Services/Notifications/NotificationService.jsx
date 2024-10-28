import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

// const API_URL = import.meta.env.VITE_APP_API_URL;
let connection = null;

const NotificationService = {
  connect: async (token, onReceiveNotification) => {
    if (!connection) {
      connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5126/notificationHub", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveNotification", onReceiveNotification);

      try {
        await connection.start();
        console.log("Connected to SignalR hub");
      } catch (err) {
        console.error("Error connecting to SignalR hub:", err);
      }
    }
  },

  disconnect: async () => {
    if (connection) {
      await connection.stop();
      connection = null;
      console.log("Disconnected from SignalR hub");
    }
  },

  isConnected: () => connection && connection.state === "Connected",
};

export default NotificationService;
