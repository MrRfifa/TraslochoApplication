const router = require("express").Router();
const contactController = require("../Controllers/contactController");

//create message router
router.post("/", contactController.createContact);
//retrieve messages router
router.get("/:userId", contactController.retrieveContactsByUserId);
//Check if the contact exists
router.get(
  "/check/:participant1/:participant2",
  contactController.checkContactExists
);

module.exports = router;
