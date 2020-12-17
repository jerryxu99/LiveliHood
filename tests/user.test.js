const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, userTwo, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'TestName',
      email: 'test@example.com',
      password: 'MyPass777',
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'TestName',
      email: 'test@example.com',
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe('MyPass777');
});

test('Should not signup user with invalid name/email/password', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'TestName10',
      email: 'nonvalidemail.com',
    })
    .expect(400);
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(user.tokens[1].token).toBe(response.body.token);
});

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'abc@gmail.com',
      password: 'badpassword123!',
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401);
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'New Name',
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual('New Name');
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      hobby: 'Soccer',
    })
    .expect(400);
});

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .set(
      'Authorization',
      `Bearer ${jwt.sign({ _id: userOneId }, 'incorrect secret')}`,
    )
    .send({
      name: 'New Name',
    })
    .expect(401);
});

test('Should not update user with invalid name/email/password', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      email: 'nonvalidemail.com',
    })
    .expect(400);
});
