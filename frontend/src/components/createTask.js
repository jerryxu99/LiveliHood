import React, { Component } from 'react';
import axios from 'axios';
import GoogleMap from './googleMap';
import Error from './error';
import CustomMarker from './customMarker';

export default class createTask extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this._onClick = this._onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      title: '',
      description: '',
      owner: '',
      location: {},
      error: '',
    };
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

  _onClick({ lat, lng }) {
    this.setState({
      location: {
        lat,
        lng,
      },
    });
  }

  async onSubmit(e) {
    e.preventDefault();

    const task = {
      title: this.state.title,
      description: this.state.description,
      location: {
        lat: this.state.location.lat,
        lng: this.state.location.lng,
      },
    };
    console.log(task);

    const token = `Bearer ${window.localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      const res = await axios.post('/api/tasks', task, config);
      console.log(res);
      window.location = '/';
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        this.setState({
          error: 'Please Sign Up/Login',
        });
      } else if (!this.state.location.lat) {
        this.setState({
          error: 'Please click a location on the map',
        });
      } else if (error.response.status === 400) {
        this.setState({
          error: 'Invalid title/description',
        });
      } else {
        this.setState({
          error: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  }

  render() {
    return (
      <div>
        <h3>Create New Task</h3>
        <Error error={this.state.error} />
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
            <label>Location: </label>
            <div style={{ height: '50vh', width: '100%', paddingBottom: '16' }}>
              <GoogleMap onClick={this._onClick}>
                <CustomMarker
                  lat={this.state.location.lat}
                  lng={this.state.location.lng}
                />
              </GoogleMap>
            </div>
            <span>
              {this.state.location.lat
                ? `(${this.state.location.lat}, ${this.state.location.lng})`
                : '(Please click a location on the map)'}
            </span>
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
