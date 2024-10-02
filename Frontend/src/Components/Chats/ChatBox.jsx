import PropTypes from "prop-types";

const ChatBox = ({
  selectedUser,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
}) => {
  return (
    <div className="flex flex-col bg-gray-50 shadow-lg p-4 h-full">
      {selectedUser ? (
        <>
          <div className="flex-grow p-2 bg-white rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "You" ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div className="max-w-xs bg-gray-200 p-2 rounded-lg shadow">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-500">
                    {message.time.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-lg"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

ChatBox.propTypes = {
  selectedUser: PropTypes.any.isRequired,
  messages: PropTypes.array.isRequired,
  newMessage: PropTypes.any.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
};