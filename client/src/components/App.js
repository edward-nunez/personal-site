import React, { Component }from 'react';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Routes from '../routes';
import { SnowFall } from '../common/SnowFall';
import '../styles/App.css';

class App extends Component {
  render() {
    const { history } = this.props;

    return (
      <ConnectedRouter history={history} >
        <React.Fragment>
          <SnowFall />
          <div className='portfolio-blog portfolio-blog--blogpost mdl-layout mdl-js-layout has-drawer is-upgraded'>
            <main class='mdl-layout__content'>
              <Routes />
            </main>
          </div>
        </React.Fragment>
      </ConnectedRouter>
    );
  }
};

App.propTypes = {
  history: PropTypes.object
};

export default App;
