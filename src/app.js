// this file is for getting the express app without calling listen()
// this way we can test our code with jest
// if we want to run our code in test env we run app.js, else if we are on dev env we run the index.js which calls this file and calls listen() on express
const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
require('./db/mongoose')

const app = express()

// parse incoming json to an object so we can access it in our req handlers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
