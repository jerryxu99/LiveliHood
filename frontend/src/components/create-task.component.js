import React, { Component } from 'react';

export default class createTask extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      title: '',
      description: '',
      owner: '',
      token: '',
    };
  }

  componentDidMount() {
    this.setState({
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRkM2RlNTM0Y2QyMjNhZWU1YmY0NTgiLCJpYXQiOjE2MDgzMzQ4MzF9.0qkTYRaXSseWRhuamI6QSW0E6XKeTEzHJs4he9dhXPM',
    });
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const task = {
      title: this.state.title,
      description: this.state.description,
    };

    console.log(task);

    window.location = '/';
  }

  render() {
    return (
      <div>
        <h3>Create New Task</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Title: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.title}
              onChange={this.onChangeTitle}
            />
          </div>
          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create Task"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
