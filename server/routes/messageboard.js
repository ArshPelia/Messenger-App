const express = require("express");
const router = express.Router();

// Require controller modules.
const message_controller = require("../controllers/messageController");

// GET catalog home page.
router.get("/", message_controller.index);

// GET request for creating a Message. NOTE This must come before routes that display Message (uses id).
router.get("/message/create", message_controller.message_create_get);

// POST request for creating Message.
router.post("/message/create", message_controller.message_create_post);

// GET request to delete Message.
router.get("/message/:id/delete", message_controller.message_delete_get);

// POST request to delete Message.
router.post("/message/:id/delete", message_controller.message_delete_post);

// GET request to update Message.
router.get("/message/:id/update", message_controller.message_update_get);

// POST request to update Message.
router.post("/message/:id/update", message_controller.message_update_post);

// GET request for one Message.
router.get("/message/:id", message_controller.message_detail);

// // GET request for list of all Message items.
// router.get("/messages", message_controller.message_list);

module.exports = router;
