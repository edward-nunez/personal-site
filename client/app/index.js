import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
// Views
import Home from './views/Home';
import NoMatch from './views/NoMatch';
import Portfolio from './views/Portfolio';
import Project from './views/Project';
import BlogPost from './views/BlogPost';
import About from './views/About';
import Contact from './views/Contact';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'portfolio/:id', element: <Project /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'blog/:id', element: <BlogPost /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NoMatch /> },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
