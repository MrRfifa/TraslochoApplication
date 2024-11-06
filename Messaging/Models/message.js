// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
//   sender: { type: Number },
//   content: String,
//   time: String,
// });

// const Message = mongoose.model("Message", messageSchema);

// module.exports = Message;
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
    required: true,
  },
  sender: { type: Number, required: true },
  content: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
