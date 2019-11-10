import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';

import Routes from '../routes';
import 'Styles/App.scss';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="portfolio-blog portfolio-blog--blogpost mdl-layout mdl-js-layout has-drawer is-upgraded">
          <main className="mdl-layout__content">
            <Routes />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  history: PropTypes.object,
};

export default hot(module)(App);
