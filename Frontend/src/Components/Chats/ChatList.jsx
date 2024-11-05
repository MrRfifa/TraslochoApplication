import { useState } from "react";
import PropTypes from "prop-types";
import UserAvatar from "./UserAvatar";
import { useSelector } from "react-redux";

const ChatList = ({ contacts, onUserClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const connectedUsers = useSelector((state) => state.messages.connectedUsers);
  const filteredContacts = contacts.filter((user) =>
    `${user.message.firstName} ${user.message.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
        {filteredContacts.length > 0 ? (
          filteredContacts.map((user) => {
            const isConnected = connectedUsers.some(
              (connectedUser) => parseInt(connectedUser) === user.participant
            );
            return (
              <UserAvatar
                key={user.participant}
                isPreview={true}
                profileImage={user.message.fileContentBase64}
                firstName={user.message.firstName}
                lastName={user.message.lastName}
                connected={isConnected}
                onUserClick={() => onUserClick(user)}
                user={user}
              />
            );
          })
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
