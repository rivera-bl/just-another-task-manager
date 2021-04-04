const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user.js')
const Task = require('../../src/models/task.js')

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

const userTaskId = new mongoose.Types.ObjectId()
const userTask = {
    _id: userTaskId,
    name: 'Test User Task',
    email: 'testusertask@example.com',
    password: 'pass12345',
    tokens: [{
        token: jwt.sign({ _id: userTaskId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Test Description',
    default: false,
    owner: userLog._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Test Description',
    default: true,
    owner: userLog._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Test Description',
    default: true,
    owner: userTask._id
}

const setupDatabase = async () => {
    // deletes every user and task of the database
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userLog).save()
    await new User(userTask).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userLog,
    userLogId,
    userTask,
    userTaskId,
    taskOne,
    setupDatabase
}
