import React, { Component } from 'react';
import axios from 'axios';
import Error from './error';

export default class login extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: '',
      email: '',
      password: '',
      error: '',
    };
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    };

    try {
      const res = await axios.post('http://localhost:5000/users', user);
      console.log(res);
      if (res.status === 201) {
        window.localStorage.setItem('token', res.data.token);
        console.log(window.localStorage.getItem('token'));
        window.location = '/';
      } else {
        this.setState({
          error: 'An unexpected error occurred. Please try again.',
        });
      }
    } catch (error) {
      console.log(error.response);
      this.setState({
        error: 'Password must be at least 5 characters or email already in use',
      });
    }
  }

  render() {
    return (
      <div>
        <h3>Sign up</h3>
        <Error error={this.state.error} />
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              required
              autoComplete="new-password"
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
            />
          </div>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="text"
              required
              autoComplete="new-password"
              className="form-control"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              type="text"
              required
              autoComplete="new-password"
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Sign Up" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}
