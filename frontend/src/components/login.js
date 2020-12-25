import React, { Component } from 'react';
import axios from 'axios';
import Error from './error';

export default class login extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
      error: '',
    };
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
      email: this.state.email,
      password: this.state.password,
    };
    try {
      const res = await axios.post('http://localhost:5000/users/login', user);
      console.log(res);
      if (res.status === 200) {
        window.localStorage.setItem('token', res.data.token);
        console.log(window.localStorage.getItem('token'));
        //window.location = '/';
      } else {
        this.setState({
          error: 'An unexpected error occurred. Please try again.',
        });
      }
    } catch (error) {
      console.log(error.response);
      this.setState({
        error: 'Invalid email/password',
      });
    }
  }

  render() {
    return (
      <div>
        <h3>Login</h3>
        <Error error={this.state.error} />
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="text"
              required
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
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Login" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}
