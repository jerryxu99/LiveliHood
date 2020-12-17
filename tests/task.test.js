const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test',
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();

  expect(task.completed).toEqual(false);
});

test('Should not create task with invalid description/completed', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: {
        title: 'task',
      },
    })
    .expect(400);
});

test('Should get tasks for user', async () => {
  const response = await request(app)
    .get('/tasks/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test('Should fetch only completed tasks', async () => {
  const response = await request(app)
    .get('/tasks/me?completed=true')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
});

test('Should fetch only incomplete tasks', async () => {
  const response = await request(app)
    .get('/tasks/me?completed=false')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
});

test('Should sort tasks by date created. Newest first.', async () => {
  const response = await request(app)
    .get('/tasks/me?sortBy=createdAt_desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body[0].description).toEqual('Second task');
});

test('Should fetch the second page (1 task each) of user tasks', async () => {
  const response = await request(app)
    .get('/tasks/me?limit=1&skip=1')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body[0].description).toEqual('Second task');
});

test('Should fetch task by id', async () => {
  const response = await request(app)
    .get(`/tasks/${taskThree._id}`)
    .send()
    .expect(200);

  const task = Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

test('Should delete user task', async () => {
  await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete another user's task", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test('Should not delete task if unauthenticated', async () => {
  await request(app).delete(`/tasks/${taskOne._id}`).send().expect(401);
});

test('Should not update other users task', async () => {
  await request(app)
    .patch(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: false,
    })
    .expect(404);
});
