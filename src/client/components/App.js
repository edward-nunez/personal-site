import React from 'react';
import { hot } from 'react-hot-loader';

import Routes from '../routes';
import Navigation from 'Common/Navigation';
import Banner from 'Common/Banner';
import Footer from 'Common/Footer';
import 'Styles/App.scss';

function App() {
  return (
    <React.Fragment>
      <header className="header">
        <Navigation path={window.location.pathname} />
        <div className="container">
          <Banner />
        </div>
      </header>
      <section className="content">
        <Routes />
      </section>
      <Footer />
    </React.Fragment>
  );
}

export default hot(module)(App);
