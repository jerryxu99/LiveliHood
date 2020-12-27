import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logout from './logout';
import axios from 'axios';

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
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
      const res = await axios.get('http://localhost:5000/auth', config);

      if (res.status === 200) {
        this.setState({
          authenticated: true,
        });
      }
    } catch (e) {
      this.setState({
        authenticated: false,
      });
    }
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link
          to="/"
          className="navbar-brand"
          // need to manually set window location to load in markers
          onClick={() => {
            window.location = '/';
          }}
        >
          LiveliHood
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link
                to="/"
                className="nav-link"
                // need to manually set window location to load in markers
                onClick={() => {
                  window.location = '/';
                }}
              >
                Tasks
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/tasks" className="nav-link">
                My Tasks
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/tasks/create" className="nav-link">
                Create Task
              </Link>
            </li>
          </ul>
          {this.state.authenticated ? (
            <Logout />
          ) : (
            <>
              <ul className="navbar-nav navbar-right">
                <li className="navbar-item">
                  <Link to="/register" className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav navbar-right">
                <li className="navbar-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              </ul>{' '}
            </>
          )}
        </div>
      </nav>
    );
  }
}
