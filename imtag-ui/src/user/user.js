import React, { Component } from 'react';
import TagsApi from '../core/apis/tags.api';
import UserService from '../core/services/user.service';

import './user.scss';

class UserComponent extends Component {
  _mounted = false;
  _user = UserService.getUser();

  constructor(props) {
    super(props);

    this.state = {
      user: this._user,
      tags: []
    };
  }

  componentDidMount() {
    this._mounted = true;
    this.getUserTags();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getUserTags = () => {
    TagsApi.getTags(this.state.user, this.onTagsResponse);
  };

  onTagsResponse = response => {
    if (this._mounted) {
      this.setState({ tags: response });
    }
  };

  render() {
    return (
      <div className="user">
        <h1>User</h1>
        <h3>{this.state.user}</h3>

        <div className="user-tags-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Tag</th>
                <th>Image</th>
                <th>Date Tagged</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tags.map((value, index) => {
                return (
                  <tr className="" key={index}>
                    <td>{value.user_id}</td>
                    <td>{value.tag_name}</td>
                    <td className="table-image">
                      <img src={value.image_url} alt="" />
                    </td>
                    <td>{value.created_at}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default UserComponent;
