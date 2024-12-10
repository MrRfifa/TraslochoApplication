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

// Check if contact exists between two participants
const checkContactExists = async (req, res) => {
  try {
    const { participant1, participant2 } = req.params;

    // Check if both participants exist in the 'participants' field
    const contact = await Contact.findOne({
      participants: { $all: [participant1, participant2] },
    });

    if (contact) {
      return res.json({ exists: true }); // Return true if contact exists
    } else {
      return res.json({ exists: false }); // Return false if contact doesn't exist
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", error: "Internal Server Error" });
  }
};

exports.createContact = createContact;
exports.retrieveContactsByUserId = retrieveContactsByUserId;
exports.checkContactExists = checkContactExists;
