import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar';
import Tasks from './components/tasks';
import TasksList from './components/tasksList';
import CreateTask from './components/createTask';
import Login from './components/login';
import Register from './components/register';

function App() {
  return (
    <Router>
      <Navbar />
      <br />
      <div className="container">
        <Route path="/" exact component={Tasks} />
        <Route path="/tasks" exact component={TasksList} />
        <Route path="/tasks/create" component={CreateTask} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </div>
    </Router>
  );
}

export default App;
