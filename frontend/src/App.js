import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar.component';
import Tasks from './components/tasks.component';
import TasksList from './components/tasks-list.component';
import CreateTask from './components/create-task.component';
import Login from './components/login.component';
import Register from './components/register.component';

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
