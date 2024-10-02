import { useState } from "react";
import { useNavigate } from "react-router-dom";
//TODO fix the prop types
const ChatList = ({ connectedUsers, suggestedUsers, onUserClick }) => {
  const [searchQuery, setSearchQuery] = useState(""); // For real-time filtering
  const navigate = useNavigate();

  // Real-time filtering based on search query
  const filteredUsers = connectedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 overflow-y-auto mt-10">
      <h2 className="text-lg font-semibold mb-4">Suggested Users</h2>
      <div className="flex space-x-4 mb-6">
        {suggestedUsers.length === 0 ? ( // Use === for comparison
          <p className="text-gray-500">No users available...</p> // Display message if no suggested users
        ) : (
          suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center cursor-pointer p-2"
              onClick={() => onUserClick(user)} // Call the onUserClick function
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full mb-2"
              />
              <span className="text-sm font-semibold">{user.name}</span>
            </div>
          ))
        )}
      </div>

      {/* Search bar for filtering chatted users */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Search your chats..."
        />
      </div>

      <h2 className="text-lg font-semibold mb-4">Chats</h2>
      <div className="flex flex-col space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center cursor-pointer p-2 bg-white rounded-lg shadow"
              onClick={() => navigate(`/messages/${user.id}`)}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4 flex flex-col">
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-gray-500">
                  {user.lastMessage}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No chats found</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;
