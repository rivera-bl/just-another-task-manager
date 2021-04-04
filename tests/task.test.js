const request = require('supertest')
const app = require('../src/app.js')
const Task = require('../src/models/task.js')
const { userLog, userLogId, setupDatabase } = require('./fixtures/db.js')

// jest setup & teardown for lifecycle functions
// beforeEach will run before each test case
beforeEach(setupDatabase)

test('Should create task for user', () => {
    
})
