import { combineReducers } from 'redux';
import axiosCallsInProgress from './axiosStatusReducer';
import { connectRouter } from 'connected-react-router';

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    axiosCallsInProgress,
  });

export default rootReducer;
