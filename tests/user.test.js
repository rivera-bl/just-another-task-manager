// convention name for supertest
const request = require('supertest')
const app = require('../src/app.js')
const User = require('../src/models/user.js')

const userLog = {
    name: 'Test Login',
    email: 'testlogin@example.com',
    password: 'pass12345'
}

// jest setup & teardown for lifecycle functions
// beforeEach will run before each test case
beforeEach(async () => {
    await User.deleteMany()
    await new User(userLog).save()
})

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Test Create',
        email: 'test@example.com',
        password: 'pass12345'
    }).expect(201)
})

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userLog.email,
        password: userLog.password
    }).expect(200)
})

test('Shouldn\'t login bad password', async () => {
    await request(app).post('/users/login').send({
        email: userLog.email,
        password: 'notthepass12345'
    }).expect(400)
})
