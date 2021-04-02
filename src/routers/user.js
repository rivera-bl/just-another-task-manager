const express = require('express')
const multer = require('multer')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')
const router = new express.Router()

// CREATE A NEW USER
// post is for adding resources to the endpoint
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        // saves the user that we got from the incoming json into the mongdb
        await user.save()

        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch (e){
        // updates the status code so we don't mislead responses to the clien
        res.status(400).send(e)
    }
})

// LOGIN AN USER WITH EMAIL AND PASSWORD
router.post('/users/login', async (req, res) => {
    try{
        // custom function
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
    }catch (e){
        res.status(400).send(e)
    }
})

// LOGOUT THE USER FROM HIS CURRENT SESSION (DELETES HIS JWB)
router.post('/users/logout', auth, async (req, res) => {
    try{
        // keep only the tokens of the user that aren't the one he's using in his current session, so he keeps logged in in other devices
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()

        res.send()
    }catch (e){
        res.status(500).send()
    }
})


// LOGOUT THE USER FROM ALL OF HIS SESSIONS (DELETES ALL OF HIS JWB)
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.send()
    }catch (e){
        res.status(500).send()
    }
})

// READ THE USER PROFILE
// to add middleware to an individual route we just pass in the middleware function to the get method before we pass the route handler
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// UPDATES THE PROFILE OF THE USER LOGGED IN
router.patch('/users/me', auth, async (req, res) => {
    // validation for trying to a update a field that doesnt exist
    // its already something that mongoose won't allows but this way it gives an appropiate response of what happened
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid update' })
    }

    try{
        updates.forEach((update) => { req.user[update] = req.body[update] })
        await req.user.save()

        res.send(req.user)
    }catch (e){
        // we could also have 500 but for now we will just focus on 400 which would mean a bad request in case the fields don't pass the validation
        res.status(400).send(e)
    }
})

// DELETE THE USER PROFILE THATS LOGGED IN
router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    }catch (e){
        res.status(500).send()
    }
})

// ADD AN AVATAR IMAGE 
const upload = multer({
    dest: 'avatars' // dir for saving the uploaded files, will create itself
})

// .single() takes the key to use for the request
router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
})

module.exports = router
