const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// app.js seperated from index.js for jest
const app = express();
const server = http.createServer(app);

const publicDirectoryPath = path.join(__dirname, '../../frontend/build');

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(cors());
app.use('/api', userRouter);
app.use('/api', taskRouter);

app.get('*', (req, res) => {
  res.sendFile(publicDirectoryPath);
});

module.exports = server;
