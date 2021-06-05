import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Home from "../views/Home";
import NoMatch from "../views/NoMatch";
import Work from "../views/Work";
import { Blog, BlogPost } from "../views/Blog";
import About from "../views/About";
import Contact from "../views/Contact";

import "./Transition.style.scss";

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
                    <Route path="/work" component={Work} />
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

export default Routes;
