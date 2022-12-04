import PropTypes from 'prop-types';

const CommentType = PropTypes.exact({
  id: PropTypes.number,
  author: PropTypes.string,
  body: PropTypes.string,
  upVotes: PropTypes.number,
  downVotes: PropTypes.number,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
});

export default CommentType;
