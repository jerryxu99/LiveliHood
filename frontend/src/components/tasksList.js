import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import PendingTask from './pendingTask';
import Error from './error';

const Task = (props) => (
  <tr>
    <td>{props.task.title}</td>
    <td>{props.task.description}</td>
    <td style={{ color: props.task.status === 'OPEN' ? 'green' : 'orange' }}>
      {props.task.status}
    </td>
    <td>
      {props.deleteTask && (
        <span>
          {props.task.status === 'OPEN' && (
            <>
              <Link to={`/tasks/edit/${props.task._id}`}>edit</Link>|
            </>
          )}
          {props.task.status === 'IN PROGRESS' && (
            <>
              <a
                href="/tasks"
                onClick={() => props.markDone(props.task._id)}
                style={{ color: 'green' }}
              >
                mark done
              </a>
              |
            </>
          )}
          <a
            href="/tasks"
            onClick={() => props.deleteTask(props.task._id)}
            style={{ color: 'orange' }}
          >
            delete
          </a>
        </span>
      )}
      {props.dropTask && (
        <a
          href="/tasks"
          onClick={() => props.dropTask(props.task._id)}
          style={{ color: 'orange' }}
        >
          remove
        </a>
      )}
    </td>
  </tr>
);

export default class tasksList extends Component {
  constructor(props) {
    super(props);

    this.deleteTask = this.deleteTask.bind(this);
    this.getTaskList = this.getTaskList.bind(this);

    this.state = {
      myTasks: [],
      todo: [],
      error: '',
    };
  }

  async componentDidMount() {
    const token = `Bearer ${window.localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      const res = await axios.get(
        '/api/tasks/me?sortBy=createdAt_desc',
        config,
      );
      this.setState({
        myTasks: res.data,
      });
      console.log(this.state.myTasks);
    } catch (e) {
      this.setState({
        error: 'Please Sign Up/Login',
      });
    }

    try {
      const res = await axios.get(
        '/api/tasks/todo?sortBy=createdAt_asc',
        config,
      );
      this.setState({
        todo: res.data,
      });
      console.log(this.state.todo);
    } catch (e) {
      const error = e.response;
      console.log(error);
    }
  }

  async deleteTask(id) {
    const token = `Bearer ${window.localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      await axios.delete(`/api/tasks/${id}`, config);
    } catch (e) {
      console.log(e);
    }
  }

  async markDone(id) {
    const token = `Bearer ${window.localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      await axios.patch(
        `/api/tasks/${id}`,
        {
          status: 'DONE',
        },
        config,
      );
    } catch (e) {
      console.log(e);
      this.setState({
        error: 'An unexpected error has occurred. Please try again',
      });
    }
  }

  async dropTask(id) {
    const token = `Bearer ${window.localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      await axios.patch(`/api/tasks/drop/${id}`, {}, config);
    } catch (e) {
      console.log(e);
    }
  }

  getTaskList(tasks, type) {
    if (type === 'tasks') {
      return tasks.map((task) => {
        return (
          <Task
            task={task}
            deleteTask={this.deleteTask}
            markDone={this.markDone}
          />
        );
      });
    }

    return tasks.map((task) => {
      return <Task task={task} dropTask={this.dropTask} />;
    });
  }

  render() {
    let id;
    if (window.location.search) {
      id = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      }).id;
    }
    console.log(id);
    return (
      <div>
        <h3>My Tasks</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.getTaskList(this.state.myTasks, 'tasks')}</tbody>
        </table>
        <Error error={this.state.error} />
        <h3>My Todo</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!this.state.error && id && <PendingTask id={id} />}
            {this.getTaskList(this.state.todo, 'todo')}
          </tbody>
        </table>
        <Error error={this.state.error} />
      </div>
    );
  }
}
