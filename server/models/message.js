const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    text: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User who created the message
});

module.exports = mongoose.model('Message', MessageSchema);
