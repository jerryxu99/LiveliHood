import React, { Component } from 'react';

export default class tasksList extends Component {
  constructor(props) {
    super(props);

    this.deleteTask = this.deleteTask.bind(this);

    this.state = {
      tasks: [],
    };
  }

  componentDidMount() {
    //get from db
  }

  deleteTask(id) {
    console.log('delete placeholder');
  }

  render() {
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
        </table>
        <h3>Tasks I've Completed</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}
