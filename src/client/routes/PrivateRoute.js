import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, currentUser, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      currentUser.username
        ? <Component {...props} />
        : <Redirect to='/home' />
    )}
  />
);

export default PrivateRoute;