import { combineReducers } from 'redux';
import projectsReducer from './projects.reducer';
import { connectRouter } from 'connected-react-router';

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    projects: projectsReducer,
  });

export default rootReducer;
