const Message = require("../models/message");
// const MessageInstance = require("../models/messageinstance");

const asyncHandler = require("express-async-handler");

const { body, validationResult} = require("express-validator");


//default routing to the messageboard
exports.index = asyncHandler(async (req, res, next) => {
  // Get details of messages, message instances, creators and genre counts (in parallel)
  // console.log('Curr user: '+ res.locals.currentUser)
  
  const [
    numMessages,
    // numMessageInstances,
    // numAvailableMessageInstances,
    ] = await Promise.all([
      Message.countDocuments({}).exec(),
      // MessageInstance.countDocuments({}).exec(),
      // MessageInstance.countDocuments({ status: "Available" }).exec(),
    ]);

  const allMessages = await Message.find({}, "title creator timestamp text")
    .sort({ timestamp: 1 })
    .populate("creator")
    .populate("text")
    .exec();

  res.render("board", {
    title: "Message Board",
    message_count: numMessages,
    message_list: allMessages,
    errors: []
    // message_instance_count: numMessageInstances,
    // message_instance_available_count: numAvailableMessageInstances,
  });
});


// // Display list of all messages.
// exports.message_list = asyncHandler(async (req, res, next) => {
//   res.send(`NOT IMPLEMENTED: All Messages List`);
//   // const allMessages = await Message.find({}, "title creator")
//   // .sort({ title: 1 })
//   // .populate("creator")
//   // .exec();

//   // res.render("message_list", { title: "Message List", message_list: allMessages });
// });

// Display detail page for a specific message.
exports.message_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Message detail: ${req.params.id}`);
});

// Display message create form on GET.

exports.message_create_get = asyncHandler(async (req, res, next) => {

  res.render("message_form", {
    title: "Create Message",
    errors: []

  });
});

// Handle message create on POST.
exports.message_create_post = [

  // Validate and sanitize fields.
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("text", "Text must not be empty.").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // If there are errors, render the form again with error messages.
    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: "Create Message",
        message: req.body,
        errors: errors.array(),
      });
      return;
    }

    try {
      // Create a Message object with escaped and trimmed data.
      const message = new Message({
        title: req.body.title,
        // Set the creator to the currently logged-in user
        creator: req.user._id, // Assuming your User model uses _id as the identifier
        text: req.body.text,
      });

      // Save the message to the database.
      await message.save();
      
      // Redirect to the detail page of the created message.
      // res.redirect(message.url);

      //redirect to index
      res.redirect('/');

    } catch (error) {
      // Handle any errors that occur during message creation.
      console.error("Error creating message:", error);
      res.status(500).send("An error occurred while creating the message");
    }
  }),
];


// Display message delete form on GET.
exports.message_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message delete GET");
});

// Handle message delete on POST.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message delete POST");
});

// Display message update form on GET.
exports.message_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message update GET");
});

// Handle message update on POST.
exports.message_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message update POST");
});
