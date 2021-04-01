const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

// express middleware, gets executed between new req and run route handler
// new request -> do something w/middleware -> run route handler
// next() says to continue and run the route handlers
// this is a simple maitenance middleware that stops any route handler
// app.use((req, res, next) => {
//     res.status(503).send('Site under Maitenance')
// })

// parse incoming json to an object so we can access it in our req handlers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
