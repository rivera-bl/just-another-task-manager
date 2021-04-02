// mongoose supports middleware, which helps us to modify the behaviour of our model, we can register some functions to run before or after given events occur, like running some code just before an user is saved
const mongoose = require('mongoose')
const Task = require('./task.js')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// the advantage of using mongoose is that we can define models for our db
// mongoose by default takes the model name and lowercase+pluralize when creating the collection
// also it has pre-built data validation and sanitization, although it is not that extensive we can always use the npm validator module

// we use schemas when using middleware
const userSchema = new mongoose.Schema({
    name: {
        // adding built in validation
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, // we have to wipe out the db for this to take place
        required: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cant contain password')
            }
        }
    },
    age: {
        type: Number,
        // adding custom validations
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    // an array so an user can be logged in more than one device
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

// we are not changing what we store for the Users documents, its virtual, it marks a relationship. 'userTasks' is just a name for our virtual. foreignField is the field in the Other Object (Task) that marks the relationship, and the localField is the field of This Object (User) thats being saved on the foreignField of the Other Object
userSchema.virtual('userTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// with the method toJSON we can send back just the properties that we want
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password 
    delete userObject.tokens 

    return userObject
}

// if we want to use custom functions on the instances of our object model, we must define them firs in the schema.methods
userSchema.methods.generateAuthToken = async function () {
    const user = this
    // with sign we provide a payload(that uniquely identifies the user we want to authenticate, and a secret
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')
    // everytime we generate a toker we concatenate it to the token array in the User object
    user.tokens = user.tokens.concat({ token })
    
    await user.save()

    return token
}

// if we want to use custom functions in the object model, we must define them first in the schema.statics
userSchema.statics.findByCredentials = async (email, password) => {
    // find an user whose email field is equals to the email passed in
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to Login')
    }

    // takes the plaintext password and the hashed password
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to Login')
    }

    return user
}

// we pass the name of the event first, and the a regular function, we cant use arrow function because we need to use the .this keyword. because .this will contain the document(user) that's about to be saved
// we also use next() to tell that we are done with the function
// but we cant use this directly with the update route because findByIdAndUpdate bypasses mongoose, thats why we had to change the code of the router.patch
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password =  await bcrypt.hash(user.password, 8)
    }

    next()
})

// middleware function that deletes the tasks of an user when its deleted
userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
