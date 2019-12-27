// Centralized propType definitions
import { shape, string, arrayOf } from 'prop-types';

export const data = React.PropTypes.shape({
  type: string,
  id: string,
  attributes: shape({
    title: string,
    techStack: string,
    created: string,
    updated: string,
  }),
});

export const root = shape({
  jsonapi: shape({
    version: string,
  }),
  data: arrayOf(data),
});
