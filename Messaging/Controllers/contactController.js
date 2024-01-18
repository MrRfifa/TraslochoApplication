const Contact = require("../Models/contact");

// Create a new contact
const createContact = async (req, res) => {
  try {
    const { participant1, participant2 } = req.body;

    // Check if a contact already exists with the given participants
    const existingContact = await Contact.findOne({
      participants: { $all: [participant1, participant2] },
    });

    if (existingContact) {
      return res.status(409).json({
        status: "failed",
        error: "Contact already exists with these participants",
      });
    }

    const contact = new Contact({
      participants: [participant1, participant2],
    });
    await contact.save();
    res
      .status(201)
      .json({ status: "success", message: "contact created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", error: "Internal Server Error" });
  }
};

// Retrieve contacts for a user
const retrieveContactsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const contact = await Contact.find({ participants: userId });
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", error: "Internal Server Error" });
  }
};

exports.createContact = createContact;
exports.retrieveContactsByUserId = retrieveContactsByUserId;
