import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

import rootReducer from '../reducers';

export const history = createBrowserHistory();

export default function configureStore(initialState) {
  return createStore(
    connectRouter(history)(rootReducer),
    initialState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
        thunk,
        reduxImmutableStateInvariant()
      )
    )
  );
}