import PropTypes from 'prop-types';

const PostType = PropTypes.exact({
  id: PropTypes.number,
  title: PropTypes.string,
  titleImage: PropTypes.string,
  subTitle: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
});

export default PostType;
