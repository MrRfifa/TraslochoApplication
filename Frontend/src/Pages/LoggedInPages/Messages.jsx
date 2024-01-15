import { useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import UserSpecInfo from "../../Redux/SlicesCalls/UserSpecInfo";
import Chat from "../../Components/Chat";
// const userEmail = "user@example.com";

const Messages = () => {
  const [room, setRoom] = useState("");

  const state = useSelector((state) => state.userSpecInfo.value);

  UserSpecInfo();

  const socket = io.connect(`http://localhost:5000?email=${state.email}`);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  return (
    <div className="ml-24 mt-10">
      <h3>Messages</h3>
      <input
        type="text"
        placeholder="Room ID..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join a room</button>
      <Chat socket={socket} email={state.email} room={room} />
    </div>
  );
};

export default Messages;
