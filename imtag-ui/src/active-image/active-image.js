import React, { Component } from 'react';
import './active-image.scss';

class ActiveImage extends Component {
  render() {
    return (
      <div className="active-image-container">
        <div className="banner-behind" />
        {this.props.imageUrl && (
          <div className="active-image">
            <img src={this.props.imageUrl} alt="new" />
          </div>
        )}
      </div>
    );
  }
}

export default ActiveImage;
