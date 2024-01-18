import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { getMessagesCall } from "../Helpers/Services/MessageServicesCall";
import ScrollToBottom from "react-scroll-to-bottom";
//emojis library
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const Chat = ({ socket, userId, contactId }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        // Clicked outside the emoji picker, close it
        setShowEmojiPicker(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const handleEmojiButtonClick = (event) => {
    // Prevent the click event from propagating to the document click event listener
    event.stopPropagation();

    // Toggle the emoji picker visibility
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    const updatedMessage = currentMessage + emoji.native;
    setCurrentMessage(updatedMessage);
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        contact: contactId,
        sender: userId,
        content: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await getMessagesCall(contactId);
        // console.log(messages.message);
        setMessageList(messages.message);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    loadMessages();
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
      // console.log(data);
    };

    // Subscribe to "receive_message" event
    socket.on("receive_message", receiveMessageHandler);

    // Clean up subscription when component unmounts
    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [socket, contactId]);

  return (
    <div className="border-2 border-[#FCA311] h-[100%] flex flex-col max-w-[70%] bg-white shadow-md">
      {/* Chat header */}
      <div className="bg-[#FCA311] text-white p-3">
        <p className="text-lg font-semibold text-center">Live Chat</p>
      </div>
      {/* Chat body */}
      <div className="flex-grow overflow-y-auto p-4">
        <ScrollToBottom className="w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-hide">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`flex flex-col mb-4 ${
                parseInt(userId) === parseInt(messageContent.sender)
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                  parseInt(userId) === parseInt(messageContent.sender)
                    ? "bg-green-500 text-white self-end"
                    : "bg-blue-500 text-white self-start"
                }`}
              >
                <p>{messageContent.content}</p>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {messageContent.time}
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>

      {/* Chat footer */}
      <div className="flex flex-row justify-between p-4 border-t-2">
        <div className="flex flex-row w-full space-x-2">
          <input
            className="rounded-lg w-10/12 h-10 border-2 focus:outline-none px-4"
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            className="bg-transparent border-2  text-white rounded-lg my-auto h-8 p-1 hover:bg-[#FCA311]"
            // onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            onClick={handleEmojiButtonClick}
          >
            😊
          </button>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-32 right-0 z-10"
            >
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        <button
          className="bg-[#FCA311] text-white rounded-lg p-2 hover:bg-[#ffee32]"
          onClick={sendMessage}
        >
          <IoIosSend size={30} />
        </button>
      </div>
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  socket: PropTypes.any.isRequired,
  userId: PropTypes.string.isRequired,
  contactId: PropTypes.any.isRequired,
};
