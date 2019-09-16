import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

import createRootReducer from '../reducers';

export const history = createBrowserHistory();

export default function configureStore(initialState) {
  return createStore(
    createRootReducer(history),
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