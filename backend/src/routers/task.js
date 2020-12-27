const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = express.Router();

// create task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// read all tasks
// GET /tasks?status=OPEN
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt_desc
router.get('/tasks', async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.status) {
    match.status = req.query.status;
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    const tasks = await Task.find(match, null, {
      limit: parseInt(req.query.limit, 10),
      skip: parseInt(req.query.skip, 10),
      sort,
    }).exec();
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// read your tasks that you put up
// GET /tasks/me?status=IN+PROGRESS
// GET /tasks/me?limit=10&skip=10
// GET /tasks/me?sortBy=createdAt_desc
router.get('/tasks/me', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.status) {
    match.status = req.query.status;
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit, 10),
          skip: parseInt(req.query.skip, 10),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// get your tasks that have been assigned to you
router.get('/tasks/todo', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.status) {
    match.status = req.query.status;
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: 'todo',
        match,
        options: {
          limit: parseInt(req.query.limit, 10),
          skip: parseInt(req.query.skip, 10),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.todo);
  } catch (e) {
    res.status(500).send();
  }
});

// read task by id
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

// update your tasks
router.patch('/tasks/:id', auth, async (req, res) => {
  const allowedUpdates = [
    'title',
    'description',
    'location',
    'status',
    'taskDoer',
  ];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

// assign yourself to a task
router.patch('/tasks/assign/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    if (task.status !== 'OPEN') {
      return res
        .status(400)
        .send({ error: 'You can only assign yourself to OPEN tasks' });
    }

    task.status = 'IN PROGRESS';
    task.taskDoer = req.user._id;

    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

// drop a task you're assigned to
router.patch('/tasks/drop/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    if (
      task.taskDoer.toString() !== req.user._id.toString() ||
      task.status !== 'IN PROGRESS'
    ) {
      return res.status(400).send({
        error: 'You can only drop an in progress task you are assigned to',
      });
    }

    task.status = 'OPEN';
    task.taskDoer = null;

    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

// Delete your task by id
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
