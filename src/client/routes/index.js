import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import Home from 'Components/Home';
import NoMatch from 'Components/NoMatch';
import Projects from 'Components/Projects';
import Blog from 'Components/Blog';
import About from 'Components/About';

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/projects" component={Projects} />
          <Route path="/blog" component={Blog} />
          <Route path="/about" component={About} />
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
