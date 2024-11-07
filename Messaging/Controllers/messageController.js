const Message = require("../Models/message");

// Create a new message
const createMessage = async (req, res) => {
  try {
    const { contactId, sender, content } = req.body;
    const message = new Message({
      contact: contactId,
      sender,
      content,
      // `read` and `time` fields are automatically handled by the schema defaults
    });

    await message.save();
    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: message, // Optional: Include the message data in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      error: "Internal Server Error",
    });
  }
};

//retrieve messages for contact
const retrieveMessagesByContactId = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const messages = await Message.find({ contact: contactId });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", error: "Internal Server Error" });
  }
};

//retrieve last message for contact
const retrieveLastMessageByContactId = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    // Retrieve the most recent message for the contact
    const lastMessage = await Message.find({ contact: contactId })
      .sort({ time: -1 }) // Sort by timestamp in descending order
      .limit(1); // Limit to only the most recent message
    // If a message exists, send it; otherwise, return a 'no message' response
    if (lastMessage.length > 0) {
      res.json(lastMessage[0]); // Return the most recent message
    } else {
      res.json("No messages yet."); // No messages for the contact
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", error: "Internal Server Error" });
  }
};

exports.createMessage = createMessage;
exports.retrieveMessagesByContactId = retrieveMessagesByContactId;
exports.retrieveLastMessageByContactId = retrieveLastMessageByContactId;
