const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        lowercase: true, 
        required: [true, "Email can't be blank"], 
        match: [/\S+@\S+\.\S+/, 'Invalid email address'], 
    },
    username: { 
        type: String, 
        required: true, 
        maxLength: 100 
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isMember: {
        type: Boolean,
        required: true,
        default: false
    } 
});

  
// Virtual for User's URL
UserSchema.virtual("url").get(function () {
    return `/messenger/User/${this.id}`;
});

// Hash the password before saving
UserSchema.pre('save', async function(next) {
    try {
        // Generate a salt
        const salt = await bcryptjs.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcryptjs.hash(this.password, salt);
        // Replace the plain text password with the hashed password
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);
