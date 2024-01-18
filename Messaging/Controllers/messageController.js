const Message = require("../Models/message");

// create a new message
const createMessage = async (req, res) => {
  try {
    const { contactId, sender, content } = req.body;

    const message = new Message({
      contact: contactId,
      sender,
      content,
    });
    await message.save();
    res
      .status(201)
      .json({ status: "success", message: "message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", error: "Internal Server Error" });
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

exports.createMessage = createMessage;
exports.retrieveMessagesByContactId = retrieveMessagesByContactId;
