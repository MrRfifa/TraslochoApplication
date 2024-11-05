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
      };
      await sendMessage(
        messageData.contact,
        messageData.sender,
        messageData.content
      );
      setCurrentMessage("");
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow">
      {/* Chat Messages Container */}
      <ScrollToBottom className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        {messages.map((message, index) => {
          if (message.contact === selectedUser.contactId) {
            return (
              <div
                key={index}
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
                  {message.content}
                </div>
              </div>
            );
          }
          return null;
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
