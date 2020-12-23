import React, { Component } from 'react';
import axios from 'axios';
import GoogleMap from './google-map.component';

const getInfoWindow = async (task) => {
  let ownerName = '';
  try {
    const res = await axios.get(`http://localhost:5000/users/${task.owner}`);
    ownerName = res.data.name;
  } catch (e) {
    console.log(e);
  }
  return `<div>
      <div style="font-size: 16px;">${task.title}</div>
      <div style="font-size: 14px;">
        <span style="color: grey;">${task.description}</span>
      </div>
      <div style="font-size: 14px; color: grey;">
        <span>${ownerName}</span>
      </div>
      <div style="font-size: 14px; color: ${
        task.status === 'OPEN' ? 'green' : 'orange'
      };">
        <span>
          ${task.status}
        </span>
      </div>
    </div>`;
};

const updateMarkers = (map, maps, markers, task) => {
  markers.push(
    new maps.Marker({
      position: {
        lat: task.location.lat,
        lng: task.location.lng,
      },
      map,
    }),
  );
};

const updateInfoWindows = (maps, infoWindows, infoWindow) => {
  infoWindows.push(
    new maps.InfoWindow({
      content: infoWindow,
      maxWidth: 250,
    }),
  );
};

const assignMarkers = (map, markers, infoWindows) => {
  markers.forEach((marker, i) => {
    marker.addListener('click', () => {
      infoWindows[i].open(map, marker);
    });
  });
};

const handleApiLoaded = async (map, maps, tasks) => {
  const markers = [];
  const infoWindows = [];

  for (const task of tasks) {
    const infoWindow = await getInfoWindow(task);
    updateMarkers(map, maps, markers, task);
    updateInfoWindows(maps, infoWindows, infoWindow);
  }

  assignMarkers(map, markers, infoWindows);
};

class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
    };
  }

  static defaultProps = {
    center: {
      lat: 49.2,
      lng: -123,
    },
    zoom: 11,
  };

  componentDidMount() {
    axios.get('http://localhost:5000/tasks').then((res) => {
      this.setState({
        tasks: res.data,
      });
      console.log(this.state.tasks);
    });
  }

  render() {
    const { tasks } = this.state;

    return (
      <div style={{ height: '87vh', width: '100%' }}>
        <GoogleMap
          // bootstrapURLKeys={{ key: process.env.API_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) =>
            handleApiLoaded(map, maps, tasks)
          }
        />
      </div>
    );
  }
}

export default Tasks;
