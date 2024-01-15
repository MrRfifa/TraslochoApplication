const router = require("express").Router();
const contactController = require("../Controllers/contactController");

//create message router
router.post("/", contactController.createContact);
//retrieve messages router
router.get("/:userId", contactController.retrieveContactsByUserId);

module.exports = router;
