import React from 'react';
import { hot } from 'react-hot-loader';

import Routes from '../routes';
import Navigation from 'Common/Navigation';
import Footer from 'Common/Footer';
import './App.style.scss';

function App() {
  return (
    <React.Fragment>
      <header>
        <Navigation />
      </header>
      <main role="main">
        <Routes />
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default hot(module)(App);
