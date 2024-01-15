const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  sender: { type: Number },
  content: String,
  time: String,
});

messageSchema.pre("save", function (next) {
  const currentTime = new Date();
  this.time =
    currentTime.getHours().toString().padStart(2, "0") +
    ":" +
    currentTime.getMinutes().toString().padStart(2, "0");
  next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
