const http = require('http');
const path = require('path');
const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// app.js seperated from index.js for jest
const app = express();
const server = http.createServer(app);

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = server;
