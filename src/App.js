import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { xParticles } from './components/Particles';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import './styles/App.css';

const App = () => {
  return (
    <React.Fragment>
      <xParticles />
      <div className='portfolio-blog portfolio-blog--blogpost mdl-layout mdl-js-layout has-drawer is-upgraded'>
        <main class='mdl-layout__content'>
          <Router>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </main>
      </div>
    </React.Fragment>
  );
};

export default App;
