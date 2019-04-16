import React, { Component } from 'react';
import './active-title.scss';

class ActiveTitle extends Component {
  render() {
    return (
      <div className="active-title-container">
        <div className="active-title">
          <h1>{this.props.title}</h1>
        </div>
      </div>
    );
  }
}

export default ActiveTitle;
