const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  participants: [{ type: Number }],
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
