import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import Home from '../components/home/HomePage';
import NoMatch from '../components/nomatch/NoMatchPage';

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route compomnent={NoMatch} />
        </Switch>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.user
  }
}

export default connect(mapStateToProps)(Routes);