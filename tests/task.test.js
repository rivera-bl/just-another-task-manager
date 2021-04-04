const request = require('supertest')
const app = require('../src/app.js')
const Task = require('../src/models/task.js')
const { userLog, userLogId, userTask, userTaskId, taskOne, setupDatabase } = require('./fixtures/db.js')

// jest setup & teardown for lifecycle functions
// beforeEach will run before each test case
beforeEach(setupDatabase)

// CREATE TASK
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

// GET ALL TASKS
test('Should get all the tasks of an user', async () => {
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userLog.tokens[0].token}`)
        .expect(200)

    expect(res.body.length).toEqual(2)
})

// DELETE A TASK FROM ANOTHER USER
test('Should not delete tasks from other user', async () => {
    const res = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTask.tokens[0].token}`)
        .expect(404)

    expect(taskOne).not.toBeUndefined()
})
