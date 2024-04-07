var express = require('express');
var router = express.Router();

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

// Handle message comment create on POST.
router.post("/message/:id/comment", message_controller.message_comment_create_post);

router.post('/message/:id/like', message_controller.message_like_post);

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Home' });
// });

module.exports = router;
