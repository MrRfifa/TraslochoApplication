import MessageService from "../../Services/Messages/Messages";

export const getMessagesCall = async (contactId) => {
  try {
    return await MessageService.getMessages(contactId);
    // console.log(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};
