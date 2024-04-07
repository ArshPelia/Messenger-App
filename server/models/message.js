const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 }, // New field to store likes
    timestamp: { type: Date, default: Date.now }
});

// Virtual for author's URL
MessageSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/message/${this._id}`;
  });
  

module.exports = mongoose.model('Message', MessageSchema);
