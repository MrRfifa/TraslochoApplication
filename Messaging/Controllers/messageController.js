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

// Function to mark a message as read
const markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking message as read",
    });
  }
};

exports.createMessage = createMessage;
exports.retrieveMessagesByContactId = retrieveMessagesByContactId;
exports.markMessageAsRead = markMessageAsRead;
