const router = require("express").Router();
const messageController = require("../Controllers/messageController");

//create message router
router.post("/", messageController.createMessage);
//retrieve messages router
router.get("/:contactId", messageController.retrieveMessagesByContactId);
//read the message 
router.patch("/:id/read", messageController.retrieveMessagesByContactId);

module.exports = router;
