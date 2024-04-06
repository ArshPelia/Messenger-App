var express = require('express');
var router = express.Router();

// Require controller modules.
const message_controller = require("../controllers/messageController");

// GET catalog home page.
router.get("/", message_controller.index);

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Home' });
// });

module.exports = router;
