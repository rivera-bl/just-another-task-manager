const express = require('express')
const Task = require('../models/task.js')
const auth = require('../middleware/auth.js')
const router = new express.Router()

// CREATE A NEW TASK AND ASSIGN IT TO THE USER THATS LOGGED IN
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        // the spread operator copies the properties of an object 
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch (e){
        res.status(400).send(e)
    }
})


// READ ALL THE TASKS OF THE USER LOGGED IN
// can be filtered by completed status, limit the number of results, & sort
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    
    // if query.completed = true it will set match to true, else it will set to false. but if it's an empty string it wont pass the if and just return all
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        // ternary operator
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'userTasks', 
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.userTasks)
    }catch (e){
        res.status(500).send()
    }
})

// READ A TASK BY IT'S ID
router.get('/tasks/:id', auth, async (req, res) => {

    try{
        // return the task that has the task id passed in the params and the id of the user currently logged in
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch (e){
        res.status(500).send()
    }
})


// UPDATE A TASK BY ITS ID
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id} )

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => { task[update] = req.body[update] })
        await task.save()
        res.send(task)
    }catch (e){
        res.status(400).send()
    }
})

// DELETE AN TASK BY IT'S ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch (e){
        res.status(500).send()
    }
})

module.exports = router
