import PropTypes from 'prop-types';

function InputLabel({ id, label }) {
  return (
    <label htmlFor={id} className="form-label">
      {label}
    </label>
  );
}

InputLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default InputLabel;
