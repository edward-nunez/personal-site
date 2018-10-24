import * as types from './actionTypes';

export const beginAxiosCall = () => {
  return { type: types.BEGIN_AXIOS_CALL };
}

export const axiosCallError = () => {
  return { type: types.AXIOS_CALL_ERROR };
}