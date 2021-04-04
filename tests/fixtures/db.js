const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user.js')

// creates an id for the user
const userLogId = new mongoose.Types.ObjectId()

const userLog = {
    _id: userLogId,
    name: 'Test Login',
    email: 'testlogin@example.com',
    password: 'pass12345',
    tokens: [{
        token: jwt.sign({ _id: userLogId }, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    // deletes every user of the database
    await User.deleteMany()
    // creates a test user for cases that require an user logged in
    await new User(userLog).save()
}

module.exports = {
    userLog,
    userLogId,
    setupDatabase
}
