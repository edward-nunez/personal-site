import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import * as serviceWorker from './serviceWorker';

import './assets/scss/style.scss';
import 'bootstrap/dist/js/bootstrap.min';

import App from './App';

const history = createBrowserHistory();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // https://reactjs.org/docs/strict-mode.html
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({});
