import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import ScrollToBottom from "react-scroll-to-bottom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { sendMessage } from "../../Services/Messages/MessageSocketService";

const ChatBox = ({ selectedUser, messages, userId }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Utility function to ensure consistent date format
  const parseTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? null : date;
  };

  const formatMessageTime = (timestamp) => {
    const date = parseTimestamp(timestamp);
    return date
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Invalid Time";
  };

  const formatDateSeparator = (timestamp) => {
    const date = parseTimestamp(timestamp);
    return date
      ? date.toLocaleDateString([], {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "Invalid Date";
  };

  const handleEmojiButtonClick = (event) => {
    event.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    setCurrentMessage((prev) => prev + emoji.native);
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        contact: selectedUser.contactId,
        sender: userId,
        content: currentMessage,
        time: new Date().toISOString(), // Ensure ISO format for consistency
      };

      // Attempt to send the message and clear the input
      await sendMessage(
        messageData.contact,
        messageData.sender,
        messageData.content
      );
      setCurrentMessage("");
      setShowEmojiPicker(false);
    }
  };

  let lastMessageDate = null;

  return (
    <div className="flex flex-col h-screen bg-gray-100 rounded-lg shadow">
      {/* Chat Messages Container */}
      <ScrollToBottom className="flex-1 p-4 overflow-y-auto overflow-x-hidden pb-24">
        {messages.map((message, index) => {
          // Check and log message time for debugging
          const messageTime = parseTimestamp(message.time);

          const showDateSeparator =
            !lastMessageDate ||
            (messageTime &&
              lastMessageDate.toDateString() !== messageTime.toDateString());
          lastMessageDate = messageTime || lastMessageDate;

          return (
            <div key={index}>
              {showDateSeparator && messageTime && (
                <div className="flex items-center my-4">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-4 text-gray-500">
                    {formatDateSeparator(message.time)}
                  </span>
                  <hr className="flex-grow border-gray-300" />
                </div>
              )}
              <div
                className={`flex ${
                  message.sender === selectedUser.participant
                    ? "justify-start"
                    : "justify-end"
                } mb-2`}
              >
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === selectedUser.participant
                      ? "bg-white text-gray-900"
                      : "bg-[#f0e68c] text-gray-900"
                  }`}
                >
                  <span className="text-xs text-gray-500 mr-2">
                    {messageTime
                      ? formatMessageTime(message.time)
                      : formatMessageTime(new Date())}
                  </span>
                  {message.content}
                </div>
              </div>
            </div>
          );
        })}
      </ScrollToBottom>

      {/* Chat Input Section */}
      <div className="p-4 border-t border-gray-300 flex items-center space-x-4 bg-gray-100 sticky bottom-0">
        <div ref={emojiPickerRef} className="relative">
          <button
            onClick={handleEmojiButtonClick}
            className="focus:outline-none"
          >
            🙂
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-10">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="text-2xl text-blue-600">
          <IoIosSend />
        </button>
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  userId: PropTypes.number.isRequired,
};

export default ChatBox;
