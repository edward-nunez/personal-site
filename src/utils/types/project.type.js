import PropTypes from 'prop-types';
import TagType from './tag.type';

const ProjectType = PropTypes.exact({
  id: PropTypes.number,
  title: PropTypes.string,
  titleImage: PropTypes.string,
  description: PropTypes.string,
  liveSite: PropTypes.string,
  criteria: PropTypes.string,
  results: PropTypes.string,
  tags: PropTypes.arrayOf(TagType),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
});

export default ProjectType;
