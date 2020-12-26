import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import NewTask from './newTask';

const Task = (props) => (
  <tr>
    <td>{props.task.title}</td>
    <td>{props.task.description}</td>
    <td style={{ color: props.task.status === 'OPEN' ? 'green' : 'orange' }}>
      {props.task.status}
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
        'http://localhost:5000/tasks/me?sortBy=createdAt_desc',
        config,
      );
      this.setState({
        myTasks: res.data,
      });
      console.log(this.state.myTasks);
    } catch (e) {
      const error = e.response;
      console.log(error);
    }

    try {
      const res = await axios.get(
        'http://localhost:5000/tasks/todo?sortBy=createdAt_asc',
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

  deleteTask(id) {
    console.log('delete placeholder');
  }

  getTaskList(tasks) {
    return tasks.map((task) => {
      return <Task task={task} />;
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
            </tr>
          </thead>
          <tbody>{this.getTaskList(this.state.myTasks)}</tbody>
        </table>
        <h3>My Todo</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {id && <NewTask id={id} />}
            {this.getTaskList(this.state.todo)}
          </tbody>
        </table>
      </div>
    );
  }
}
