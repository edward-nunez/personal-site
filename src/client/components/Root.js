import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import App from './App';

export default function Root(props) {
  return (
    <Provider store={props.store}>
      <ConnectedRouter history={props.history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
