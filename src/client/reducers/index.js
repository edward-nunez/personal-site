import { combineReducers } from 'redux';
import projects from './projects.reducer';
import { connectRouter } from 'connected-react-router';

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    projects,
  });

export default rootReducer;
