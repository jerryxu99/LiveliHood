import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          LiveliHood
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">
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
          </ul>
        </div>
      </nav>
    );
  }
}
