import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';

import Routes from '../routes';
import Navigation from 'Common/Navigation';
import 'Styles/App.scss';

function App() {
  return (
    <React.Fragment>
      <Navigation />
      <section>
        <Routes />
      </section>
    </React.Fragment>
  );
}

App.propTypes = {
  history: PropTypes.object,
};

export default hot(module)(App);
