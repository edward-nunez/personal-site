import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore, { history } from './store/configureStore';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import './styles/index.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App
      history={history}
    />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
