const mongoose = require('mongoose');
const faker = require('faker');

// Importing Mongoose models
require('./user');
require('./message');

// Getting references to the models
const User = mongoose.model('User');
const Message = mongoose.model('Message');

// Function to generate random users
const generateRandomUsers = (count) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const email = faker.internet.email(firstName, lastName);
        users.push({ first_name: firstName, last_name: lastName, email });
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
        messages.push({ title, text, creator: creator._id });
    }
    return messages;
};

// Connecting to MongoDB
mongoose.connect('mongodb+srv://arshpelia1:AGVARp2qdueKu2VN@cluster0.eldknbb.mongodb.net/local_library?retryWrites=true&w=majority&appName=Clust', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
}).then(() => {
    console.log('Connected to MongoDB');

    // Generating random users
    const randomUsers = generateRandomUsers(5);

    // Saving the users to the database
    User.insertMany(randomUsers)
        .then((savedUsers) => {
            console.log('Saved users to the database');

            // Generating random messages
            const randomMessages = generateRandomMessages(savedUsers, 10);

            // Saving the messages to the database
            Message.insertMany(randomMessages)
                .then(() => {
                    console.log('Saved messages to the database');
                })
                .catch((err) => {
                    console.error('Error saving messages:', err);
                });
        })
        .catch((err) => {
            console.error('Error saving users:', err);
        });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
