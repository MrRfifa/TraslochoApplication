import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserAvatar from "./UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import MessageService from "../../Services/Messages/Messages";
import { updateLastSeenTimestamp } from "../../Redux/Features/messageSlice";

const ChatList = ({ contacts, onUserClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactsWithMessages, setContactsWithMessages] = useState([]);

  // Get connected users and messages from Redux state
  const dispatch = useDispatch();
  const connectedUsers = useSelector((state) => state.messages.connectedUsers);
  const conversation = useSelector((state) => state.messages.conversation);
  const lastSeenTimestamps = useSelector(
    (state) => state.messages.lastSeenTimestamps
  );

  const filteredContacts = contacts.filter((user) =>
    `${user.message.firstName} ${user.message.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchLastMessagesForContacts = async () => {
      const contactsWithLastMessages = await Promise.all(
        filteredContacts.map(async (user) => {
          const isConnected = connectedUsers.some(
            (connectedUser) => parseInt(connectedUser) === user.participant
          );

          // Fetch the last message and its timestamp for each contact
          const lastMessage = await MessageService.getLastMessage(
            user.contactId
          );
          const lastMessageTimestamp = lastMessage?.time || Date.now();

          // Determine if the message is unread based on last seen timestamp
          const hasUnreadMessages =
            lastMessageTimestamp > (lastSeenTimestamps[user.participant] || 0);

          return {
            ...user,
            isConnected,
            hasUnreadMessages,
            lastMessagePreview: lastMessage?.message || "No messages yet",
          };
        })
      );

      setContactsWithMessages(contactsWithLastMessages);
    };

    if (filteredContacts.length > 0) {
      fetchLastMessagesForContacts();
    }
  }, [filteredContacts, connectedUsers, conversation, lastSeenTimestamps]);

  // Function to handle user click
  const handleUserClick = (user) => {
    // Update lastSeenTimestamp for the selected user when they open the chat
    const lastMessage = conversation
      .filter((msg) => msg.sender === user.participant)
      .pop();
    const lastMessageTimestamp = lastMessage?.time || Date.now();
    dispatch(
      updateLastSeenTimestamp({
        participantId: user.participant,
        time: lastMessageTimestamp,
      })
    );
    onUserClick(user);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto mt-10">
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Search users..."
        />
      </div>

      <h2 className="text-lg font-semibold mb-4">Chats</h2>
      <div className="flex flex-col space-y-4">
        {contactsWithMessages.length > 0 ? (
          contactsWithMessages.map((user) => (
            <UserAvatar
              key={user.participant}
              isPreview={true}
              profileImage={user.message.fileContentBase64}
              firstName={user.message.firstName}
              lastName={user.message.lastName}
              connected={user.isConnected}
              onUserClick={() => handleUserClick(user)}
              user={user}
              hasUnreadMessages={user.hasUnreadMessages} // Control bold styling based on this
              lastMessagePreview={user.lastMessagePreview}
            />
          ))
        ) : (
          <p className="text-gray-500">No chats found</p>
        )}
      </div>
    </div>
  );
};

ChatList.propTypes = {
  contacts: PropTypes.array.isRequired,
  onUserClick: PropTypes.func.isRequired,
};

export default ChatList;
