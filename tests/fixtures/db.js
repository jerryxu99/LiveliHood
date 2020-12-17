const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

// Sample data to test on
const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'Name1',
  email: 'name@example.com',
  password: 'abc123!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  name: 'Name2',
  email: 'name2@example.com',
  password: 'myhouse099',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = new Task({
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOneId,
});

const taskTwo = new Task({
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOneId,
});

const taskThree = new Task({
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: userTwoId,
});

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
