import {
  GET_PROJECTS,
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS_FAILURE,
} from '../actions/types';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function projectsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PROJECTS:
      return objectAssign({}, state, { projectsLoading: true });

    case GET_PROJECTS_SUCCESS:
      return objectAssign({}, state, {
        projectsLoading: false,
        projectsError: null,
        projects: action.payload,
      });

    case GET_PROJECTS_FAILURE:
      return objectAssign({}, state, {
        projectsLoading: false,
        matchesError: action.payload,
      });

    default:
      return state;
  }
}
