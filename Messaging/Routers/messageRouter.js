const router = require("express").Router();
const messageController = require("../Controllers/messageController");

//create message router
router.post("/", messageController.createMessage);
//retrieve messages router
router.get("/:contactId", messageController.retrieveMessagesByContactId);
//retrieve last message router
router.get("/:contactId/last-message", messageController.retrieveLastMessageByContactId);

module.exports = router;
