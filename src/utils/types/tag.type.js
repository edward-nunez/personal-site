import PropTypes from 'prop-types';

const TagType = PropTypes.exact({
  id: PropTypes.number,
  name: PropTypes.string,
});

export default TagType;
