import React from "react";
import { Switch } from "react-router-dom";

// Layouts
import LayoutDefault from "./layouts/LayoutDefault";

// Views
import AppRoute from "./utils/AppRoute";
import Home from "./views/Home";
import NoMatch from "./views/NoMatch";
import Portfolio from "./views/Portfolio";
import BlogPost from "./views/BlogPost";
import About from "./views/About";
import Contact from "./views/Contact";

function App() {
  return (
    <Switch>
      <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
      <AppRoute path="/portfolio" component={Portfolio} layout={LayoutDefault} />
      <AppRoute path="/blog/:id" component={BlogPost} layout={LayoutDefault} />
      <AppRoute path="/about" component={About} layout={LayoutDefault} />
      <AppRoute path="/contact" component={Contact} layout={LayoutDefault} />
      <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
      <AppRoute component={NoMatch} layout={LayoutDefault} />
    </Switch>
  );
}

export default App;
