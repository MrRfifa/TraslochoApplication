import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatList from "../../Components/Chats/ChatList";
import ChatBox from "../../Components/Chats/ChatBox";
import av2 from "../../assets/extra/img_chapter_2.png";
import UserAvatar from "../../Components/Chats/UserAvatar";

// Mock data for connected users
const connectedUsersMock = [
  { id: 1, name: "Alice", lastMessage: "Hey there!", avatar: av2 },
  { id: 2, name: "Bob", lastMessage: "Let's catch up later.", avatar: av2 },
  { id: 3, name: "Carol", lastMessage: "How's your project?", avatar: av2 },
];

// Mock data for suggested users
const suggestedUsersMock = [
  { id: 4, name: "David", avatar: av2 },
  { id: 5, name: "Emma", avatar: av2 },
];

const Messages = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState(connectedUsersMock);
  const [suggestedUsers, setSuggestedUsers] = useState(suggestedUsersMock);

  const selectedUser = connectedUsers.find(
    (user) => user.id === parseInt(userId)
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { text: newMessage, sender: "You", time: new Date() },
      ]);
      setNewMessage("");
    }
  };

  const handleUserClick = (user) => {
    // Move the user from suggested to connected users
    setConnectedUsers((prev) => [...prev, user]);
    // Remove the user from suggested users
    setSuggestedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col sm:flex-row ml-0 md:ml-64">
      {!userId ? (
        <div className="flex flex-col w-full">
          {/* Chat List with suggested users */}
          <ChatList
            connectedUsers={connectedUsers}
            suggestedUsers={suggestedUsers}
            onUserClick={handleUserClick}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col z-50">
          <div className="flex items-center p-4 bg-[#14213D] text-white rounded-none justify-start space-x-10">
            <button onClick={() => window.history.back()} className="mr-4">
              Back
            </button>
            <UserAvatar
              connected={true}
              names={selectedUser.name}
              profileImage={av2}
            />
          </div>
          <ChatBox
            selectedUser={selectedUser}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default Messages;
