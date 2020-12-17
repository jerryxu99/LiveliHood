const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

// create a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login user and get token
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: 'Unable to Login' });
  }
});

// read profile
router.get('/users/me', auth, async (req, res) => {
  res.status(200).send(req.user);
});

// update profile
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    res.status(400).send({ error: 'invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete profile
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
