const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming you have a User model
  message: { type: Schema.Types.ObjectId, ref: 'Message', required: true }, // Assuming you have a Message model
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
