import React from 'react';
import { hot } from 'react-hot-loader';

import Routes from '../routes';
import Navigation from 'Common/Navigation';
import Banner from 'Common/Banner';
import Footer from 'Common/Footer';
import './App.style.scss';

function App() {
  return (
    <React.Fragment>
      <header>
        <Navigation />
        <div className="container">
          <Banner />
        </div>
      </header>
      <main role="main">
        <Routes />
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default hot(module)(App);
