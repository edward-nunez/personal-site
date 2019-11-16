import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import Home from 'Components/Home';
import NoMatch from 'Components/NoMatch';
import Projects from 'Components/Projects';
import Blog from 'Components/Blog';
import About from 'Components/About';
import Contact from 'Components/Contact';

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/projects" component={Projects} />
          <Route path="/blog" component={Blog} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
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
