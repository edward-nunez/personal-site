import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({
  component: Component,
  currentUser,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props =>
        currentUser.username ? (
          <Component {...props} />
        ) : (
          <Redirect to="/home" />
        )
      }
    />
  );
}
