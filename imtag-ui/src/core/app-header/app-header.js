import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './app-header.scss';

class AppHeader extends Component {
  render() {
    return (
      <header className="">
        <div />

        <div>
          <p>
            <span role="img" aria-label="camera">
              📸📸📸
            </span>
          </p>
        </div>

        <div>
          <nav className="links">
            <ul>
              <li>
                <NavLink exact to="/" activeClassName="is-active">
                  <span role="img" aria-label="camera">
                    🏠
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink exact to="/user/" activeClassName="is-active">
                  <span role="img" aria-label="camera">
                    👤
                  </span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}

export default AppHeader;
