import * as types from './types';

export const getProjects = () => dispatch => {
  fetch('http://localhost:8000/api/v1/projects')
    .then(res => res.json())
    .then(projects =>
      dispatch({
        type: types.GET_PROJECTS,
        payload: projects,
      })
    );
};
