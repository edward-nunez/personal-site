import React from "react";

import Routes from "./utils";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import "./App.style.scss";

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

export default App;
