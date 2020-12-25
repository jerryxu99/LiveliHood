import React, { Component } from 'react';

export default class Error extends Component {
  render() {
    return (
      this.props.error && (
        <div>
          <p
            style={{
              color: '#A63232',
              border: '1px solid #A63232',
              padding: '6px 12px',
              borderRadius: '.25rem',
            }}
          >
            {this.props.error}
          </p>
        </div>
      )
    );
  }
}
