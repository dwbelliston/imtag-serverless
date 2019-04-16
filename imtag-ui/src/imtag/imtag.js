import React, { Component } from 'react';
import ActiveImage from '../active-image/active-image';
import ActiveTitle from '../active-title/active-title';
import ImagesApi from '../core/apis/images.api';
import TagsApi from '../core/apis/tags.api';
import UserService from '../core/services/user.service';
import ImageTags from '../image-tags/image-tags';

import './imtag.scss';

class ImtagComponent extends Component {
  _mounted = false;
  _user = UserService.getUser();

  constructor(props) {
    super(props);

    this.state = {
      activeTitle: 'Please Classify',
      activeImage: '',
      tags: []
    };
  }

  componentDidMount() {
    this._mounted = true;
    this.getImage();
    this.getTags();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getImage = () => {
    ImagesApi.getImage(this.onNewImageResponse);
  };

  getTags = () => {
    TagsApi.getTags(null, this.onTagsResponse);
  };

  onNewImageResponse = response => {
    if (this._mounted) {
      this.setState({ activeImage: response.image_url });
    }
  };

  onTagsResponse = response => {
    if (this._mounted) {
      this.setState({ tags: response });
    }
  };

  onImageTagResponse = response => {
    if (this._mounted) {
      this.getImage();
    }
  };

  onTag(tag) {
    const payload = {
      user: this._user,
      tag: tag.name,
      image: this.state.activeImage
    };

    TagsApi.postTag(payload, this.onImageTagResponse);
  }

  render() {
    return (
      <div className="imtag">
        {/* Tagging Title */}
        <ActiveTitle title={this.state.activeTitle} />
        {/* New Image Request */}
        <div className="getNewButton">
          <button onClick={this.getImage}>New Image</button>
        </div>
        {/* Active Image */}
        <ActiveImage imageUrl={this.state.activeImage} />
        {/* Active Tags */}
        <ImageTags tags={this.state.tags} onTag={tag => this.onTag(tag)} />
        {/* Active Actions */}
      </div>
    );
  }
}

export default ImtagComponent;
