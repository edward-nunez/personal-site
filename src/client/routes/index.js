import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Home from '../components/Home';
import NoMatch from '../components/NoMatch';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import BlogPost from '../components/BlogPost';
import About from '../components/About';
import Contact from '../components/Contact';

import './Transition.style.scss';

class Routes extends Component {
  render() {
    /**
     * Changed the usual way of react router rendering, in order to use
     * react transition groups when change views
     * https://css-tricks.com/animating-between-views-in-react/
     */
    return (
      <React.Fragment>
        <Route
          render={({ location }) => {
            return (
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  timeout={450}
                  classNames="fade"
                >
                  <Switch location={location}>
                    <Route path="/projects" component={Projects} />
                    <Route path="/blog/:id" component={BlogPost} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                    <Route exact path="/" component={Home} />
                    <Route component={NoMatch} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            );
          }}
        ></Route>
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
