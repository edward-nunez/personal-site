import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import axiosCallsInProgress from './axiosStatusReducer';

export default (history) => combineReducers({
  axiosCallsInProgress,
  router: connectRouter(history),
})