const Message = require("../models/message");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult} = require("express-validator");


//default routing to the messageboard
exports.index = asyncHandler(async (req, res, next) => {
  const numMessages = await Message.countDocuments({}).exec();

  const latestMessages = await Message.find({}, "title creator timestamp text")
    .sort({ timestamp: -1 }) // Sort by timestamp in descending order
    .limit(5) // Limit to 5 documents
    .populate("creator")
    .populate("text")
    .exec();

  res.render("board", {
    title: "Message Board",
    message_count: numMessages,
    message_list: latestMessages,
    errors: []
  });
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


// Display detail page for a specific message.
exports.message_detail = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate("creator").exec();
  const currentUser = res.locals.currentUser;

  if (!message) {
    const error = new Error("Message not found");
    error.status = 404;
    throw error;
  }

  const comments = await Comment.find({ message: req.params.id }).populate("creator").exec();

  res.render("message_detail", {
    title: message.title,
    message: message,
    comments: comments,
    currentUser: currentUser
  });
});

exports.message_comment_create_post = asyncHandler(async (req, res, next) => {
  // Find the message to which the comment belongs
  const message = await Message.findById(req.params.id).exec();
  if (!message) {
    const error = new Error("Message not found");
    error.status = 404;
    throw error;
  }

  // Create the comment
  const comment = new Comment({
    creator: req.user._id,
    message: message._id,
    text: req.body.comment,
  });

  // Save the comment to the database
  await comment.save();

  // Redirect back to the message detail page
  res.redirect(`/message/${req.params.id}`);
});

exports.message_like_post = asyncHandler(async (req, res, next) => {
  const messageId = req.params.id;

  try {
      const message = await Message.findById(messageId);
      if (!message) {
          return res.status(404).send('Message not found');
      }

      // Increment the likes count
      message.likes++;

      // Save the updated message
      await message.save();

      res.redirect(`/message/${messageId}`);
  } catch (error) {
      console.error("Error liking message:", error);
      res.status(500).send("An error occurred while liking the message");
  }
});


// Display message delete form on GET.
exports.message_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message delete GET");
});

// Handle message delete on POST.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  try {
    // Retrieve the message to be deleted based on the ID from the request parameters
    const message = await Message.findById(req.params.id).exec();

    if (!message) {
      // If the message is not found, return a 404 Not Found error
      const err = new Error('Message not found');
      err.status = 404;
      throw err;
    }

    // Check if the current user is the creator of the message
    const isCreator = req.user && message.creator.equals(req.user._id);

    if (!isCreator) {
      // If the current user is not the creator of the message, return a 403 Forbidden error
      const err = new Error('You are not authorized to delete this message');
      err.status = 403;
      throw err;
    }

    // Delete the message using the Mongoose model's deleteOne method
    await Message.deleteOne({ _id: message._id });

    // Redirect to the message board or any other appropriate page
    res.redirect('/');

  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
});


// Display message update form on GET.
exports.message_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message update GET");
});

// Handle message update on POST.
exports.message_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message update POST");
});
