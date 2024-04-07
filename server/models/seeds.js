const mongoose = require('mongoose');
const faker = require('faker');

// Importing Mongoose models
require('./user');
require('./message');
require('./comment');

require('dotenv').config();

const mongoDB = ""

// Getting references to the models
const User = mongoose.model('User');
const Message = mongoose.model('Message');
const Comment = mongoose.model('Comment');

// Function to generate random users
const generateRandomUsers = (count) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const email = faker.internet.email(firstName, lastName);
        const password = "password10";
        users.push({ fname : firstName, lname: lastName, email: email, password: password });
    }
    return users;
};

// Function to generate random messages
const generateRandomMessages = (users, count) => {
    const messages = [];
    for (let i = 0; i < count; i++) {
        const title = faker.lorem.words(5);
        const text = faker.lorem.paragraph();
        const creator = users[Math.floor(Math.random() * users.length)];
        const likes = Math.floor(Math.random() * users.length)
        messages.push({ title: title, text: text, creator: creator._id, likes: likes});
    }
    return messages;
};

// Function to generate random comments for messages
const generateRandomComments = (messages, users) => {
    const comments = [];
    messages.forEach(message => {
        const commentCount = faker.datatype.number({ min: 1, max: 5 }); // Random number of comments per message
        for (let i = 0; i < commentCount; i++) {
            const text = faker.lorem.sentence();
            const creator = users[Math.floor(Math.random() * users.length)];
            comments.push({ text: text, creator: creator._id, message: message._id });
        }
    });
    return comments;
};

// Connecting to MongoDB
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to MongoDB');

    // Generating random users
    const randomUsers = generateRandomUsers(5);

    // Saving the users to the database
    const savedUsers = await User.insertMany(randomUsers);
    console.log('Saved users to the database');

    // Generating random messages
    const randomMessages = generateRandomMessages(savedUsers, 10);

    // Saving the messages to the database
    const savedMessages = await Message.insertMany(randomMessages);
    console.log('Saved messages to the database');

    // Generating random comments for messages
    const randomComments = generateRandomComments(savedMessages, savedUsers);

    // Saving the comments to the database
    await Comment.insertMany(randomComments);
    console.log('Saved comments to the database');

    // Disconnecting from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
