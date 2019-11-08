import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import Home from '../components/home/Home';
import NoMatch from '../components/nomatch/NoMatch';

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={NoMatch} />
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.user,
  };
};

export default connect(mapStateToProps)(Routes);
