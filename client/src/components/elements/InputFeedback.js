import PropTypes from 'prop-types';

function InputFeedback({ valid, touched, errorMessage = null }) {
  return (
    <>
      <div className="valid-feedback" style={{ display: valid && touched ? 'block' : 'none' }}>
        Looks good!
      </div>
      <div
        className="invalid-feedback"
        style={{
          display: !valid && touched ? 'block' : 'none',
        }}
      >
        {errorMessage}
      </div>
    </>
  );
}

InputFeedback.propTypes = {
  valid: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
};

InputFeedback.defaultProps = {
  errorMessage: null,
};

export default InputFeedback;
