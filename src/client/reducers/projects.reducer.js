import {
  GET_PROJECT,
  GET_PROJECTS,
  GET_PROJECT_FAILURE,
} from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function projectsReducer(state = initialState.projects, action) {
  switch (action.type) {
    case GET_PROJECT:
      return objectAssign({}, state, { projectLoading: true });

    case GET_PROJECT_SUCCESS:
      return objectAssign({}, state, {
        projectLoading: false,
        projectError: null,
        project: action.payload,
      });

    case GET_PROJECT_FAILURE:
      return objectAssign({}, state, {
        projectLoading: false,
        matchesError: action.payload,
      });

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
