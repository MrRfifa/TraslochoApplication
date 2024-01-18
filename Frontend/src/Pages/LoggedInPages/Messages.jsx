import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";
import Chat from "../../Components/Chat";
import { getContactsCall } from "../../Helpers/Services/ContactServicesCall";
import UserContact from "../../Components/USerContact";
import messageImg from "../../assets/messages.svg";

const Messages = () => {
  const [contactId, setContactId] = useState("");
  const [showChat, setShowChat] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [selectedContactIndex, setSelectedContactIndex] = useState(null);

  const state = useSelector((state) => state.userInfo.value);

  UserInfo();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactsData = await getContactsCall(state.id);
        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchData();
  }, [state.id]);

  const socket = useMemo(
    () => io.connect(`http://localhost:5000?id=${state.id}`),
    [state.id]
  );

  const joinRoom = (roomId) => {
    if (roomId !== "") {
      socket.emit("join_room", roomId);
    }
  };

  const handleContactClick = (index, contactId) => {
    setContactId(contactId);
    setShowChat(true);
    setSelectedContactIndex(index);
    joinRoom(contactId);
  };

  return (
    <div className="ml-28 mt-20">
      {/* <h3>Messages</h3> */}
      <div className="grid grid-cols-2">
        {/* Contacts section */}
        <div className="flex flex-col space-y-5">
          {contacts &&
            contacts.map((contact, index) => (
              <UserContact
                key={index}
                firstName={contact.message.firstName}
                lastName={contact.message.lastName}
                imgSrc={contact.message.fileContentBase64}
                selected={index === selectedContactIndex}
                handleContactClick={() => {
                  handleContactClick(index, contact.contactId);
                }}
              />
            ))}
        </div>
        {/* Chat section */}
        <div className="max-h-[600px]">
          {showChat ? (
            <Chat
              socket={socket}
              userId={state.id.toString()}
              contactId={contactId}
            />
          ) : (
            <img className="w-[500px]" src={messageImg} alt="message image" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
