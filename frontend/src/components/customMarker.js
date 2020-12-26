import { Component } from 'react';
import '../utils/customMarker.css';

export default class CustomMarker extends Component {
  render() {
    return (
      <>
        <div className="pin"></div>
        <div className="pulse"></div>
      </>
    );
  }
}
