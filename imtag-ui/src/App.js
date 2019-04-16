import React from 'react';
import './styles/index.scss';

import ImtagComponent from './imtag/imtag';
import UserComponent from './user/user';

import AppHeader from './core/app-header/app-header';
import AppFooter from './core/app-footer/app-footer';

import { BrowserRouter as Router, Route } from 'react-router-dom';

function AppRouter() {
  return (
    <Router>
      <div className="app">
        <AppHeader />

        <div className="home">
          <Route path="/" exact component={ImtagComponent} />
          <Route path="/user" exact component={UserComponent} />
        </div>

        <AppFooter />
      </div>
    </Router>
  );
}

export default AppRouter;
