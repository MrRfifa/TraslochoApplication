import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ChatList from "../../Components/Chats/ChatList";
import ChatBox from "../../Components/Chats/ChatBox";
import UserAvatar from "../../Components/Chats/UserAvatar";
import { fetchMessages } from "../../Redux/Features/messageSlice";
import {
  // sendMessage,
  joinRoom,
} from "../../Services/Messages/MessageSocketService";
import { getContactsCall } from "../../Helpers/Services/ContactServicesCall";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";
import { Toaster } from "react-hot-toast";

const Messages = () => {
  const [contactId, setContactId] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Change to null for easier checks
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const connectedUsers = useSelector((state) => state.messages.connectedUsers);
  const state = useSelector((state) => state.userInfo.value);
  UserInfo();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactsData = await getContactsCall(state.id);
        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [state.id]);

  const { conversation } = useSelector((state) => state.messages);

  const handleUserClick = (user) => {
    setContactId(user.contactId);
    setSelectedUser(user);
    navigate(`/messages/${user.participant}`);
    joinRoom(user.contactId); // Join the room after selecting the user
  };

  useEffect(() => {
    if (userId && contacts.length > 0) {
      const foundUser = contacts.find(
        (contact) => contact.participant === parseInt(userId)
      );

      if (!foundUser) {
        navigate("/messages"); // Navigate back if user isn't found
      } else {
        setSelectedUser(foundUser);
        setContactId(foundUser.contactId); // Update contactId based on found user
      }
    }
  }, [userId, contacts, navigate]);

  useEffect(() => {
    if (contactId) {
      dispatch(fetchMessages({ contactId })); // Fetch messages whenever contactId is set
    }
  }, [contactId, dispatch]);

  return (
    <div className="h-screen overflow-hidden flex flex-col sm:flex-row ml-0 md:ml-64">
      <Toaster />
      {!userId ? (
        <div className="flex flex-col w-full">
          <ChatList contacts={contacts} onUserClick={handleUserClick} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col z-50">
          <div className="flex items-center p-4 bg-[#14213D] text-white rounded-none justify-start space-x-10">
            <button onClick={() => window.history.back()} className="mr-4">
              Back
            </button>
            {selectedUser && (
              <UserAvatar
                connected={connectedUsers.some(
                  (connectedUser) =>
                    parseInt(connectedUser) === selectedUser.participant
                )}
                isPreview={false}
                firstName={selectedUser.message?.firstName}
                lastName={selectedUser.message?.lastName}
                user={selectedUser}
                profileImage={selectedUser.message?.fileContentBase64}
              />
            )}
          </div>
          {selectedUser && (
            <ChatBox
              selectedUser={selectedUser}
              messages={conversation}
              userId={parseInt(state.id)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
