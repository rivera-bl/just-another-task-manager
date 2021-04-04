const request = require('supertest')
const app = require('../src/app.js')
const Task = require('../src/models/task.js')
const { userLog, userLogId, setupDatabase } = require('./fixtures/db.js')

// jest setup & teardown for lifecycle functions
// beforeEach will run before each test case
beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userLog.tokens[0].token}`)
        .send({
            description: 'Test Task'
        })
        .expect(201)

    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})
