// convention name for supertest
const request = require('supertest')
const app = require('../src/app.js')

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Test User',
        email: 'aaaaaaaaaandr2@example.com',
        password: 'pass12345'
    }).expect(201)
})
