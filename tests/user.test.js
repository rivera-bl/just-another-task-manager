// convention name for supertest
const request = require('supertest')
const app = require('../src/app.js')
const User = require('../src/models/user.js')
const { userLog, userLogId, setupDatabase } = require('./fixtures/db.js')

// jest setup & teardown for lifecycle functions
// beforeEach will run before each test case
beforeEach(setupDatabase)

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
    await request(app)
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

// AVATAR UPLOAD
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userLog.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-picture.jpg')
        .expect(200)

    const user = await User.findById(userLogId)
    // .toBe() uses the === operator so we can't use it to compare objects
    // .toEqual(), on the otherhand, compares the properties of the object
    // we don't have the value of the avatar sent, we just compare its type
    expect(user.avatar).toEqual(expect.any(Buffer))
})

// UPDATE USER LOGGED IN
test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userLog.tokens[0].token}`)
        .send({
            name: 'Test Updated',
            age: 20
        })
        .expect(200)

    const user = await User.findById(userLogId)
    expect(user.name).toEqual('Test Updated')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userLog.tokens[0].token}`)
        .send({
            location: 'santiago'
        })
        .expect(400)
})
