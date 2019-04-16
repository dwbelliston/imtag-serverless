import React, { Component } from 'react';
import './image-tags.scss';

class ImageTags extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {}

  tagClicked(tag) {
    this.props.onTag(tag);
  }

  render() {
    return (
      <div className="image-tags-container">
        {this.props.tags.map((value, index) => {
          return (
            <div
              className="tag btn"
              key={index}
              onClick={() => this.tagClicked(value)}
            >
              {value.name}
            </div>
          );
        })}
      </div>
    );
  }
}

export default ImageTags;
