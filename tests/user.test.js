// convention name for supertest
const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app.js')
const User = require('../src/models/user.js')

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

// jest setup & teardown for lifecycle functions
// beforeEach will run before each test case
beforeEach(async () => {
    // deletes every user of the database
    await User.deleteMany()
    // creates a test user for cases that require an user logged in
    await new User(userLog).save()
})

// POST CREATE USER
test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Test Create',
        email: 'test@example.com',
        password: 'pass12345'
    }).expect(201)
})

// POST LOGIN USER
test('Should login existing user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userLog.email,
        password: userLog.password
    }).expect(200)
    
    // when login an user the res gives a token for the session, but it's the second token of the user because when the user is created it gets a token too
    const user = await User.findById(userLogId)
    expect(res.body.token).toBe(user.tokens[1].token)
})

test('Shouldn\'t login bad password', async () => {
    await request(app).post('/users/login').send({
        email: userLog.email,
        password: 'notthepass12345'
    }).expect(400)
})

// GET PROFILE
test ('Should get profile for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userLog.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

// DELETE ACCOUNT
test('Should delete account for authenticated user', async () => {
     const res = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userLog.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userLogId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})
