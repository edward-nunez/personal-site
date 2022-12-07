import React from 'react';
import { Routes } from 'react-router-dom';

// Layouts
import { DefaultLayout } from './components/layout';

// Views
import AppRoute from './utils/AppRoute';
import Home from './views/Home';
import NoMatch from './views/NoMatch';
import Portfolio from './views/Portfolio';
import Project from './views/Project';
import BlogPost from './views/BlogPost';
import About from './views/About';
import Contact from './views/Contact';

function App() {
  return (
    <Routes>
      <AppRoute exact path="/" Component={Home} Layout={DefaultLayout} />
      <AppRoute path="/portfolio/:id" Component={Project} Layout={DefaultLayout} />
      <AppRoute path="/portfolio" Component={Portfolio} Layout={DefaultLayout} />
      <AppRoute path="/blog/:id" Component={BlogPost} Layout={DefaultLayout} />
      <AppRoute path="/about" Component={About} Layout={DefaultLayout} />
      <AppRoute path="/contact" Component={Contact} Layout={DefaultLayout} />
      <AppRoute exact path="/" Component={Home} Layout={DefaultLayout} />
      <AppRoute Component={NoMatch} Layout={DefaultLayout} />
    </Routes>
  );
}

export default App;
