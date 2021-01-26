import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Logout extends Component {
  async logout(all) {
    const token = `Bearer ${window.localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      await axios.post(`/api/users/logout${all}`, {}, config);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <>
        <ul className="navbar-nav navbar-right">
          <li className="navbar-item">
            <Link
              to="/"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                this.logout('');
                window.location = '/';
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav navbar-right">
          <li className="navbar-item">
            <Link
              to="/"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                this.logout('All');
                window.location = '/';
              }}
            >
              Logout All
            </Link>
          </li>
        </ul>
      </>
    );
  }
}
