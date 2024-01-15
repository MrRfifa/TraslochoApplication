import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";

const Chat = ({ socket, email, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: email,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <div>
      {/* TODO update chat header */}
      <div>
        <p>Live chat</p>
      </div>
      {/* TODO chat body */}
      <div></div>
      {/* TODO chat footer */}
      <div>
        <input
          type="text"
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  socket: PropTypes.any.isRequired,
  email: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};
