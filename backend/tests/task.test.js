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
      title: 'test',
      description: 'From my test',
      location: {
        lat: 59.22,
        lng: 80,
      },
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();

  expect(task.status).toEqual('OPEN');
});

test('Should not create task with invalid description/completed', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: 'bad',
      description: {
        title: 'task',
      },
      location: {
        lat: 59.22,
        lng: 80,
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
    .get('/tasks/me?status=DONE')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
});

test('Should fetch only incomplete tasks', async () => {
  const response = await request(app)
    .get('/tasks/me?status=OPEN')
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
      status: 'OPEN',
    })
    .expect(404);
});

test('Should assign user to open task', async () => {
  await request(app)
    .patch(`/tasks/assign/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  const task = await Task.findById(taskOne._id);
  expect(task.taskDoer).not.toBeNull();
});

test('Should not assign user to non open task', async () => {
  await request(app)
    .patch(`/tasks/assign/${taskThree._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(400);
});

test('Should drop a task', async () => {
  await request(app)
    .patch(`/tasks/assign/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  await request(app)
    .patch(`/tasks/drop/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  const task = await Task.findById(taskOne._id);
  expect(task.taskDoer).toBeNull;
  expect(task.status).toEqual('OPEN');
});

test('Should not drop a task you are not taskDoer of', async () => {
  await request(app)
    .patch(`/tasks/assign/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  await request(app)
    .patch(`/tasks/drop/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(400);

  const task = await Task.findById(taskOne._id);
  expect(task.taskDoer).not.toBeNull;
  expect(task.status).not.toEqual('OPEN');
});
