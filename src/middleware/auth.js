const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req, res, next) => {
    try{
        // save the token passed into the header
        const token = req.header('Authorization').replace('Bearer ', '')
        // verify the token with the secret passed in the creation
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // find an user with the same id of the token and the token
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user){
            throw new Error()
        }
        
        // we pass the user to the req, so we can use it in the route handler
        req.token = token
        req.user = user

        next()
    }catch (e){
        res.status(401).send({ error: 'Please Authenticate' })
    }
}

module.exports = auth
