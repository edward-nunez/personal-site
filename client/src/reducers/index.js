import { combineReducers } from 'redux';
import axiosCallsInProgress from './axiosStatusReducer';

const rootReducer = combineReducers({
  axiosCallsInProgress
})

export default rootReducer;