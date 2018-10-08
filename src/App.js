import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import './App.css';

const App = () => {
  return (
    <div className="portfolio-blog portfolio-blog--blogpost mdl-layout mdl-js-layout has-drawer is-upgraded">
      <main class="mdl-layout__content">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
      </main>
    </div>
  );
};

export default App;
