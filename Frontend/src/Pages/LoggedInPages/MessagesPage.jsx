import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatList from "../../Components/Chats/ChatList";
import ChatBox from "../../Components/Chats/ChatBox";
import av2 from "../../assets/extra/img_chapter_2.png";
import UserAvatar from "../../Components/Chats/UserAvatar";

const connectedUsersMock = [
  { id: 1, name: "Alice", lastMessage: "Hey there!" },
  { id: 2, name: "Bob", lastMessage: "Let's catch up later." },
  { id: 3, name: "Carol", lastMessage: "How's your project?" },
];

const MessagesPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const selectedUser = connectedUsersMock.find(
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

  return (
    <div className="h-screen overflow-hidden flex flex-col sm:flex-row ml-0 md:ml-64">
      {!userId ? (
        <ChatList />
      ) : (
        <div className="flex-1 flex flex-col z-50">
          <div className="flex items-center p-4 bg-[#14213D] text-white rounded-none justify-start space-x-10">
            <button onClick={() => window.history.back()} className="mr-4">
              Back
            </button>
            <UserAvatar
              connected={true}
              names={"Anouar Rfifa"}
              profileImage={av2}
            />
            {/* <div className="flex flex-row justify-between space-x-5">
              <div className="relative">
                <img className="w-10 h-10 rounded-full" src={av2} alt="" />
                <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
              <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
            </div> */}
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

export default MessagesPage;
